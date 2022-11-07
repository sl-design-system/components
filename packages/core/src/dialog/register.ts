import { Dialog } from './dialog.js';

customElements.define('sl-dialog', Dialog);

declare global {
  interface HTMLElementTagNameMap {
    'sl-dialog': Dialog;
  }
}
