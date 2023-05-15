import { Switch } from './src/switch.js';

customElements.define('sl-switch', Switch);

declare global {
  interface HTMLElementTagNameMap {
    'sl-switch': Switch;
  }
}
