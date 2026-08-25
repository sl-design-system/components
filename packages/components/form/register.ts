import { Error } from './src/error.js';
import { FormField } from './src/form-field.js';
import { FormValidationErrors } from './src/form-validation-errors.js';
import { Form } from './src/form.js';
import { Hint } from './src/hint.js';
import { Label } from './src/label.js';

customElements.define('sl-error', Error);
customElements.define('sl-form', Form);
customElements.define('sl-form-field', FormField);
customElements.define('sl-form-validation-errors', FormValidationErrors);
customElements.define('sl-hint', Hint);
customElements.define('sl-label', Label);
