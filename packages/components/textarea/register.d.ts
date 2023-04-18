import { Textarea } from './src/textarea.js';
declare global {
    interface HTMLElementTagNameMap {
        'sl-textarea': Textarea;
    }
}
