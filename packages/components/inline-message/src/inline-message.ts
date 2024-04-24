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
    'sl-inline-message': InlineMessage;
  }
}

export type InlineMessageVariant = 'info' | 'success' | 'warning' | 'danger';

export type SlDismissEvent = CustomEvent<void>;

/**
 * An inline message component for displaying additional information/errors.
 *
 * @slot default - The body of the inline-message
 * @slot title - Title content for the inline message
 * @slot details - More details of the inline-message like list of errors
 * @slot icon - Icon shown on the left side of the component
 */
@localized()
export class InlineMessage extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Emits when the inline message is dismissed. */
  @event({ name: 'sl-dismiss' }) dismissEvent!: EventEmitter<SlDismissEvent>;

  /** Will hide the close button if set. */
  @property({ type: Boolean }) indismissible?: boolean;

  /** The variant of the inline message. */
  @property({ reflect: true }) variant: InlineMessageVariant = 'info';

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
          <slot name="title"></slot>
        </div>
        <div part="action">
          <slot name="action"></slot>
        </div>
        ${this.indismissible
          ? nothing
          : html`
              <sl-button
                @click=${this.#closeOnAnimationend}
                .variant=${this.variant}
                aria-label=${msg('Close')}
                fill="ghost"
                size="md"
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
