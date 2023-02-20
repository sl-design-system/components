import { Select } from './select.js';
import { SelectOption } from './select-option.js';
import { SelectOverlay } from './select-overlay.js';
import { SelectOptionGroup } from './select-option-group.js';

customElements.define('sl-select', Select);
customElements.define('sl-select-option', SelectOption);
customElements.define('sl-select-option-group', SelectOptionGroup);
customElements.define('sl-select-overlay', SelectOverlay);

declare global {
  interface HTMLElementTagNameMap {
    'sl-select': Select;
    'sl-select-option': SelectOption;
    'sl-select-option-group': SelectOptionGroup;
    'sl-select-overlay': SelectOverlay;
  }
}
