import { getValueByPath, setValueByPath } from '@sl-design-system/shared';
import { TextField } from '@sl-design-system/text-field';
import { type TemplateResult, html } from 'lit';
import { GridColumn } from './column.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-grid-text-field-column': GridTextFieldColumn;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GridTextFieldColumn<T = any> extends GridColumn<T> {
  override connectedCallback(): void {
    super.connectedCallback();

    this.scopedElements = { ...this.scopedElements, 'sl-text-field': TextField };
  }

  override renderData(item: T): TemplateResult {
    return html`
      <td part="data text-field delegate-focus">
        <sl-text-field
          @sl-change=${(event: CustomEvent<string>) => this.#onChange(event, item)}
          .value=${getValueByPath(item, this.path)}
          tabindex="-1"
        ></sl-text-field>
      </td>
    `;
  }

  #onChange(event: CustomEvent<string>, item: T): void {
    setValueByPath(item, this.path, event.detail);
  }
}
