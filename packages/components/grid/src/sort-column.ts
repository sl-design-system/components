import { type DataSourceSortDirection, type DataSourceSortFunction, getNameByPath } from '@sl-design-system/shared';
import { type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { GridColumn } from './column.js';
import { GridSorter } from './sorter.js';

let nextUniqueId = 0;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GridSortColumn<T = any> extends GridColumn<T> {
  /** The direction this columns should be sorted in. */
  @property({ type: String }) direction?: DataSourceSortDirection;

  /** If you want to provide a custom sort function, you can via this property. */
  @property({ attribute: false }) sorter?: DataSourceSortFunction<T>;

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
  }

  override renderHeader(): TemplateResult {
    const parts = ['header', 'sort', ...this.getParts()];

    return html`
      <th part=${parts.join(' ')}>
        <sl-grid-sorter .column=${this} .direction=${this.direction} .path=${this.path} .sorter=${this.sorter}>
          ${this.header ?? getNameByPath(this.path)}
        </sl-grid-sorter>
      </th>
    `;
  }
}
