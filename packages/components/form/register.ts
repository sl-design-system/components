import { Error } from './src/error.js';
import { FormField } from './src/form-field.js';
import { Hint } from './src/hint.js';
import { Label } from './src/label.js';

customElements.define('sl-error', Error);
customElements.define('sl-form-field', FormField);
customElements.define('sl-hint', Hint);
customElements.define('sl-label', Label);

declare global {
  interface HTMLElementTagNameMap {
    'sl-error': Error;
    'sl-form-field': FormField;
    'sl-hint': Hint;
    'sl-label': Label;
  }
}
