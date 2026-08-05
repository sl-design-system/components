import { Error } from './error.js';
import { FormField } from './form-field.js';
import { FormValidationErrors } from './form-validation-errors.js';
import { Form } from './form.js';
import { Hint } from './hint.js';
import { Label } from './label.js';

customElements.define('sl-error', Error);
customElements.define('sl-form', Form);
customElements.define('sl-form-field', FormField);
customElements.define('sl-form-validation-errors', FormValidationErrors);
customElements.define('sl-hint', Hint);
customElements.define('sl-label', Label);
