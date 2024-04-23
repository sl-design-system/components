import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, breakpoints, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
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
 * @slot default - slot for the main information of the inline-message
 * @slot title - title content for the inline message
 * @slot details - slot for more details of the inline-message like list of errors
 * @slot icon - icon shown on the left side of the component
 * @slot close-button - Closing button for the inline message
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
  static override styles: CSSResultGroup = [breakpoints, styles];

  /** @internal */
  @query('.wrapper') wrapper?: HTMLDivElement;

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
        <div class="content">
          <slot name="icon">
            <sl-icon .name=${this.iconName} size="md"></sl-icon>
          </slot>
          <div class="content-details">
            <slot name="title"></slot>
            <slot></slot>
            <slot name="details"></slot>
          </div>
        </div>
        ${this.indismissible
          ? nothing
          : html`
              <slot @click=${this.#closeOnAnimationend} name="close-button">
                <sl-button aria-label=${msg('Close')} fill="ghost" size="sm" .variant=${this.variant}>
                  <sl-icon name="xmark"></sl-icon>
                </sl-button>
              </slot>
            `}
      </div>
    `;
  }

  #closeOnAnimationend(event: AnimationEvent): void {
    if (event.animationName !== 'slide-in-up') {
      this.wrapper?.removeAttribute('open');
      this.wrapper?.addEventListener(
        'animationend',
        () => {
          this.dismissEvent.emit();
          this.remove();
        },
        { once: true }
      );

      requestAnimationFrame(() => {
        this.wrapper?.setAttribute('close', '');
      });
    }
  }
}
