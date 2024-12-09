import { localized } from '@lit/localize';
import { ScopedElementsMap } from '@open-wc/scoped-elements/html-element.js';
import { EventEmitter, EventsController } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
// import { state } from 'lit/decorators.js';
import { Announcement } from './announcement.js';
import styles from './announcer.scss.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-announce': SlAnnounceEvent;
    'sl-announce-polite': SlAnnounceEvent;
    'sl-announce-assertive': SlAnnounceEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-announcer': Announcer;
  }
}

export type SlAnnounceEvent = CustomEvent<{ message: string; urgency?: 'polite' | 'assertive' }>;

/** Sends a notification to the live aria.
 * Please be aware that sending messages too soon after each other can cause the screenreader
 * to stop reading the earlier messages, or even skip them, when a new message is sent.
 * If you want to send multiple messages in a row, consider using a single message with all the information.
 *
 * @param message - The message to send to the live aria.
 * @param urgency - The urgency of the message. Default is 'polite'.
 */
export function sendToAnnouncer(message: string, urgency?: 'polite' | 'assertive'): void {
  const liveEvent = new EventEmitter<SlAnnounceEvent>(document.body, 'sl-announce');
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
export class Announcer extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-announcement': Announcement
    };
  }

  #events = new EventsController(this, {});

  override connectedCallback(): void {
    super.connectedCallback();
    this.#events.listen(window, 'sl-announce', this.#onLiveEvent);
  }
  override render(): TemplateResult {
    return html`
      <div aria-live="polite" aria-atomic="true"></div>
      <div aria-live="assertive" aria-atomic="false"></div>
    `;
  }

  #onLiveEvent(event: SlAnnounceEvent) {
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
    const messageNode = document.createElement('sl-announcement');
    messageNode.innerText = message;
    this.renderRoot.querySelector('[aria-live="assertive"]')?.appendChild(messageNode);
  }

  #politeNotification(message: string) {
    const messageNode = document.createElement('sl-announcement');
    messageNode.innerText = message;
    this.renderRoot.querySelector('[aria-live="polite"]')?.appendChild(messageNode);
  }
}
