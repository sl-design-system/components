import { TextInput } from './src/text-field.js';

customElements.define('sl-text-input', TextInput);

declare global {
  interface HTMLElementTagNameMap {
    'sl-text-input': TextInput;
  }
}
