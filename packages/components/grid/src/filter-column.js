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
var _filterRef;
import { localized, msg } from '@lit/localize';
import { ArrayListDataSource, FetchListDataSourcePlaceholder } from '@sl-design-system/data-source';
import { getStringByPath, getValueByPath } from '@sl-design-system/shared';
import { html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { GridFilter } from './filter.js';
import { GridSortColumn } from './sort-column.js';
let nextUniqueId = 0;
export let GridFilterColumn = class extends GridSortColumn {
  constructor() {
    super(...arguments);
    /** Reference to the rendered `<sl-grid-filter>` element. */
    __privateAdd(this, _filterRef, createRef());
    this.headerRowCount = 2;
  }
  /** @internal */
  get baseScopedElements() {
    return {
      ...super.baseScopedElements,
      'sl-grid-filter': GridFilter
    };
  }
  /** Returns the element that is rendered in the table header. */
  get filterElement() {
    return __privateGet(this, _filterRef).value;
  }
  connectedCallback() {
    super.connectedCallback();
    this.id ||= `grid-filter-${nextUniqueId++}`;
  }
  willUpdate(changes) {
    super.willUpdate(changes);
    if (changes.has('options') && __privateGet(this, _filterRef).value) {
      __privateGet(this, _filterRef).value.options = this.options;
    }
    if (changes.has('value') && __privateGet(this, _filterRef).value) {
      __privateGet(this, _filterRef).value.value = this.value;
    }
  }
  itemsChanged() {
    super.itemsChanged();
    if (
      this.mode === 'select' &&
      typeof this.options === 'undefined' &&
      this.grid?.dataSource instanceof ArrayListDataSource
    ) {
      this.internalOptions = this.grid.dataSource.unfilteredItems
        ?.filter(item => item.type === 'data')
        ?.reduce((acc, { data: item }) => {
          let value = getValueByPath(item, this.path),
            label = (this.labelPath ? getStringByPath(item, this.labelPath) : String(value)) ?? '';
          if (value === null || value === void 0 || String(value).trim() === '') {
            label = msg('Blank', { id: 'sl.grid.blankFilterOption' });
            value = '';
          }
          if (value !== null && !acc.some(option => option.value === value)) {
            acc.push({ label, value });
          }
          return acc;
        }, [])
        .sort((a, b) => a.label.localeCompare(b.label));
    }
  }
  stateChanged() {
    super.stateChanged();
    const filter = this.grid?.dataSource?.filters.get(this.id);
    if (filter && (filter.by === this.path || filter.by === this.filter)) {
      this.value = filter.value?.toString();
    }
  }
  renderHeaderRow(index) {
    const parts = ['header', 'filter', ...this.getParts()];
    if (index === 0) {
      return super.renderHeaderRow(index);
    } else if (index === 1) {
      return html`
        <th part=${parts.join(' ')} role="columnheader" scope="col">
          <sl-grid-filter
            ${ref(__privateGet(this, _filterRef))}
            .column=${this}
            .filter=${this.filter}
            .filterLabel=${this.filterLabel}
            .mode=${this.mode || 'text'}
            .options=${this.options ?? this.internalOptions}
            .path=${this.path}
            .value=${this.value}>
          </sl-grid-filter>
        </th>
      `;
    }
    return nothing;
  }
  getDisplayValue(item) {
    if (this.renderer || item === FetchListDataSourcePlaceholder || !this.labelPath) {
      return super.getDisplayValue(item);
    } else {
      return getValueByPath(item, this.labelPath);
    }
  }
};
_filterRef = new WeakMap();
__decorateClass([state()], GridFilterColumn.prototype, 'internalOptions', 2);
__decorateClass([property({ attribute: false })], GridFilterColumn.prototype, 'filter', 2);
__decorateClass(
  [property({ type: String, attribute: 'filter-label' })],
  GridFilterColumn.prototype,
  'filterLabel',
  2
);
__decorateClass(
  [property({ attribute: 'label-path' })],
  GridFilterColumn.prototype,
  'labelPath',
  2
);
__decorateClass([property({ type: String })], GridFilterColumn.prototype, 'mode', 2);
__decorateClass([property({ attribute: false })], GridFilterColumn.prototype, 'options', 2);
__decorateClass([property({ type: String })], GridFilterColumn.prototype, 'value', 2);
GridFilterColumn = __decorateClass([localized()], GridFilterColumn);
//# sourceMappingURL=filter-column.js.map
