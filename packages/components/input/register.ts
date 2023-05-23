import { Input } from './src/input.js';

customElements.define('sl-text-input', Input);

declare global {
  interface HTMLElementTagNameMap {
    'sl-text-input': Input;
  }
}
