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
import { Select } from '@sl-design-system/select';
import { getValueByPath, setValueByPath } from '@sl-design-system/shared';
import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { GridColumn } from './column.js';
export class GridSelectColumn extends GridColumn {
  /** @internal */
  get baseScopedElements() {
    return {
      'sl-option': Option,
      'sl-select': Select
    };
  }
  renderData(item) {
    return html`
      <td part="data select delegate-focus">
        <sl-select
          @sl-change=${event => this.#onChange(event, item.data)}
          aria-label=${this.getFormControlLabel(item.data)}
          .value=${getValueByPath(item.data, this.path)}>
          ${this.options?.map(option =>
            typeof option === 'string'
              ? html`<sl-option .value=${option}>${option}</sl-option>`
              : html`<sl-option .value=${option.value}>${option.label}</sl-option>`
          )}
        </sl-select>
      </td>
    `;
  }
  #onChange(event, item) {
    setValueByPath(item, this.path, event.detail);
  }
}
__decorateClass([property({ type: Array })], GridSelectColumn.prototype, 'options', 2);
//# sourceMappingURL=select-column.js.map
