import { type ListDataSourceDataItem } from '@sl-design-system/data-source';
import { type Path, type PathKeys, getValueByPath, setValueByPath } from '@sl-design-system/shared';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
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

  override renderData(item: ListDataSourceDataItem<T>): TemplateResult {
    return html`
      <td part="data text-field">
        <sl-text-field
          @sl-change=${(event: SlChangeEvent<string>) => this.#onChange(event, item.item)}
          .value=${getValueByPath(item.item, this.path!)}
        ></sl-text-field>
      </td>
    `;
  }

  #onChange(event: SlChangeEvent<string>, item: T): void {
    setValueByPath(item, this.path!, event.detail as Path<T, PathKeys<T>>);
  }
}
