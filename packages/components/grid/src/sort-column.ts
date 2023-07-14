import type { TemplateResult } from 'lit';
import type { DataSourceSortDirection, DataSourceSortFunction } from '@sl-design-system/shared';
import { getNameByPath } from '@sl-design-system/shared';
import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { GridColumn } from './column.js';
import { GridSorter } from './sorter.js';

export class GridSortColumn<T> extends GridColumn {
  /** The direction this columns should be sorted in. */
  @property({ type: String }) direction?: DataSourceSortDirection;

  /** If you want to provide a custom sort function, you can via this property. */
  @property({ attribute: false }) sort?: DataSourceSortFunction<T>;

  override connectedCallback(): void {
    super.connectedCallback();

    this.scopedElements = { ...this.scopedElements, 'sl-grid-sorter': GridSorter };
  }

  override renderHeader(): TemplateResult {
    return html`
      <th part="header sort">
        <sl-grid-sorter .column=${this} .direction=${this.direction} .sort=${this.sort}>
          ${this.header ?? getNameByPath(this.path)}
        </sl-grid-sorter>
      </th>
    `;
  }
}
