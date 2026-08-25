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
  _observer,
  _originalWidth,
  _width,
  _Paginator_instances,
  onChange_fn,
  getPagesLabel_fn,
  getPageFill_fn,
  getPageVariant_fn,
  onNext_fn,
  onMenuPageClick_fn,
  onPageClick_fn,
  focusPageButton_fn,
  onPrevious_fn,
  onResize_fn,
  _onUpdate,
  updateVisibility_fn;
import { localized, msg, str } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { announce } from '@sl-design-system/announcer';
import { Button } from '@sl-design-system/button';
import { LIST_DATA_SOURCE_DEFAULT_PAGE_SIZE } from '@sl-design-system/data-source';
import { Icon } from '@sl-design-system/icon';
import { Option } from '@sl-design-system/listbox';
import { Menu, MenuButton, MenuItem } from '@sl-design-system/menu';
import { Select } from '@sl-design-system/select';
import { event, getPluralCategory } from '@sl-design-system/shared';
import { LitElement, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import styles from './paginator.scss.js';
const PAGINATOR_SIZES = {
  xs: 6,
  sm: 7,
  md: 9,
  lg: 11
};
export let Paginator = class extends ScopedElementsMixin(LitElement) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _Paginator_instances);
    /** The data source that the paginator controls. */
    __privateAdd(this, _dataSource);
    /** Observe changes in size of the container. */
    __privateAdd(
      this,
      _observer,
      new ResizeObserver(entries =>
        __privateMethod(this, _Paginator_instances, onResize_fn).call(this, entries[0])
      )
    );
    /** The original width, before any resize observer logic. */
    __privateAdd(this, _originalWidth);
    /** The current width. */
    __privateAdd(this, _width);
    this.page = 0;
    this.pageCount = 1;
    this.pageSize = LIST_DATA_SOURCE_DEFAULT_PAGE_SIZE;
    this.totalItems = 1;
    this.windowStart = 0;
    this.windowEnd = Infinity;
    __privateAdd(this, _onUpdate, async () => {
      const { page, pageSize, size } = this.dataSource;
      if (this.page === page && (this.pageSize !== pageSize || this.totalItems !== size)) {
        this.pageSize = pageSize;
        this.totalItems = size;
        await this.updateComplete;
        __privateMethod(this, _Paginator_instances, onPageClick_fn).call(this, 0, true);
        return;
      }
      this.page = page ?? 0;
      this.pageSize = pageSize;
      this.totalItems = size;
    });
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-button': Button,
      'sl-icon': Icon,
      'sl-menu': Menu,
      'sl-menu-button': MenuButton,
      'sl-menu-item': MenuItem,
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
    void __privateGet(this, _onUpdate).call(this);
  }
  get width() {
    return __privateGet(this, _width);
  }
  set width(value) {
    __privateSet(this, _originalWidth, value);
    __privateSet(this, _width, value);
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute('aria-label')) {
      this.setAttribute('aria-label', msg('Pagination', { id: 'sl.paginator.pagination' }));
    }
    this.setAttribute('role', 'navigation');
    this.dataSource?.addEventListener('sl-update', __privateGet(this, _onUpdate));
    __privateGet(this, _observer).observe(this);
  }
  disconnectedCallback() {
    __privateGet(this, _observer).disconnect();
    this.dataSource?.removeEventListener('sl-update', __privateGet(this, _onUpdate));
    super.disconnectedCallback();
  }
  willUpdate(changes) {
    super.willUpdate(changes);
    if (changes.has('page') || changes.has('pageSize') || changes.has('totalItems')) {
      this.pageSize ??= LIST_DATA_SOURCE_DEFAULT_PAGE_SIZE;
      this.pageCount = Math.ceil(this.totalItems / this.pageSize) || 1;
      this.page = Math.min(Math.max(this.page, 0), this.pageCount - 1);
      __privateMethod(this, _Paginator_instances, updateVisibility_fn).call(this);
    }
    if (changes.has('width')) {
      __privateMethod(this, _Paginator_instances, updateVisibility_fn).call(this);
    }
  }
  render() {
    return html`
      <sl-button
        @click=${__privateMethod(this, _Paginator_instances, onPrevious_fn)}
        ?disabled=${this.page === 0}
        aria-label=${msg(str`Go to the previous page (${this.page})`, {
          id: 'sl.paginator.previousPage'
        })}
        class="nav"
        fill="ghost"
        size=${ifDefined(this.size)}>
        <sl-icon name="caret-left-solid"></sl-icon>
      </sl-button>

      <sl-button
        @click=${() => __privateMethod(this, _Paginator_instances, onPageClick_fn).call(this, 0)}
        aria-current=${ifDefined(this.page === 0 ? 'page' : void 0)}
        class=${classMap({ current: this.page === 0, page: true })}
        fill=${__privateMethod(this, _Paginator_instances, getPageFill_fn).call(this, 0)}
        size=${ifDefined(this.size)}
        variant=${ifDefined(__privateMethod(this, _Paginator_instances, getPageVariant_fn).call(this, 0))}>
        1
      </sl-button>

      ${
        this.windowStart > 0
          ? html`
              <sl-menu-button
                aria-label=${msg('Select page number', { id: 'sl.paginator.selectPageNumber' })}
                fill="ghost"
                size=${ifDefined(this.size)}>
                <sl-icon name="ellipsis-down" slot="button"></sl-icon>
                ${Array.from({ length: this.windowStart + 1 }).map(
                  (_, i) => html`
                    <sl-menu-item
                      @click=${() => __privateMethod(this, _Paginator_instances, onMenuPageClick_fn).call(this, i + 1)}>
                      ${i + 2}
                    </sl-menu-item>
                  `
                )}
              </sl-menu-button>
            `
          : nothing
      }
      ${Array.from({ length: this.pageCount - 2 }).map(
        (_, index) => html`
          <sl-button
            @click=${() => __privateMethod(this, _Paginator_instances, onPageClick_fn).call(this, index + 1)}
            aria-current=${ifDefined(this.page === index + 1 ? 'page' : void 0)}
            class=${classMap({ current: this.page === index + 1, page: true })}
            fill=${__privateMethod(this, _Paginator_instances, getPageFill_fn).call(this, index + 1)}
            size=${ifDefined(this.size)}
            style=${styleMap({
              display: index <= this.windowStart || index >= this.windowEnd ? 'none' : void 0
            })}
            variant=${ifDefined(__privateMethod(this, _Paginator_instances, getPageVariant_fn).call(this, index + 1))}>
            ${index + 2}
          </sl-button>
        `
      )}
      ${
        this.windowEnd < this.pageCount - 2
          ? html`
              <sl-menu-button
                aria-label=${msg('Select page number', { id: 'sl.paginator.selectPageNumber' })}
                fill="ghost"
                size=${ifDefined(this.size)}>
                <sl-icon name="ellipsis-down" slot="button"></sl-icon>
                ${Array.from({ length: this.pageCount - this.windowEnd - 2 }).map(
                  (_, i) => html`
                    <sl-menu-item
                      @click=${() => __privateMethod(this, _Paginator_instances, onMenuPageClick_fn).call(this, i + this.windowEnd + 1)}>
                      ${i + this.windowEnd + 2}
                    </sl-menu-item>
                  `
                )}
              </sl-menu-button>
            `
          : nothing
      }
      ${
        this.pageCount > 1
          ? html`
              <sl-button
                @click=${() => __privateMethod(this, _Paginator_instances, onPageClick_fn).call(this, this.pageCount - 1)}
                aria-current=${ifDefined(this.page === this.pageCount - 1 ? 'page' : void 0)}
                class=${classMap({ current: this.page === this.pageCount - 1, page: true })}
                fill=${__privateMethod(this, _Paginator_instances, getPageFill_fn).call(this, this.pageCount - 1)}
                size=${ifDefined(this.size)}
                variant=${ifDefined(__privateMethod(this, _Paginator_instances, getPageVariant_fn).call(this, this.pageCount - 1))}>
                ${this.pageCount}
              </sl-button>
            `
          : nothing
      }

      <div class="wrapper">
        <sl-select
          @sl-change=${__privateMethod(this, _Paginator_instances, onChange_fn)}
          .value=${this.page}
          aria-label=${`${msg(str`${this.page}, page`, { id: 'sl.paginator.currentPage' })}`}
          size=${this.size === 'lg' ? this.size : 'md'}>
          ${Array.from({ length: this.pageCount }).map(
            (_, index) => html`
              <sl-option
                aria-label=${msg(str`${index + 1}, page`, { id: 'sl.paginator.pageOption' })}
                .value=${index}
                >${index + 1}</sl-option
              >
            `
          )}
        </sl-select>
        <span
          >${msg(
            str`of ${this.pageCount + ' ' + __privateMethod(this, _Paginator_instances, getPagesLabel_fn).call(this)}`,
            {
              id: 'sl.paginator.totalPages'
            }
          )}</span
        >
      </div>

      <sl-button
        @click=${__privateMethod(this, _Paginator_instances, onNext_fn)}
        ?disabled=${this.page === this.pageCount - 1}
        aria-label=${msg(str`Go to the next page (${this.page + 2})`, {
          id: 'sl.paginator.nextPage'
        })}
        class="nav"
        fill="ghost"
        size=${ifDefined(this.size)}>
        <sl-icon name="caret-right-solid"></sl-icon>
      </sl-button>
    `;
  }
};
_dataSource = new WeakMap();
_observer = new WeakMap();
_originalWidth = new WeakMap();
_width = new WeakMap();
_Paginator_instances = new WeakSet();
onChange_fn = function (event2) {
  __privateMethod(this, _Paginator_instances, onPageClick_fn).call(this, event2.detail);
};
getPagesLabel_fn = function () {
  switch (getPluralCategory(this.pageCount)) {
    case 'one':
      return msg('page', { id: 'sl.paginator.pagesLabelOne' });
    case 'few':
      return msg('pages', { id: 'sl.paginator.pagesLabelFew' });
    default:
      return msg('pages', { id: 'sl.paginator.pagesLabelOther' });
  }
};
getPageFill_fn = function (page) {
  if (this.page === page) {
    return this.emphasis === 'bold' ? 'solid' : 'outline';
  }
  return 'ghost';
};
getPageVariant_fn = function (page) {
  return this.page === page ? 'primary' : void 0;
};
onNext_fn = function () {
  __privateMethod(this, _Paginator_instances, onPageClick_fn).call(
    this,
    Math.min(this.page + 1, this.pageCount - 1),
    true
  );
};
onMenuPageClick_fn = function (page) {
  __privateMethod(this, _Paginator_instances, onPageClick_fn).call(this, page);
  void __privateMethod(this, _Paginator_instances, focusPageButton_fn).call(this, page);
};
onPageClick_fn = function (page, announcePage = false) {
  this.page = page;
  this.pageChangeEvent.emit(this.page);
  if (this.dataSource) {
    this.dataSource.setPage(this.page);
    this.dataSource.update();
  }
  __privateMethod(this, _Paginator_instances, updateVisibility_fn).call(this);
  if (announcePage) {
    announce(
      msg(str`Page ${this.page + 1} of ${this.pageCount}`, {
        id: 'sl.paginator.pageChangeAnnouncement'
      })
    );
  }
};
focusPageButton_fn = async function (page) {
  await this.updateComplete;
  await new Promise(resolve => requestAnimationFrame(() => resolve()));
  const current = this.renderRoot.querySelector('sl-button.current');
  if (current && current.style.display !== 'none') {
    current.focus();
    return;
  }
  Array.from(this.renderRoot.querySelectorAll('sl-button.page'))
    .find(
      button => button.textContent?.trim() === String(page + 1) && button.style.display !== 'none'
    )
    ?.focus();
};
onPrevious_fn = function () {
  __privateMethod(this, _Paginator_instances, onPageClick_fn).call(
    this,
    Math.max(this.page - 1, 0),
    true
  );
};
onResize_fn = function (entry) {
  const buttonSize = parseInt(getComputedStyle(this).getPropertyValue('--sl-size-500')) || 0,
    gap = parseInt(getComputedStyle(this).gap, 10) || 0;
  if (buttonSize && gap) {
    const count = Math.floor(entry.contentRect.width / (buttonSize + gap)) - 2,
      [width, visiblePages] = Object.entries(PAGINATOR_SIZES).find(
        ([, value]) => count <= value
      ) || ['lg', PAGINATOR_SIZES['lg']];
    if (__privateGet(this, _originalWidth)) {
      if (visiblePages <= PAGINATOR_SIZES[__privateGet(this, _originalWidth)]) {
        __privateSet(this, _width, width);
      }
    } else {
      __privateSet(this, _width, width);
    }
    this.requestUpdate('width');
  }
};
_onUpdate = new WeakMap();
updateVisibility_fn = function () {
  const { page, pageCount } = this,
    visiblePageCount = PAGINATOR_SIZES[this.width || 'lg'],
    count = Math.floor(visiblePageCount / 2);
  this.windowStart = Math.min(Math.max(page - count, 0), pageCount - visiblePageCount) || -1;
  if (page >= pageCount - count - 1) {
    this.windowEnd = pageCount - 2;
  } else {
    this.windowEnd = Math.min(Math.max(page, count) + count - 2, pageCount - 1);
  }
};
/** @internal */
Paginator.styles = styles;
__decorateClass([property({ attribute: false })], Paginator.prototype, 'dataSource', 1);
__decorateClass([property({ reflect: true })], Paginator.prototype, 'emphasis', 2);
__decorateClass([property({ type: Number })], Paginator.prototype, 'page', 2);
__decorateClass([event({ name: 'sl-page-change' })], Paginator.prototype, 'pageChangeEvent', 2);
__decorateClass([state()], Paginator.prototype, 'pageCount', 2);
__decorateClass(
  [property({ type: Number, attribute: 'page-size' })],
  Paginator.prototype,
  'pageSize',
  2
);
__decorateClass([property({ reflect: true })], Paginator.prototype, 'width', 1);
__decorateClass([property({ reflect: true })], Paginator.prototype, 'size', 2);
__decorateClass(
  [property({ type: Number, attribute: 'total-items' })],
  Paginator.prototype,
  'totalItems',
  2
);
__decorateClass([state()], Paginator.prototype, 'windowStart', 2);
__decorateClass([state()], Paginator.prototype, 'windowEnd', 2);
Paginator = __decorateClass([localized()], Paginator);
//# sourceMappingURL=paginator.js.map
