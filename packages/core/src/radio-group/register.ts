import { Radio } from './radio.js';
import { RadioGroup } from './radio-group.js';

customElements.define('sl-radio', Radio);
customElements.define('sl-radio-group', RadioGroup);

declare global {
  interface HTMLElementTagNameMap {
    'sl-radio': Radio;
    'sl-radio-group': RadioGroup;
  }
}
