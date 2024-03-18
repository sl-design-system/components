import { RadioGroup } from './src/radio-group.js';
import { Radio } from './src/radio.js';

customElements.define('sl-radio', Radio);
customElements.define('sl-radio-group', RadioGroup);

declare global {
  interface HTMLElementTagNameMap {
    'sl-radio': Radio;
    'sl-radio-group': RadioGroup;
  }
}
