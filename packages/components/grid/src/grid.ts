/* eslint-disable slds/button-has-label */
/* eslint-disable lit/prefer-static-styles */
import { localized, msg, str } from '@lit/localize';
import { type VirtualizerHostElement, virtualize, virtualizerRef } from '@lit-labs/virtualizer/virtualize.js';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { ArrayListDataSource, ListDataSource } from '@sl-design-system/data-source';
import { EllipsizeText } from '@sl-design-system/ellipsize-text';
import { Icon } from '@sl-design-system/icon';
import { Scrollbar } from '@sl-design-system/scrollbar';
import {
  type EventEmitter,
  EventsController,
  type PathKeys,
  SelectionController,
  event,
  getValueByPath,
  isSafari,
  positionPopover
} from '@sl-design-system/shared';
import { type SlSelectEvent, type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { Skeleton } from '@sl-design-system/skeleton';
import { ToolBar } from '@sl-design-system/tool-bar';
import { Tooltip } from '@sl-design-system/tooltip';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { GridColumnGroup } from './column-group.js';
import { GridColumn } from './column.js';
import { GridFilterColumn } from './filter-column.js';
import { type GridFilter, type SlFilterRegisterEvent } from './filter.js';
import styles from './grid.scss.js';
import { GridGroupHeader } from './group-header.js';
import { GridSelectionColumn } from './selection-column.js';
import { GridSortColumn } from './sort-column.js';
import { type GridSorter, type SlSorterRegisterEvent } from './sorter.js';
import { GridViewModel, GridViewModelGroup } from './view-model.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-active-item-change': SlActiveItemChangeEvent;
    'sl-grid-dragstart': SlDragStartEvent;
    'sl-grid-dragend': SlDragEndEvent;
    'sl-grid-drop': SlDropEvent;
    'sl-grid-state-change': SlStateChangeEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-grid': Grid;
  }
}

/** Callback method for setting the parts on the `<tr>` for this item. */
export type GridItemParts<T> = (item: T) => string | undefined;

/**
 * Indicates how rows can be dragged in the grid.
 * - `between`: Rows can be dragged between other rows; useful for reordering
 * - `on-top`: Rows can be dragged on top of other rows; useful for grouping
 * - `between-or-on-top`: Rows can be dragged between or on top of other rows;
 *   which one is determined by the dropFilter function
 * - `on-grid`: Rows can be dragged anywhere on the grid
 */
export type GridDraggableRows = 'between' | 'on-top' | 'between-or-on-top' | 'on-grid';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GridDropFilter<T = any> = (item: T) => boolean | 'between' | 'on-top';

export interface GridGroupHeaderRendererOptions {
  expanded?: boolean;
  selectable?: boolean;
  selected: 'all' | 'some' | 'none';
}

export type GridGroupHeaderRenderer = (
  group: GridViewModelGroup,
  options?: GridGroupHeaderRendererOptions
) => TemplateResult;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SlActiveItemChangeEvent<T = any> = CustomEvent<{ grid: Grid<T>; item?: T; relatedEvent?: Event }>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SlDragStartEvent<T = any> = CustomEvent<{ grid: Grid<T>; item: T }>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SlDragEndEvent<T = any> = CustomEvent<{ grid: Grid<T>; item: T }>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SlDropEvent<T = any> = CustomEvent<{
  grid: Grid<T>;
  item: T;
  relativeItem?: T;
  position: 'before' | 'after' | 'on-grid' | 'on-top';
}>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SlStateChangeEvent<T = any> = CustomEvent<{ grid: Grid<T> }>;

