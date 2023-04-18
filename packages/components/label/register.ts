import { Label } from './src/label.js';

customElements.define('sl-label', Label);

declare global {
  interface HTMLElementTagNameMap {
    'sl-label': Label;
  }
}
