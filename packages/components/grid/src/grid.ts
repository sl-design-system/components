/* eslint-disable lit/prefer-static-styles */
import { localized } from '@lit/localize';
import { type VirtualizerHostElement, virtualize, virtualizerRef } from '@lit-labs/virtualizer/virtualize.js';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import {
  ArrayDataSource,
  type DataSource,
  type EventEmitter,
  SelectionController,
  event,
  getValueByPath,
  isSafari
} from '@sl-design-system/shared';
import { type SlSelectEvent, type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { styleMap } from 'lit/directives/style-map.js';
import { type Virtualizer } from 'node_modules/@lit-labs/virtualizer/Virtualizer.js';
import { GridColumnGroup } from './column-group.js';
import { GridColumn } from './column.js';
import { GridFilterColumn } from './filter-column.js';
import { type GridFilter, type SlFilterChangeEvent } from './filter.js';
import styles from './grid.scss.js';
import { GridGroupHeader } from './group-header.js';
import { GridSelectionColumn } from './selection-column.js';
import { GridSortColumn } from './sort-column.js';
import { type GridSorter, type SlSorterChangeEvent } from './sorter.js';
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
export type SlActiveItemChangeEvent<T = any> = CustomEvent<{ grid: Grid<T>; item: T; relatedEvent?: Event }>;

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Grid<T = any> extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-grid-group-header': GridGroupHeader
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The item being dragged. */
  #dragItem?: T;

  /** The filters for this grid. */
  #filters: Array<GridFilter<T>> = [];

  /** Flag for calculating the column widths only once. */
  #initialColumnWidthsCalculated = false;

  /** The item before the dragged item when dragging started. */
  #itemBeforeDragItem?: T;

  /** Observe the tbody style changes. */
  #mutationObserver = new MutationObserver(() => {
    this.#mutationObserver?.disconnect();

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
  });

  /** The sorters for this grid. */
  #sorters: Array<GridSorter<T>> = [];

  /** The virtualizer instance for the grid. */
  #virtualizer?: Virtualizer;

  /** Selection manager. */
  readonly selection = new SelectionController<T>(this);

  /** The active item in the grid. */
  @state() activeItem?: T;

  /** @internal Emits when the active item changes */
  @event({ name: 'sl-active-item-change' }) activeItemChangeEvent!: EventEmitter<SlActiveItemChangeEvent<T>>;

  /** Provide your own implementation for getting the data. */
  @property({ attribute: false }) dataSource?: DataSource;

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

  /**
   * Determines if or what kind of drop target the given item is:
   * - boolean: the item is valid drop target based on the draggableRows value
   * - 'between': the item is a valid drop target between
   * - 'on-top': the item is a valid drop target to drop on top of
   */
  @property({ attribute: false }) dropFilter?: GridDropFilter;

  /** @internal Provides clarity when 'between-or-on-top' is the active draggableRows value. */
  @property({ reflect: true, attribute: 'drop-target-mode' }) dropTargetMode?: 'between' | 'on-grid' | 'on-top';

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

  /** @internal Emits when the state in the grid has changed. */
  @event({ name: 'sl-grid-state-change' }) stateChangeEvent!: EventEmitter<SlStateChangeEvent<T>>;

  /** Uses alternating background colors for the rows when set. */
  @property({ type: Boolean, reflect: true }) striped?: boolean;

  /** The table body element. */
  @query('tbody') tbody!: HTMLTableSectionElement;

  /** The table head element. */
  @query('thead') thead!: HTMLTableSectionElement;

  /** The model used for rendering the grid. */
  @property({ attribute: false }) view = new GridViewModel<T>(this);

  override connectedCallback(): void {
    super.connectedCallback();

    this.#resizeObserver.observe(this);
  }

  override disconnectedCallback(): void {
    this.#resizeObserver?.disconnect();
    this.#mutationObserver?.disconnect();

    super.disconnectedCallback();
  }

  override async firstUpdated(): Promise<void> {
    this.#mutationObserver?.observe(this.tbody, { attributes: true, attributeFilter: ['style'] });

    this.tbody.addEventListener(
      'scroll',
      () => {
        this.thead.scrollLeft = this.tbody.scrollLeft;
      },
      { passive: true }
    );

    // Workaround for https://github.com/lit/lit/issues/4232
    await new Promise(resolve => requestAnimationFrame(resolve));

    const host = this.tbody as VirtualizerHostElement;
    this.#virtualizer = host[virtualizerRef] as Virtualizer;
    this.#virtualizer?.disconnected();
    this.#virtualizer?.connected();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    console.log('changes in willChange', changes);
    if (changes.has('dataSource')) {
      this.#updateDataSource(this.dataSource);
    }

    if (changes.has('items')) {
      if (this.dataSource) {
        this.dataSource.items = this.items ?? [];
      } else {
        this.dataSource = this.items ? new ArrayDataSource(this.items) : undefined;
      }

      this.#updateDataSource(this.dataSource);
    }

    if (changes.has('scopedElements')) {
      this.#addScopedElements(this.scopedElements);
    }
  }

  override render(): TemplateResult {
    console.log('in grid render', this.items, this.dataSource);
    return html`
      <slot @sl-column-update=${this.#onColumnUpdate} @slotchange=${this.#onSlotChange} style="display:none"></slot>
      <style>
        ${this.renderStyles()}
      </style>
      <table part="table">
        <thead
          @sl-filter-change=${this.#onFilterChange}
          @sl-filter-value-change=${this.#onFilterValueChange}
          @sl-sort-direction-change=${this.#onSortDirectionChange}
          @sl-sorter-change=${this.#onSorterChange}
          part="thead"
        >
          ${this.renderHeader()}
        </thead>
        <tbody @visibilityChanged=${this.#onVisibilityChanged} part="tbody">
          ${virtualize({
            items: this.view.rows,
            renderItem: (item, index) => this.renderItem(item, index)
          })}
        </tbody>
      </table>
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
              justify-content: ${col.align};
              ${col.renderStyles()?.toString() ?? ''}
            }
            `
            : nothing;
        });
      })}
      ${rows[rows.length - 1].map((col, index) => {
        return `
          :where(td, thead tr:last-of-type th):nth-child(${index + 1}) {
            flex-grow: ${col.grow};
            inline-size: ${col.width || '100'}px;
            justify-content: ${col.align};
            ${
              col.sticky
                ? `
              inset-inline-start: ${this.view.getStickyColumnOffset(index)}px;
              position: sticky;
              `
                : ''
            }
            ${col.renderStyles()?.toString() ?? ''}
          }
          `;
      })}
    `;
  }

  renderHeader(): TemplateResult {
    const rows = this.view.headerRows,
      selectionColumn = rows.at(-1)?.find((col): col is GridSelectionColumn => col instanceof GridSelectionColumn),
      showSelectionHeader =
        selectionColumn &&
        this.selection.size > 0 &&
        (this.selection.areSomeSelected() || this.selection.areAllSelected());
    return html`
      ${rows.slice(0, -1).map(
        row => html`
          <tr>
            ${repeat(
              row,
              col => col.path,
              col => col.renderHeader()
            )}
          </tr>
        `
      )}
      ${showSelectionHeader
        ? html`
            <tr>
              ${selectionColumn.renderHeader()} ${selectionColumn.renderSelectionHeader()}
            </tr>
          `
        : nothing}
      <tr style=${styleMap({ display: showSelectionHeader ? 'none' : '' })}>
        ${repeat(
          rows.at(-1) ?? [],
          col => col.path,
          col => col.renderHeader()
        )}
      </tr>
    `;
  }

  renderItem(item: T, index: number): TemplateResult {
    return item instanceof GridViewModelGroup ? this.renderGroupRow(item, index) : this.renderItemRow(item, index);
  }

  renderItemRow(item: T, index: number): TemplateResult {
    const rows = this.view.headerRows,
      selected = this.selection.isSelected(item),
      parts = [
        'row',
        index % 2 === 0 ? 'odd' : 'even',
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
        class=${classMap({ selected })}
        part=${parts.join(' ')}
        index=${index}
      >
        ${rows[rows.length - 1].map(col => col.renderData(item))}
      </tr>
    `;
  }

  renderGroupRow(group: GridViewModelGroup, index: number): TemplateResult {
    const expanded = this.view.getGroupState(group.value),
      selectable = !!this.view.columns.find(col => col instanceof GridSelectionColumn),
      selected = this.view.getGroupSelection(group.value);

    return html`
      <tr part="group" index=${index}>
        <td part="group-header">
          <sl-grid-group-header
            @sl-select=${(event: SlSelectEvent<boolean>) => this.#onGroupSelect(event, group)}
            @sl-toggle=${(event: SlToggleEvent<boolean>) => this.#onGroupToggle(event, group)}
            .expanded=${expanded}
            .selectable=${selectable}
            .selected=${selected}
          >
            ${this.groupHeaderRenderer?.(group) ?? html`<span part="group-heading">${group.value}</span>`}
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
          cells = this.renderRoot.querySelectorAll<HTMLElement>(`:where(td, th):nth-child(${index + 1})`);
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

    this.requestUpdate();
  }

  #onClickRow(event: Event, item: T): void {
    this.activeItem = item;
    this.activeItemChangeEvent.emit({ grid: this, item: this.activeItem, relatedEvent: event });
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

    if (this.draggableRows === 'between-or-on-top') {
      const dropFilter = this.dropFilter?.(item) ?? true;

      this.dropTargetMode = typeof dropFilter === 'boolean' ? 'between' : dropFilter;
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

  #onFilterChange({ detail, target }: SlFilterChangeEvent & { target: GridFilter<T> }): void {
    if (detail === 'added') {
      this.#filters = [...this.#filters, target];
    } else {
      this.#filters = this.#filters.filter(filter => filter !== target);
    }

    this.#applyFilters(true);
  }

  #onFilterValueChange(): void {
    this.#applyFilters(true);
  }

  #onGroupSelect(event: SlSelectEvent<boolean>, group: GridViewModelGroup): void {
    const items = this.dataSource?.filteredItems ?? [],
      groupItems = items.filter(item => getValueByPath(item, group.path) === group.value);

    if (event.detail) {
      groupItems.forEach(item => this.selection.select(item as T));
    } else {
      groupItems.forEach(item => this.selection.deselect(item as T));
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

  async #onSlotChange(event: Event & { target: HTMLSlotElement }): Promise<void> {
    const elements = event.target.assignedElements({ flatten: true }),
      columns = elements.filter((el): el is GridColumn<T> => el instanceof GridColumn);

    columns.forEach(col => {
      this.#addScopedElements(col.scopedElements);

      col.grid = this;

      if (this.dataSource) {
        col.itemsChanged();
      }

      if (col instanceof GridFilterColumn) {
        const { value } = this.dataSource?.filters.get(col.id) || {};
        if (value) {
          col.value = value;
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

    this.view.columnDefinitions = columns;
  }

  #onSortDirectionChange({ target }: Event & { target: GridSorter<T> }): void {
    this.#sorters.filter(sorter => sorter !== target).forEach(sorter => sorter.reset());
    this.#applySorters(true);
  }

  #onSorterChange({ detail, target }: SlSorterChangeEvent & { target: GridSorter<T> }): void {
    if (detail === 'added') {
      this.#sorters = [...this.#sorters, target];
    } else {
      this.#sorters = this.#sorters.filter(sorter => sorter !== target);
    }

    this.#applySorters(true);
  }

  #onVisibilityChanged(): void {
    if (!this.#initialColumnWidthsCalculated) {
      this.#initialColumnWidthsCalculated = true;

      void this.recalculateColumnWidths();
    }
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

      if (!empty && (f.path || f.filter)) {
        this.dataSource?.addFilter(id, f.path! || f.filter!, f.value);
      } else {
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

    if (sorter) {
      this.dataSource?.setSort(sorter.column.id, sorter.path! || sorter.sorter!, sorter.direction!);
    } else if (id && this.#sorters.find(s => s.column.id === id)) {
      this.dataSource?.removeSort();
    }

    if (update) {
      // Update the data source in the next frame to avoid multiple Lit update cycles
      requestAnimationFrame(() => this.dataSource?.update());

      this.stateChangeEvent.emit({ grid: this });
    }
  }

  #updateDataSource(dataSource?: DataSource<T>): void {
    this.view.dataSource = dataSource;
    this.selection.size = dataSource?.size ?? 0;

    this.#applyFilters();
    this.#applySorters();

    dataSource?.update();
    this.stateChangeEvent.emit({ grid: this });
  }
}
