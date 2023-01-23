import { Textarea } from './textarea.js';

customElements.define('sl-textarea', Textarea);

declare global {
  interface HTMLElementTagNameMap {
    'sl-textarea': Textarea;
  }
}
