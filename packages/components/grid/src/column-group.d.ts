import { type PropertyValues, type TemplateResult, nothing } from 'lit';
import { GridColumn } from './column.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-grid-column-group': GridColumnGroup;
  }
}
export declare class GridColumnGroup<T = any> extends GridColumn<T> {
  #private;
  /** The nested columns in the group. */
  columns: Array<GridColumn<T>>;
  set width(value: number);
  /** The width of the group column is either manually specified, or the sum of the nested columns. */
  get width(): number;
  willUpdate(changes: PropertyValues<this>): void;
  render(): TemplateResult;
  renderHeaderRow(index: number): TemplateResult | typeof nothing;
}
