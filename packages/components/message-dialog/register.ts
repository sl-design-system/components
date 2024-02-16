import { MessageDialog } from './src/message-dialog.js';

customElements.define('sl-message-dialog', MessageDialog);

declare global {
  interface HTMLElementTagNameMap {
    'sl-message-dialog': MessageDialog;
  }
}
