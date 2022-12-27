import type { TemplateResult } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { getNameByPath } from '@sanomalearning/slds-core/utils';
import { html } from 'lit';
import { GridColumn } from './column.js';
import { GridFilter } from './filter.js';

export class GridFilterColumn extends ScopedElementsMixin(GridColumn) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-grid-filter': GridFilter
    };
  }

  override renderHeader(): TemplateResult {
    return html`
      <th>
        <sl-grid-filter .column=${this}>${this.header ?? getNameByPath(this.path)}</sl-grid-filter>
      </th>
    `;
  }
}
