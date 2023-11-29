import { InlineMessage } from './src/inline-message.js';

customElements.define('sl-inline-message', InlineMessage);

declare global {
  interface HTMLElementTagNameMap {
    'sl-inline-message': InlineMessage;
  }
}
