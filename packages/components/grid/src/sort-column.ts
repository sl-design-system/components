import { type DataSourceSortDirection, type DataSourceSortFunction } from '@sl-design-system/data-source';
import { getNameByPath } from '@sl-design-system/shared';
import { type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { GridColumn } from './column.js';
import { GridSorter } from './sorter.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-grid-sort-column': GridSortColumn;
  }
}

let nextUniqueId = 0;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GridSortColumn<T = any> extends GridColumn<T> {
  /** The direction this columns should be sorted in. */
  @property({ type: String }) direction?: DataSourceSortDirection;

  /** If you want to provide a custom sort function, you can via this property. */
  @property({ attribute: false }) sorter?: DataSourceSortFunction<T>;

  /** The direction of the sorting */
  @property({ attribute: false }) ariaSorting?: 'ascending' | 'descending';

  override connectedCallback(): void {
    super.connectedCallback();

    this.id ||= `grid-sort-${nextUniqueId++}`;
    this.scopedElements = { ...this.scopedElements, 'sl-grid-sorter': GridSorter };
  }

  override stateChanged(): void {
    super.stateChanged();

    const sort = this.grid?.dataSource?.sort;
    if (sort?.id === this.id) {
      this.direction = sort.direction;
    } else {
      this.direction = undefined;
    }

    if (!this.direction) {
      this.ariaSorting = undefined;
    } else {
      this.ariaSorting = this.direction === 'asc' ? 'ascending' : 'descending';
    }
  }

  override renderHeader(): TemplateResult {
    const parts = ['header', 'sort', ...this.getParts()];

    return html`
      <th part=${parts.join(' ')} aria-sort=${ifDefined(this.ariaSorting)} role="columnheader" scope="col">
        <sl-grid-sorter .column=${this} .direction=${this.direction} .path=${this.path} .sorter=${this.sorter}>
          ${this.header ?? getNameByPath(this.path)}
        </sl-grid-sorter>
      </th>
    `;
  }
}
