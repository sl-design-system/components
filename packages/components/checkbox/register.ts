import { CheckboxGroup } from './src/checkbox-group.js';
import { Checkbox } from './src/checkbox.js';

customElements.define('sl-checkbox', Checkbox);
customElements.define('sl-checkbox-group', CheckboxGroup);

declare global {
  interface HTMLElementTagNameMap {
    'sl-checkbox': Checkbox;
    'sl-checkbox-group': CheckboxGroup;
  }
}
