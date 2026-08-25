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
var _dataSource,
  _pageSize,
  _PaginatorPageSize_instances,
  onChange_fn,
  getDefaultItemLabel_fn,
  _onUpdate;
import { localized, msg, str } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LIST_DATA_SOURCE_DEFAULT_PAGE_SIZE } from '@sl-design-system/data-source';
import { Label } from '@sl-design-system/form';
import { Option } from '@sl-design-system/listbox';
import { Select } from '@sl-design-system/select';
import { event, getPluralCategory } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './page-size.scss.js';
export let PaginatorPageSize = class extends ScopedElementsMixin(LitElement) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _PaginatorPageSize_instances);
    /** The data source that the paginator controls. */
    __privateAdd(this, _dataSource);
    /** The current page size. */
    __privateAdd(this, _pageSize);
    __privateAdd(this, _onUpdate, () => {
      this.pageSize = this.dataSource.pageSize;
    });
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-label': Label,
      'sl-option': Option,
      'sl-select': Select
    };
  }
  get dataSource() {
    return __privateGet(this, _dataSource);
  }
  set dataSource(dataSource) {
    if (__privateGet(this, _dataSource)) {
      __privateGet(this, _dataSource).removeEventListener(
        'sl-update',
        __privateGet(this, _onUpdate)
      );
    }
    __privateSet(this, _dataSource, dataSource);
    __privateGet(this, _dataSource)?.addEventListener('sl-update', __privateGet(this, _onUpdate));
    __privateGet(this, _onUpdate).call(this);
  }
  get pageSize() {
    return (
      __privateGet(this, _dataSource)?.pageSize ??
      __privateGet(this, _pageSize) ??
      this.pageSizes?.at(0) ??
      LIST_DATA_SOURCE_DEFAULT_PAGE_SIZE
    );
  }
  set pageSize(pageSize) {
    if (this.dataSource) {
      this.dataSource?.setPageSize(pageSize);
    } else {
      __privateSet(this, _pageSize, pageSize);
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.dataSource?.addEventListener('sl-update', __privateGet(this, _onUpdate));
  }
  disconnectedCallback() {
    this.dataSource?.removeEventListener('sl-update', __privateGet(this, _onUpdate));
    super.disconnectedCallback();
  }
  render() {
    const itemLabel = this.itemLabel ?? msg('Items', { id: 'sl.paginator.defaultItemLabel' });
    return html`
      <sl-label for="sizes">
        <span>${msg(str`${itemLabel} per page:`, { id: 'sl.paginator.itemsPerPage' })}</span>
      </sl-label>
      <sl-select
        @sl-change=${__privateMethod(this, _PaginatorPageSize_instances, onChange_fn)}
        aria-label=${msg(str`${itemLabel} per page`, { id: 'sl.paginator.itemsPerPageAriaLabel' })}
        ?disabled=${!this.pageSizes}
        id="sizes"
        value=${ifDefined(this.pageSize)}>
        ${this.pageSizes?.map(size => {
          const sizeLabel =
            this.itemLabel ??
            __privateMethod(this, _PaginatorPageSize_instances, getDefaultItemLabel_fn).call(
              this,
              size
            );
          return html`
            <sl-option
              aria-label=${`${size} ${msg(str`${sizeLabel} per page`, { id: 'sl.paginator.itemsPerPageOption' })}`}
              .value=${size}
              >${size}</sl-option
            >
          `;
        })}
      </sl-select>
    `;
  }
};
_dataSource = new WeakMap();
_pageSize = new WeakMap();
_PaginatorPageSize_instances = new WeakSet();
onChange_fn = function ({ detail: pageSize }) {
  this.pageSize = pageSize;
  this.pageSizeChangeEvent.emit(pageSize);
  this.dataSource?.setPageSize(pageSize);
  this.dataSource?.update();
};
getDefaultItemLabel_fn = function (count) {
  switch (getPluralCategory(count)) {
    case 'one':
      return msg('item', { id: 'sl.paginator.defaultItemLabelOne' });
    case 'few':
      return msg('items', { id: 'sl.paginator.defaultItemLabelFew' });
    default:
      return msg('items', { id: 'sl.paginator.defaultItemLabelOther' });
  }
};
_onUpdate = new WeakMap();
/** @internal */
PaginatorPageSize.styles = styles;
__decorateClass([property({ attribute: false })], PaginatorPageSize.prototype, 'dataSource', 1);
__decorateClass([property({ attribute: false })], PaginatorPageSize.prototype, 'itemLabel', 2);
__decorateClass(
  [property({ type: Number, attribute: 'page-size' })],
  PaginatorPageSize.prototype,
  'pageSize',
  1
);
__decorateClass(
  [event({ name: 'sl-page-size-change' })],
  PaginatorPageSize.prototype,
  'pageSizeChangeEvent',
  2
);
__decorateClass(
  [property({ type: Array, attribute: 'page-sizes' })],
  PaginatorPageSize.prototype,
  'pageSizes',
  2
);
PaginatorPageSize = __decorateClass([localized()], PaginatorPageSize);
//# sourceMappingURL=page-size.js.map
