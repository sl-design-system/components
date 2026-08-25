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
var _bulkActionsObserver,
  _columnDefinitions,
  _dataSource,
  _dataSourceUpdateTimer,
  _dragClone,
  _dragItem,
  _filters,
  _filterDebounceTimer,
  _headerRows,
  _initialColumnWidthsCalculated,
  _itemBeforeDragItem,
  _itemAfterDragItem,
  _scrollSyncing,
  _mutationObserver,
  _onWindowDragOver,
  _resizeObserver,
  _sorters,
  _sorterDebounceTimer,
  _virtualizer,
  _skipNextFocusAnnounce,
  _Grid_instances,
  onCancelSelection_fn,
  onClickRow_fn,
  onColumnUpdate_fn,
  announceSelection_fn,
  onFocusIn_fn,
  _onDataSourceUpdate,
  onDragStart_fn,
  onDragEnter_fn,
  onDragOver_fn,
  onGroupDragOver_fn,
  onDragEnd_fn,
  onDrop_fn,
  onGroupDrop_fn,
  restoreDraggedItemPosition_fn,
  onFilterRegister_fn,
  onFilterChange_fn,
  onGroupSelect_fn,
  onGroupToggle_fn,
  onBodyScroll_fn,
  onHeaderScroll_fn,
  onScroll_fn,
  syncScrollLeft_fn,
  _onSelectionChange,
  onSkipTo_fn,
  onSkipToFocus_fn,
  onSlotChange_fn,
  onSorterChange_fn,
  onSorterRegister_fn,
  addScopedElements_fn,
  applyFilters_fn,
  applySorters_fn,
  cloneRowForDragging_fn,
  flattenColumnGroups_fn,
  getStickyColumnOffset_fn,
  removeColumn_fn,
  updateDataSource_fn;
