import { localized } from '@lit/localize';
import { ScopedElementsMap } from '@open-wc/scoped-elements/html-element.js';
import { EventEmitter, EventsController } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
// import { state } from 'lit/decorators.js';
import { NotificationMessage } from './notification-message.js';
import styles from './notification.scss.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-live-event': SlLiveEvent;
    'sl-live-event-polite': SlLiveEvent;
    'sl-live-event-assertive': SlLiveEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-live-aria': Notification;
  }
}

export type SlLiveEvent = CustomEvent<{ message: string; urgency?: 'polite' | 'assertive' }>;

/** Sends a notification to the live aria.
 * Please be aware that sending messages too soon after each other can cause the screenreader
 * to stop reading the earlier messages, or even skip them, when a new message is sent.
 * If you want to send multiple messages in a row, consider using a single message with all the information.
 *
 * @param message - The message to send to the live aria.
 * @param urgency - The urgency of the message. Default is 'polite'.
 */
export function sendToLiveAria(message: string, urgency?: 'polite' | 'assertive'): void {
  const liveEvent = new EventEmitter<SlLiveEvent>(document.body, 'sl-live-event');
  console.log('sendToLiveAria', message, urgency);
  liveEvent.emit({ message, urgency });
}

/**
 * Utility that serves as a receipient for all live-aria notifications and supplies them for screenreaders
 * from a central place in your application.
 *
 * ```html
 * <sl-live-aria></sl-live-aria>
 * ```
 */
@localized()
export class Notification extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-notification-message': NotificationMessage
    };
  }

  #events = new EventsController(this, {});

  override connectedCallback(): void {
    super.connectedCallback();
    this.#events.listen(window, 'sl-live-event', this.#onLiveEvent);
  }
  override render(): TemplateResult {
    return html`
      <div aria-live="polite" aria-atomic="true"></div>
      <div aria-live="assertive" aria-atomic="false"></div>
    `;
  }

  #onLiveEvent(event: SlLiveEvent) {
    if (event.detail.urgency === 'assertive') {
      this.#assertiveNotification(event.detail.message);
    } else {
      this.#politeNotification(event.detail.message);
    }
  }

  polite(message: string) {
    this.#politeNotification(message);
  }

  #assertiveNotification(message: string) {
    const messageNode = document.createElement('sl-notification-message');
    messageNode.innerText = message;
    this.renderRoot.querySelector('[aria-live="assertive"]')?.appendChild(messageNode);
  }

  #politeNotification(message: string) {
    const messageNode = document.createElement('sl-notification-message');
    messageNode.innerText = message;

    this.renderRoot.querySelector('[aria-live="polite"]')?.appendChild(messageNode);
  }
}
