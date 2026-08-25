import { type ListDataSourceDataItem } from '@sl-design-system/data-source';
import { type TemplateResult } from 'lit';
import { GridColumn } from './column.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-grid-select-column': GridSelectColumn;
  }
}
export declare class GridSelectColumn<T = any> extends GridColumn<T> {
  #private;
  /** @internal */
  get baseScopedElements(): Record<string, typeof HTMLElement>;
  /** The options for the select. */
  options?:
    | Array<{
        label: string;
        value: any;
      }>
    | string[];
  renderData(item: ListDataSourceDataItem<T>): TemplateResult;
}
