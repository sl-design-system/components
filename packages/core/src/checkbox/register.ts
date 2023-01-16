import { Checkbox } from './checkbox.js';
import { CheckboxGroup } from './checkbox-group.js';

customElements.define('sl-checkbox', Checkbox);
customElements.define('sl-checkbox-group', CheckboxGroup);

declare global {
  interface HTMLElementTagNameMap {
    'sl-checkbox': Checkbox;
    'sl-checkbox-group': CheckboxGroup;
  }
}
