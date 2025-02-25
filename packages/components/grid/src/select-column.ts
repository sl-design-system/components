import { Option } from '@sl-design-system/listbox';
import { Select } from '@sl-design-system/select';
import { type Path, type PathKeys, getValueByPath, setValueByPath } from '@sl-design-system/shared';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { GridColumn } from './column.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-grid-select-column': GridSelectColumn;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GridSelectColumn<T = any> extends GridColumn<T> {
  /** The options for the select. */
  @property({ type: Array }) options?: Array<{ label: string; value: unknown }> | string[];

  override connectedCallback(): void {
    super.connectedCallback();

    this.scopedElements = { ...this.scopedElements, 'sl-select': Select, 'sl-option': Option };
  }

  override renderData(item: T): TemplateResult {
    return html`
      <td part="data select delegate-focus">
        <sl-select
          @sl-change=${(event: SlChangeEvent) => this.#onChange(event, item)}
          .value=${getValueByPath(item, this.path!)}
        >
          ${this.options?.map(option =>
            typeof option === 'string'
              ? html`<sl-option .value=${option}>${option}</sl-option>`
              : html`<sl-option .value=${option.value}>${option.label}</sl-option>`
          )}
        </sl-select>
      </td>
    `;
  }

  #onChange(event: SlChangeEvent, item: T): void {
    setValueByPath(item, this.path!, event.detail as Path<T, PathKeys<T>>);
  }
}
