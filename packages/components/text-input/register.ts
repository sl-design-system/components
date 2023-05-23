import { TextInput } from './src/text-input';

customElements.define('sl-text-input', TextInput);

declare global {
  interface HTMLElementTagNameMap {
    'sl-text-input': TextInput;
  }
}
