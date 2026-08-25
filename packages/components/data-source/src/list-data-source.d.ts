import { type PathKeys } from '@sl-design-system/shared';
import {
  DataSource,
  type DataSourceFilter,
  type DataSourceFilterFunction,
  type DataSourceSort,
  type DataSourceSortDirection,
  type DataSourceSortFunction
} from './data-source.js';
export type ListDataSourceItemType = 'data' | 'group';
export interface ListDataSourceItemBase {
  id: unknown;
  type: ListDataSourceItemType;
}
export interface ListDataSourceGroupItem<T = any> extends ListDataSourceItemBase {
  type: 'group';
  count?: number;
  label?: string;
  members?: Array<ListDataSourceDataItem<T>>;
  selected?: 'all' | 'some' | 'none';
  /** The number of items in the group. */
  size?: number;
}
export interface ListDataSourceDataItem<T = any> extends ListDataSourceItemBase {
  type: 'data';
  data: T;
  group?: ListDataSourceGroupItem<T>;
  groupId?: unknown;
  selected?: boolean;
}
/** Union type that represents all possible item types in the data source */
export type ListDataSourceItem<T = any> = ListDataSourceGroupItem<T> | ListDataSourceDataItem<T>;
export interface ListDataSourceMapping<T> {
  /**
   * Returns a unique identifier for the group the item belongs to. Use this if the group cannot
   * easily be derived from the item itself. If it can, use the `groupBy` option instead.
   */
  getGroupId?(item: T): unknown;
  /**
   * Returns a unique identifier for the item in the list. If not provided, the item itself will be
   * used as the identifier.
   */
  getId?(item: T): unknown;
  /**
   * Returns whether the given item is selected. This is only used for the initial selected state of
   * the item. If you want to select/deselect an item programmatically, use the `select` and
   * `deselect` methods on the data source.
   */
  isSelected?(item: T): boolean;
}
export interface ListDataSourceOptions<T> extends ListDataSourceMapping<T> {
  /** The filters to apply to the data source. */
  filters?: Array<DataSourceFilter<T>>;
  /** The path to the group by attribute. */
  groupBy?: PathKeys<T>;
  /** The path to the group label. */
  groupLabelPath?: PathKeys<T>;
  /** A function for sorting the groups within the data source. */
  groupSortBy?: DataSourceSortFunction<ListDataSourceItem<T>>;
  /** The direction the groups should be sorted in. */
  groupSortDirection?: DataSourceSortDirection;
  /** Whether this data source supports pagination. */
  pagination?: boolean;
  /** The number of the current page. */
  page?: number;
  /** The size of the pages within the data source. */
  pageSize?: number;
  /** Indicates the selection type for the data source. */
  selects?: 'single' | 'multiple';
  /** A path to the property used for sorting the items, or a custom sorting function. */
  sortBy?: PathKeys<T> | DataSourceSortFunction<T>;
  /** The direction the list should be sorted in. */
  sortDirection?: DataSourceSortDirection;
}
/** The default page size, if not explicitly set. */
export declare const LIST_DATA_SOURCE_DEFAULT_PAGE_SIZE = 10;
/** Symbol used as a placeholder for items that are being loaded. */
export declare const ListDataSourcePlaceholder: unique symbol;
/** Use this for narrowing ListDataSourceItem type to ListDataSourceDataItem. */
export declare function isListDataSourceDataItem<T>(
  item?: ListDataSourceItemBase
): item is ListDataSourceDataItem<T>;
/** Use this for narrowing ListDataSourceItem type to ListDataSourceGroupItem. */
export declare function isListDataSourceGroupItem<T>(
  item?: ListDataSourceItemBase
): item is ListDataSourceGroupItem<T>;
export declare abstract class ListDataSource<T = any, U = ListDataSourceItem<T>> extends DataSource<
  T,
  U
