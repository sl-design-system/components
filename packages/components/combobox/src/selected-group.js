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
import { localized, msg } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Option, OptionGroup } from '@sl-design-system/listbox';
import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './selected-group.scss.js';
export let SelectedGroup = class extends ScopedElementsMixin(OptionGroup) {
  constructor() {
    super(...arguments);
    this.options = [];
  }
  /** @internal */
  static get scopedElements() {
    return {
      ...super.scopedElements,
      'sl-option': Option
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.label = msg('Selected', { id: 'sl.common.selected' });
  }
  render() {
    return html`
      <div part="wrapper">
        <sl-option-group-header>
          ${msg('Selected', { id: 'sl.common.selected' })}
        </sl-option-group-header>
        <slot></slot>
      </div>
      ${
        this.hasGroups
          ? nothing
          : html`
              <sl-option-group-header divider>
                ${msg('All options', { id: 'sl.common.allOptions' })}
              </sl-option-group-header>
            `
      }
    `;
  }
};
/** @internal */
SelectedGroup.styles = [OptionGroup.styles, styles];
__decorateClass([property({ attribute: false })], SelectedGroup.prototype, 'currentOption', 2);
__decorateClass(
  [property({ type: Boolean, reflect: true, attribute: 'has-groups' })],
  SelectedGroup.prototype,
  'hasGroups',
  2
);
__decorateClass([property({ attribute: false })], SelectedGroup.prototype, 'options', 2);
SelectedGroup = __decorateClass([localized()], SelectedGroup);
//# sourceMappingURL=selected-group.js.map
