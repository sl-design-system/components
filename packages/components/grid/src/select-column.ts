import { type ListDataSourceDataItem } from '@sl-design-system/data-source';
import { Option } from '@sl-design-system/listbox';
import { Select } from '@sl-design-system/select';
import { type Path, type PathKeys, getValueByPath, setValueByPath } from '@sl-design-system/shared';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { GridColumn } from './column.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-grid-select-column': GridSelectColumn;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GridSelectColumn<T = any> extends GridColumn<T> {
  /** @internal */
  override get baseScopedElements(): Record<string, typeof HTMLElement> {
    return {
      'sl-option': Option,
      'sl-select': Select
    };
  }

  /** The options for the select. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @property({ type: Array }) options?: Array<{ label: string; value: any }> | string[];

  override renderData(item: ListDataSourceDataItem<T>): TemplateResult {
    const classes = this.getClasses(item.data),
      labelledBy =
        this.groupHeaderIds.length > 0
          ? [...this.groupHeaderIds, this.headerCellId].join(' ')
          : undefined;

    return html`
      <td
        aria-colindex=${String(this.columnIndex)}
        aria-labelledby=${ifDefined(labelledBy)}
        class=${ifDefined(classes.join(' ') || undefined)}
        data-grid-column=${this.headerCellId}
        headers=${this.headerIds}
        part="data select delegate-focus"
        role=${this.grid?.keyboardNavigation === 'arrows' ? 'gridcell' : nothing}>
        <sl-select
          @sl-change=${(event: SlChangeEvent) => this.#onChange(event, item.data)}
          aria-label=${this.getFormControlLabel(item.data)}
          .value=${getValueByPath(item.data, this.path!)}>
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
