import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { EventEmitter, EventsController, event } from '@sl-design-system/shared';
import { Tooltip } from '@sl-design-system/tooltip';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
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
 *
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

  /** Events controller. */
  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, {
    keydown: this.#onKeydown,
    focusin: this.#onFocusin,
    click: this.#onFocusin
  });

  /** Whether the tag component is disabled, when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** The emphasis of the tag; defaults to 'subtle'. */
  @property({ reflect: true }) emphasis?: TagEmphasis;

  /** The label of the tag component. */
  @property({ reflect: true }) label?: string;

  /** The size of the tag. Defaults to `md`. */
  @property({ reflect: true }) size?: TagSize;

  /** Whether you can interact with the tag or if it is just a static, readonly display. Readonly cannot be removable. */
  @property({ type: Boolean, reflect: true }) readonly?: boolean;

  /** Whether the tag component is removable. */
  @property({ type: Boolean, reflect: true }) removable?: boolean;

  /** @internal Emits when the inline message is dismissed. */
  @event({ name: 'sl-remove' }) removeEvent!: EventEmitter<SlRemoveEvent>;

  /** Whether the tag label is overflowing. */
  #overflow = false;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('id', 'tag-element');

    if (this.readonly) {
      this.setAttribute('aria-readonly', 'true');
    }
  }

  override render(): TemplateResult {
    return html`
      <div class="wrapper" aria-describedby="tooltip-label" tabindex="0">
        <div class="label">${this.label}</div>
        ${this.removable && !this.readonly
          ? html` <button
              id="close-button"
              aria-labelledby="tag-element"
              aria-label=${msg('Remove')}
              @mouseover=${this.#onMouseover}
              @mouseout=${this.#onMouseover}
              @click=${this.#onRemoveClick}
              class="remove-button"
              tabindex="-1"
            >
              <sl-icon name="xmark" .size=${this.size}></sl-icon>
            </button>`
          : nothing}
      </div>
      ${this.#overflow ? html`<sl-tooltip id="tooltip-label" position="bottom"> ${this.label} </sl-tooltip>` : nothing}
    `;
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    this.#checkOverflow();
    this.requestUpdate();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('readonly')) {
      if (this.readonly) {
        this.setAttribute('aria-readonly', 'true');
      } else {
        this.removeAttribute('aria-readonly');
      }
    }

    if (changes.has('disabled')) {
      const wrapper = this.renderRoot.querySelector('.wrapper') as HTMLDivElement;
      wrapper.setAttribute('tabindex', this.disabled ? '-1' : '0');
    }

    this.#checkOverflow();
  }

  #onRemoveClick(): void {
    if (this.disabled || this.readonly) {
      return;
    }

    this.removeEvent.emit();
    this.remove();
  }

  /** Since :has is not working with :host (works only in Safari), this workaround is needed. */
  #onMouseover(event: MouseEvent): void {
    if (!(event.target instanceof HTMLButtonElement)) {
      return;
    }

    if (event.type === 'mouseover') {
      this.setAttribute('close-hover', '');
    } else {
      this.removeAttribute('close-hover');
    }
  }

  #onKeydown(event: KeyboardEvent): void {
    if (['Delete', 'Backspace'].includes(event.key) && this.removable) {
      this.#onRemoveClick();
    }
  }

  #onFocusin(): void {
    const wrapper = this.renderRoot.querySelector('.wrapper') as HTMLElement;
    wrapper?.focus();
  }

  #checkOverflow(): void {
    const labelEl = this.renderRoot.querySelector('.label') as HTMLElement,
      wrapper = this.renderRoot.querySelector('.wrapper') as HTMLElement;

    if (!labelEl) {
      return;
    }

    const isOverflowing = wrapper.clientWidth < wrapper.scrollWidth;

    if (isOverflowing) {
      labelEl.style.overflow = 'hidden';
      this.#overflow = isOverflowing;
    }
  }
}
