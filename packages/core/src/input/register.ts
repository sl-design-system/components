import { Input } from './input.js';

customElements.define('sl-input', Input);

declare global {
  interface HTMLElementTagNameMap {
    'sl-input': Input;
  }
}
