import { Editor } from './src/editor.js';

customElements.define('sl-editor', Editor);

declare global {
  interface HTMLElementTagNameMap {
    'sl-editor': Editor;
  }
}
