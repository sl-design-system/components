import { Checkbox } from './checkbox.js';

customElements.define('sl-checkbox', Checkbox);

declare global {
  interface HTMLElementTagNameMap {
    'sl-checkbox': Checkbox;
  }
}
