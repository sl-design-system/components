import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import {
  ListDataSource,
  type ListDataSourceDataItem,
  type ListDataSourceGroupItem,
  type ListDataSourceItem
} from '@sl-design-system/data-source';
import { type EventEmitter } from '@sl-design-system/shared';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  nothing
} from 'lit';
import { GridColumn } from './column.js';
import { GridViewModel } from './view-model.js';
declare global {
  interface GlobalEventHandlersEventMap {
    'sl-grid-active-row-change': SlActiveRowChangeEvent;
    'sl-grid-dragstart': SlDragStartEvent;
    'sl-grid-dragend': SlDragEndEvent;
    'sl-grid-drop': SlDropEvent;
    'sl-grid-selection-change': SlSelectionChangeEvent;
    'sl-grid-state-change': SlStateChangeEvent;
  }
  interface HTMLElementTagNameMap {
    'sl-grid': Grid;
  }
}
/** Callback method for setting the parts on the `<tr>` for this item. */
export type GridItemParts<T> = (item: T) => string | undefined;
/**
 * Indicates how rows can be dragged in the grid. - `between`: Rows can be dragged between other
 * rows; useful for reordering - `on-top`: Rows can be dragged on top of other rows; useful for
 * grouping - `between-or-on-top`: Rows can be dragged between or on top of other rows; which one is
 * determined by the dropFilter function - `on-grid`: Rows can be dragged anywhere on the grid
 */
export type GridDraggableRows = 'between' | 'on-top' | 'between-or-on-top' | 'on-grid';
export type GridDropFilter<T = any> = (item: T) => boolean | 'between' | 'on-top';
export interface GridGroupHeaderRendererOptions {
  expanded?: boolean;
  selectable?: boolean;
  selected: 'all' | 'some' | 'none';
}
export type GridGroupHeaderRenderer = (
  group: ListDataSourceGroupItem,
  options?: GridGroupHeaderRendererOptions
) => TemplateResult;
export type SlActiveRowChangeEvent<T = any> = CustomEvent<T | undefined>;
export type SlDragStartEvent<T = any> = CustomEvent<{
  grid: Grid<T>;
  item: ListDataSourceItem<T>;
}>;
export type SlDragEndEvent<T = any> = CustomEvent<{
  grid: Grid<T>;
  item: ListDataSourceItem<T>;
}>;
export type SlDropEvent<T = any> = CustomEvent<{
  grid: Grid<T>;
  item: ListDataSourceItem<T>;
  relativeItem?: T;
  position: 'before' | 'after' | 'on-grid' | 'on-top';
}>;
export type SlSelectionChangeEvent<T = any> = CustomEvent<{
  grid: Grid<T>;
}>;
export type SlStateChangeEvent<T = any> = CustomEvent<{
  grid: Grid<T>;
}>;
declare const Grid_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
export declare class Grid<T = any> extends Grid_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  /** The current active row. */
  activeRow?: T;
  /** @internal Emits when the active row has changed. */
  activeRowChangeEvent: EventEmitter<SlActiveRowChangeEvent<T>>;
  get dataSource(): ListDataSource<T> | undefined;
  /** Provide your own implementation for getting the data. */
  set dataSource(dataSource: ListDataSource<T> | undefined);
  /**
   * Whether you can drag rows in the grid. If you use the drag-handle column, then this property is
   * automatically set by the column to 'between'.
   */
  draggableRows?: GridDraggableRows;
  /** @internal Emits when a drag operation is starting. */
  dragStartEvent: EventEmitter<SlDragStartEvent<T>>;
  /** @internal Emits when a drag operation has finished. */
  dragEndEvent: EventEmitter<SlDragEndEvent<T>>;
  /** @internal Emits when an item has been dropped. */
  dropEvent: EventEmitter<SlDropEvent<T>>;
  /**
   * Determines if or what kind of drop target the given item is: - boolean: the item is valid drop
   * target based on the draggableRows value - 'between': the item is a valid drop target between -
   * 'on-top': the item is a valid drop target to drop on top of
   */
  dropFilter?: GridDropFilter;
  /** @internal Provides clarity when 'between-or-on-top' is the active draggableRows value. */
  dropTargetMode?: 'between' | 'on-grid' | 'on-top';
  /** This will ellipsize the text in the `<td>` elements if it overflows. */
  ellipsizeText?: boolean;
  /** Custom renderer for group headers. */
  groupHeaderRenderer?: GridGroupHeaderRenderer;
  /** An array of items to be displayed in the grid. */
  items?: T[];
  /** Custom parts to be set on the `<tr>` so it can be styled externally. */
  itemParts?: GridItemParts<T>;
  /** Hide the border around the grid when true. */
  noBorder?: boolean;
  /**
   * Hide the skip links. Use when there are not tab stops in the table or the table only has a few
   * rows with limited tab stops.
   */
  noSkipLinks?: boolean;
  /** Hides the border between rows when true. */
  noRowBorder?: boolean;
  /**
   * This indicates the behavior when a user clicks on a row. This does not include the selection
   * column. If you don't want a click on a particular interactive element to trigger this behavior,
   * please use `preventDefault()` and `stopPropagation()` to stop that from happening.
   *
   * @default undefined
   */
  rowAction?: 'activate' | 'select';
  /**
   * The custom elements used for rendering this grid. This can be used if you want to render custom
   * elements in the group header. Custom elements that you want to render in the columns can be
   * registered via the `scopedElements` property on the column.
   */
  scopedElements?: Record<string, typeof HTMLElement>;
  /** @internal Will render a custom horizontal scrollbar when set. */
  scrollbar?: boolean;
  /** @internal Emits when the selection in the grid changes. */
  selectionChangeEvent: EventEmitter<SlSelectionChangeEvent<T>>;
  /**
   * The selection mode for the grid. If you are using a `ListDataSource`, you should set the
   * selection mode on the data source instead of on the grid. If you are using the `items`
   * property, then you need to set the selection mode on the grid itself.
   *
   * @default undefined
   */
  selects?: 'single' | 'multiple';
  /** @internal Emits when the state in the grid has changed. */
  stateChangeEvent: EventEmitter<SlStateChangeEvent<T>>;
  /** Uses alternating background colors for the rows when set. */
  striped?: boolean;
  /** The table body element. */
  tbody: HTMLTableSectionElement;
  /** The table head element. */
  thead: HTMLTableSectionElement;
  /** The table element. */
  table: HTMLTableElement;
  /** The table foot element. */
  tfoot: HTMLTableSectionElement;
  /** The model used for rendering the grid. */
  view: GridViewModel<T>;
  connectedCallback(): void;
  disconnectedCallback(): void;
  firstUpdated(): Promise<void>;
  willUpdate(changes: PropertyValues<this>): void;
  render(): TemplateResult;
  renderStyles(): TemplateResult | typeof nothing;
  renderHeaderRow(columns: GridColumn[]): TemplateResult;
  renderItem(item: ListDataSourceItem<T>, index: number): TemplateResult;
  renderItemRow(item: ListDataSourceDataItem<T>, index: number): TemplateResult;
  renderGroupRow(item: ListDataSourceGroupItem<T>, index: number): TemplateResult;
  /** Updates the `width` of all columns which have `autoWidth` set to `true`. */
  recalculateColumnWidths(): Promise<void>;
}
export {};
