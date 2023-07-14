import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { GridSorter, GridSorterChange } from './sorter.js';
import type { GridFilter, GridFilterChange } from './filter.js';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import type {
  DataSource,
  DataSourceFilterValue,
  DataSourceSortDirection,
  EventEmitter
} from '@sl-design-system/shared';
import { localized } from '@lit/localize';
import { virtualize } from '@lit-labs/virtualizer/virtualize.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { ArrayDataSource, SelectionController, event } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { GridColumn } from './column.js';
import { GridColumnGroup } from './column-group.js';
import styles from './grid.scss.js';
import { GridSelectionColumn } from './selection-column.js';

export class GridActiveItemChangeEvent<T> extends Event {
  constructor(public readonly item: T, public readonly relatedEvent: Event | null) {
    super('sl-active-item-change', { bubbles: true, composed: true });
  }
}

export type GridItemParts<T> = (model: T) => string | undefined;

@localized()
export class Grid<T extends Record<string, unknown> = Record<string, unknown>> extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {};
  }

  /** @private */
  static override styles: CSSResultGroup = styles;

  /** The filters for this grid. */
  #filters: GridFilter[] = [];

  /** Flag for calculating the column widths only once. */
  #initialColumnWidthsCalculated = false;

  /** Observe the tbody style changes. */
  #mutationObserver?: MutationObserver;

  /** Observe the grid width. */
  #resizeObserver?: ResizeObserver;

  /** The sorters for this grid. */
  #sorters: Array<GridSorter<T>> = [];

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

  /** Emits when the items in the grid have changed. */
  @event() gridItemsChange!: EventEmitter<void>;

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

    this.#mutationObserver = new MutationObserver(() => {
      this.#mutationObserver?.disconnect();

      // This is a workaround for the virtualizer not taking the border width into account
      // We convert the min-height to a CSS variable so we can use it in the styles and
      // add the border-width to the eventual min-height value.
      this.style.setProperty('--sl-grid-tbody-min-height', this.tbody.style.minHeight);
      this.tbody.style.minHeight = '';

      this.#mutationObserver?.observe(this.tbody, { attributes: true, attributeFilter: ['style'] });
    });

    this.#resizeObserver = new ResizeObserver(entries => {
      const {
        contentBoxSize: [{ inlineSize }]
      } = entries[0];

      this.style.setProperty('--sl-grid-width', `${inlineSize}px`);
    });

    this.#resizeObserver.observe(this);
  }

  override firstUpdated(): void {
    this.#mutationObserver?.observe(this.tbody, { attributes: true, attributeFilter: ['style'] });

    this.tbody.addEventListener(
      'scroll',
      () => {
        this.thead.scrollLeft = this.tbody.scrollLeft;
      },
      { passive: true }
    );
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

      // Notify any listeners (columns) that the items have changed
      this.gridItemsChange.emit();
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('dataSource') && this.dataSource) {
      this.dataSource?.addEventListener('sl-update', () => (this.selection.size = this.dataSource?.size ?? 0));
    }
  }

  override disconnectedCallback(): void {
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = undefined;

    super.disconnectedCallback();
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
          @sl-sorter-change=${this.#onSorterChange}
          @sl-sorter-direction-change=${this.#onSorterDirectionChange}
          part="thead"
        >
          ${this.renderHeader()}
        </thead>
        <tbody @visibilityChanged=${this.#onVisibilityChanged} part="tbody">
          ${virtualize({
            items: this.dataSource?.items,
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
              ${rows.at(-1)?.[0].renderHeader()} ${(rows.at(-1)?.[0] as GridSelectionColumn).renderSelectionHeader()}
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
        class=${classMap({ selected })}
        part=${parts.join(' ')}
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
    this.activeItemChange.emit(new GridActiveItemChangeEvent(this.activeItem, event));
  }

  #onColumnUpdate(event: Event & { target: GridColumn<T> }): void {
    this.#addScopedElements(event.target);
  }

  #onFilterChange({ detail, target }: CustomEvent<GridFilterChange> & { target: GridFilter }): void {
    if (detail === 'added') {
      this.#filters = [...this.#filters, target];
    } else {
      this.#filters = this.#filters.filter(filter => filter !== target);
    }

    // If any filter starts out active, we need to apply it
    if (this.#filters.some(filter => filter.active)) {
      this.#applyFilters();
    }
  }

  #onFilterValueChange(): void {
    this.#applyFilters();
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const elements = event.target.assignedElements({ flatten: true }),
      columns = elements.filter((el): el is GridColumn<T> => el instanceof GridColumn);

    columns.forEach(col => {
      col.grid = this;
      this.#addScopedElements(col);
    });

    this.columns = columns;
  }

  #onSorterChange({ detail, target }: CustomEvent<GridSorterChange> & { target: GridSorter<T> }): void {
    if (detail === 'added') {
      this.#sorters = [...this.#sorters, target];
    } else {
      this.#sorters = this.#sorters.filter(sorter => sorter !== target);
    }

    // If any sorter starts out active, sort the grid
    if (this.#sorters.some(sorter => sorter.direction !== undefined)) {
      this.#applySorters();
    }
  }

  #onSorterDirectionChange({
    target
  }: CustomEvent<DataSourceSortDirection | undefined> & { target: GridSorter<T> }): void {
    this.#sorters.filter(sorter => sorter !== target).forEach(sorter => sorter.reset());

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
        if (!this.registry.get(tagName)) {
          this.defineScopedElement(tagName, klass);
        }
      }
    }
  }

  #applyFilters(): void {
    if (!this.dataSource) {
      return;
    }

    const filterValues: DataSourceFilterValue[] = this.#filters
      .filter(filter => (Array.isArray(filter.value) ? filter.value.length > 0 : !!filter.value))
      .map(filter => ({ path: filter.column.path || '', value: filter.value }));

    this.dataSource.filterValues = filterValues;
    this.dataSource.update();
    this.requestUpdate();
  }

  #applySorters(): void {
    if (!this.dataSource) {
      return;
    }

    const sorter = this.#sorters.find(sorter => !!sorter.direction);

    if (sorter) {
      this.dataSource.sortFunction = sorter.sort;
      this.dataSource.sortValue = { path: sorter.column.path, direction: sorter.direction! };
    } else {
      this.dataSource.sortFunction = undefined;
      this.dataSource.sortValue = undefined;
    }

    this.dataSource.update();
    this.requestUpdate();
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
