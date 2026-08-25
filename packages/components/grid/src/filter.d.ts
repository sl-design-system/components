import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type DataSourceFilterFunction } from '@sl-design-system/data-source';
import { type EventEmitter, type PathKeys } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult } from 'lit';
import { type GridColumn } from './column.js';
import { type GridFilterMode, type GridFilterOption } from './filter-column.js';
declare global {
  interface GlobalEventHandlersEventMap {
    'sl-filter-change': SlFilterChangeEvent;
    'sl-filter-register': SlFilterRegisterEvent;
  }
  interface HTMLElementTagNameMap {
    'sl-grid-filter': GridFilter;
  }
}
export type SlFilterChangeEvent<T = any> = CustomEvent<{
  column: GridColumn<T>;
  value?: string | string[];
}>;
export type SlFilterRegisterEvent = CustomEvent<void>;
declare const GridFilter_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
export declare class GridFilter<T = any> extends GridFilter_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  /**
   * Whether the grid is currently being filtered by this column.
   *
   * @internal
   */
  active: boolean;
  /** The grid column. */
  column: GridColumn<T>;
  /** The custom filter */
  filter?: DataSourceFilterFunction<T>;
  /** @internal Emits when the value of the filter has changed. */
  filterChangeEvent: EventEmitter<SlFilterChangeEvent<T>>;
  /** @internal Emits when the filter has been connected. */
  filterRegisterEvent: EventEmitter<SlFilterRegisterEvent>;
  /** The mode of the filter. */
  mode?: GridFilterMode;
  /** The filter options. */
  options?: GridFilterOption[];
  /** The path to the field to filter on. */
  path?: PathKeys<T>;
  /**
   * The label as it needs to be shown in the filter. Only use this when the label needs to be
   * something else than the column header converted to lowercase (and stripped of any html tags in
   * case of a ColumnHeaderRenderer).
   */
  filterLabel?: string;
  get value(): string | string[] | undefined;
  set value(value: string | undefined);
  connectedCallback(): void;
  render(): TemplateResult;
}
export {};