import { localized, msg, str } from '@lit/localize';
import { virtualize, virtualizerRef } from '@lit-labs/virtualizer/virtualize.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { announce } from '@sl-design-system/announcer';
import { Button } from '@sl-design-system/button';
import { ArrayListDataSource, isListDataSourceDataItem } from '@sl-design-system/data-source';
import { EllipsizeText } from '@sl-design-system/ellipsize-text';
import { Icon } from '@sl-design-system/icon';
import { Scrollbar } from '@sl-design-system/scrollbar';
import { event, isSafari, positionPopover } from '@sl-design-system/shared';
import { Skeleton } from '@sl-design-system/skeleton';
import { ToggleGroup } from '@sl-design-system/toggle-group';
import { ToolBar } from '@sl-design-system/tool-bar';
import { LitElement, html, nothing, render } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { GridColumnGroup } from './column-group.js';
import { GridColumn } from './column.js';
import { GridDragHandleColumn } from './drag-handle-column.js';
import { GridFilterColumn } from './filter-column.js';
import styles from './grid.scss.js';
import { GridGroupHeader } from './group-header.js';
import { GridSelectionColumn } from './selection-column.js';
import { GridSortColumn } from './sort-column.js';
import { GridViewModel } from './view-model.js';
export let Grid = class extends ScopedElementsMixin(LitElement) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _Grid_instances);
    /**
     * Observe changes to the bulk actions slot and refresh the tool-bar.
     *
     * The bulk actions `<slot>` is nested in the default slot of `<sl-tool-bar>`. This means that
     * changes to the bulk actions slot are not automatically observed by the tool-bar. To work
     * around this, we explicitly call `refresh()` on the tool-bar when the bulk actions slot
     * changes.
     */
    __privateAdd(
      this,
      _bulkActionsObserver,
      new MutationObserver(() => this.renderRoot.querySelector('sl-tool-bar')?.refresh())
    );
    /** The column definitions. */
    __privateAdd(this, _columnDefinitions, []);
    /** The data source. */
    __privateAdd(this, _dataSource);
    /** Timer for debouncing data source updates. */
    __privateAdd(this, _dataSourceUpdateTimer);
    /** The clone of the row; used for the drag image. */
    __privateAdd(this, _dragClone);
    /** The item being dragged. */
    __privateAdd(this, _dragItem);
    /** The filters for this grid. */
    __privateAdd(this, _filters, []);
    /** Timer for debouncing filter updates. */
    __privateAdd(this, _filterDebounceTimer);
    /** The header rows for the grid. */
    __privateAdd(this, _headerRows, []);
    /** Flag for calculating the column widths only once. */
    __privateAdd(this, _initialColumnWidthsCalculated, false);
    /** The item before the dragged item when dragging started. */
    __privateAdd(this, _itemBeforeDragItem);
    /** The item after the dragged item when dragging started. */
    __privateAdd(this, _itemAfterDragItem);
    /** Prevent recursive scroll syncing between the header and body. */
    __privateAdd(this, _scrollSyncing, false);
    /** Observe the tbody style changes. */
    __privateAdd(
      this,
      _mutationObserver,
      new MutationObserver(() => {
        __privateGet(this, _mutationObserver)?.disconnect();
        if (
          !__privateGet(this, _initialColumnWidthsCalculated) &&
          this.renderRoot.querySelectorAll('td').length
        ) {
          __privateSet(this, _initialColumnWidthsCalculated, true);
          void this.recalculateColumnWidths();
        }
        this.style.setProperty('--sl-grid-tbody-min-height', this.tbody.style.minHeight);
        this.tbody.style.minHeight = '';
        __privateGet(this, _mutationObserver)?.observe(this.tbody, {
          attributes: true,
          attributeFilter: ['style']
        });
      })
    );
    /** We need to know when the user drags items outside of the grid. */
    __privateAdd(this, _onWindowDragOver, event2 => {
      const grid = event2.composedPath().find(el => el instanceof Grid);
      if (!grid || grid !== this) {
        this.dataSource?.reorder(
          __privateGet(this, _dragItem),
          __privateGet(this, _itemBeforeDragItem),
          'after'
        );
        this.requestUpdate();
      }
    });
    /** Observe the grid width. */
    __privateAdd(
      this,
      _resizeObserver,
      new ResizeObserver(entries => {
        const {
          contentBoxSize: [{ inlineSize }]
        } = entries[0];
        this.style.setProperty('--sl-grid-width', `${inlineSize}px`);
        if (this.renderRoot.querySelector('[part="bulk-actions"]:popover-open')) {
          const toolbar = this.renderRoot.querySelector('sl-tool-bar');
          toolbar?.forceRecalculation();
        }
        __privateMethod(this, _Grid_instances, onScroll_fn).call(this);
      })
    );
    /** The sorters for this grid. */
    __privateAdd(this, _sorters, []);
    /** The debounce timer for sorters. */
    __privateAdd(this, _sorterDebounceTimer);
    /** The virtualizer instance for the grid. */
    __privateAdd(this, _virtualizer);
    /** Flag to skip the next focus announcement (e.g. after a click that already announced). */
    __privateAdd(this, _skipNextFocusAnnounce, false);
    this.view = new GridViewModel(this);
    __privateAdd(this, _onDataSourceUpdate, () => {
      this.requestUpdate();
    });
    __privateAdd(this, _onSelectionChange, () => {
      if (!this.renderRoot) {
        return;
      }
      this.renderRoot
        .querySelector('[part="bulk-actions"]')
        ?.togglePopover((this.dataSource?.selected ?? 0) > 0);
      this.requestUpdate();
      this.selectionChangeEvent.emit({ grid: this });
    });
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-button': Button,
      'sl-ellipsize-text': EllipsizeText,
      'sl-grid-group-header': GridGroupHeader,
      'sl-icon': Icon,
      'sl-skeleton': Skeleton,
      'sl-scrollbar': Scrollbar,
      'sl-toggle-group': ToggleGroup,
      'sl-tool-bar': ToolBar
    };
  }
  get dataSource() {
    return __privateGet(this, _dataSource);
  }
  set dataSource(dataSource) {
    const replacement = !!__privateGet(this, _dataSource);
    if (__privateGet(this, _dataSource)) {
      __privateGet(this, _dataSource).removeEventListener(
        'sl-update',
        __privateGet(this, _onDataSourceUpdate)
      );
      __privateGet(this, _dataSource).removeEventListener(
        'sl-selection-change',
        __privateGet(this, _onSelectionChange)
      );
    }
    __privateSet(this, _dataSource, dataSource);
    __privateGet(this, _dataSource)?.addEventListener(
      'sl-update',
      __privateGet(this, _onDataSourceUpdate)
    );
    __privateGet(this, _dataSource)?.addEventListener(
      'sl-selection-change',
      __privateGet(this, _onSelectionChange)
    );
    if (replacement) {
      __privateGet(this, _onSelectionChange).call(this);
    }
  }
  connectedCallback() {
    super.connectedCallback();
    __privateGet(this, _resizeObserver).observe(this);
  }
  disconnectedCallback() {
    __privateGet(this, _dataSource)?.removeEventListener(
      'sl-update',
      __privateGet(this, _onDataSourceUpdate)
    );
    __privateGet(this, _dataSource)?.removeEventListener(
      'sl-selection-change',
      __privateGet(this, _onSelectionChange)
    );
    __privateGet(this, _bulkActionsObserver).disconnect();
    __privateGet(this, _mutationObserver)?.disconnect();
    __privateGet(this, _resizeObserver)?.disconnect();
    if (__privateGet(this, _filterDebounceTimer)) {
      clearTimeout(__privateGet(this, _filterDebounceTimer));
    }
    if (__privateGet(this, _sorterDebounceTimer)) {
      clearTimeout(__privateGet(this, _sorterDebounceTimer));
    }
    super.disconnectedCallback();
  }
  async firstUpdated() {
    __privateGet(this, _bulkActionsObserver).observe(this, {
      attributes: true,
      attributeFilter: ['aria-disabled', 'disabled'],
      childList: true,
      subtree: true
    });
    __privateGet(this, _mutationObserver)?.observe(this.tbody, {
      attributes: true,
      attributeFilter: ['style']
    });
    this.tbody.addEventListener(
      'scroll',
      () => __privateMethod(this, _Grid_instances, onBodyScroll_fn).call(this),
      { passive: true }
    );
    this.thead.addEventListener(
      'scroll',
      () => __privateMethod(this, _Grid_instances, onHeaderScroll_fn).call(this),
      { passive: true }
    );
    this.tbody.addEventListener('focusin', event2 =>
      __privateMethod(this, _Grid_instances, onFocusIn_fn).call(this, event2)
    );
    await new Promise(resolve => requestAnimationFrame(resolve));
    const host = this.tbody;
    __privateSet(this, _virtualizer, host[virtualizerRef]);
    __privateGet(this, _virtualizer)?.disconnected();
    __privateGet(this, _virtualizer)?.connected();
  }
  willUpdate(changes) {
    if (changes.has('dataSource') && this.dataSource) {
      __privateMethod(this, _Grid_instances, updateDataSource_fn).call(this);
    }
    if (changes.has('items')) {
      this.dataSource = this.items
        ? new ArrayListDataSource(this.items, { selects: this.selects })
        : void 0;
      if (this.dataSource) {
        __privateMethod(this, _Grid_instances, updateDataSource_fn).call(this);
      }
    }
    if (changes.has('selects') && this.dataSource?.selects !== this.selects) {
      this.dataSource.selects = this.selects;
    }
    if (changes.has('scopedElements')) {
      __privateMethod(this, _Grid_instances, addScopedElements_fn).call(this, this.scopedElements);
    }
    if (changes.has('ellipsizeText')) {
      __privateGet(this, _headerRows)
        .at(-1)
        ?.forEach(col => (col.ellipsizeText = this.ellipsizeText));
    }
  }
  render() {
    return html`
      <slot
        @sl-column-update=${__privateMethod(this, _Grid_instances, onColumnUpdate_fn)}
        @slotchange=${__privateMethod(this, _Grid_instances, onSlotChange_fn)}
        style="display:none"></slot>
      <style>
        ${this.renderStyles()}
      </style>
      ${
        !this.noSkipLinks
          ? html`
              <a
                id="table-start"
                href="#table-end"
                class="skip-link-start"
                @click=${e => __privateMethod(this, _Grid_instances, onSkipTo_fn).call(this, e, 'end')}
                @focus=${e => __privateMethod(this, _Grid_instances, onSkipToFocus_fn).call(this, e, 'top')}>
                ${msg('Skip to end of table', { id: 'sl.grid.skipToEndOfTable' })}
              </a>
            `
          : nothing
      }
      <table part="table" aria-rowcount=${this.dataSource?.items.length || 0}>
        <caption></caption>
        <thead
          @sl-filter-change=${__privateMethod(this, _Grid_instances, onFilterChange_fn)}
          @sl-filter-register=${__privateMethod(this, _Grid_instances, onFilterRegister_fn)}
          @sl-sorter-change=${__privateMethod(this, _Grid_instances, onSorterChange_fn)}
          @sl-sorter-register=${__privateMethod(this, _Grid_instances, onSorterRegister_fn)}
          part="thead">
          ${__privateGet(this, _headerRows).map(row => this.renderHeaderRow(row))}
        </thead>
        <tbody id="tbody" part="tbody">
          ${virtualize({
            items: this.dataSource?.items ?? [],
            renderItem: (item, index) => this.renderItem(item, index)
          })}
        </tbody>
        ${
          this.scrollbar
            ? html`
                <tfoot>
                  <tr class="scrollbar">
                    <td>
                      <sl-scrollbar scroller="tbody"></sl-scrollbar>
                    </td>
                  </tr>
                </tfoot>
              `
            : nothing
        }
      </table>

      <div part="bulk-actions" popover="manual">
        <span>
          ${msg(str`${this.dataSource?.selected} of ${this.dataSource?.totalSize} selected`, {
            id: 'sl.grid.selectionStatusMessage'
          })}
        </span>
        <sl-tool-bar align="end" inverted>
          <slot name="bulk-actions"></slot>
        </sl-tool-bar>
        <sl-button
          @click=${__privateMethod(this, _Grid_instances, onCancelSelection_fn)}
          fill="ghost"
          tooltip=${msg('Cancel selection', { id: 'sl.grid.cancelSelection' })}
          variant="inverted">
          <sl-icon name="xmark"></sl-icon>
        </sl-button>
      </div>

      ${
        !this.noSkipLinks
          ? html`
              <a
                id="table-end"
                href="#table-start"
                class="skip-link-end"
                @focus=${e => __privateMethod(this, _Grid_instances, onSkipToFocus_fn).call(this, e, 'bottom')}
                @click=${e => __privateMethod(this, _Grid_instances, onSkipTo_fn).call(this, e, 'start')}
                >${msg('Skip to start of table', { id: 'sl.grid.skipToStartOfTable' })}</a
              >
            `
          : nothing
      }
    `;
  }
  renderStyles() {
    const rows = __privateGet(this, _headerRows);
    if (!rows.length) {
      return nothing;
    }
    return html`
      ${rows.slice(0, -1).map((row, rowIndex) => {
        return row.map((col, colIndex) => {
          return col instanceof GridColumnGroup
            ? `
            thead tr:nth-child(${rowIndex + 1}) th:nth-child(${colIndex + 1}) {
              flex-grow: ${Math.max(col.columns.length, 1)};
              inline-size: ${col.width || '100'}px;
              justify-content: ${col.align ?? 'start'};
              ${col.renderStyles()?.toString() ?? ''}
            }
            `
            : nothing;
        });
      })}
      ${rows[rows.length - 1].map((col, index) => {
        return `
          :where(tbody td, thead tr th):nth-child(${index + 1}) {
            flex-grow: ${col.grow};
            inline-size: ${col.width || '100'}px;
            justify-content: ${col.align ?? 'start'};
            ${col.sticky ? 'position: sticky;' : ''}
            ${col.sticky ? (col.stickyPosition === 'start' ? `inset-inline-start: ${__privateMethod(this, _Grid_instances, getStickyColumnOffset_fn).call(this, index)}px;` : `inset-inline-end: ${__privateMethod(this, _Grid_instances, getStickyColumnOffset_fn).call(this, index)}px;`) : ''}
            ${col.renderStyles()?.toString() ?? ''}
          }
          `;
      })}
    `;
  }
  renderHeaderRow(columns) {
    const rowCount = columns.reduce((acc, column) => Math.max(acc, column.headerRowCount), 0);
    return html`
      ${Array.from({ length: rowCount }).map(
        (_, rowIndex) => html`
          <tr>
            ${columns.map(col => col.renderHeaderRow(rowIndex))}
          </tr>
        `
      )}
    `;
  }
  renderItem(item, index) {
    return item.type === 'group'
      ? this.renderGroupRow(item, index)
      : this.renderItemRow(item, index);
  }
  renderItemRow(item, index) {
    const rows = __privateGet(this, _headerRows),
      active = this.activeRow === item.data,
      selected = this.dataSource?.isSelected(item),
      parts = [
        'row',
        index % 2 === 0 ? 'odd' : 'even',
        ...(selected ? ['selected'] : []),
        ...(active ? ['active'] : []),
        ...(__privateGet(this, _dragItem) === item ? ['dragging'] : []),
        ...(this.itemParts?.(item.data)?.split(' ') || [])
      ],
      ariaSelected =
        this.rowAction === 'activate'
          ? active
            ? 'true'
            : 'false'
          : (this.dataSource?.selects ?? this.selects) === 'single'
            ? selected
              ? 'true'
              : 'false'
            : nothing;
    return html`
      <tr
        @click=${() => __privateMethod(this, _Grid_instances, onClickRow_fn).call(this, item, index + 1)}
        @dragstart=${event2 => __privateMethod(this, _Grid_instances, onDragStart_fn).call(this, event2, item)}
        @dragenter=${event2 => __privateMethod(this, _Grid_instances, onDragEnter_fn).call(this, event2, item)}
        @dragover=${event2 => __privateMethod(this, _Grid_instances, onDragOver_fn).call(this, event2, item)}
        @dragend=${event2 => __privateMethod(this, _Grid_instances, onDragEnd_fn).call(this, event2, item)}
        @drop=${event2 => __privateMethod(this, _Grid_instances, onDrop_fn).call(this, event2, item)}
        aria-rowindex=${index + 1}
        aria-selected=${ariaSelected}
        index=${index}
        part=${parts.join(' ')}>
        ${rows[rows.length - 1].map(col => col.renderData(item))}
      </tr>
    `;
  }
  renderGroupRow(item, index) {
    const collapsed = this.dataSource?.isGroupCollapsed(item.id),
      draggable = !!__privateGet(this, _columnDefinitions).find(
        col => !col.hidden && col instanceof GridDragHandleColumn
      ),
      groupDraggable =
        draggable &&
        !!item.members?.length &&
        (this.draggableRows === 'between' || this.draggableRows === 'between-or-on-top'),
      selectable = !!__privateGet(this, _columnDefinitions).find(
        col => !col.hidden && col instanceof GridSelectionColumn
      );
    return html`
      <tr
        @dragover=${event2 => __privateMethod(this, _Grid_instances, onGroupDragOver_fn).call(this, event2, item)}
        @dragstart=${event2 => __privateMethod(this, _Grid_instances, onDragStart_fn).call(this, event2, item)}
        @dragend=${event2 => __privateMethod(this, _Grid_instances, onDragEnd_fn).call(this, event2, item)}
        @drop=${event2 => __privateMethod(this, _Grid_instances, onGroupDrop_fn).call(this, event2, item)}
        aria-rowindex=${index + 1}
        .draggable=${groupDraggable}
        part="group"
        index=${index}>
        <td part="group-header">
          <sl-grid-group-header
            @sl-select=${event2 => __privateMethod(this, _Grid_instances, onGroupSelect_fn).call(this, event2, item)}
            @sl-toggle=${event2 => __privateMethod(this, _Grid_instances, onGroupToggle_fn).call(this, event2, item)}
            ?collapsed=${collapsed}
            ?drag-handle=${draggable}
            group-label=${ifDefined(item.label)}
            ?selectable=${selectable}
            .selected=${item.selected ?? 'none'}>
            ${
              this.groupHeaderRenderer?.(item) ??
              html`
                <span slot="group-heading">
                  ${item.label} ${typeof item.count === 'number' ? `(${item.count})` : nothing}
                </span>
              `
            }
          </sl-grid-group-header>
        </td>
      </tr>
    `;
  }
  /** Updates the `width` of all columns which have `autoWidth` set to `true`. */
  async recalculateColumnWidths() {
    await this.updateComplete;
    const rows = __privateGet(this, _headerRows);
    rows[rows.length - 1]
      .filter(col => !col.hidden && col.autoWidth)
      .forEach(col => {
        const index = rows[rows.length - 1].indexOf(col),
          cells = this.renderRoot.querySelectorAll(
            `:where(tbody tr:not([part~='group']) td, th):nth-child(${index + 1})`
          );
        col.width = Array.from(cells).reduce((acc, cur) => {
          cur.style.flexGrow = '0';
          cur.style.width = 'auto';
          const { width } = cur.getBoundingClientRect();
          cur.style.flexGrow = cur.style.width = '';
          return Math.max(acc, width);
        }, 0);
      });
    const columns = __privateGet(this, _columnDefinitions).filter(col => !col.hidden);
    const rowWidth = columns.reduce((acc, cur) => acc + Number(cur?.width ?? 0), 0);
    this.style.setProperty('--sl-grid-row-width', `${rowWidth}px`);
    const scrollbarMarginInlineStart = columns
      .filter(col => col.stickyPosition === 'start')
      .reduce((acc, cur) => acc + Number(cur?.width ?? 0), 0);
    const scrollbarMarginInlineEnd = columns
      .filter(col => col.stickyPosition === 'end')
      .reduce((acc, cur) => acc + Number(cur?.width ?? 0), 0);
    this.style.setProperty(
      '--sl-grid-scrollbar-margin-inline',
      `${scrollbarMarginInlineStart}px ${scrollbarMarginInlineEnd}px`
    );
    this.style.setProperty(
      '--sl-grid-scrollbar-inline-size',
      `calc(var(--sl-grid-width) - ${scrollbarMarginInlineStart + scrollbarMarginInlineEnd}px)`
    );
    this.renderRoot.querySelector('sl-scrollbar')?.updateThumbSize();
    __privateMethod(this, _Grid_instances, onScroll_fn).call(this);
    this.requestUpdate();
  }
};
_bulkActionsObserver = new WeakMap();
_columnDefinitions = new WeakMap();
_dataSource = new WeakMap();
_dataSourceUpdateTimer = new WeakMap();
_dragClone = new WeakMap();
_dragItem = new WeakMap();
_filters = new WeakMap();
_filterDebounceTimer = new WeakMap();
_headerRows = new WeakMap();
_initialColumnWidthsCalculated = new WeakMap();
_itemBeforeDragItem = new WeakMap();
_itemAfterDragItem = new WeakMap();
_scrollSyncing = new WeakMap();
_mutationObserver = new WeakMap();
_onWindowDragOver = new WeakMap();
_resizeObserver = new WeakMap();
_sorters = new WeakMap();
_sorterDebounceTimer = new WeakMap();
_virtualizer = new WeakMap();
_skipNextFocusAnnounce = new WeakMap();
_Grid_instances = new WeakSet();
onCancelSelection_fn = function () {
  this.dataSource?.deselectAll();
  this.dataSource?.update();
};
onClickRow_fn = function (item, index) {
  if (this.rowAction === 'activate') {
    this.dataSource?.deselectAll();
    this.dataSource?.update();
    if (this.activeRow === item.data) {
      this.activeRow = void 0;
    } else {
      this.activeRow = item.data;
    }
    const isNowActive = this.activeRow === item.data;
    this.activeRowChangeEvent.emit(this.activeRow);
    __privateMethod(this, _Grid_instances, announceSelection_fn).call(
      this,
      item,
      index,
      isNowActive
    );
  } else if (this.rowAction === 'select') {
    this.dataSource?.toggle(item);
    this.dataSource?.update();
    __privateMethod(this, _Grid_instances, announceSelection_fn).call(this, item, index);
  } else {
    return;
  }
  __privateSet(this, _skipNextFocusAnnounce, true);
  setTimeout(() => __privateSet(this, _skipNextFocusAnnounce, false));
};
onColumnUpdate_fn = function (event2) {
  __privateMethod(this, _Grid_instances, addScopedElements_fn).call(
    this,
    event2.target.scopedElements
  );
};
announceSelection_fn = function (item, index, selected) {
  const isSelected =
    selected !== void 0
      ? selected
      : this.rowAction === 'activate'
        ? this.activeRow === item.data
        : !!this.dataSource?.isSelected(item);
  const headerRowCount = this.thead?.querySelectorAll('tr').length ?? 0,
    rowNumber = index + headerRowCount;
  announce(
    isSelected
      ? msg(str`Row ${rowNumber} activated`, { id: 'sl.grid.rowActivated' })
      : msg(str`Row ${rowNumber} deactivated`, { id: 'sl.grid.rowDeactivated' }),
    'polite'
  );
};
onFocusIn_fn = function (event2) {
  if (__privateGet(this, _skipNextFocusAnnounce)) {
    __privateSet(this, _skipNextFocusAnnounce, false);
    return;
  }
  const row = event2.target?.closest?.('tr');
  if (!row || this.rowAction !== 'activate' || !row.part.contains('active')) {
    return;
  }
  const index = row.getAttribute('aria-rowindex');
  if (index) {
    const headerRowCount = this.thead?.querySelectorAll('tr').length ?? 0,
      rowNumber = Number(index) + headerRowCount;
    announce(
      msg(str`In activated row ${rowNumber}`, { id: 'sl.grid.inActivatedRow' }),
      'assertive',
      true
    );
  }
};
_onDataSourceUpdate = new WeakMap();
onDragStart_fn = function (event2, item) {
  event2.stopPropagation();
  window.addEventListener('dragover', __privateGet(this, _onWindowDragOver));
  const row = event2.currentTarget,
    rowRect = row.getBoundingClientRect();
  if (isSafari) {
    const transform = row.style.transform;
    row.style.top = /translate\(0px, (.+)\)/.exec(transform)?.at(1) ?? '';
    row.style.transform = 'none';
    requestAnimationFrame(() => {
      row.style.top = '';
      row.style.transform = transform;
    });
  }
  event2.dataTransfer.effectAllowed = 'move';
  event2.dataTransfer.setData('text/plain', String(item.id));
  __privateSet(
    this,
    _dragClone,
    __privateMethod(this, _Grid_instances, cloneRowForDragging_fn).call(this, row, item)
  );
  this.renderRoot.appendChild(__privateGet(this, _dragClone));
  event2.dataTransfer.setDragImage(
    __privateGet(this, _dragClone),
    event2.clientX - rowRect.left,
    event2.clientY - rowRect.top
  );
  __privateSet(this, _dragItem, item);
  const dragItemIndex = this.dataSource?.items.indexOf(item) ?? -1;
  __privateSet(this, _itemBeforeDragItem, this.dataSource?.items.at(dragItemIndex - 1));
  __privateSet(this, _itemAfterDragItem, this.dataSource?.items.at(dragItemIndex + 1));
  requestAnimationFrame(() => {
    if (this.draggableRows !== 'between-or-on-top') {
      this.dropTargetMode = this.draggableRows;
    }
    this.requestUpdate();
  });
  this.dragStartEvent.emit({ grid: this, item });
};
onDragEnter_fn = function (_event, item) {
  if (__privateGet(this, _dragItem) === item || this.view.isFixedItem(item.data)) {
    return;
  }
};
onDragOver_fn = function (event2, item) {
  event2.preventDefault();
  const { draggableRows, dropFilter } = this;
  this.renderRoot
    .querySelectorAll('.drop-target')
    .forEach(el => el.classList.remove('drop-target'));
  if (draggableRows === 'on-grid' && dropFilter?.(item)) {
    this.tbody.classList.add('drop-target');
  } else {
    const row = event2.composedPath().find(el => el instanceof HTMLTableRowElement),
      fixed = !!row?.part.contains('fixed');
    if (!row || fixed) {
      return;
    } else if (
      draggableRows === 'between' ||
      (draggableRows === 'between-or-on-top' && this.dropTargetMode === 'between')
    ) {
      const { top, height } = row.getBoundingClientRect();
      this.dataSource?.reorder(
        __privateGet(this, _dragItem),
        item,
        event2.clientY < top + height / 2 ? 'before' : 'after'
      );
      this.requestUpdate();
    } else if (
      draggableRows === 'on-top' ||
      (draggableRows === 'between-or-on-top' && this.dropTargetMode === 'on-top')
    ) {
      if (dropFilter?.(item.data)) {
        row?.classList.add('drop-target');
      }
    }
  }
};
onGroupDragOver_fn = function (event2, item) {
  if (
    !(
      this.draggableRows === 'between' ||
      (this.draggableRows === 'between-or-on-top' && this.dropTargetMode === 'between')
    )
  ) {
    return;
  }
  event2.preventDefault();
  this.renderRoot
    .querySelectorAll('.drop-target')
    .forEach(el => el.classList.remove('drop-target'));
  const row = event2.composedPath().find(el => el instanceof HTMLTableRowElement);
  if (!row || !item.members?.length) {
    return;
  }
  row.classList.add('drop-target');
};
onDragEnd_fn = function (event2, item) {
  window.removeEventListener('dragover', __privateGet(this, _onWindowDragOver));
  event2
    .composedPath()
    .find(el => el instanceof HTMLTableRowElement)
    ?.removeAttribute('draggable');
  this.renderRoot
    .querySelectorAll('.drop-target')
    .forEach(el => el.classList.remove('drop-target'));
  __privateSet(
    this,
    _dragItem,
    (this.dropTargetMode = __privateSet(this, _itemBeforeDragItem, void 0))
  );
  __privateSet(this, _itemAfterDragItem, void 0);
  __privateGet(this, _dragClone)?.remove();
  __privateSet(this, _dragClone, void 0);
  this.view.refresh();
  this.dragEndEvent.emit({ grid: this, item });
};
onDrop_fn = function (event2, item) {
  if (this.draggableRows === 'on-grid') {
    this.dropEvent.emit({ grid: this, item: __privateGet(this, _dragItem), position: 'on-grid' });
  } else if (
    this.draggableRows === 'on-top' ||
    (this.draggableRows === 'between-or-on-top' && this.dropTargetMode === 'on-top')
  ) {
    this.dropEvent.emit({
      grid: this,
      item: __privateGet(this, _dragItem),
      relativeItem: item.data,
      position: 'on-top'
    });
  } else if (
    this.draggableRows === 'between' ||
    (this.draggableRows === 'between-or-on-top' && this.dropTargetMode === 'between')
  ) {
    const row = event2.composedPath().find(el => el instanceof HTMLTableRowElement),
      { top, height } = row?.getBoundingClientRect() ?? { top: 0, height: 0 },
      position = event2.clientY < top + height / 2 ? 'before' : 'after';
    const proceeded = this.dropEvent.emit({
      grid: this,
      item: __privateGet(this, _dragItem),
      relativeItem: item.data,
      position
    });
    if (!proceeded) {
      __privateMethod(this, _Grid_instances, restoreDraggedItemPosition_fn).call(this);
    }
    this.requestUpdate();
  }
};
onGroupDrop_fn = function (event2, item) {
  if (
    !(
      this.draggableRows === 'between' ||
      (this.draggableRows === 'between-or-on-top' && this.dropTargetMode === 'between')
    )
  ) {
    return;
  }
  const row = event2.composedPath().find(el => el instanceof HTMLTableRowElement),
    members = item.members;
  if (!row || !members?.length) {
    return;
  }
  const { top, height } = row.getBoundingClientRect(),
    position = event2.clientY < top + height / 2 ? 'before' : 'after',
    relativeItem = position === 'before' ? members[0] : members.at(-1);
  if (!relativeItem) {
    return;
  }
  if (
    this.dropEvent.emit({
      grid: this,
      item: __privateGet(this, _dragItem),
      relativeItem: relativeItem.data,
      position
    })
  ) {
    this.dataSource?.reorder(__privateGet(this, _dragItem), relativeItem, position);
  }
  this.requestUpdate();
};
restoreDraggedItemPosition_fn = function () {
  if (!__privateGet(this, _dragItem)) {
    return;
  }
  if (__privateGet(this, _itemBeforeDragItem)) {
    this.dataSource?.reorder(
      __privateGet(this, _dragItem),
      __privateGet(this, _itemBeforeDragItem),
      'after'
    );
    return;
  }
  if (__privateGet(this, _itemAfterDragItem)) {
    this.dataSource?.reorder(
      __privateGet(this, _dragItem),
      __privateGet(this, _itemAfterDragItem),
      'before'
    );
  }
};
onFilterRegister_fn = function ({ target }) {
  __privateSet(this, _filters, [...__privateGet(this, _filters), target]);
  if (__privateGet(this, _filterDebounceTimer)) {
    clearTimeout(__privateGet(this, _filterDebounceTimer));
  }
  __privateSet(
    this,
    _filterDebounceTimer,
    setTimeout(() => {
      __privateMethod(this, _Grid_instances, applyFilters_fn).call(this, target.active);
      __privateSet(this, _filterDebounceTimer, void 0);
    })
  );
};
onFilterChange_fn = function () {
  __privateMethod(this, _Grid_instances, applyFilters_fn).call(this, true);
};
onGroupSelect_fn = function (_event, item) {
  this.dataSource?.toggle(item);
  this.dataSource?.update();
};
onGroupToggle_fn = function (_event, item) {
  this.dataSource?.toggleGroup(item.id);
  this.dataSource?.update();
};
onBodyScroll_fn = function () {
  __privateMethod(this, _Grid_instances, onScroll_fn).call(this);
};
onHeaderScroll_fn = function () {
  if (this.thead.scrollLeft === this.tbody.scrollLeft) {
    return;
  }
  __privateMethod(this, _Grid_instances, syncScrollLeft_fn).call(this, this.thead, this.tbody);
  __privateMethod(this, _Grid_instances, onScroll_fn).call(this);
};
onScroll_fn = function () {
  const { offsetWidth, scrollLeft, scrollWidth } = this.tbody;
  this.scrollbar = scrollWidth > offsetWidth;
  __privateMethod(this, _Grid_instances, syncScrollLeft_fn).call(this, this.tbody, this.thead);
  this.toggleAttribute('scrollable', this.scrollbar);
  this.toggleAttribute('scrollable-start', this.scrollbar && scrollLeft > 0);
  this.toggleAttribute(
    'scrollable-end',
    this.scrollbar && Math.round(scrollLeft) < scrollWidth - offsetWidth
  );
};
syncScrollLeft_fn = function (source, target) {
  if (__privateGet(this, _scrollSyncing) || target.scrollLeft === source.scrollLeft) {
    return;
  }
  __privateSet(this, _scrollSyncing, true);
  target.scrollLeft = source.scrollLeft;
  __privateSet(this, _scrollSyncing, false);
};
_onSelectionChange = new WeakMap();
onSkipTo_fn = function (event2, destination) {
  event2.preventDefault();
  this.table?.scrollIntoView({
    behavior: 'instant',
    block: destination
  });
  this.renderRoot.querySelector(`#table-${destination}`).focus();
};
onSkipToFocus_fn = function (e, position) {
  if (!('anchorName' in document.documentElement.style)) {
    const bottomAnchor = this.tfoot ?? this.tbody.querySelector('tr:last-of-type');
    positionPopover(e.target, position === 'top' ? this.thead : bottomAnchor, {
      position: `${position}-start`
    });
  }
};
onSlotChange_fn = async function (event2) {
  const elements = event2.target.assignedElements({ flatten: true }),
    columns = elements.filter(el => el instanceof GridColumn);
  columns.forEach((col, index) => {
    __privateMethod(this, _Grid_instances, addScopedElements_fn).call(this, col.scopedElements);
    col.grid = this;
    if (this.dataSource) {
      col.itemsChanged();
    }
    if (this.ellipsizeText) {
      col.ellipsizeText = this.ellipsizeText;
    }
    if (col.sticky) {
      if (index === 0) {
        col.stickyOrder = 'first';
        col.stickyPosition = 'start';
      } else if (index === columns.length - 1) {
        col.stickyOrder = columns.at(index - 1)?.sticky ? 'last' : 'first';
        col.stickyPosition = 'end';
      } else if (columns.at(index - 1)?.sticky) {
        col.stickyPosition = columns.at(index - 1).stickyPosition;
        if (!columns.at(index + 1)?.sticky) {
          col.stickyOrder = 'last';
        }
      } else {
        col.stickyOrder = 'first';
        col.stickyPosition = 'end';
      }
    }
    if (col instanceof GridFilterColumn) {
      const { value } = this.dataSource?.filters.get(col.id) || {};
      if (value) {
        col.value = String(value);
      }
    } else if (col instanceof GridSortColumn && this.dataSource?.sort) {
      const sort = this.dataSource.sort;
      if ('path' in sort && sort.path === col.path) {
        col.direction = sort.direction;
      } else if ('sorter' in sort && sort.sorter === col.sorter) {
        col.direction = sort.direction;
      }
    }
  });
  await Promise.allSettled(columns.map(async col => await col.updateComplete));
  __privateGet(this, _columnDefinitions).forEach(col => {
    if (!columns.includes(col)) {
      __privateMethod(this, _Grid_instances, removeColumn_fn).call(this, col);
    }
  });
  __privateSet(this, _columnDefinitions, columns);
  __privateSet(
    this,
    _headerRows,
    __privateMethod(this, _Grid_instances, flattenColumnGroups_fn).call(this, columns)
  );
  await this.recalculateColumnWidths();
};
onSorterChange_fn = function ({ target }) {
  if (!target.direction) {
    this.dataSource?.removeSort();
  }
  __privateGet(this, _sorters)
    .filter(sorter => sorter !== target)
    .forEach(sorter => sorter.reset());
  __privateMethod(this, _Grid_instances, applySorters_fn).call(this, true);
};
onSorterRegister_fn = function ({ target }) {
  __privateSet(this, _sorters, [...__privateGet(this, _sorters), target]);
  if (__privateGet(this, _sorterDebounceTimer)) {
    clearTimeout(__privateGet(this, _sorterDebounceTimer));
  }
  __privateSet(
    this,
    _sorterDebounceTimer,
    setTimeout(() => {
      __privateMethod(this, _Grid_instances, applySorters_fn).call(
        this,
        __privateGet(this, _sorters).some(s => s.direction)
      );
      __privateSet(this, _sorterDebounceTimer, void 0);
    })
  );
};
addScopedElements_fn = function (scopedElements) {
  if (scopedElements) {
    for (const [tagName, klass] of Object.entries(scopedElements)) {
      if (!this.registry?.get(tagName)) {
        this.registry?.define(tagName, klass);
      }
    }
  }
};
applyFilters_fn = function (update = false) {
  __privateGet(this, _filters).forEach(f => {
    const id = f.column.id,
      empty = (Array.isArray(f.value) && f.value.length === 0) || !f.value;
    if (!empty && (f.filter || f.path)) {
      this.dataSource?.addFilter(id, f.filter || f.path, f.value);
    } else if (empty) {
      this.dataSource?.removeFilter(id);
    } else {
      console.warn(
        `The column ${id} is missing a filter or path. Either provide a path or a filter function, otherwise the filter cannot not work.`
      );
      this.dataSource?.removeFilter(id);
    }
  });
  if (update) {
    if (__privateGet(this, _dataSourceUpdateTimer)) {
      clearTimeout(__privateGet(this, _dataSourceUpdateTimer));
    }
    __privateSet(
      this,
      _dataSourceUpdateTimer,
      setTimeout(() => this.dataSource?.update(), 10)
    );
  }
  this.stateChangeEvent.emit({ grid: this });
};
applySorters_fn = function (update = false) {
  const sorter = __privateGet(this, _sorters).find(sorter2 => !!sorter2.direction);
  if (sorter && (sorter.sorter || sorter.path)) {
    this.dataSource?.setSort(sorter.sorter || sorter.path, sorter.direction ?? 'asc');
  } else if (sorter) {
    console.warn(
      `The column ${sorter?.column.id} is missing a sorter or path. Either provide a path or a sorter function, otherwise the sorter cannot not work.`
    );
  }
  if (update) {
    if (__privateGet(this, _dataSourceUpdateTimer)) {
      clearTimeout(__privateGet(this, _dataSourceUpdateTimer));
    }
    __privateSet(
      this,
      _dataSourceUpdateTimer,
      setTimeout(() => this.dataSource?.update(), 10)
    );
  }
  this.stateChangeEvent.emit({ grid: this });
};
cloneRowForDragging_fn = function (row, item) {
  const clone = document.createElement('tr');
  clone.setAttribute('aria-hidden', 'true');
  clone.style.background = 'transparent';
  clone.style.border = 'var(--sl-size-borderWidth-default) solid var(--sl-color-border-plain)';
  clone.style.borderRadius = 'var(--sl-size-borderRadius-default)';
  clone.style.cursor = 'grabbing';
  clone.style.overflow = 'clip';
  clone.style.width = row.getBoundingClientRect().width + 'px';
  if (isListDataSourceDataItem(item)) {
    render(
      html`${__privateGet(this, _columnDefinitions)
        .filter(col => !col.hidden)
        .map(col => col.renderData(item))}`,
      clone,
      {
        creationScope: this.shadowRoot
      }
    );
  }
  Array.from(clone.querySelectorAll('td')).forEach((cell, index) => {
    cell.style.background = 'var(--sl-elevation-surface-raised-default)';
    cell.style.flexGrow = '0';
    cell.style.width = row.children[index].getBoundingClientRect().width + 'px';
  });
  return clone;
};
/**
 * Flattens the column groups.
 *
 * So the following column definitions: - group 1 - column 1 - column 2 - group 2 - column 3 -
 * column 4 - group 3 - column 5
 *
 * Will be flattened to: [ [ group 1, group 2, group 3 ], [ column 1, column 2, column 3, column 4,
 * column 5 ] ]
 */
