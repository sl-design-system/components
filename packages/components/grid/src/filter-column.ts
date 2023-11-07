import type { TemplateResult } from 'lit';
import type { DataSourceFilterFunction } from '@sl-design-system/shared';
import { getNameByPath, getValueByPath } from '@sl-design-system/shared';
import { localized, msg } from '@lit/localize';
import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { GridColumn } from './column.js';
import { GridFilter } from './filter.js';

export type GridFilterMode = 'select' | 'text';

export interface GridFilterOption {
  label: string;
  value?: unknown;
}

let nextUniqueId = 0;

@localized()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GridFilterColumn<T = any> extends GridColumn<T> {
  /** The internal options if none are provided. */
  @state() internalOptions?: GridFilterOption[];

  /** The filter function if you want to do custom filtering. */
  @state() filter?: DataSourceFilterFunction<T>;

  /**
   * The mode for the filter:
   * - `select`: The filter will allow you to select from a list of options. If none
   * are provided, the filter will create a list of options based on the column's values
   * - `text`: The filter will be a text field.
   *
   * @type {select | text}
   */
  @property({ type: String }) mode?: GridFilterMode;

  /**
   * The options you can choose from to filter. If not provided,
   * the filter will be a text field.
   */
  @property({ attribute: false }) options?: GridFilterOption[];

  /** The value for this filter column. */
  @property({ type: String }) value?: string | string[];

  override connectedCallback(): void {
    super.connectedCallback();

    this.id ||= `grid-filter-${nextUniqueId++}`;
    this.scopedElements = { ...this.scopedElements, 'sl-grid-filter': GridFilter };
  }

  override itemsChanged(): void {
    super.itemsChanged();

    if (this.mode !== 'text' && typeof this.options === 'undefined') {
      // No options were provided, so we'll create a list of options based on the column's values
      this.internalOptions = this.grid?.dataSource?.items
        ?.reduce((acc, item) => {
          let value = getValueByPath(item, this.path),
            label = value?.toString() ?? '';

          if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
            label = msg('Blank');
            value = '';
          }

          if (value !== null && !acc.some(option => option.value === value)) {
            acc.push({ label, value });
          }

          return acc;
        }, [] as GridFilterOption[])
        .sort((a, b) => a.label.localeCompare(b.label));
    }
  }

  override stateChanged(): void {
    super.stateChanged();

    const filter = this.grid?.dataSource?.filters.get(this.id);
    this.value = filter ? filter.value : undefined;
  }

  override renderHeader(): TemplateResult {
    const parts = ['header', 'filter', ...this.getParts()];

    return html`
      <th part=${parts.join(' ')}>
        <sl-grid-filter
          .column=${this}
          .mode=${this.mode || 'select'}
          .options=${this.options ?? this.internalOptions}
          .path=${this.path}
          .value=${this.value}
        >
          ${this.header ?? getNameByPath(this.path)}
        </sl-grid-filter>
      </th>
    `;
  }
}
