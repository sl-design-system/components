import { localized, msg, str } from '@lit/localize';
import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { EventEmitter, event } from '@sl-design-system/shared';
import { Tooltip } from '@sl-design-system/tooltip';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './tag.scss.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-remove': SlRemoveEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-tag': Tag;
  }
}

export type SlRemoveEvent = CustomEvent<void>;

export type TagSize = 'md' | 'lg';
export type TagVariant = 'neutral' | 'info';

/**
 * A tag component containing label.
 *
 * ```html
 * <sl-tag>Tag label</sl-tag>
 * ```
 *
 * @slot default - The tag label.
 *
 * @csspart label - The wrapper around the tag label.
 * @csspart button - The remove button.
 */
@localized()
export class Tag extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon,
      'sl-tooltip': Tooltip
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal */
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true
  };

  /** @internal */
  #internals = this.attachInternals();

  /** Observe changes in size, so we can check whether we need to show tooltips for truncated links. */
  #observer = new ResizeObserver(() => this.#onResize());

  /** Observe label text changes that do not trigger a resize or slotchange. */
  #mutationObserver = new MutationObserver(() => this.#updateLabel());

  /**
   * Whether the tag component is disabled, when set no interaction is possible.
   *
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** @internal Whether a tooltip should be shown. */
  @state() tooltip?: boolean;

  /** @internal The label of the tag component. */
  @state() label = '';

  /** @internal Clarifies tag list keyboard navigation for assistive technologies. */
  @state() navigationDescription?: string;

  /** @internal Additional description for the tag label. */
  @property({ attribute: false }) labelDescription?: string;

  /**
   * Whether the tag component is removable.
   *
   * @default false
   */
  @property({ type: Boolean, reflect: true }) removable?: boolean;

  /** @internal Emits when the tag is removed. */
  @event({ name: 'sl-remove' }) removeEvent!: EventEmitter<SlRemoveEvent>;

  /**
   * The size of the tag.
   *
   * @default 'md'
   */
  @property({ reflect: true }) size?: TagSize;

  /**
   * The variant of the tag.
   *
   * @default 'neutral'
   */
  @property({ reflect: true }) variant?: TagVariant;

  /** @internal */
  override get tabIndex(): number {
    return super.tabIndex;
  }

  /** @internal */
  override set tabIndex(tabIndex: number) {
    super.tabIndex = tabIndex;
    this.#syncButtonTabIndex();
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.#observer.observe(this);
    this.#mutationObserver.observe(this, { characterData: true, childList: true, subtree: true });
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();
    this.#mutationObserver.disconnect();

    super.disconnectedCallback();
  }

  override focus(options?: FocusOptions): void {
    const focusTarget = this.removable
      ? this.renderRoot.querySelector<HTMLElement>('button')
      : this.renderRoot.querySelector<HTMLElement>('[part="label"][tabindex]');

    if (focusTarget) {
      focusTarget.focus(options);
    } else {
      super.focus(options);
    }
  }

  protected override updated(changes: Map<PropertyKey, unknown>): void {
    super.updated(changes);
    this.#syncButtonTabIndex();
  }

  override render(): TemplateResult {
    const labelTabIndex =
        !this.disabled && !this.removable
          ? this.hasAttribute('tabindex')
            ? this.tabIndex.toString()
            : this.tooltip
              ? '0'
              : undefined
          : undefined,
      buttonDescription = [
        this.tooltip ? 'tooltip' : undefined,
        this.navigationDescription ? 'navigation-description' : undefined
      ]
        .filter(Boolean)
        .join(' '),
      labelDescribedBy = [
        this.tooltip ? 'tooltip' : undefined,
        this.labelDescription ? 'label-description' : undefined
      ]
        .filter(Boolean)
        .join(' ');

    return html`
      ${this.tooltip ? html`<sl-tooltip id="tooltip">${this.label}</sl-tooltip>` : nothing}
      <div
        @blur=${this.#onBlur}
        @focus=${this.#onFocus}
        aria-describedby=${ifDefined(labelDescribedBy || undefined)}
        part="label"
        tabindex=${ifDefined(labelTabIndex)}>
        <slot @slotchange=${this.#onSlotChange}></slot>
      </div>
      ${this.labelDescription
        ? html`<span id="label-description" class="visually-hidden">${this.labelDescription}</span>`
        : nothing}
      ${this.removable
        ? html`
            <button
              @blur=${this.#onBlur}
              @click=${this.#onRemove}
              @focus=${this.#onFocus}
              @keydown=${this.#onKeydown}
              aria-describedby=${ifDefined(buttonDescription || undefined)}
              aria-disabled=${ifDefined(this.disabled ? 'true' : undefined)}
              aria-label=${msg(str`Remove tag '${this.label}'`, { id: 'sl.tag.remove' })}
              part="button"
              type="button">
              <sl-icon name="xmark"></sl-icon>
            </button>
            ${this.navigationDescription
              ? html`
                  <span id="navigation-description" class="visually-hidden" aria-hidden="true"
                    >${this.navigationDescription}</span
                  >
                `
              : nothing}
          `
        : nothing}
    `;
  }

  #onBlur(): void {
    this.#internals.states.delete('focus-visible');
  }

  #onFocus(event: FocusEvent): void {
    if ((event.target as HTMLElement).matches(':focus-visible')) {
      this.#internals.states.add('focus-visible');
    }
  }

  #onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      event.stopPropagation();

      this.#onRemove(event);
    }
  }

  #onRemove(event: Event): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();

      return;
    }

    // Emit remove event *before* removing the tag, so consumers can react to the event.
    this.removeEvent.emit();
    this.remove();
  }

  #syncButtonTabIndex(): void {
    const button = this.renderRoot.querySelector<HTMLButtonElement>('button');

    if (!button) {
      return;
    }

    if (this.navigationDescription || this.hasAttribute('tabindex')) {
      button.tabIndex = this.tabIndex;
    } else {
      button.removeAttribute('tabindex');
    }
  }

  #onResize(): void {
    const label = this.renderRoot.querySelector('[part="label"]');

    this.tooltip = !!(label && label.clientWidth < label.scrollWidth);
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    this.#updateLabel(event.target);
  }

  #updateLabel(slot = this.renderRoot.querySelector('slot')): void {
    if (!slot) {
      return;
    }

    this.label = slot
      .assignedNodes({ flatten: true })
      .map(node => node.textContent ?? '')
      .join('')
      .trim()
      .replaceAll(/\s+/g, ' ');

    void this.updateComplete.then(() => this.#onResize());
  }
}
