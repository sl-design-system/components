// The checklist renders `<sl-checkbox>` elements in light DOM, which uses the global registry.
import '@sl-design-system/checkbox/register.js';
import { RichTextEditor } from './rich-text-editor.js';

customElements.define('sl-rich-text-editor', RichTextEditor);
