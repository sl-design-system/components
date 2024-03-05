import { getValueByPath, setValueByPath } from '@sl-design-system/shared';
import { Select, SelectOption } from '@sl-design-system/select';
import { type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { GridColumn } from './column.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GridSelectColumn<T = any> extends GridColumn<T> {
  /** The options for the select. */
  @property({ type: Array }) options?: Array<{ label: string; value: unknown }> | string[];

  override connectedCallback(): void {
    super.connectedCallback();

    this.scopedElements = { ...this.scopedElements, 'sl-select': Select, 'sl-select-option': SelectOption };
  }

  override renderData(item: T): TemplateResult {
    return html`
      <td part="data select">
        <sl-select
          @sl-change=${(event: CustomEvent<unknown>) => this.#onChange(event, item)}
          .value=${getValueByPath(item, this.path)}
        >
          ${this.options?.map(option =>
            typeof option === 'string'
              ? html`<sl-select-option .value=${option}>${option}</sl-select-option>`
              : html`<sl-select-option .value=${option.value}>${option.label}</sl-select-option>`
          )}
        </sl-select>
      </td>
    `;
  }

  #onChange(event: CustomEvent<unknown>, item: T): void {
    setValueByPath(item, this.path, event.detail);
  }
}
