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
  _timeoutId,
  _onUpdate,
  _PaginatorStatus_instances,
  announce_fn,
  getDefaultItemLabel_fn;
import { localized, msg, str } from '@lit/localize';
import { announce } from '@sl-design-system/announcer';
import { LIST_DATA_SOURCE_DEFAULT_PAGE_SIZE } from '@sl-design-system/data-source';
import { getPluralCategory } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './status.scss.js';
export let PaginatorStatus = class extends LitElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _PaginatorStatus_instances);
    /** The data source that the paginator controls. */
    __privateAdd(this, _dataSource);
    /** Timeout id, to be used with `clearTimeout`. */
    __privateAdd(this, _timeoutId);
    this.page = 0;
    this.pageCount = 1;
    this.pageSize = LIST_DATA_SOURCE_DEFAULT_PAGE_SIZE;
    this.totalItems = 1;
    __privateAdd(this, _onUpdate, () => {
      this.page = this.dataSource.page ?? 0;
      this.pageSize = this.dataSource.pageSize;
      this.totalItems = this.dataSource.size;
    });
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
  connectedCallback() {
    super.connectedCallback();
    this.dataSource?.addEventListener('sl-update', __privateGet(this, _onUpdate));
  }
  disconnectedCallback() {
    if (__privateGet(this, _timeoutId)) {
      clearTimeout(__privateGet(this, _timeoutId));
      __privateSet(this, _timeoutId, void 0);
    }
    this.dataSource?.removeEventListener('sl-update', __privateGet(this, _onUpdate));
    super.disconnectedCallback();
  }
  willUpdate(changes) {
    super.willUpdate(changes);
    if (changes.has('page') || changes.has('pageSize') || changes.has('totalItems')) {
      this.pageSize ??= 10;
      this.pageCount = Math.ceil(this.totalItems / this.pageSize) || 1;
      this.page = Math.min(Math.max(this.page, 0), this.pageCount - 1);
      const start = this.page * this.pageSize + 1;
      let end = start + this.pageSize - 1;
      if (this.page === this.pageCount - 1) {
        end += this.totalItems % this.pageSize;
        end = Math.min(end, this.totalItems);
      }
      this.range = [start, end];
      __privateMethod(this, _PaginatorStatus_instances, announce_fn).call(this);
    }
  }
  render() {
    const [start, end] = this.range ?? [1, 1],
      itemLabel =
        this.itemLabel ??
        __privateMethod(this, _PaginatorStatus_instances, getDefaultItemLabel_fn).call(
          this,
          this.totalItems
        );
    return html`${msg(str`${start} - ${end} of ${this.totalItems + ' ' + itemLabel}`, {
      id: 'sl.paginator.itemsRange'
    })}`;
  }
};
_dataSource = new WeakMap();
_timeoutId = new WeakMap();
_onUpdate = new WeakMap();
_PaginatorStatus_instances = new WeakSet();
announce_fn = function () {
  if (__privateGet(this, _timeoutId)) {
    clearTimeout(__privateGet(this, _timeoutId));
    __privateSet(this, _timeoutId, void 0);
  }
  __privateSet(
    this,
    _timeoutId,
    setTimeout(() => {
      if (this.totalItems > 1) {
        const [start, end] = this.range ?? [1, 1],
          itemLabel =
            this.itemLabel ??
            __privateMethod(this, _PaginatorStatus_instances, getDefaultItemLabel_fn).call(
              this,
              this.totalItems
            );
        announce(
          msg(str`Currently showing ${start} to ${end} of ${this.totalItems + ' ' + itemLabel}`, {
            id: 'sl.paginator.currentlyShowingAmount'
          })
        );
      }
    }, 100)
  );
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
/** @internal */
PaginatorStatus.styles = styles;
__decorateClass([property({ attribute: false })], PaginatorStatus.prototype, 'dataSource', 1);
__decorateClass([property({ attribute: false })], PaginatorStatus.prototype, 'itemLabel', 2);
__decorateClass([property({ type: Number })], PaginatorStatus.prototype, 'page', 2);
__decorateClass(
  [property({ type: Number, attribute: 'page-count' })],
  PaginatorStatus.prototype,
  'pageCount',
  2
);
__decorateClass(
  [property({ type: Number, attribute: 'page-size' })],
  PaginatorStatus.prototype,
  'pageSize',
  2
);
__decorateClass([state()], PaginatorStatus.prototype, 'range', 2);
__decorateClass(
  [property({ type: Number, attribute: 'total-items' })],
  PaginatorStatus.prototype,
  'totalItems',
  2
);
PaginatorStatus = __decorateClass([localized()], PaginatorStatus);
//# sourceMappingURL=status.js.map
