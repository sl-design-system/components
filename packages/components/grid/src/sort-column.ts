import type { TemplateResult } from 'lit';
import { getNameByPath } from '@sl-design-system/shared';
import { html } from 'lit';
import { GridColumn } from './column.js';
import { GridSorter } from './sorter.js';

export class GridSortColumn extends GridColumn {
  override connectedCallback(): void {
    super.connectedCallback();

    this.scopedElements = {
      'sl-grid-sorter': GridSorter
    };
  }

  override renderHeader(): TemplateResult {
    return html`
      <th>
        <sl-grid-sorter .column=${this}>${this.header ?? getNameByPath(this.path)}</sl-grid-sorter>
      </th>
    `;
  }
}
