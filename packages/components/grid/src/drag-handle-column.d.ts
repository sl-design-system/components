import { type ListDataSourceDataItem } from '@sl-design-system/data-source';
import { type PropertyValues, type TemplateResult } from 'lit';
import { GridColumn } from './column.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-grid-drag-handle-column': GridDragHandleColumn;
  }
}
/**
 * A grid column that can be used to drag and drop rows.
 *
 * If you want drag and drop behavior to be conditional, you can use the `path` property to specify
 * a path to a value in the data item. If the value at that path is truthy, the row will be
 * draggable. If the value is falsy, the row will not be draggable.
 */
export declare class GridDragHandleColumn<T = any> extends GridColumn<T> {
  #private;
  /** @internal */
  get baseScopedElements(): Record<string, typeof HTMLElement>;
  connectedCallback(): void;
  willUpdate(changes: PropertyValues<this>): void;
  renderHeaderRow(): TemplateResult;
  renderData(item: ListDataSourceDataItem<T>): TemplateResult;
}
