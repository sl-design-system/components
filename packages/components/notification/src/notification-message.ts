import { CSSResultGroup, LitElement, html } from 'lit';
import styles from './notification.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-notification-message': NotificationMessage;
  }
}

export class NotificationMessage extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  override render() {
    return html`<slot></slot> `;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    setTimeout(() => {
      this.remove();
    }, 500);
  }
}
