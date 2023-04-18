import { Checkbox } from './src/checkbox.js';
import { CheckboxGroup } from './src/checkbox-group.js';
declare global {
    interface HTMLElementTagNameMap {
        'sl-checkbox': Checkbox;
        'sl-checkbox-group': CheckboxGroup;
    }
}
