import { type ListDataSourceDataItem } from '@sl-design-system/data-source';
import { type TemplateResult } from 'lit';
import { GridColumn } from './column.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-grid-text-field-column': GridTextFieldColumn;
  }
}
export declare class GridTextFieldColumn<T = any> extends GridColumn<T> {
  #private;
  /** @internal */
  get baseScopedElements(): Record<string, typeof HTMLElement>;
  renderData(item: ListDataSourceDataItem<T>): TemplateResult;
}
