import type { TemplateResult } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { getNameByPath } from '@sanomalearning/slds-core/utils';
import { html } from 'lit';
import { GridColumn } from './column.js';
import { GridSorter } from './sorter.js';

export class GridSortColumn extends ScopedElementsMixin(GridColumn) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
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
