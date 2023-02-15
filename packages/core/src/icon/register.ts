import { Icon } from './icon.js';

customElements.define('sl-icon', Icon);

declare global {
  interface HTMLElementTagNameMap {
    'sl-icon': Icon;
  }
}
