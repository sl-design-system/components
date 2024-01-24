import { getValueByPath } from '@sl-design-system/shared';
import { TextField } from '@sl-design-system/text-field';
import { type TemplateResult, html } from 'lit';
import { GridColumn } from './column.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GridTextFieldColumn<T = any> extends GridColumn<T> {
  override connectedCallback(): void {
    super.connectedCallback();

    this.scopedElements = { ...this.scopedElements, 'sl-text-field': TextField };
  }

  override renderData(item: T): TemplateResult {
    return html`
      <td part="data text-field">
        <sl-text-field .value=${getValueByPath(item, this.path)}></sl-text-field>
      </td>
    `;
  }
}
