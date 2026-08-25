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
import { Option } from '@sl-design-system/listbox';
import { html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './grouped-option.scss.js';
export class GroupedOption extends Option {
  static {
    /** @internal */
    this.styles = [Option.styles, styles];
  }
  render() {
    return html`
      <div part="container">
        <sl-icon name="check"></sl-icon>
        <div part="wrapper">
          <slot></slot>
          <span part="group">${this.group}</span>
        </div>
      </div>
    `;
  }
}
__decorateClass([property()], GroupedOption.prototype, 'group', 2);
//# sourceMappingURL=grouped-option.js.map
