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
import styles from './grid.scss.js';
import { GridColumn } from './column.js';
import { GridColumnGroup } from './column-group.js';

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

  /** Observe the grid width. */
  #resizeObserver?: ResizeObserver;

  /** The sorters for this grid. */
  #sorters: GridSorter[] = [];

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

  /** The `<thead>` element. */
  @query('thead') header!: HTMLTableSectionElement;

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

  override connectedCallback(): void {
    super.connectedCallback();

    this.#resizeObserver = new ResizeObserver(entries => {
      const {
        borderBoxSize: [{ inlineSize }]
      } = entries[0];

      this.style.setProperty('--sl-grid-width', `${inlineSize}px`);
    });

    this.#resizeObserver.observe(this);
  }

  override disconnectedCallback(): void {
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = undefined;

    super.disconnectedCallback();
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

    if (changes.has('dataSource') && this.dataSource) {
      this.dataSource?.addEventListener('sl-update', () => (this.selection.size = this.dataSource?.size ?? 0));
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
          @sl-direction-change=${this.#onDirectionChange}
          @sl-filter-change=${this.#onFilterChange}
          @sl-filter-value-change=${this.#onFilterValueChange}
          @sl-sorter-change=${this.#onSorterChange}
          part="thead"
        >
          ${this.renderHeader()}
        </thead>
        <tbody @scroll=${this.#onScroll} @visibilityChanged=${this.#onVisibilityChanged} part="tbody">
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
              justify-content: ${col.align};
              width: ${col.width || '100'}px;
            }
          `;
        });
      })}
      ${rows[rows.length - 1].map((col, index) => {
        return `
          :where(td, thead tr:last-of-type th):nth-child(${index + 1}) {
            flex-grow: ${col.grow};
            justify-content: ${col.align};
            width: ${col.width || '100'}px;
            ${
              col.sticky
                ? `
                  left: ${this.#getStickyColumnOffset(index)}px;
                  position: sticky;
                `
                : ''
            }
          }
        `;
      })}
    `;
  }

  renderHeader(): TemplateResult {
    const rows = this.#getHeaderRows(this.columns);

    return html`
      ${rows.map(
        row =>
          html`
            <tr>
              ${row.map(col => col.renderHeader())}
            </tr>
          `
      )}
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

    this.requestUpdate('columns');
  }

  #onClickRow(event: Event, item: T): void {
    this.activeItem = item;
    this.activeItemChange.emit(new GridActiveItemChangeEvent(this.activeItem, event));
  }

  #onColumnUpdate(event: Event & { target: GridColumn<T> }): void {
    this.#addScopedElements(event.target);
  }

  #onDirectionChange({ target }: CustomEvent<DataSourceSortDirection | undefined> & { target: GridSorter }): void {
    this.#sorters.filter(sorter => sorter !== target).forEach(sorter => sorter.reset());

    this.#applySorters();
  }

  #onFilterChange({ detail, target }: CustomEvent<GridFilterChange> & { target: GridFilter }): void {
    if (detail === 'added') {
      this.#filters = [...this.#filters, target];
    } else {
      this.#filters = this.#filters.filter(filter => filter !== target);
    }
  }

  #onFilterValueChange(): void {
    this.#applyFilters();
  }

  #onScroll(event: Event & { target: HTMLElement }): void {
    this.header.scrollLeft = event.target.scrollLeft;
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

  #onSorterChange({ detail, target }: CustomEvent<GridSorterChange> & { target: GridSorter }): void {
    if (detail === 'added') {
      this.#sorters = [...this.#sorters, target];
    } else {
      this.#sorters = this.#sorters.filter(sorter => sorter !== target);
    }
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
      .filter(filter => !!filter.value)
      .map(filter => ({ path: filter.column.path || '', value: filter.value }));

    this.dataSource.filterValues = filterValues;
    this.dataSource.update();
    this.requestUpdate();
  }

  #applySorters(): void {
    if (!this.dataSource) {
      return;
    }

    const { column, direction } = this.#sorters.find(sorter => !!sorter.direction) || {};

    if (column?.path && direction) {
      this.dataSource.sortValue = { path: column.path, direction };
    } else {
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
