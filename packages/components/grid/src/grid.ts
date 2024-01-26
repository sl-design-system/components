import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { GridSorter, GridSorterChange } from './sorter.js';
import type { GridFilter, GridFilterChange } from './filter.js';
import type { Virtualizer } from '@lit-labs/virtualizer/Virtualizer.js';
import type { ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import type { DataSource, EventEmitter } from '@sl-design-system/shared';
import { localized } from '@lit/localize';
import { flow } from '@lit-labs/virtualizer/layouts/flow.js';
import { virtualize, virtualizerRef } from '@lit-labs/virtualizer/virtualize.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { ArrayDataSource, SelectionController, event, isSafari } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { GridColumn } from './column.js';
import { GridColumnGroup } from './column-group.js';
import styles from './grid.scss.js';
import { GridSelectionColumn } from './selection-column.js';
import { GridActiveItemChangeEvent, GridEvent, GridItemDropEvent, GridItemEvent } from './events.js';
import { GridFilterColumn } from './filter-column.js';
import { GridSortColumn } from './sort-column.js';

export type GridItemParts<T> = (model: T) => string | undefined;

/**
 * Indicates how rows can be dragged in the grid.
 * - `between`: Rows can be dragged between other rows; useful for reordering
 * - `on-top`: Rows can be dragged on top of other rows; useful for grouping
 * - `between-or-on-top`: Rows can be dragged between or on top of other rows
 * - `on-grid`: Rows can be dragged anywhere in the grid
 */
export type GridDraggableRows = 'between' | 'on-top' | 'between-or-on-top' | 'on-grid';

export type GridDropFilter<T> = (item: T) => boolean | 'between' | 'on-top';

@localized()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Grid<T = any> extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {};
  }

  /** @private */
  static override styles: CSSResultGroup = styles;

  /** The item being dragged. */
  #dragItem?: T;

  /** The placeholder element where the drag item will be dropped. */
  #dropPlaceholder?: HTMLElement;

  /** The mode if the drag item is dropped on the current target. */
  #dropTargetMode?: 'between' | 'on-top';

  /** The filters for this grid. */
  #filters: Array<GridFilter<T>> = [];

  /** Flag for calculating the column widths only once. */
  #initialColumnWidthsCalculated = false;

  /** The layout used by virtualizer. */
  #layout = flow();

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

  /** Observe the grid width. */
  #resizeObserver = new ResizeObserver(entries => {
    const {
      contentBoxSize: [{ inlineSize }]
    } = entries[0];

    this.style.setProperty('--sl-grid-width', `${inlineSize}px`);
  });

  /** The sorters for this grid. */
  #sorters: Array<GridSorter<T>> = [];

  /** The virtualizer instance. */
  #virtualizer?: Virtualizer;

  /** Selection manager. */
  readonly selection = new SelectionController<T>(this);

  /** The active item in the grid. */
  @state() activeItem?: T;

  /** Emits when the active item changes */
  @event() activeItemChange!: EventEmitter<GridActiveItemChangeEvent<T>>;

  /** The columns in the grid. */
  @state() columns: Array<GridColumn<T>> = [];

  /** Provide your own implementation for getting the data. */
  @property({ attribute: false }) dataSource?: DataSource<T>;

  /**
   * Whether you can drag rows in the grid. If you use the drag-handle column,
   * then this property is automatically set by the column to 'between'.
   */
  @property({ attribute: 'draggable-rows' }) draggableRows?: GridDraggableRows;

  /**
   * Determines if or what kind of drop target the given item is:
   * - boolean: the item is valid drop target based on the draggableRows value
   * - 'between': the item is a valid drop target between
   * - 'on-top': the item is a valid drop target to drop on top of
   */
  @property({ attribute: false }) dropFilter?: GridDropFilter<T>;

  /** Emits when a drag operation is starting. */
  @event() gridDragstart!: EventEmitter<GridEvent<T>>;

  /** Emits when a drag operation has finished. */
  @event() gridDragend!: EventEmitter<GridEvent<T>>;

  /** Emits when an item has been dropped. */
  @event() gridDrop!: EventEmitter<GridEvent<T>>;

  /** Emits when the items in the grid have changed. */
  @event() gridItemsChange!: EventEmitter<GridEvent<T>>;

  /** Emits when the state in the grid has changed. */
  @event() gridStateChange!: EventEmitter<GridEvent<T>>;

  /** An array of items to be displayed in the grid. */
  @property({ type: Array }) items?: T[];

  /** Custom parts to be set on the `<tr>` so it can be styled externally. */
  @property({ attribute: false }) itemParts?: GridItemParts<T>;

  /** Hide the border around the grid when true. */
  @property({ type: Boolean, reflect: true, attribute: 'no-border' }) noBorder?: boolean;

  /** Hides the border between rows when true. */
  @property({ type: Boolean, reflect: true, attribute: 'no-row-border' }) noRowBorder?: boolean;

  /** Uses alternating background colors for the rows when set. */
  @property({ type: Boolean, reflect: true }) striped?: boolean;

  /** The `<tbody>` element. */
  @query('tbody') tbody!: HTMLTableSectionElement;

  /** The `<thead>` element. */
  @query('thead') thead!: HTMLTableSectionElement;

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.#dropPlaceholder) {
      this.#dropPlaceholder = document.createElement('div');
      this.#dropPlaceholder.classList.add('drop-placeholder');
      this.#dropPlaceholder.addEventListener('dragover', event => event.preventDefault());
      this.#dropPlaceholder.addEventListener('drop', () => this.#onDropOnPlaceholder());
    }

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
    this.#virtualizer = this.tbody[
      virtualizerRef as unknown as keyof HTMLTableSectionElement
    ] as unknown as Virtualizer;
    this.#virtualizer.disconnected();
    this.#virtualizer.connected();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    if (changes.has('items')) {
      if (this.items) {
        this.dataSource = new ArrayDataSource(this.items);
        this.selection.size = this.dataSource.size;
      } else {
        this.dataSource = undefined;
        this.selection.size = 0;
      }
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('dataSource')) {
      this.dataSource?.addEventListener('sl-update', () => {
        this.selection.size = this.dataSource?.size ?? 0;
        this.requestUpdate();
      });

      this.#applyFilters();
      this.#applySorters();
    }
  }

  override render(): TemplateResult {
    return html`
      <slot @sl-column-update=${this.#onColumnUpdate} @slotchange=${this.#onSlotchange} style="display:none"></slot>
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
            items: this.dataSource?.filteredItems,
            layout: this.#layout,
            renderItem: (item, index) => this.renderItem(item, index)
          })}
        </tbody>
      </table>
    `;
  }

  renderStyles(): TemplateResult {
    const rows = this.#getHeaderRows(this.columns);

    return html`
      ${rows.slice(0, -1).map((row, rowIndex) => {
        return row.map((col, colIndex) => {
          return `
            thead tr:nth-child(${rowIndex + 1}) th:nth-child(${colIndex + 1}) {
              flex-grow: ${(col as GridColumnGroup<T>).columns.length};
              inline-size: ${col.width || '100'}px;
              justify-content: ${col.align};
              ${col.renderStyles()?.toString() ?? ''}
            }
          `;
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
                  inset-inline-start: ${this.#getStickyColumnOffset(index)}px;
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
    const rows = this.#getHeaderRows(this.columns),
      showSelectionHeader =
        this.selection.size > 0 &&
        (this.selection.areSomeSelected() || this.selection.areAllSelected()) &&
        rows.at(-1)?.[0] instanceof GridSelectionColumn;

    return html`
      ${rows.slice(0, -1).map(
        row => html`
          <tr>
            ${row.map(col => col.renderHeader())}
          </tr>
        `
      )}
      ${showSelectionHeader
        ? html`
            <tr>
              ${rows.at(-1)?.[0].renderHeader()} ${(rows.at(-1)?.[0] as GridSelectionColumn<T>).renderSelectionHeader()}
            </tr>
          `
        : html`
            <tr>
              ${rows.at(-1)?.map(col => col.renderHeader())}
            </tr>
          `}
    `;
  }

  renderItem(item: T, index: number): TemplateResult {
    const rows = this.#getHeaderRows(this.columns),
      selected = this.selection.isSelected(item),
      parts = [
        'row',
        index % 2 === 0 ? 'odd' : 'even',
        ...(selected ? ['selected'] : []),
        ...(this.itemParts?.(item)?.split(' ') || [])
      ];

    return html`
      <tr
        @click=${(event: Event) => this.#onClickRow(event, item)}
        @dragstart=${(event: DragEvent) => this.#onDragstart(event, item)}
        @dragenter=${(event: DragEvent) => this.#onDragenter(event, item)}
        @dragover=${(event: DragEvent) => this.#onDragover(event, item)}
        @dragend=${(event: DragEvent) => this.#onDragend(event, item)}
        @drop=${(event: DragEvent) => this.#onDrop(event, item)}
        class=${classMap({ selected })}
        part=${parts.join(' ')}
        index=${index}
      >
        ${rows[rows.length - 1].map(col => col.renderData(item))}
      </tr>
    `;
  }

  /** Updates the `width` of all columns which have `autoWidth` set to `true`. */
  async recalculateColumnWidths(): Promise<void> {
    // Do not remove, this is needed; not sure why
    await this.updateComplete;

    const rows = this.#getHeaderRows(this.columns);

    rows[rows.length - 1]
      .filter(col => !col.hidden && col.autoWidth)
      .forEach(col => {
        const index = this.columns.indexOf(col),
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
    const rowWidth = this.columns.reduce((acc, cur) => acc + Number(cur?.width ?? 0), 0);
    this.style.setProperty('--sl-grid-row-width', `${rowWidth}px`);

    this.requestUpdate('columns');
  }

  #onClickRow(event: Event, item: T): void {
    this.activeItem = item;
    this.activeItemChange.emit(new GridActiveItemChangeEvent(this, this.activeItem, event));
  }

  #onColumnUpdate(event: Event & { target: GridColumn<T> }): void {
    this.#addScopedElements(event.target);
  }

  #onDragstart(event: DragEvent, item: T): void {
    event.stopPropagation();

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

    event.dataTransfer!.effectAllowed = 'move';
    event.dataTransfer!.setData('application/json', JSON.stringify(item));

    // This is necessary for the dragged item to appear correctly in Safari
    event.dataTransfer!.setDragImage(row, event.clientX - rowRect.left, event.clientY - rowRect.top);

    this.#dragItem = item;
    this.#dropPlaceholder!.style.height = `${rowRect.height}px`;

    this.gridDragstart.emit(new GridItemEvent('sl-grid-dragstart', this, item));
  }

  #onDragenter(event: DragEvent, item: T): void {
    if (this.#dragItem === item) {
      return;
    }

    if (this.draggableRows !== 'on-grid') {
      const dropFilter = this.dropFilter?.(item) ?? true;
      if (!dropFilter) {
        // Prevent the item from being dropped here
        event.preventDefault();
      }

      if (this.draggableRows === 'between-or-on-top') {
        this.#dropTargetMode = typeof dropFilter === 'boolean' ? 'between' : dropFilter;
      } else {
        this.#dropTargetMode = this.draggableRows;
      }
    }
  }

  #onDragover(event: DragEvent, item: T): void {
    event.preventDefault();

    if (this.draggableRows === 'on-grid') {
      return;
    }

    const row = event.composedPath().find((el): el is HTMLTableRowElement => el instanceof HTMLTableRowElement);

    if (row && this.#dragItem === item) {
      row.style.height = '0px';
      row.style.opacity = '0';
    }

    if (!row?.classList.contains('drop-target')) {
      this.renderRoot
        .querySelector('tr:where(.drop-target, .drop-target-above, .drop-target-below, .drop-target-on-top)')
        ?.classList.remove('drop-target', 'drop-target-above', 'drop-target-below', 'drop-target-on-top');

      row?.classList.add('drop-target');
    }

    if (
      this.draggableRows === 'between' ||
      (this.draggableRows === 'between-or-on-top' && this.#dropTargetMode === 'between')
    ) {
      const { top, height } = row!.getBoundingClientRect(),
        y = event.clientY;

      // If the cursor is in the top half of the row, make this row the drop target
      if (y < top + height / 2) {
        row?.before(this.#dropPlaceholder!);
      } else {
        row?.after(this.#dropPlaceholder!);
      }
    } else if (
      this.draggableRows === 'on-top' ||
      (this.draggableRows === 'between-or-on-top' && this.#dropTargetMode === 'on-top')
    ) {
      row?.classList.add('drop-target-on-top');
    }
  }

  #onDragend(event: DragEvent, item: T): void {
    const row = event.composedPath().find((el): el is HTMLTableRowElement => el instanceof HTMLTableRowElement);

    row!.removeAttribute('draggable');
    row!.style.height = '';
    row!.style.opacity = '';

    this.renderRoot
      .querySelector('tr:where(.drop-target, .drop-target-above, .drop-target-below)')
      ?.classList.remove('drop-target', 'drop-target-above', 'drop-target-below');

    this.#dragItem = undefined;
    this.#dropPlaceholder?.remove();

    this.gridDragend.emit(new GridItemEvent('sl-grid-dragend', this, item));
  }

  #onDrop(event: DragEvent, item: T): void {
    const row = event.composedPath().find((el): el is HTMLTableRowElement => el instanceof HTMLTableRowElement),
      oldIndex = this.dataSource!.filteredItems.indexOf(this.#dragItem!);

    let newIndex = parseInt(row!.getAttribute('index')!);

    if (
      this.draggableRows === 'between' ||
      (this.draggableRows === 'between-or-on-top' && this.#dropTargetMode === 'between')
    ) {
      const { top, height } = row!.getBoundingClientRect(),
        y = event.clientY;

      // If the cursor is in the bottom half of the row, increase the index by 1
      newIndex += y < top + height / 2 ? 0 : 1;
    }

    if (oldIndex < newIndex) {
      newIndex--;
    }

    this.gridDrop.emit(new GridItemDropEvent(this, item, oldIndex, newIndex));
  }

  #onDropOnPlaceholder(): void {
    const oldIndex = this.dataSource!.filteredItems.indexOf(this.#dragItem!);

    let newIndex = -1;
    if (this.#dropPlaceholder!.previousElementSibling) {
      newIndex = parseInt(this.#dropPlaceholder!.previousElementSibling.getAttribute('index')!) + 1;
    } else if (this.#dropPlaceholder!.nextElementSibling) {
      newIndex = parseInt(this.#dropPlaceholder!.nextElementSibling.getAttribute('index')!);
    }

    if (oldIndex < newIndex) {
      newIndex--;
    }

    this.gridDrop.emit(new GridItemDropEvent(this, this.#dragItem!, oldIndex, newIndex));
  }

  #onFilterChange({ detail, target }: CustomEvent<GridFilterChange> & { target: GridFilter<T> }): void {
    if (detail === 'added') {
      this.#filters = [...this.#filters, target];
    } else {
      this.#filters = this.#filters.filter(filter => filter !== target);
    }

    this.#applyFilters();
  }

  #onFilterValueChange(): void {
    this.#applyFilters();
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const elements = event.target.assignedElements({ flatten: true }),
      columns = elements.filter((el): el is GridColumn<T> => el instanceof GridColumn);

    columns.forEach(col => {
      this.#addScopedElements(col);

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

    this.columns = columns;
  }

  #onSortDirectionChange({ target }: Event & { target: GridSorter<T> }): void {
    this.#sorters.filter(sorter => sorter !== target).forEach(sorter => sorter.reset());
    this.#applySorters();
  }

  #onSorterChange({ detail, target }: CustomEvent<GridSorterChange> & { target: GridSorter<T> }): void {
    if (detail === 'added') {
      this.#sorters = [...this.#sorters, target];
    } else {
      this.#sorters = this.#sorters.filter(sorter => sorter !== target);
    }

    this.#applySorters();
  }

  #onVisibilityChanged(): void {
    if (!this.#initialColumnWidthsCalculated) {
      this.#initialColumnWidthsCalculated = true;

      void this.recalculateColumnWidths();
    }
  }

  #addScopedElements(col: GridColumn<T>): void {
    if (col.scopedElements) {
      for (const [tagName, klass] of Object.entries(col.scopedElements)) {
        if (!this.registry?.get(tagName)) {
          this.registry?.define(tagName, klass);
        }
      }
    }
  }

  #applyFilters(): void {
    if (!this.dataSource) {
      return;
    }

    this.#filters.forEach(f => {
      const id = f.column.id,
        empty = (Array.isArray(f.value) && f.value.length === 0) || !f.value;

      if (!empty && (f.path || f.filter)) {
        this.dataSource?.addFilter(id, f.path! || f.filter!, f.value);
      } else {
        this.dataSource?.removeFilter(id);
      }
    });

    this.dataSource.update();
    this.requestUpdate();
    this.gridStateChange.emit(new GridEvent('sl-grid-state-change', this));
  }

  #applySorters(): void {
    if (!this.dataSource) {
      return;
    }

    const { id } = this.dataSource.sort ?? {},
      sorter = this.#sorters.find(sorter => !!sorter.direction);

    if (sorter) {
      this.dataSource.setSort(sorter.column.id, sorter.path! || sorter.sorter!, sorter.direction!);
    } else if (id && this.#sorters.find(s => s.column.id === id)) {
      this.dataSource.removeSort();
    }

    this.dataSource.update();
    this.requestUpdate();
    this.gridStateChange.emit(new GridEvent('sl-grid-state-change', this));
  }

  #getHeaderRows(columns: Array<GridColumn<T>>): Array<Array<GridColumn<T>>> {
    const children = columns
      .filter((col): col is GridColumnGroup<T> => col instanceof GridColumnGroup)
      .reduce((acc: Array<Array<GridColumn<T>>>, cur) => {
        return [...acc, ...this.#getHeaderRows(cur.columns)];
      }, []);

    return children.length ? [[...columns], children.flat(2)] : [[...columns]];
  }

  #getStickyColumnOffset(index: number): number {
    return this.columns
      .slice(0, index)
      .filter(col => !col.hidden)
      .reduce((acc, { width = 0 }) => {
        return acc + width;
      }, 0);
  }
}
