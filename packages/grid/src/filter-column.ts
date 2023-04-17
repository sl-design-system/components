import type { TemplateResult } from 'lit';
import { getNameByPath } from '@sanomalearning/slds-core/utils';
import { html } from 'lit';
import { GridColumn } from './column.js';
import { GridFilter } from './filter.js';

export class GridFilterColumn extends GridColumn {
  override connectedCallback(): void {
    super.connectedCallback();

    this.scopedElements = { 'sl-grid-filter': GridFilter };
  }

  override renderHeader(): TemplateResult {
    return html`
      <th>
        <sl-grid-filter .column=${this}>${this.header ?? getNameByPath(this.path)}</sl-grid-filter>
      </th>
    `;
  }
}
