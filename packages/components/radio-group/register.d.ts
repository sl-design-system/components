import { Radio } from './src/radio.js';
import { RadioGroup } from './src/radio-group.js';
declare global {
    interface HTMLElementTagNameMap {
        'sl-radio': Radio;
        'sl-radio-group': RadioGroup;
    }
}