> {
  #private;
  get filters(): Map<string, DataSourceFilter<T>>;
  get groupBy(): PathKeys<T> | undefined;
  get groupLabelPath(): PathKeys<T> | undefined;
  get groupSort():
    | {
        by?: DataSourceSortFunction<ListDataSourceItem<T>>;
        direction?: DataSourceSortDirection;
      }
    | undefined;
  get page(): number;
  get pageSize(): number;
  get pagination(): boolean;
  /** The number of selected items in the data source. */
  get selected(): number;
  /**
   * The current selection of item(s).
   *
   * This is a set of ids. Depending on the "select all" state, it either are the selected ids or
   * the deselected ids. If you want to use the selection, take the select all state into account.
   * If you want to know the state of a single item, use the `isSelected` method.
   */
  get selection(): Set<unknown>;
  get selects(): 'single' | 'multiple' | undefined;
  /** Indicates whether the data source allows single, multiple or no selection at all. */
  set selects(value: 'single' | 'multiple' | undefined);
  get sort(): DataSourceSort<T> | undefined;
  /** The total number of (unfiltered) items in the data source. */
  abstract readonly totalSize: number;
  constructor(options: ListDataSourceOptions<T>);
  addFilter(id: string, by: PathKeys<T> | DataSourceFilterFunction<T>, value?: unknown): void;
  removeFilter(id: string): void;
  /**
   * Groups the items in the data source by the specified property path.
   *
   * @param path - The path to the property used for grouping the items
   * @param labelPath - Optional path to the property used for generating group labels
   */
  setGroupBy(path: PathKeys<T>, labelPath?: PathKeys<T>): void;
  /** Removes the grouping from the list. */
  removeGroupBy(): void;
  /**
   * Sets the current page.
   *
   * @param page - The page number to set
   */
  setPage(page: number): void;
  /**
   * Sets the number of items that are shown on a page.
   *
   * @param pageSize - The number of items per page
   */
  setPageSize(pageSize: number): void;
  setSort(by: PathKeys<T> | DataSourceSortFunction<T>, direction: DataSourceSortDirection): void;
  removeSort(): void;
  /**
   * Selects the item. Whether it is added to the selection or replaces any previously selected item
   * is based on the `selects` value.
   *
   * @param item - The item to select
   */
  select(item: ListDataSourceItemBase, update?: boolean): void;
  /**
   * Deselects the item.
   *
   * @param item - The item to deselect
   */
  deselect(item: ListDataSourceItemBase, update?: boolean): void;
  /**
   * Toggles the selection state of an item.
   *
   * @param item - The item to toggle the selection state for
   * @param force - If true, the item will be selected. If false, it will be deselected.
   */
  toggle(item: ListDataSourceItemBase, force?: boolean, update?: boolean): void;
  /**
   * Returns whether the item is selected.
   *
   * @param item - The item to check
   */
  isSelected(item?: ListDataSourceItemBase): boolean;
  /** Selects all items in the data source. */
  selectAll(update?: boolean): void;
  /** Deselects all items in the data source. */
  deselectAll(update?: boolean): void;
  /** Returns whether the "select all" state is active. */
  isSelectAllToggled(): boolean;
  /** Returns whether all items are selected. */
  areAllSelected(): boolean;
  /** Returns whether some items are selected. */
  areSomeSelected(): boolean;
  /**
   * Expands the group with the given id.
   *
   * @param id - The id of the group to expand
   */
  expandGroup(id: unknown): void;
  /**
   * Collapses the group with the given id.
   *
   * @param id - The id of the group to collapse
   */
  collapseGroup(id: unknown): void;
  /**
   * Toggles the expansion state of the group with the given id.
   *
   * @param id - The id of the group to toggle
   * @param force - If true, the group will be collapsed. If false, it will be expanded.
   */
  toggleGroup(id: unknown, force?: boolean): void;
  /**
   * Returns whether the group with the given id is collapsed.
   *
   * @param id - The id of the group to check
   */
  isGroupCollapsed(id: unknown): boolean;
  /**
   * Reorder the item in the data source.
   *
   * @param item The item to reorder.
   * @param relativeItem The item to reorder relative to.
   * @param position The position relative to the relativeItem.
   * @returns True if the items were reordered, false if not.
   */
  abstract reorder(item: U, relativeItem: U, position: 'before' | 'after'): void;
}
