import { Input } from './input';

customElements.define('sl-input', Input);

declare global {
  interface HTMLElementTagNameMap {
    'sl-input': Input;
  }
}
