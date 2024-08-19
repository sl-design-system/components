import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { EventEmitter, EventsController, event } from '@sl-design-system/shared';
import { Tooltip } from '@sl-design-system/tooltip';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
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
  static override styles: CSSResultGroup = styles;

  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, {
    keydown: this.#onKeydown
  });

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

  /** The label of the tag component. */
  @property({ reflect: true }) label?: string;

  /** Whether you can interact with the tag or if it is just a static, readonly display. Readonly cannot be removable. */
  @property({ type: Boolean, reflect: true }) readonly?: boolean;

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

    if (changes.has('readonly')) {
      if (this.readonly) {
        this.setAttribute('aria-readonly', 'true');
      } else {
        this.removeAttribute('aria-readonly');
      }
    }
  }

  override render(): TemplateResult {
    return html`
      <div class="label">${this.label}</div>
      ${this.removable && !this.readonly
        ? html`
            <button @click=${this.#onRemove} aria-label=${msg('Remove')} aria-labelledby="tag-element" tabindex="-1">
              <sl-icon name="xmark" size=${ifDefined(this.size)}></sl-icon>
            </button>
          `
        : nothing}
    `;
  }

  #onKeydown(event: KeyboardEvent): void {
    if (['Backspace', 'Delete'].includes(event.key) && this.removable) {
      this.#onRemove(event);
    }
  }

  #onRemove(event: Event): void {
    if (this.disabled || this.readonly) {
      event.preventDefault();
      event.stopPropagation();

      return;
    }

    // Emit remove event *before* removing the tag, so consumers can react to the event.
    this.removeEvent.emit();
    this.remove();
  }

  #onResize(): void {
    const label = this.renderRoot.querySelector('div');

    if (label && label.clientWidth < label.scrollWidth) {
      this.#tooltip ||= Tooltip.lazy(
        this,
        tooltip => {
          this.#tooltip = tooltip;
          tooltip.textContent = this.label!;
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
}
