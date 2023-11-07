import { TextField } from './src/text-field.js';

customElements.define('sl-text-field', TextField);

declare global {
  interface HTMLElementTagNameMap {
    'sl-text-field': TextField;
  }
}
