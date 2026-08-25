import { type DataSourceFilterFunction } from '@sl-design-system/data-source';
import { type PathKeys } from '@sl-design-system/shared';
import { type PropertyValues, type TemplateResult, nothing } from 'lit';
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
/**
 * A column that can be used to filter the data in the grid. This column extends the sortable
 * column, so it can be used to sort the data as well.
 */
export declare class GridFilterColumn<T = any> extends GridSortColumn<T> {
  #private;
  /** @internal */
  get baseScopedElements(): Record<string, typeof HTMLElement>;
  /** Returns the element that is rendered in the table header. */
  get filterElement(): GridFilter | undefined;
  /** @internal The internal options if none are provided. */
  internalOptions?: GridFilterOption[];
  /** The filter function if you want to do custom filtering. */
  filter?: DataSourceFilterFunction<T>;
  /**
   * The label as it needs to be shown in the filter. Only use this when the label needs to be
   * something else than the column header converted to lowercase (and stripped of any html tags in
   * case of a ColumnHeaderRenderer).
   */
  filterLabel?: string;
  headerRowCount: number;
  /** The path to use for the displayed value in the column. */
  labelPath?: PathKeys<T>;
  /**
   * The mode for the filter: - `select`: The filter will allow you to select from a list of
   * options. If none are provided, the filter will create a list of options based on the column's
   * values - `text`: The filter will be a text field.
   *
   * @type {select | text}
   */
  mode?: GridFilterMode;
  /** The options you can choose from to filter. If not provided, the filter will be a text field. */
  options?: GridFilterOption[];
  /** The value for this filter column. */
  value?: string;
  connectedCallback(): void;
  willUpdate(changes: PropertyValues<this>): void;
  itemsChanged(): void;
  stateChanged(): void;
  renderHeaderRow(index: number): TemplateResult | typeof nothing;
  getDisplayValue(item: T): unknown;
}