@localized()
/**
 * Data grid component. This component is designed to be highly customizable
 * and can be used to display a wide variety of data. It supports sorting,
 * filtering, grouping, and more.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Grid<T = any> extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-ellipsize-text': EllipsizeText,
      'sl-grid-group-header': GridGroupHeader,
      'sl-icon': Icon,
      'sl-skeleton': Skeleton,
      'sl-scrollbar': Scrollbar,
      'sl-tool-bar': ToolBar,
      'sl-tooltip': Tooltip
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The item being dragged. */
  #dragItem?: T;

  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, { 'sl-selection-change': this.#onSelectionChange });

  /** The filters for this grid. */
  #filters: Array<GridFilter<T>> = [];

  /** Timer for debouncing filter updates. */
  #filterDebounceTimer?: ReturnType<typeof setTimeout>;

  /** Flag for calculating the column widths only once. */
  #initialColumnWidthsCalculated = false;

  /** The item before the dragged item when dragging started. */
  #itemBeforeDragItem?: T;

  /** Observe the tbody style changes. */
  #mutationObserver = new MutationObserver(() => {
    this.#mutationObserver?.disconnect();

    // Only recalculate the column widths if the grid has been rendered for the first time
    if (!this.#initialColumnWidthsCalculated && this.renderRoot.querySelectorAll('td').length) {
      this.#initialColumnWidthsCalculated = true;
      void this.recalculateColumnWidths();
    }

    // This is a workaround for the virtualizer not taking the border width into account
    // We convert the min-height to a CSS variable so we can use it in the styles and
    // add the border-width to the eventual min-height value.
    this.style.setProperty('--sl-grid-tbody-min-height', this.tbody.style.minHeight);
    this.tbody.style.minHeight = '';

    this.#mutationObserver?.observe(this.tbody, { attributes: true, attributeFilter: ['style'] });
  });

  /** We need to know when the user drags items outside of the grid. */
  #onWindowDragOver = (event: DragEvent) => {
    const grid = event.composedPath().find(el => el instanceof Grid);

    if (!grid || grid !== this) {
      this.view.reorderItem(this.#dragItem!, this.#itemBeforeDragItem, 'after');
      this.requestUpdate('view');
    }
  };

  /** Observe the grid width. */
  #resizeObserver = new ResizeObserver(entries => {
    const {
      contentBoxSize: [{ inlineSize }]
    } = entries[0];

    this.style.setProperty('--sl-grid-width', `${inlineSize}px`);

    // Update the scroll state
    this.#onScroll();
  });

  /** The sorters for this grid. */
  #sorters: Array<GridSorter<T>> = [];

  /** The debounce timer for sorters. */
  #sorterDebounceTimer?: ReturnType<typeof setTimeout>;

  /** The virtualizer instance for the grid. */
  #virtualizer?: VirtualizerHostElement[typeof virtualizerRef];

  /** Selection manager. */
  readonly selection = new SelectionController<T>(this);

  /** The active item in the grid. */
  @state() activeItem?: T;

  /** @internal Emits when the active item changes */
  @event({ name: 'sl-active-item-change' }) activeItemChangeEvent!: EventEmitter<SlActiveItemChangeEvent<T>>;

  /** Provide your own implementation for getting the data. */
  @property({ attribute: false }) dataSource?: ListDataSource<T>;

  /**
   * Whether you can drag rows in the grid. If you use the drag-handle column,
   * then this property is automatically set by the column to 'between'.
   */
  @property({ attribute: 'draggable-rows' }) draggableRows?: GridDraggableRows;

  /** @internal Emits when a drag operation is starting. */
  @event({ name: 'sl-grid-dragstart' }) dragStartEvent!: EventEmitter<SlDragStartEvent<T>>;

  /** @internal Emits when a drag operation has finished. */
  @event({ name: 'sl-grid-dragend' }) dragEndEvent!: EventEmitter<SlDragEndEvent<T>>;

  /** @internal Emits when an item has been dropped. */
  @event({ name: 'sl-grid-drop', cancelable: true }) dropEvent!: EventEmitter<SlDropEvent<T>>;

  /** Whether a row can be set active by clicking anywhere in the row. */
  @property({ type: Boolean, reflect: true, attribute: 'clickable-row' }) clickableRow?: boolean;

  /**
   * Determines if or what kind of drop target the given item is:
   * - boolean: the item is valid drop target based on the draggableRows value
   * - 'between': the item is a valid drop target between
   * - 'on-top': the item is a valid drop target to drop on top of
   */
  @property({ attribute: false }) dropFilter?: GridDropFilter;

  /** @internal Provides clarity when 'between-or-on-top' is the active draggableRows value. */
  @property({ reflect: true, attribute: 'drop-target-mode' }) dropTargetMode?: 'between' | 'on-grid' | 'on-top';

  /** This will ellipsize the text in the `<td>` elements if it overflows. */
  @property({ type: Boolean, reflect: true, attribute: 'ellipsize-text' }) ellipsizeText?: boolean;

  /** Custom renderer for group headers. */
  @property({ attribute: false }) groupHeaderRenderer?: GridGroupHeaderRenderer;

  /** An array of items to be displayed in the grid. */
  @property({ type: Array }) items?: T[];

  /** Custom parts to be set on the `<tr>` so it can be styled externally. */
  @property({ attribute: false }) itemParts?: GridItemParts<T>;

  /** Hide the border around the grid when true. */
  @property({ type: Boolean, reflect: true, attribute: 'no-border' }) noBorder?: boolean;

  /** Hides the border between rows when true. */
  @property({ type: Boolean, reflect: true, attribute: 'no-row-border' }) noRowBorder?: boolean;

  /**
   * The custom elements used for rendering this grid. This can be used if you want to render
   * custom elements in the group header. Custom elements that you want to render in the columns
   * can be registered via the `scopedElements` property on the column.
   */
  @property({ attribute: false }) scopedElements?: Record<string, typeof HTMLElement>;

  /** @internal Will render a custom horizontal scrollbar when set. */
  @state() scrollbar?: boolean;

  /** @internal Emits when the state in the grid has changed. */
  @event({ name: 'sl-grid-state-change' }) stateChangeEvent!: EventEmitter<SlStateChangeEvent<T>>;

  /** Uses alternating background colors for the rows when set. */
  @property({ type: Boolean, reflect: true }) striped?: boolean;

  /** The table body element. */
  @query('tbody') tbody!: HTMLTableSectionElement;

  /** The table head element. */
  @query('thead') thead!: HTMLTableSectionElement;

  /** The table element. */
  @query('table') table!: HTMLTableElement;

  /** The table foot element. */
  @query('tfoot') tfoot!: HTMLTableSectionElement;

  /** The model used for rendering the grid. */
  @property({ attribute: false }) view = new GridViewModel<T>(this);

  override connectedCallback(): void {
    super.connectedCallback();

    this.#resizeObserver.observe(this);
  }

  override disconnectedCallback(): void {
    this.#mutationObserver?.disconnect();
    this.#resizeObserver?.disconnect();

    if (this.#filterDebounceTimer) {
      clearTimeout(this.#filterDebounceTimer);
    }

    if (this.#sorterDebounceTimer) {
      clearTimeout(this.#sorterDebounceTimer);
    }

    super.disconnectedCallback();
  }

  override async firstUpdated(): Promise<void> {
    this.#mutationObserver?.observe(this.tbody, { attributes: true, attributeFilter: ['style'] });

    this.tbody.addEventListener('scroll', () => this.#onScroll(), { passive: true });

    // Workaround for https://github.com/lit/lit/issues/4232
    await new Promise(resolve => requestAnimationFrame(resolve));

    const host = this.tbody as VirtualizerHostElement;
    this.#virtualizer = host[virtualizerRef];
    this.#virtualizer?.disconnected();
    this.#virtualizer?.connected();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    if (changes.has('dataSource')) {
      this.#updateDataSource(this.dataSource);
    }

    if (changes.has('items')) {
      this.dataSource = this.items ? new ArrayListDataSource(this.items) : undefined;

      this.#updateDataSource(this.dataSource);
    }

    if (changes.has('scopedElements')) {
      this.#addScopedElements(this.scopedElements);
    }

    if (changes.has('ellipsizeText')) {
      this.view.headerRows.at(-1)?.forEach(col => (col.ellipsizeText = this.ellipsizeText));
    }
  }

  override render(): TemplateResult {
    return html`
      <slot @sl-column-update=${this.#onColumnUpdate} @slotchange=${this.#onSlotChange} style="display:none"></slot>
      <style>
        ${this.renderStyles()}
      </style>
      <a
        id="table-start"
        href="#table-end"
        class="skip-link-start"
        @focus=${(e: Event & { target: HTMLSlotElement }) => this.#onSkipToFocus(e, 'top')}
        @click=${(e: Event & { target: HTMLSlotElement }) => this.#onSkipTo(e, 'end')}
      >
        ${msg('Skip to end of table', { id: 'sl.grid.skipToEndOfTable' })}
      </a>
      <table part="table" aria-rowcount=${this.dataSource?.items.length || 0}>
        <caption></caption>
        <thead
          @sl-filter-change=${this.#onFilterChange}
          @sl-filter-register=${this.#onFilterRegister}
          @sl-sorter-change=${this.#onSorterChange}
          @sl-sorter-register=${this.#onSorterRegister}
          part="thead"
        >
          ${this.renderHeaderRows()}
        </thead>
        <tbody id="tbody" part="tbody">
          ${virtualize({
            items: this.view.rows,
            renderItem: (item, index) => this.renderItem(item, index)
          })}
        </tbody>
        ${this.scrollbar
          ? html`
              <tfoot>
                <tr class="scrollbar">
                  <td>
                    <sl-scrollbar scroller="tbody"></sl-scrollbar>
                  </td>
                </tr>
              </tfoot>
            `
          : nothing}
      </table>

      <div part="bulk-actions" popover="manual">
        <span
          >${msg(str`${this.selection.selected} of ${this.selection.size} selected`, {
            id: 'sl.grid.selectionStatusMessage'
          })}</span
        >
        <sl-tool-bar no-border>
          <slot name="bulk-actions"></slot>
          <sl-button @click=${this.#onCancelSelection} aria-describedby="tooltip" fill="ghost" variant="inverted">
            <sl-icon name="xmark"></sl-icon>
          </sl-button>
          <sl-tooltip id="tooltip">${msg('Cancel selection', { id: 'sl.grid.cancelSelection' })}</sl-tooltip>
        </sl-tool-bar>
      </div>

      <a
        id="table-end"
        href="#table-start"
        class="skip-link-end"
        @focus=${(e: Event & { target: HTMLSlotElement }) => this.#onSkipToFocus(e, 'bottom')}
        @click=${(e: Event & { target: HTMLSlotElement }) => this.#onSkipTo(e, 'start')}
        >${msg('Skip to start of table', { id: 'sl.grid.skipToStartOfTable' })}</a
      >
    `;
  }

  renderStyles(): TemplateResult {
    const rows = this.view.headerRows;

    return html`
      ${rows.slice(0, -1).map((row, rowIndex) => {
        return row.map((col, colIndex) => {
          return col instanceof GridColumnGroup
            ? `
            thead tr:nth-child(${rowIndex + 1}) th:nth-child(${colIndex + 1}) {
              flex-grow: ${Math.max((col as GridColumnGroup<T>).columns.length, 1)};
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
            ${
              col.sticky
                ? col.stickyPosition === 'start'
                  ? `inset-inline-start: ${this.view.getStickyColumnOffset(index)}px;`
                  : `inset-inline-end: ${this.view.getStickyColumnOffset(index)}px;`
                : ''
            }
            ${col.renderStyles()?.toString() ?? ''}
          }
          `;
      })}
    `;
  }

  renderHeaderRows(): TemplateResult[] {
    return this.view.headerRows.map(row => this.renderHeaderRow(row));
  }

  renderHeaderRow(columns: GridColumn[]): TemplateResult {
    const rowCount = columns.reduce((acc, column) => Math.max(acc, column.headerRowCount), 0),
      rows = Array.from({ length: rowCount });

    return html`
      ${rows.map(
        (_, rowIndex) => html`
          <tr>
            ${columns.map(col => col.renderHeaderRow(rowIndex))}
          </tr>
        `
      )}
    `;
  }

  renderItem(item: T, index: number): TemplateResult {
    return item instanceof GridViewModelGroup ? this.renderGroupRow(item, index) : this.renderItemRow(item, index);
  }

  renderItemRow(item: T, index: number): TemplateResult {
    const rows = this.view.headerRows,
      active = this.selection.isActive(item),
      selected = this.selection.isSelected(item),
      parts = [
        'row',
        index % 2 === 0 ? 'odd' : 'even',
        ...(active ? ['active'] : []),
        ...(selected ? ['selected'] : []),
        ...(this.#dragItem === item ? ['dragging'] : []),
        ...(this.itemParts?.(item)?.split(' ') || []),
        ...(this.view.isFixedItem(item) ? ['fixed'] : [])
      ];

    return html`
      <tr
        @click=${(event: Event) => this.#onClickRow(event, item)}
        @dragstart=${(event: DragEvent) => this.#onDragStart(event, item)}
        @dragenter=${(event: DragEvent) => this.#onDragEnter(event, item)}
        @dragover=${(event: DragEvent) => this.#onDragOver(event, item)}
        @dragend=${(event: DragEvent) => this.#onDragEnd(event, item)}
        @drop=${(event: DragEvent) => this.#onDrop(event, item)}
        aria-rowindex=${index}
        class=${ifDefined(active ? 'active' : undefined)}
        index=${index}
        part=${parts.join(' ')}
      >
        ${rows[rows.length - 1].map(col => col.renderData(item))}
      </tr>
    `;
  }

  renderGroupRow(group: GridViewModelGroup, index: number): TemplateResult {
    const expanded = this.view.getGroupState(group.value),
      selectable = !!this.view.columns.find(col => col instanceof GridSelectionColumn),
      selected = this.view.getGroupSelection(group.value),
      active = this.view.getActiveRow(group.value);

    return html`
      <tr part="group" index=${index}>
        <td part="group-header">
          <sl-grid-group-header
            @sl-select=${(event: SlSelectEvent<boolean>) => this.#onGroupSelect(event, group)}
            @sl-toggle=${(event: SlToggleEvent<boolean>) => this.#onGroupToggle(event, group)}
            .active=${active}
            .expanded=${expanded}
            .selectable=${selectable}
            .selected=${selected}
          >
            ${this.groupHeaderRenderer?.(group) ?? html`<span part="group-heading">${group.label}</span>`}
          </sl-grid-group-header>
        </td>
      </tr>
    `;
  }

  /** Updates the `width` of all columns which have `autoWidth` set to `true`. */
  async recalculateColumnWidths(): Promise<void> {
    // Do not remove, this is needed; not sure why
    await this.updateComplete;

    const rows = this.view.headerRows;

    rows[rows.length - 1]
      .filter(col => !col.hidden && col.autoWidth)
      .forEach(col => {
        const index = this.view.headerRows[this.view.headerRows.length - 1].indexOf(col),
          cells = this.renderRoot.querySelectorAll<HTMLElement>(`:where(tbody td, th):nth-child(${index + 1})`);
        col.width = Array.from(cells).reduce((acc, cur) => {
          cur.style.flexGrow = '0';
          cur.style.width = 'auto';

          const { width } = cur.getBoundingClientRect();

          cur.style.flexGrow = cur.style.width = '';

          return Math.max(acc, width);
        }, 0);
      });

    // Since we set an explicit width for the `<thead>` and `<tbody>`, we also need
    // to set an explicit width for all the `<tr>` elements. Otherwise, the sticky columns
    // will not be sticky when you scroll horizontally.
    const rowWidth = this.view.columns.reduce((acc, cur) => acc + Number(cur?.width ?? 0), 0);
    this.style.setProperty('--sl-grid-row-width', `${rowWidth}px`);

    const scrollbarMarginInlineStart = this.view.columns
      .filter(col => col.stickyPosition === 'start')
      .reduce((acc, cur) => acc + Number(cur?.width ?? 0), 0);

    const scrollbarMarginInlineEnd = this.view.columns
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

    // Manually trigger the scrollbar to update its thumb size since the scrollbar
    // is monitoring the `<tbody>` element and the width of that may not have changed,
    // only the contents of the element may have changed width.
    this.renderRoot.querySelector('sl-scrollbar')?.updateThumbSize();

    // Update the scrollbar position
    this.#onScroll();

    this.requestUpdate();
  }

  #onCancelSelection(): void {
    this.selection.deselectAll();
  }

  #onClickRow(event: Event, item: T): void {
    if (!this.clickableRow) {
      return;
    }

    if (this.view.columnDefinitions.some(col => col instanceof GridSelectionColumn)) {
      this.selection.toggle(item);
    } else {
      this.activeItem = this.selection.toggleActive(item);
      this.activeItemChangeEvent.emit({ grid: this, item: this.activeItem, relatedEvent: event });
    }
  }

  #onColumnUpdate(event: Event & { target: GridColumn<T> }): void {
    this.#addScopedElements(event.target.scopedElements);
  }

  #onDragStart(event: DragEvent, item: T): void {
    event.stopPropagation();

    window.addEventListener('dragover', this.#onWindowDragOver);

    const row = event.composedPath().at(0) as HTMLElement,
      rowRect = row.getBoundingClientRect();

    if (isSafari) {
      // Safari doesn't position drag images from transformed elements properly so we need to
      // switch to use top temporarily. See https://bugs.webkit.org/show_bug.cgi?id=267811
      const transform = row.style.transform;
      row.style.top = /translate\(0px, (.+)\)/.exec(transform)?.at(1) ?? '';
      row.style.transform = 'none';
      requestAnimationFrame(() => {
        row.style.top = '';
        row.style.transform = transform;
      });
    }

    // Style the dragged row
    row.style.setProperty('--_cell-background', 'var(--_dragging-background)');
    row.style.setProperty('border', 'var(--_dragging-border)');
    row.style.setProperty('opacity', 'var(--_dragging-opacity)');

    event.dataTransfer!.effectAllowed = 'move';
    event.dataTransfer!.setData('application/json', JSON.stringify(item));

    // This is necessary for the dragged item to appear correctly in Safari
    event.dataTransfer!.setDragImage(row, event.clientX - rowRect.left, event.clientY - rowRect.top);

    this.#dragItem = item;
    this.#itemBeforeDragItem = this.view.rows.at(this.view.rows.indexOf(item) - 1);

    // Update styles in the next frame, after the drag image has been created
    requestAnimationFrame(() => {
      row.style.removeProperty('--_cell-background');
      row.style.removeProperty('border');
      row.style.removeProperty('opacity');

      if (this.draggableRows !== 'between-or-on-top') {
        this.dropTargetMode = this.draggableRows;
      }

      this.view.refresh();
    });

    this.dragStartEvent.emit({ grid: this, item: item });
  }

  #onDragEnter(_event: DragEvent, item: T): void {
    if (this.#dragItem === item || this.view.isFixedItem(item)) {
      return;
    }
  }

  #onDragOver(event: DragEvent, item: T): void {
    event.preventDefault();

    const { draggableRows, dropFilter } = this;

    // Reset any drop targets
    this.renderRoot.querySelectorAll('.drop-target').forEach(el => el.classList.remove('drop-target'));

    if (draggableRows === 'on-grid' && dropFilter?.(item)) {
      this.tbody.classList.add('drop-target');
    } else {
      const row = event.composedPath().find((el): el is HTMLTableRowElement => el instanceof HTMLTableRowElement),
        fixed = !!row?.part.contains('fixed');

      if (!row || fixed) {
        return;
      } else if (
        draggableRows === 'between' ||
        (draggableRows === 'between-or-on-top' && this.dropTargetMode === 'between')
      ) {
        const { top, height } = row.getBoundingClientRect();

        // If the cursor is in the top half of the row, make this row the drop target
        this.view.reorderItem(this.#dragItem!, item, event.clientY < top + height / 2 ? 'before' : 'after');

        this.requestUpdate('view');
      } else if (
        draggableRows === 'on-top' ||
        (draggableRows === 'between-or-on-top' && this.dropTargetMode === 'on-top')
      ) {
        if (dropFilter?.(item)) {
          row?.classList.add('drop-target');
        }
      }
    }
  }

  #onDragEnd(event: DragEvent, item: T): void {
    window.removeEventListener('dragover', this.#onWindowDragOver);

    event
      .composedPath()
      .find((el): el is HTMLTableRowElement => el instanceof HTMLTableRowElement)
      ?.removeAttribute('draggable');

    // Reset any drop targets
    this.renderRoot.querySelectorAll('.drop-target').forEach(el => el.classList.remove('drop-target'));

    this.#dragItem = this.dropTargetMode = this.#itemBeforeDragItem = undefined;

    // Force rerender
    requestAnimationFrame(() => this.view.refresh());

    this.dragEndEvent.emit({ grid: this, item });
  }

  #onDrop(_event: DragEvent, item: T): void {
    let cancelled = false;

    if (this.draggableRows === 'on-grid') {
      cancelled = !this.dropEvent.emit({ grid: this, item: this.#dragItem!, position: 'on-grid' });

      if (!cancelled) {
        // Insert item at the end of the grid.
      }
    } else if (
      this.draggableRows === 'on-top' ||
      (this.draggableRows === 'between-or-on-top' && this.dropTargetMode === 'on-top')
    ) {
      cancelled = !this.dropEvent.emit({ grid: this, item: this.#dragItem!, relativeItem: item, position: 'on-top' });

      if (!cancelled) {
        // Insert item at the top of the group.
        console.log('Item dropped on top of', this.#dragItem, item);
      }
    } else if (
      this.draggableRows === 'between' ||
      (this.draggableRows === 'between-or-on-top' && this.dropTargetMode === 'between')
    ) {
      const index = this.view.rows.indexOf(this.#dragItem!);

      let relativeItem: T | undefined;
      if (index === 0 && this.view.rows.length > 1) {
        relativeItem = this.view.rows.at(index + 1);
      } else if (index > 0 && index < this.view.rows.length) {
        relativeItem = this.view.rows.at(index - 1);
      }

      cancelled = !this.dropEvent.emit({
        grid: this,
        item: this.#dragItem!,
        relativeItem,
        position: 'after'
      });

      if (!cancelled) {
        this.dataSource?.reorder(this.#dragItem!, relativeItem!, index === 0 ? 'before' : 'after');
      }
    }
  }

  #onFilterRegister({ target }: SlFilterRegisterEvent & { target: GridFilter<T> }): void {
    this.#filters = [...this.#filters, target];

    if (this.#filterDebounceTimer) {
      clearTimeout(this.#filterDebounceTimer);
    }

    this.#filterDebounceTimer = setTimeout(() => {
      this.#applyFilters(target.active);
      this.#filterDebounceTimer = undefined;
    });
  }

  #onFilterChange(): void {
    this.#applyFilters(true);
  }

  #onGroupSelect(event: SlSelectEvent<boolean>, group: GridViewModelGroup): void {
    const items = this.dataSource?.items ?? [],
      groupItems = items.filter(item => getValueByPath(item, group.path as PathKeys<T>) === group.value);

    if (event.detail) {
      groupItems.forEach(item => this.selection.select(item));
    } else {
      groupItems.forEach(item => this.selection.deselect(item));
    }
  }

  #onGroupToggle(event: SlToggleEvent<boolean>, group: GridViewModelGroup): void {
    this.view.toggleGroup(group.value, event.detail);

    // HACK: force the virtualizer to recalculate the size of the `<tbody>` element. If we
    // don't, then there will be "extra padding" at the bottom of the tbody element.
    // Once there is a better way to do this, remove this hack.

    // @ts-expect-error This is a hack
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.#virtualizer?._layout?._metricsCache?.clear();
  }

  #onScroll(): void {
    const { offsetWidth, scrollLeft, scrollWidth } = this.tbody;

    this.scrollbar = scrollWidth > offsetWidth;
    this.thead.scrollLeft = scrollLeft;

    this.toggleAttribute('scrollable', this.scrollbar);
    this.toggleAttribute('scrollable-start', this.scrollbar && scrollLeft > 0);
    this.toggleAttribute('scrollable-end', this.scrollbar && Math.round(scrollLeft) < scrollWidth - offsetWidth);
  }

  #onSelectionChange(): void {
    this.renderRoot.querySelector<HTMLElement>('[part="bulk-actions"]')?.togglePopover(this.selection.selected > 0);
  }

  #onSkipTo(event: Event & { target: HTMLSlotElement }, destination: string): void {
    // Not all frameworks work well with hash links, so we need to prevent the default behavior and focus the target manually
    event.preventDefault();
    this.table?.scrollIntoView({ behavior: 'instant', block: destination as ScrollLogicalPosition });
    (this.renderRoot.querySelector(`#table-${destination}`) as HTMLLinkElement).focus();
  }

  #onSkipToFocus(e: Event & { target: HTMLSlotElement }, position: 'top' | 'bottom') {
    if (!('anchorName' in document.documentElement.style)) {
      positionPopover(e.target, position === 'top' ? this.thead : this.tfoot, { position: `${position}-start` });
    }
  }

  async #onSlotChange(event: Event & { target: HTMLSlotElement }): Promise<void> {
    const elements = event.target.assignedElements({ flatten: true }),
      columns = elements.filter((el): el is GridColumn<T> => el instanceof GridColumn);

    columns.forEach((col, index) => {
      this.#addScopedElements(col.scopedElements);

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
          col.stickyPosition = columns.at(index - 1)!.stickyPosition;

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
          col.value = value.toString();
        }
      } else if (col instanceof GridSortColumn) {
        const { id, direction } = this.dataSource?.sort || {};
        if (id === col.id) {
          col.direction = direction;
        }
      }
    });

    // Wait for all the columns to update; the column group especially
    // needs time for the slotchange event to fire.
    await Promise.allSettled(columns.map(async col => await col.updateComplete));

    // Cleanup any columns that are no longer in the slot
    this.view.columnDefinitions.forEach(col => {
      if (!columns.includes(col)) {
        this.#removeColumn(col);
      }
    });

    // Update the column definitions
    this.view.columnDefinitions = columns;

    // Recalculate the column widths
    await this.recalculateColumnWidths();
  }

  #onSorterChange({ target }: Event & { target: GridSorter<T> }): void {
    this.#sorters.filter(sorter => sorter !== target).forEach(sorter => sorter.reset());
    this.#applySorters(true);
  }

  #onSorterRegister({ target }: SlSorterRegisterEvent & { target: GridSorter<T> }): void {
    this.#sorters = [...this.#sorters, target];

    if (this.#sorterDebounceTimer) {
      clearTimeout(this.#sorterDebounceTimer);
    }

    this.#sorterDebounceTimer = setTimeout(() => {
      this.#applySorters(this.#sorters.some(s => s.direction));
      this.#sorterDebounceTimer = undefined;
    });
  }

  #addScopedElements(scopedElements?: Record<string, typeof HTMLElement>): void {
    if (scopedElements) {
      for (const [tagName, klass] of Object.entries(scopedElements)) {
        if (!this.registry?.get(tagName)) {
          this.registry?.define(tagName, klass);
        }
      }
    }
  }

  #applyFilters(update = false): void {
    this.#filters.forEach(f => {
      const id = f.column.id,
        empty = (Array.isArray(f.value) && f.value.length === 0) || !f.value;

      if (!empty && (f.filter || f.path)) {
        this.dataSource?.addFilter(id, f.filter! || f.path!, f.value);
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
      // Update the data source in the next frame to avoid multiple Lit update cycles
      requestAnimationFrame(() => this.dataSource?.update());

      this.stateChangeEvent.emit({ grid: this });
    }
  }

  #applySorters(update = false): void {
    const { id } = this.dataSource?.sort ?? {},
      sorter = this.#sorters.find(sorter => !!sorter.direction);

    if (sorter && (sorter.sorter || sorter.path)) {
      this.dataSource?.setSort(sorter.column.id, sorter.sorter! || sorter.path!, sorter.direction ?? 'asc');
    } else if (id && this.#sorters.find(s => s.column.id === id)) {
      this.dataSource?.removeSort();
    } else if (sorter) {
      console.warn(
        `The column ${sorter?.column.id} is missing a sorter or path. Either provide a path or a sorter function, otherwise the sorter cannot not work.`
      );

      this.dataSource?.removeSort();
    }

    if (update) {
      // Update the data source in the next frame to avoid multiple Lit update cycles
      requestAnimationFrame(() => this.dataSource?.update());

      this.stateChangeEvent.emit({ grid: this });
    }
  }

  #removeColumn(col: GridColumn): void {
    if (col instanceof GridSortColumn) {
      this.#sorters = this.#sorters.filter(s => s !== col.sorterElement);
    }

    if (col instanceof GridFilterColumn) {
      this.#filters = this.#filters.filter(f => f !== col.filterElement);
    }
  }

  #updateDataSource(dataSource?: ListDataSource<T>): void {
    this.selection.size = dataSource?.size ?? 0;

    this.#applyFilters();
    this.#applySorters();

    // This will trigger the data source to update
    this.view.dataSource = dataSource;

    this.stateChangeEvent.emit({ grid: this });
  }
}
