import { LitElement, html } from 'lit';
import styles from './tab-panel.scss.js';
export class TabPanel extends LitElement {
  static {
    /** @internal */
    this.styles = styles;
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'tabpanel');
  }
  render() {
    return html`<slot></slot>`;
  }
}
//# sourceMappingURL=tab-panel.js.map
