import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { EventEmitter, event } from '@sl-design-system/shared';
import { Tooltip } from '@sl-design-system/tooltip';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
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
export type TagEmphasis = 'subtle' | 'bold';

/**
 * A tag component containing label.
 *
 * ```html
 * <sl-tag label="tag label"></sl-tag>
 * ```
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
  static override shadowRootOptions: ShadowRootInit = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * Observe changes in size, so we can check whether we need to show tooltips
   * for truncated links.
   */
  #observer = new ResizeObserver(() => this.#onResize());

  /** Either an instanceof of Tooltip, or a cleanup function. */
  #tooltip?: Tooltip | (() => void);

  /** Whether the tag component is disabled, when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** The emphasis of the tag; defaults to 'subtle'. */
  @property({ reflect: true }) emphasis?: TagEmphasis;

  /** @internal The label of the tag component. */
  @state() label = '';

  /** Whether the tag component is removable. */
  @property({ type: Boolean, reflect: true }) removable?: boolean;

  /** @internal Emits when the tag is removed. */
  @event({ name: 'sl-remove' }) removeEvent!: EventEmitter<SlRemoveEvent>;

  /** The size of the tag. Defaults to `md`. */
  @property({ reflect: true }) size?: TagSize;

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }

    this.#observer.observe(this);
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    if (this.#tooltip instanceof Tooltip) {
      this.#tooltip?.remove();
    } else if (this.#tooltip) {
      this.#tooltip();
    }

    this.#tooltip = undefined;

    super.disconnectedCallback();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('disabled')) {
      this.setAttribute('tabindex', this.disabled ? '-1' : '0');
    }
  }

  override render(): TemplateResult {
    return html`
      <div class="wrapper" .tabIndex=${this.disabled ? -1 : 0}>
        <slot @slotchange=${this.#onSlotChange}></slot>
        ${this.removable
          ? html`
              <button @click=${this.#onRemove} aria-label=${msg(`Remove '${this.label}'`)} ?disabled=${this.disabled}>
                <sl-icon name="xmark"></sl-icon>
              </button>
            `
          : nothing}
      </div>
    `;
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
    const slot = this.renderRoot.querySelector('slot');

    if (slot && slot.clientWidth < slot.scrollWidth) {
      this.#tooltip ||= Tooltip.lazy(
        this,
        tooltip => {
          this.#tooltip = tooltip;
          tooltip.textContent = this.label;
        },
        { context: this.shadowRoot! }
      );
    } else if (this.#tooltip instanceof Tooltip) {
      this.#tooltip.remove();
      this.#tooltip = undefined;
    } else if (this.#tooltip) {
      this.#tooltip();
      this.#tooltip = undefined;
    }
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    this.label = event.target
      .assignedNodes({ flatten: true })
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent?.trim())
      .join('');
  }
}
