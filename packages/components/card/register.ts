import { Card } from './src/card.js';

customElements.define('sl-card', Card);

declare global {
  interface HTMLElementTagNameMap {
    'sl-card': Card;
  }
}