flattenColumnGroups_fn = function (columns) {
  const groups = columns.filter(col => col instanceof GridColumnGroup);
  if (groups.length) {
    return [
      groups,
      groups
        .flatMap(group =>
          __privateMethod(this, _Grid_instances, flattenColumnGroups_fn).call(this, group.columns)
        )
        .flat()
    ];
  } else {
    return [columns];
  }
};
/** Returns the left offset, taking any sticky columns into account. */
getStickyColumnOffset_fn = function (index) {
  let columns;
  if (__privateGet(this, _columnDefinitions)[index].stickyPosition === 'end') {
    columns = __privateGet(this, _columnDefinitions)
      .slice(index, __privateGet(this, _columnDefinitions).length - 1)
      .reverse();
  } else {
    columns = __privateGet(this, _columnDefinitions).slice(0, index);
  }
  return columns.filter(col => !col.hidden).reduce((acc, { width = 0 }) => acc + width, 0);
};
removeColumn_fn = function (col) {
  if (col instanceof GridSortColumn) {
    if (col.direction) {
      this.dataSource?.removeSort();
    }
    __privateSet(
      this,
      _sorters,
      __privateGet(this, _sorters).filter(s => s !== col.sorterElement)
    );
  }
  if (col instanceof GridFilterColumn) {
    __privateSet(
      this,
      _filters,
      __privateGet(this, _filters).filter(f => f !== col.filterElement)
    );
  }
};
updateDataSource_fn = function () {
  __privateMethod(this, _Grid_instances, applyFilters_fn).call(this);
  __privateMethod(this, _Grid_instances, applySorters_fn).call(this);
  if (__privateGet(this, _dataSourceUpdateTimer)) {
    clearTimeout(__privateGet(this, _dataSourceUpdateTimer));
  }
  __privateSet(
    this,
    _dataSourceUpdateTimer,
    setTimeout(() => this.dataSource?.update(), 10)
  );
  this.stateChangeEvent.emit({ grid: this });
};
/** @internal */
Grid.styles = styles;
__decorateClass([property({ attribute: false })], Grid.prototype, 'activeRow', 2);
__decorateClass(
  [event({ name: 'sl-grid-active-row-change' })],
  Grid.prototype,
  'activeRowChangeEvent',
  2
);
__decorateClass([property({ attribute: false })], Grid.prototype, 'dataSource', 1);
__decorateClass([property({ attribute: 'draggable-rows' })], Grid.prototype, 'draggableRows', 2);
__decorateClass([event({ name: 'sl-grid-dragstart' })], Grid.prototype, 'dragStartEvent', 2);
__decorateClass([event({ name: 'sl-grid-dragend' })], Grid.prototype, 'dragEndEvent', 2);
__decorateClass(
  [event({ name: 'sl-grid-drop', cancelable: true })],
  Grid.prototype,
  'dropEvent',
  2
);
__decorateClass([property({ attribute: false })], Grid.prototype, 'dropFilter', 2);
__decorateClass(
  [property({ reflect: true, attribute: 'drop-target-mode' })],
  Grid.prototype,
  'dropTargetMode',
  2
);
__decorateClass(
  [property({ type: Boolean, reflect: true, attribute: 'ellipsize-text' })],
  Grid.prototype,
  'ellipsizeText',
  2
);
__decorateClass([property({ attribute: false })], Grid.prototype, 'groupHeaderRenderer', 2);
__decorateClass([property({ type: Array })], Grid.prototype, 'items', 2);
__decorateClass([property({ attribute: false })], Grid.prototype, 'itemParts', 2);
__decorateClass(
  [property({ type: Boolean, reflect: true, attribute: 'no-border' })],
  Grid.prototype,
  'noBorder',
  2
);
__decorateClass(
  [property({ type: Boolean, reflect: true, attribute: 'no-skip-links' })],
  Grid.prototype,
  'noSkipLinks',
  2
);
__decorateClass(
  [property({ type: Boolean, reflect: true, attribute: 'no-row-border' })],
  Grid.prototype,
  'noRowBorder',
  2
);
__decorateClass(
  [property({ reflect: true, attribute: 'row-action' })],
  Grid.prototype,
  'rowAction',
  2
);
__decorateClass([property({ attribute: false })], Grid.prototype, 'scopedElements', 2);
__decorateClass([state()], Grid.prototype, 'scrollbar', 2);
__decorateClass(
  [event({ name: 'sl-grid-selection-change' })],
  Grid.prototype,
  'selectionChangeEvent',
  2
);
__decorateClass([property()], Grid.prototype, 'selects', 2);
__decorateClass([event({ name: 'sl-grid-state-change' })], Grid.prototype, 'stateChangeEvent', 2);
__decorateClass([property({ type: Boolean, reflect: true })], Grid.prototype, 'striped', 2);
__decorateClass([query('tbody')], Grid.prototype, 'tbody', 2);
__decorateClass([query('thead')], Grid.prototype, 'thead', 2);
__decorateClass([query('table')], Grid.prototype, 'table', 2);
__decorateClass([query('tfoot')], Grid.prototype, 'tfoot', 2);
__decorateClass([property({ attribute: false })], Grid.prototype, 'view', 2);
Grid = __decorateClass([localized()], Grid);
//# sourceMappingURL=grid.js.map
