import { type ListDataSourceDataItem } from '@sl-design-system/data-source';
import { type PropertyValues, type TemplateResult, nothing } from 'lit';
import { GridColumn } from './column.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-grid-selection-column': GridSelectionColumn;
  }
}
/** A grid column that can be used to select items in the grid. */
export declare class GridSelectionColumn<T = any> extends GridColumn<T> {
  #private;
  /** @internal */
  get baseScopedElements(): Record<string, typeof HTMLElement>;
  /** Set this property to true to select all rows in the grid. */
  selectAll?: boolean;
  connectedCallback(): void;
  willUpdate(changes: PropertyValues<this>): void;
  renderHeaderRow(index: number): TemplateResult | typeof nothing;
  renderData(item: ListDataSourceDataItem<T>): TemplateResult;
}
