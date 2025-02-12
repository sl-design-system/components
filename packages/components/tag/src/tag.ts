import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { EventEmitter, EventsController, event } from '@sl-design-system/shared';
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
export type TagVariant = 'neutral' | 'info';

/**
 * A tag component containing label.
 *
 * ```html
 * <sl-tag>Tag label</sl-tag>
 * ```
 *
 * @slot default - The tag label.
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
  static override styles: CSSResultGroup = styles;

  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, { keydown: this.#onKeydown });

  /**
   * Observe changes in size, so we can check whether we need to show tooltips
   * for truncated links.
   */
  #observer = new ResizeObserver(() => this.#onResize());

  /** Either an instanceof of Tooltip, or a cleanup function. */
  #tooltip?: Tooltip | (() => void);

  /** Whether the tag component is disabled, when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** @internal The label of the tag component. */
  @state() label = '';

  /** Whether the tag component is removable. */
  @property({ type: Boolean }) removable?: boolean;

  /** @internal Emits when the tag is removed. */
  @event({ name: 'sl-remove' }) removeEvent!: EventEmitter<SlRemoveEvent>;

  /**
   * The size of the tag.
   * @default 'md'
   */
  @property({ reflect: true }) size?: TagSize;

  /**
   * The variant of the tag.
   * @default 'neutral'
   */
  @property({ reflect: true }) variant?: TagVariant;

  override connectedCallback(): void {
    super.connectedCallback();

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

    if (changes.has('disabled') || changes.has('removable')) {
      if (this.removable) {
        this.setAttribute('tabindex', this.disabled ? '-1' : '0');
      } else if (this.disabled || changes.get('removable')) {
        this.removeAttribute('tabindex');
      }
    }

    if (changes.has('removable')) {
      if (this.removable) {
        this.setAttribute('aria-description', msg('Press the delete or backspace key to remove this item'));
      } else {
        this.removeAttribute('aria-description');
      }
    }
  }

  override render(): TemplateResult {
    return html`
      <slot @slotchange=${this.#onSlotChange} part="label"></slot>
      ${this.removable
        ? html`
            <button @click=${this.#onRemove} ?disabled=${this.disabled} aria-hidden="true" part="button" tabindex="-1">
              <sl-icon name="xmark"></sl-icon>
            </button>
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

    // If the contents of the the tag overflows, make sure it is keyboard focusable,
    // so the user can tab to it.
    if (!this.disabled && (this.removable || this.#tooltip)) {
      this.setAttribute('tabindex', '0');
    } else if (!this.hasAttribute('aria-labelledby')) {
      this.removeAttribute('tabindex');
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
