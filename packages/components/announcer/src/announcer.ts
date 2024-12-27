import { localized } from '@lit/localize';
import { EventsController } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import styles from './announcer.scss.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-announce': SlAnnounceEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-announcer': Announcer;
  }
}

export type SlAnnounceEvent = CustomEvent<{ message: string; urgency?: 'polite' | 'assertive' }>;

/**
 * Utility that serves as a recipient for all live-aria notifications and supplies them for screenreaders
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

  #events = new EventsController(this, {});

  override connectedCallback(): void {
    super.connectedCallback();

    this.#events.listen(document.body, 'sl-announce', this.#onLiveEvent);
  }

  override render(): TemplateResult {
    return html`
      <ul aria-live="polite" aria-atomic="false"></ul>
      <ul aria-live="assertive" aria-atomic="false"></ul>
    `;
  }

  #onLiveEvent(event: SlAnnounceEvent) {
    const container = this.renderRoot.querySelector(`[aria-live="${event.detail.urgency || 'polite'}"]`);

    // make sure the message is not already in the container
    if (container?.textContent?.indexOf(event.detail.message) === -1) {
      const messageNode = document.createElement('li');
      messageNode.innerText = event.detail.message;

      container?.appendChild(messageNode);
      setTimeout(() => {
        messageNode.remove();
      }, 500);
    }
  }
}
