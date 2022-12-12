import { Editor } from './editor.js';

customElements.define('sl-editor', Editor);

declare global {
  interface HTMLElementTagNameMap {
    'sl-editor': Editor;
  }
}
