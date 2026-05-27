import { localized, msg } from '@lit/localize';
import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { EventEmitter, EventsController, event } from '@sl-design-system/shared';
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
 * @csspart container - The component's container.
 * @csspart label - The tag's label.
 * @csspart button - The remove button.
 * @csspart tooltip - The tooltip shown when the content is truncated.
 */
@localized()
export class Tag extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon,
      'sl-tooltip': Tooltip
    };
  }

  /** @internal */
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true
  };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, { keydown: this.#onKeydown });

  /** Observe changes in size, so we can check whether we need to show tooltips for truncated links. */
  #observer = new ResizeObserver(() => this.#onResize());

  /**
   * Whether the tag component is disabled, when set no interaction is possible.
   *
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** @internal The label of the tag component. */
  @state() label = '';

  /**
   * Whether the tag component is removable.
   *
   * @default false
   */
  @property({ type: Boolean }) removable?: boolean;

  /** @internal Emits when the tag is removed. */
  @event({ name: 'sl-remove' }) removeEvent!: EventEmitter<SlRemoveEvent>;

  /**
   * The size of the tag.
   *
   * @default 'md'
   */
  @property({ reflect: true }) size?: TagSize;

  /**
   * The text to be shown in the tooltip. If the tooltip property isn't set explicitly to a string,
   * the component itself will automatically determine when to show a tooltip based on the content's
   * truncation.
   */
  @property() tooltip?: boolean | string;

  /**
   * The variant of the tag.
   *
   * @default 'neutral'
   */
  @property({ reflect: true }) variant?: TagVariant;

  override connectedCallback(): void {
    super.connectedCallback();

    this.#observer.observe(this);
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    const focusable = !this.disabled && (this.removable || this.tooltip);

    let description;
    if (focusable && this.removable) {
      description = msg('Press the delete or backspace key to remove this item', {
        id: 'sl.tag.removalInstructions'
      });
    }

    return html`
      <div
        aria-description=${ifDefined(description)}
        id="container"
        part="container"
        tabindex=${ifDefined(focusable ? '0' : undefined)}>
        <div part="label">
          <slot @slotchange=${this.#onSlotChange}></slot>
        </div>
        ${this.removable && !this.disabled
          ? html`
              <button
                @click=${this.#onRemove}
                ?disabled=${this.disabled}
                aria-hidden="true"
                part="button"
                tabindex="-1">
                <sl-icon name="xmark"></sl-icon>
              </button>
            `
          : nothing}
      </div>
      ${this.tooltip
        ? html`
            <sl-tooltip for="container" part="tooltip" type="description">
              ${typeof this.tooltip === 'string' ? this.tooltip : this.label}
            </sl-tooltip>
          `
        : nothing}
    `;
  }

  #onKeydown(event: KeyboardEvent): void {
    if (this.removable && (event.key === 'Backspace' || event.key === 'Delete')) {
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

  #onResize(): void {
    if (typeof this.tooltip === 'string') {
      return;
    }

    const label = this.renderRoot.querySelector('[part="label"]');

    this.tooltip = !!label && label.clientWidth < label.scrollWidth;
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    this.label = event.target
      .assignedNodes({ flatten: true })
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent?.trim())
      .join('');
  }
}
