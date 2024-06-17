import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './inline-message.scss.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-dismiss': SlDismissEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-format-date': FormatDate;
  }
}

export type InlineMessageVariant = 'info' | 'success' | 'warning' | 'danger';

export type SlDismissEvent = CustomEvent<void>;

/**
 * An inline message component for displaying additional information.
 *
 * @slot default - The body of the inline-message
 * @slot icon - Icon shown on the left side of the component
 * @slot title - Title content for the inline message
 * @slot action - Optional action button
 */
@localized()
export class FormatDate extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Observe the size and determine where to place the action button if present. */
  #observer = new ResizeObserver(() => this.#onResize());

  /** @internal Emits when the inline message is dismissed. */
  @event({ name: 'sl-dismiss' }) dismissEvent!: EventEmitter<SlDismissEvent>;

  /** Will hide the close button if set. */
  @property({ type: Boolean, reflect: true }) indismissible?: boolean;

  /** @internal If the action is missing, we need to hide the action part. */
  @property({ type: Boolean, attribute: 'no-action', reflect: true }) noAction = true;

  /** @internal If the title is missing, the content needs to be placed where the title should be. */
  @property({ type: Boolean, attribute: 'no-title', reflect: true }) noTitle = true;

  /** The variant of the inline message. */
  @property({ reflect: true }) variant: InlineMessageVariant = 'info';

  /** @internal Calculates the height of the title and wraps the button if longer than 1 line. */
  @property({ type: Boolean, attribute: 'wrap-action', reflect: true }) wrapAction?: boolean;

  /** @internal The name of the icon, depending on the variant. */
  get iconName(): string {
    switch (this.variant) {
      case 'success':
        return 'circle-check-solid';
      case 'warning':
        return 'octagon-exclamation-solid';
      case 'danger':
        return 'triangle-exclamation-solid';
      default:
        return 'info';
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.#observer.observe(this);
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('variant')) {
      this.setAttribute('role', ['danger', 'warning'].includes(this.variant) ? 'alert' : 'status');
    }
  }

  override render(): TemplateResult {
    return html`
      <div @animationend=${this.#closeOnAnimationend} class="wrapper" open>
        <div part="icon">
          <slot name="icon">
            <sl-icon .name=${this.iconName} size="md"></sl-icon>
          </slot>
        </div>
        <div part="title">
          <slot @slotchange=${this.#onTitleSlotChange} name="title"></slot>
        </div>
        <div part="action">
          <slot @slotchange=${this.#onActionSlotChange} name="action"></slot>
        </div>
        ${this.indismissible
          ? nothing
          : html`
              <sl-button
                @click=${this.#closeOnAnimationend}
                .variant=${this.variant}
                aria-label=${msg('Close')}
                fill="ghost"
                size="lg"
              >
                <sl-icon name="xmark"></sl-icon>
              </sl-button>
            `}
        <div part="content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  #onActionSlotChange(event: Event & { target: HTMLSlotElement }): void {
    this.noAction = !event.target.assignedElements({ flatten: true }).length;
  }

  #onResize(): void {
    const heading = this.noTitle
      ? this.renderRoot.querySelector('slot:not([name])')
      : this.renderRoot.querySelector('slot[name="title"]');

    if (heading) {
      const { height } = heading.getBoundingClientRect(),
        lineHeight = parseInt(getComputedStyle(heading).getPropertyValue('line-height') ?? '1000');

      this.wrapAction = height > lineHeight;
    }
  }

  #onTitleSlotChange(event: Event & { target: HTMLSlotElement }): void {
    this.noTitle = !Array.from(event.target.assignedNodes({ flatten: true })).some(
      node => node.nodeType === Node.ELEMENT_NODE || node.textContent?.trim()
    );
  }

  #closeOnAnimationend(event: AnimationEvent): void {
    // Do nothing when it is the open animation
    if (event.animationName === 'slide-in-up') {
      return;
    }

    const wrapper = this.renderRoot.querySelector('.wrapper')!;

    wrapper.removeAttribute('open');
    wrapper.addEventListener(
      'animationend',
      () => {
        this.dismissEvent.emit();
        this.remove();
      },
      { once: true }
    );

    requestAnimationFrame(() => {
      wrapper.setAttribute('close', '');
    });
  }
}
