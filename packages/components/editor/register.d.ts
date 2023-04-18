import { Editor } from './src/editor.js';
declare global {
    interface HTMLElementTagNameMap {
        'sl-editor': Editor;
    }
}
