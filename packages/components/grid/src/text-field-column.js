import { getValueByPath, setValueByPath } from '@sl-design-system/shared';
import { TextField } from '@sl-design-system/text-field';
import { html } from 'lit';
import { GridColumn } from './column.js';
export class GridTextFieldColumn extends GridColumn {
  /** @internal */
  get baseScopedElements() {
    return { 'sl-text-field': TextField };
  }
  renderData(item) {
    return html`
      <td part="data text-field">
        <sl-text-field
          @sl-change=${event => this.#onChange(event, item.data)}
          aria-label=${this.getFormControlLabel(item.data)}
          .value=${getValueByPath(item.data, this.path)}></sl-text-field>
      </td>
    `;
  }
  #onChange(event, item) {
    setValueByPath(item, this.path, event.detail);
  }
}
//# sourceMappingURL=text-field-column.js.map
