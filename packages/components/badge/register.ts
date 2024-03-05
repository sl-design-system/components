import { Badge } from './src/badge.js';

customElements.define('sl-badge', Badge);

declare global {
  interface HTMLElementTagNameMap {
    'sl-badge': Badge;
  }
}
