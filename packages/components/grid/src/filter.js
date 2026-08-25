var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __typeError = msg2 => {
  throw TypeError(msg2);
};
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if ((decorator = decorators[i]))
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var __accessCheck = (obj, member, msg2) => member.has(obj) || __typeError('Cannot ' + msg2);
var __privateGet = (obj, member, getter) => (
  __accessCheck(obj, member, 'read from private field'),
  getter ? getter.call(obj) : member.get(obj)
);
var __privateAdd = (obj, member, value) =>
  member.has(obj)
    ? __typeError('Cannot add the same private member more than once')
    : member instanceof WeakSet
      ? member.add(obj)
      : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (
  __accessCheck(obj, member, 'write to private field'),
  setter ? setter.call(obj, value) : member.set(obj, value),
  value
);
var __privateMethod = (obj, member, method) => (
  __accessCheck(obj, member, 'access private method'),
  method
);
var _value,
  _GridFilter_instances,
  onSearchFieldChange_fn,
  onSelectChange_fn,
  onClear_fn,
  getFilterHeaderValue_fn;
import { localized, msg, str } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { Option } from '@sl-design-system/listbox';
import { SearchField } from '@sl-design-system/search-field';
import { Select } from '@sl-design-system/select';
import { event, getNameByPath, getValueByPath } from '@sl-design-system/shared';
import { LitElement, html, render } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './filter.scss.js';
export let GridFilter = class extends ScopedElementsMixin(LitElement) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _GridFilter_instances);
    /** The filter value(s). */
    __privateAdd(this, _value);
    this.active = false;
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-icon': Icon,
      'sl-option': Option,
      'sl-search-field': SearchField,
      'sl-select': Select
    };
  }
  get value() {
    return __privateGet(this, _value);
  }
  set value(value) {
    __privateSet(this, _value, value);
    this.active = !!__privateGet(this, _value);
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.mode === 'text' && this.column.path && !this.filter) {
      this.filter = item => {
        const itemValue = getValueByPath(item, this.column.path);
        if (typeof itemValue !== 'string') {
          return false;
        }
        return itemValue.toLowerCase().includes((this.value?.toString() ?? '').toLowerCase());
      };
    }
    this.filterRegisterEvent.emit();
  }
  render() {
    if (this.mode === 'select') {
      const filterLabel = msg(
        str`Filter by ${__privateMethod(this, _GridFilter_instances, getFilterHeaderValue_fn).call(this)}`,
        {
          id: 'sl.grid.filterByValue'
        }
      );
      return html`
        <sl-select
          @sl-change=${__privateMethod(this, _GridFilter_instances, onSelectChange_fn)}
          @sl-clear=${__privateMethod(this, _GridFilter_instances, onClear_fn)}
          aria-label=${filterLabel}
          .placeholder=${filterLabel}
          clearable>
          ${this.options?.map(option => {
            return html`
              <sl-option ?selected=${this.value?.includes(option.value)} .value=${option.value}>
                ${option.label}
              </sl-option>
            `;
          })}
        </sl-select>
      `;
    } else {
      return html`
        <sl-search-field
          @sl-change=${__privateMethod(this, _GridFilter_instances, onSearchFieldChange_fn)}
          @sl-clear=${__privateMethod(this, _GridFilter_instances, onClear_fn)}
          .placeholder=${msg(
            str`Filter by ${__privateMethod(this, _GridFilter_instances, getFilterHeaderValue_fn).call(this)}`,
            {
              id: 'sl.grid.filterByValue'
            }
          )}
          .value=${this.value?.toString() ?? ''}></sl-search-field>
      `;
    }
  }
};
_value = new WeakMap();
_GridFilter_instances = new WeakSet();
onSearchFieldChange_fn = function (event2) {
  this.value = event2.target.value?.trim() ?? '';
  this.filterChangeEvent.emit({ column: this.column, value: this.value });
};
onSelectChange_fn = function (event2) {
  if (event2.target.value) {
    this.value = event2.target.value.toString().trim() ?? '';
    this.filterChangeEvent.emit({ column: this.column, value: this.value });
  }
};
onClear_fn = function () {
  this.value = void 0;
  this.filterChangeEvent.emit({ column: this.column, value: this.value });
};
getFilterHeaderValue_fn = function () {
  if (this.filterLabel) {
    return this.filterLabel;
  } else if (!this.column) {
    return '';
  }
  const header = this.column.header;
  if (typeof header === 'string') {
    return header.toString().toLocaleLowerCase();
  } else if (header !== void 0) {
    const div = document.createElement('div');
    render(header, div);
    const textNodes = Array.from(div.childNodes)
      .filter(node => node.nodeType !== Node.ELEMENT_NODE && node.textContent?.trim())
      .map(node => node.textContent?.trim());
    return textNodes.join(' ').toString().toLocaleLowerCase();
  }
  return getNameByPath(this.column.path).toLocaleLowerCase();
};
/** @internal */
GridFilter.styles = styles;
__decorateClass([property({ type: Boolean, reflect: true })], GridFilter.prototype, 'active', 2);
__decorateClass([property({ attribute: false })], GridFilter.prototype, 'column', 2);
__decorateClass([property({ attribute: false })], GridFilter.prototype, 'filter', 2);
__decorateClass(
  [event({ name: 'sl-filter-change' })],
  GridFilter.prototype,
  'filterChangeEvent',
  2
);
__decorateClass(
  [event({ name: 'sl-filter-register' })],
  GridFilter.prototype,
  'filterRegisterEvent',
  2
);
__decorateClass([property({ type: String })], GridFilter.prototype, 'mode', 2);
__decorateClass([property({ attribute: false })], GridFilter.prototype, 'options', 2);
__decorateClass([property()], GridFilter.prototype, 'path', 2);
__decorateClass(
  [property({ type: String, attribute: 'filter-label' })],
  GridFilter.prototype,
  'filterLabel',
  2
);
__decorateClass([property({ attribute: false })], GridFilter.prototype, 'value', 1);
GridFilter = __decorateClass([localized()], GridFilter);
//# sourceMappingURL=filter.js.map
