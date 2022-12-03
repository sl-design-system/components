import type { TemplateResult } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { Checkbox } from '@sanomalearning/slds-core/checkbox';
import { html } from 'lit';
import { GridColumn } from './column.js';

export class GridSelectionColumn extends ScopedElementsMixin(GridColumn) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-checkbox': Checkbox
    };
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.grow = 0;
  }

  override renderHeader(): TemplateResult {
    return html`<th><sl-checkbox></sl-checkbox></th>`;
  }

  override renderData(): TemplateResult {
    return html`<td><sl-checkbox></sl-checkbox></td>`;
  }
}
