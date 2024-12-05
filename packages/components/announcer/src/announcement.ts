import { CSSResultGroup, LitElement, html } from 'lit';
import styles from './announcer.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-announcement': Announcement;
  }
}

export class Announcement extends LitElement {
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
