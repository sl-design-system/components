import { Button } from './src/button.js';

customElements.define('sl-button', Button);

declare global {
  interface HTMLElementTagNameMap {
    'sl-button': Button;
  }
}
