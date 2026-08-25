var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if ((decorator = decorators[i]))
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
import { localized, msg, str } from '@lit/localize';
import { Option } from '@sl-design-system/listbox';
import { html } from 'lit';
import styles from './create-custom-option.scss.js';
export let CreateCustomOption = class extends Option {
  render() {
    return html`
      <div part="container">
        <sl-icon name="plus"></sl-icon>
        <div part="wrapper">
          ${msg(str`Create "${this.value}"`, { id: 'sl.combobox.createCustomOption' })}
        </div>
      </div>
    `;
  }
};
/** @internal */
CreateCustomOption.styles = [Option.styles, styles];
CreateCustomOption = __decorateClass([localized()], CreateCustomOption);
//# sourceMappingURL=create-custom-option.js.map
