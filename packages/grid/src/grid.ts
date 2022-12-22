import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { GridSorter, GridSorterChange } from './sorter.js';
import type { DataSource, DataSourceSortDirection } from '@sanomalearning/slds-core/utils/data-source';
import { ArrayDataSource } from '@sanomalearning/slds-core/utils/data-source';
import { virtualize } from '@lit-labs/virtualizer/virtualize.js';
import { SelectionController } from '@sanomalearning/slds-core/utils/controllers';
import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './grid.scss.js';
import { GridColumn } from './column.js';

export class Grid<T extends { [x: string]: unknown } = Record<string, unknown>> extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Flag for calculating the column widths only once. */
  #initialColumnWidthsCalculated = false;

  /** The sorters for this grid. */
  #sorters: GridSorter[] = [];

  /** Selection manager. */
  readonly selection = new SelectionController<T>(this);

  /** The columns in the grid. */
  @state() columns: Array<GridColumn<T>> = [];

  /** Provide your own implementation for getting the data. */
  @property({ attribute: false }) dataSource?: DataSource<T>;

  /** An array of items to be displayed in the grid. */
  @property() items?: T[];

  /** Hide the border around the grid when true. */
  @property({ type: Boolean, reflect: true, attribute: 'no-border' }) noBorder?: boolean;

  /** Hides the border between rows when true. */
  @property({ type: Boolean, reflect: true, attribute: 'no-row-border' }) noRowBorder?: boolean;

  /** Uses alternating background colors for the rows when set. */
  @property({ type: Boolean, reflect: true }) striped?: boolean;

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
      this.dataSource?.addEventListener('update', () => (this.selection.size = this.dataSource?.size ?? 0));
    }
  }

  override render(): TemplateResult {
    return html`
      <slot @slotchange=${this.#onSlotchange} style="display:none"></slot>
      <style>
        ${this.columns.map((col, index) => {
          return `
            :where(td, th):nth-child(${index + 1}) {
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
      </style>
      <table>
        <thead @directionChange=${this.#onDirectionChange} @sorterChange=${this.#onSorterChange}>
          <tr>
            ${this.columns.map(col => col.renderHeader())}
          </tr>
        </thead>
        <tbody @visibilityChanged=${this.#onVisibilityChanged}>
          ${virtualize({
            items: this.dataSource?.items,
            renderItem: (item, index) => this.renderItem(item, index)
          })}
        </tbody>
        <tfoot></tfoot>
      </table>
    `;
  }

  renderItem(item: T, index: number): TemplateResult {
    const selected = this.selection.isSelected(item);

    return html`
      <tr class=${classMap({ selected })} part="row ${index % 2 === 0 ? 'odd' : 'even'} ${selected ? 'selected' : ''}">
        ${this.columns.map(col => col.renderData(item))}
      </tr>
    `;
  }

  /** Updates the `width` of all columns which have `autoWidth` set to `true`. */
  async recalculateColumnWidths(): Promise<void> {
    // Do not remove, this is needed; not sure why
    await this.updateComplete;

    this.columns
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

  #onDirectionChange({ target }: CustomEvent<DataSourceSortDirection | undefined> & { target: GridSorter }): void {
    this.#sorters.filter(sorter => sorter !== target).forEach(sorter => sorter.reset());

    this.#applySorters();
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const elements = event.target.assignedElements({ flatten: true }),
      columns = elements.filter((el): el is GridColumn<T> => el instanceof GridColumn);

    columns.forEach(col => (col.grid = this));

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

  #applySorters(): void {
    if (!this.dataSource) {
      return;
    }

    const { direction, path } = this.#sorters.find(sorter => !!sorter.direction) || {};

    if (direction && path) {
      this.dataSource.sortValue = { path, direction };
    } else {
      this.dataSource.sortValue = undefined;
    }

    this.dataSource.update();
    this.requestUpdate();
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
