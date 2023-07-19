import type { PropertyValues, TemplateResult } from 'lit';
import { getNameByPath, getValueByPath } from '@sl-design-system/shared';
import { localized, msg } from '@lit/localize';
import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { GridColumn, GridColumnEvent } from './column.js';
import { GridFilter } from './filter.js';

export type GridFilterMode = 'select' | 'text';

export interface GridFilterOption {
  label: string;
  value?: unknown;
}

export class GridFilterValueChangeEvent<T = unknown> extends GridColumnEvent<T> {
  constructor(column: GridColumn<T>, public readonly value: string | string[] | undefined) {
    super('sl-filter-value-change', column);
  }
}

@localized()
export class GridFilterColumn<T = unknown> extends GridColumn<T> {
  /** The internal options if none are provided. */
  @state() internalOptions?: GridFilterOption[];

  /**
   * The mode for the filter:
   * - `select`: The filter will allow you to select from a list of options. If none
   * are provided, the filter will create a list of options based on the column's values
   * - `text`: The filter will be a text input.
   *
   * @type {select | text}
   */
  @property({ type: String }) mode?: GridFilterMode;

  /**
   * The options you can choose from to filter. If not provided,
   * the filter will be a text input.
   */
  @property({ attribute: false }) options?: GridFilterOption[];

  /** The value for this filter column. */
  @property({ type: String }) value?: string | string[];

  override connectedCallback(): void {
    super.connectedCallback();

    this.scopedElements = { ...this.scopedElements, 'sl-grid-filter': GridFilter };
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('grid')) {
      this.itemsChanged();
    }
  }

  override itemsChanged(): void {
    super.itemsChanged();

    if (this.mode !== 'text' && typeof this.options === 'undefined') {
      // No options were provided, so we'll create a list of options based on the column's values
      this.internalOptions = this.grid?.items
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

  override renderHeader(): TemplateResult {
    return html`
      <th part="header filter">
        <sl-grid-filter
          .column=${this}
          .mode=${this.mode || 'select'}
          .options=${this.options ?? this.internalOptions}
          .value=${this.value}
        >
          ${this.header ?? getNameByPath(this.path)}
        </sl-grid-filter>
      </th>
    `;
  }
}
