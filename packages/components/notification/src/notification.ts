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

  /** @ignore */
  static notify(message: string, urgency?: 'polite' | 'assertive'): void {
    const liveEvent = new EventEmitter<SlLiveEvent>(document.body, 'sl-live-event');
    liveEvent.emit({ message, urgency });
  }

  #events = new EventsController(this, {});

  override connectedCallback(): void {
    super.connectedCallback();
    this.#events.listen(window, 'sl-live-event', this.#onLiveEvent);
    const statusElement = this.renderRoot.querySelector('[aria-live="polite"]');
    if (statusElement) {
      statusElement.innerHTML = ' ';
    }
  }
  override render(): TemplateResult {
    return html`
      <div aria-live="polite" aria-atomic="false"></div>
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
