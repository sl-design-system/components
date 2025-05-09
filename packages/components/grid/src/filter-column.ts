import { localized, msg } from '@lit/localize';
import { type DataSourceFilterFunction, FetchListDataSourcePlaceholder } from '@sl-design-system/data-source';
import { type Path, type PathKeys, getValueByPath } from '@sl-design-system/shared';
import { type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { type Ref, createRef, ref } from 'lit/directives/ref.js';
import { GridFilter } from './filter.js';
import { GridSortColumn } from './sort-column.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-grid-filter-column': GridFilterColumn;
  }
}

export type GridFilterMode = 'date' | 'date-range' | 'select' | 'text';

export interface GridFilterOption {
  label: string;
  value?: unknown;
}

let nextUniqueId = 0;

/**
 * A column that can be used to filter the data in the grid. This column extends
 * the sortable column, so it can be used to sort the data as well.
 */
@localized()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GridFilterColumn<T = any> extends GridSortColumn<T> {
  /** Reference to the rendered `<sl-grid-filter>` element. */
  #filterRef: Ref<GridFilter> = createRef();

  /** Returns the element that is rendered in the table header. */
  get filterElement(): GridFilter | undefined {
    return this.#filterRef.value;
  }

  /** @internal The internal options if none are provided. */
  @state() internalOptions?: GridFilterOption[];

  /** The filter function if you want to do custom filtering. */
  @property({ attribute: false }) filter?: DataSourceFilterFunction<T>;

  /** The label as it needs to be shown in the filter. Only use this when the label needs to be something else than the column header converted to lowercase (and stripped of any html tags in case of a ColumnHeaderRenderer). */
  @property({ type: String, attribute: 'filter-label' }) filterLabel?: string;

  override headerRowCount = 2;

  /** The path to use for the displayed value in the column. */
  @property({ attribute: 'label-path' }) labelPath?: PathKeys<T>;

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
  @property({ type: String }) value?: string;

  override connectedCallback(): void {
    super.connectedCallback();

    this.id ||= `grid-filter-${nextUniqueId++}`;
    this.scopedElements = { ...this.scopedElements, 'sl-grid-filter': GridFilter };
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('options') && this.#filterRef.value) {
      this.#filterRef.value.options = this.options;
    }

    if (changes.has('value') && this.#filterRef.value) {
      this.#filterRef.value.value = this.value;
    }
  }

  override itemsChanged(): void {
    super.itemsChanged();

    if (this.mode === 'select' && typeof this.options === 'undefined') {
      const dataSource = this.grid?.dataSource;

      // No options were provided, so we'll create a list of options based on the column's values
      this.internalOptions = dataSource?.originalItems
        ?.reduce((acc, item) => {
          let value = getValueByPath(item, this.path!),
            label = (this.labelPath ? getValueByPath(item, this.labelPath)?.toString() : value?.toString()) ?? '';

          if (value === null || value === undefined || value?.toString().trim() === '') {
            label = msg('Blank');
            value = '' as Path<T, PathKeys<T>>;
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

    this.value = filter ? filter.value?.toString() : undefined;
  }

  override renderHeaderRow(index: number): TemplateResult | typeof nothing {
    const parts = ['header', 'filter', ...this.getParts()];

    if (index === 0) {
      return super.renderHeaderRow(index);
    } else if (index === 1) {
      return html`
        <th part=${parts.join(' ')} role="columnheader" scope="col">
          <sl-grid-filter
            ${ref(this.#filterRef)}
            .column=${this}
            .filter=${this.filter}
            .filterLabel=${this.filterLabel}
            .mode=${this.mode || 'text'}
            .options=${this.options ?? this.internalOptions}
            .path=${this.path}
            .value=${this.value}
          >
          </sl-grid-filter>
        </th>
      `;
    }

    return nothing;
  }

  override getDisplayValue(item: T): unknown {
    if (this.renderer || item === FetchListDataSourcePlaceholder || !this.labelPath) {
      return super.getDisplayValue(item);
    } else {
      return getValueByPath(item, this.labelPath);
    }
  }
}
