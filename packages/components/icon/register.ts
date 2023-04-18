import { Icon } from './src/icon.js';

customElements.define('sl-icon', Icon);

declare global {
  interface HTMLElementTagNameMap {
    'sl-icon': Icon;
  }
}
