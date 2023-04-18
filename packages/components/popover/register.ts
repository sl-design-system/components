import { Popover } from './src/popover.js';

customElements.define('sl-popover', Popover);

declare global {
  interface HTMLElementTagNameMap {
    'sl-popover': Popover;
  }
}
