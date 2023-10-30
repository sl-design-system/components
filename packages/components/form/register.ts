import { FormControlAdapter } from './src/adapter.js';
import { TextInputAdapter } from './src/adapters/text-input-adapter.js';
import { Error } from './src/error.js';
import { Hint } from './src/hint.js';
import { Label } from './src/label.js';

FormControlAdapter.register(TextInputAdapter);

customElements.define('sl-error', Error);
customElements.define('sl-hint', Hint);
customElements.define('sl-label', Label);
