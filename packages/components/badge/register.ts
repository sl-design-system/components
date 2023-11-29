import { badge } from './src/badge.js';

customElements.define('sl-badge', badge);

declare global {
  interface HTMLElementTagNameMap {
    'sl-badge': badge;
  }
}
