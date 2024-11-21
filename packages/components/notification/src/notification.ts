import { localized } from '@lit/localize';
import { EventEmitter, EventsController } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { state } from 'lit/decorators.js';
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

  /** @ignore */
  static notify(message: string, urgency?: 'polite' | 'assertive'): void {
    const liveEvent = new EventEmitter<SlLiveEvent>(document.body, 'sl-live-event');
    liveEvent.emit({ message, urgency });
  }

  @state() assertive: string[] = [];
  @state() polite: string[] = [];

  #events = new EventsController(this, {});

  override connectedCallback(): void {
    super.connectedCallback();
    this.#events.listen(window, 'sl-live-event', this.#onLiveEvent);
  }
  override render(): TemplateResult {
    return html`
      <div role="status">${this.polite?.map(message => html`${message}`)}</div>
      <div role="alert" aria-atomic="false" aria-relevant="additions">
        ${this.assertive?.map(message => html`${message}`)}
      </div>
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
    this.assertive = [...this.assertive, message];
  }

  #politeNotification(message: string) {
    this.polite = [...this.polite, message];
  }

  // TODO: fix that it reads things multiple times in NVDA; when something is added it reads the entire contents, not only the just added text
}
