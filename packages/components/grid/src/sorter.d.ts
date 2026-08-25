import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import {
  type DataSourceSortDirection,
  type DataSourceSortFunction
} from '@sl-design-system/data-source';
import { type EventEmitter } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult } from 'lit';
import { type GridColumn } from './column.js';
declare global {
  interface GlobalEventHandlersEventMap {
    'sl-sorter-change': SlSorterChangeEvent;
    'sl-sorter-register': SlSorterRegisterEvent;
  }
  interface HTMLElementTagNameMap {
    'sl-grid-sorter': GridSorter;
  }
}
export type SlSorterChangeEvent<T = any> = CustomEvent<{
  column: GridColumn<T>;
  direction?: DataSourceSortDirection;
}>;
export type SlSorterRegisterEvent = CustomEvent<void>;
declare const GridSorter_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
/** Component that is used as the column header for a sortable column. */
export declare class GridSorter<T = any> extends GridSorter_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  /** The grid column. */
  column: GridColumn<T>;
  /** The direction in which to sort the items. */
  direction?: DataSourceSortDirection;
  /** The path to the field to sort on. */
  path?: string;
  /** An optional custom sort function. */
  sorter?: DataSourceSortFunction<T>;
  /** @internal Emits when the direction has changed. */
  sorterChangeEvent: EventEmitter<SlSorterChangeEvent<T>>;
  /** @internal Emits when the sorter has been added or removed. */
  sorterRegisterEvent: EventEmitter<SlSorterRegisterEvent>;
  connectedCallback(): void;
  render(): TemplateResult;
  /**
   * Resets the sorter to its initial state. This does not emit a change event. It is used
   * internally by the grid component to reset the sorter.
   */
  reset(): void;
}
export {};
