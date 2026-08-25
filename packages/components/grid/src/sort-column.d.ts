import {
  type DataSourceSortDirection,
  type DataSourceSortFunction
} from '@sl-design-system/data-source';
import { type PropertyValues, type TemplateResult, nothing } from 'lit';
import { GridColumn } from './column.js';
import { GridSorter } from './sorter.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-grid-sort-column': GridSortColumn;
  }
}
/** A grid column that can be sorted. */
export declare class GridSortColumn<T = any> extends GridColumn<T> {
  #private;
  /** @internal The direction of the sorting */
  ariaSorting?: 'ascending' | 'descending';
  /** @internal */
  get baseScopedElements(): Record<string, typeof HTMLElement>;
  /** The direction this columns should be sorted in. */
  direction?: DataSourceSortDirection;
  /** If you want to provide a custom sort function, you can via this property. */
  sorter?: DataSourceSortFunction<T>;
  /** Returns the element that is rendered in the table header. */
  get sorterElement(): GridSorter | undefined;
  connectedCallback(): void;
  willUpdate(changes: PropertyValues<this>): void;
  stateChanged(): void;
  renderHeaderRow(index: number): TemplateResult | typeof nothing;
}
