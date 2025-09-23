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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ListDataSourceGroupItem<T = any> extends ListDataSourceItemBase {
  type: 'group';
  collapsed?: boolean;
  count?: number;
  label?: string;
  members?: Array<ListDataSourceDataItem<T>>;
  selected?: 'all' | 'some' | 'none';

  /** The number of items in the group. */
  size?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ListDataSourceDataItem<T = any> extends ListDataSourceItemBase {
  type: 'data';
  data: T;
  group?: ListDataSourceGroupItem<T>;
  groupId?: unknown;
  selected?: boolean;
}

/** Union type that represents all possible item types in the data source */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ListDataSourceItem<T = any> = ListDataSourceGroupItem<T> | ListDataSourceDataItem<T>;

export interface ListDataSourceMapping<T> {
  /**
   * Returns a unique identifier for the group the item belongs to. Use this
   * if the group cannot easily be derived from the item itself. If it can,
   * use the `groupBy` option instead.
   */
  getGroupId?(item: T): unknown;

  /**
   * Returns a unique identifier for the item in the list. If not provided, the item itself
   * will be used as the identifier.
   */
  getId?(item: T): unknown;

  /**
   * Returns whether the given item is selected. This is only used for the initial
   * selected state of the item. If you want to select/deselect an item programmatically,
   * use the `select` and `deselect` methods on the data source.
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
export const LIST_DATA_SOURCE_DEFAULT_PAGE_SIZE = 10;

/** Symbol used as a placeholder for items that are being loaded. */
export const ListDataSourcePlaceholder = Symbol('ListDataSourcePlaceholder');

/** Use this for narrowing ListDataSourceItem type to ListDataSourceDataItem. */
export function isListDataSourceDataItem<T>(item?: ListDataSourceItemBase): item is ListDataSourceDataItem<T> {
  return item?.type === 'data';
}

/** Use this for narrowing ListDataSourceItem type to ListDataSourceGroupItem. */
export function isListDataSourceGroupItem<T>(item?: ListDataSourceItemBase): item is ListDataSourceGroupItem<T> {
  return item?.type === 'group';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class ListDataSource<T = any, U = ListDataSourceItem<T>> extends DataSource<T, U> {
  /** Map of all active filters. */
  #filters: Map<string, DataSourceFilter<T>> = new Map();

  /** The path to the group by attribute. */
  #groupBy?: PathKeys<T>;

  /** The path to the group label. */
  #groupLabelPath?: PathKeys<T>;

  /**
   * The set of selected groups in the data source. This selection
   * is kept separate from the selection of items, so that they do not
   * interfere with each other.
   */
  #groupSelection: Set<unknown> = new Set();

  /** The sort configuration for the groups. */
  #groupSort?: {
    by?: DataSourceSortFunction<ListDataSourceItem<T>>;
    direction?: DataSourceSortDirection;
  };

  /** The index of the page. */
  #page = 0;

  /** The number of items on a single page. */
  #pageSize = LIST_DATA_SOURCE_DEFAULT_PAGE_SIZE;

  /** Whether this data source uses pagination. */
  #pagination: boolean;

  /** Whether all items are selected. */
  #selectAll?: boolean;

  /** A set containing the selected ids in the data source. */
  #selection: Set<unknown> = new Set();

  /** Indicates the selection type for the data source. */
  #selects?: 'single' | 'multiple';

  /**
   * The value and path/function to use for sorting. When setting this property,
   * it will cause the data to be automatically sorted.
   */
  #sort?: DataSourceSort<T>;

  get filters() {
    return this.#filters;
  }

  get groupBy() {
    return this.#groupBy;
  }

  get groupLabelPath() {
    return this.#groupLabelPath;
  }

  get groupSort() {
    return this.#groupSort;
  }

  get page(): number {
    return this.#page;
  }

  get pageSize(): number {
    return this.#pageSize;
  }

  get pagination(): boolean {
    return this.#pagination;
  }

  /** The number of selected items in the data source. */
  get selected(): number {
    if (this.#selectAll) {
      return this.totalSize - this.#selection.size;
    } else {
      return this.#selection.size;
    }
  }

  /**
   * The current selection of item(s).
   *
   * This is a set of ids. Depending on the "select all" state, it either
   * are the selected ids or the deselected ids. If you want to use the
   * selection, take the select all state into account. If you want to know
   * the state of a single item, use the `isSelected` method.
   */
  get selection() {
    return this.#selection;
  }

  get selects() {
    return this.#selects;
  }

  /** Indicates whether the data source allows single, multiple or no selection at all. */
  set selects(value: 'single' | 'multiple' | undefined) {
    this.#selects = value;
  }

  get sort() {
    return this.#sort;
  }

  /** The total number of (unfiltered) items in the data source. */
  abstract readonly totalSize: number;

  constructor(options: ListDataSourceOptions<T>) {
    super();

    if (options.filters) {
      options.filters.forEach(filter => this.#filters.set(filter.id, filter));
    }

    this.#groupBy = options.groupBy;
    this.#groupLabelPath = options.groupLabelPath;

    if (options.groupSortBy || options.groupSortDirection) {
      this.#groupSort = {
        by: options.groupSortBy,
        direction: options.groupSortDirection ?? 'asc'
      };
    }

    this.#pagination = options.pagination ?? false;
    this.#page = options.page ?? 0;
    this.#pageSize = options.pageSize ?? LIST_DATA_SOURCE_DEFAULT_PAGE_SIZE;
    this.#selects = options.selects;

    if (options.sortBy) {
      this.#sort = { by: options.sortBy, direction: options.sortDirection ?? 'asc' };
    }

    if (this.#groupBy && this.#pagination) {
      console.warn(
        'Grouping and pagination are both enabled for the list data source. This may cause unexpected behavior. It is recommended to use grouping without pagination.'
      );
    }
  }

  addFilter(id: string, by: PathKeys<T> | DataSourceFilterFunction<T>, value?: unknown): void {
    this.#filters.set(id, { id, by, value } as DataSourceFilter<T>);
  }

  removeFilter(id: string): void {
    this.#filters.delete(id);
  }

  /**
   * Groups the items in the data source by the specified property path.
   * @param path - The path to the property used for grouping the items
   * @param labelPath - Optional path to the property used for generating group labels
   */
  setGroupBy(path: PathKeys<T>, labelPath?: PathKeys<T>): void {
    this.#groupBy = path;
    this.#groupLabelPath = labelPath;
  }

  /** Removes the grouping from the list. */
  removeGroupBy(): void {
    this.#groupBy = undefined;
    this.#groupLabelPath = undefined;
  }

  /**
   * Sets the current page.
   * @param page - The page number to set
   */
  setPage(page: number): void {
    this.#page = page;
  }

  /**
   * Sets the number of items that are shown on a page.
   * @param pageSize - The number of items per page
   */
  setPageSize(pageSize: number): void {
    this.#pageSize = pageSize;
  }

  setSort(by: PathKeys<T> | DataSourceSortFunction<T>, direction: DataSourceSortDirection): void {
    this.#sort = { by, direction };

    if (this.page) {
      this.setPage(0);
    }
  }

  removeSort(): void {
    if (this.#sort && this.page) {
      this.setPage(0);
    }

    this.#sort = undefined;
  }

  /**
   * Selects the item. Whether it is added to the selection or replaces
   * any previously selected item is based on the `selects` value.
   * @param item - The item to select
   */
  select(item: ListDataSourceItemBase, update = true): void {
    if (this.#selects === undefined) {
      return;
    } else if (this.#selectAll) {
      if (item.type === 'group') {
        this.#groupSelection.delete(item.id);
      } else {
        this.#selection.delete(item.id);
      }
    } else {
      if (this.#selects === 'single') {
        this.#selection.clear();
      }

      if (item.type === 'group') {
        this.#groupSelection.add(item.id);
      } else {
        this.#selection.add(item.id);
      }
    }

    if (update) {
      if (isListDataSourceGroupItem(item)) {
        item.members?.forEach(member => this.select(member, false));
      } else if (isListDataSourceDataItem(item) && item.group?.members?.every(member => this.isSelected(member))) {
        this.select(item.group, false);
      }

      this.dispatchEvent(new CustomEvent('sl-selection-change'));
    }
  }

  /**
   * Deselects the item.
   * @param item - The item to deselect
   */
  deselect(item: ListDataSourceItemBase, update = true): void {
    if (this.#selects === undefined) {
      return;
    } else if (this.#selectAll) {
      if (item.type === 'group') {
        this.#groupSelection.add(item.id);
      } else {
        this.#selection.add(item.id);
      }

      // If all items have been manually deselected, turn off select all mode
      if (this.#selection.size === this.size) {
        this.deselectAll(false);
      }
    } else {
      if (item.type === 'group') {
        this.#groupSelection.delete(item.id);
      } else {
        this.#selection.delete(item.id);
      }
    }

    if (update) {
      if (isListDataSourceGroupItem(item)) {
        item.members?.forEach(member => this.deselect(member, false));
      } else if (isListDataSourceDataItem(item) && item.group?.members?.some(member => !this.isSelected(member))) {
        this.deselect(item.group, false);
      }

      this.dispatchEvent(new CustomEvent('sl-selection-change'));
    }
  }

  /**
   * Toggles the selection state of an item.
   * @param item - The item to toggle the selection state for
   * @param force - If true, the item will be selected. If false, it will be deselected.
   */
  toggle(item: ListDataSourceItemBase, force?: boolean, update?: boolean): void {
    force ??= !this.isSelected(item);

    if (force) {
      this.select(item, update);
    } else {
      this.deselect(item, update);
    }

    if (isListDataSourceGroupItem(item)) {
      item.members?.forEach(member => this.toggle(member, force, false));
    }

    if (update) {
      this.dispatchEvent(new CustomEvent('sl-selection-change'));
    }
  }

  /**
   * Returns whether the item is selected.
   * @param item - The item to check
   */
  isSelected(item?: ListDataSourceItemBase): boolean {
    if (!item || !('id' in item)) {
      return false;
    }

    if (this.#selectAll) {
      if (item.type === 'group') {
        return !this.#groupSelection.has(item.id);
      } else {
        return !this.#selection.has(item.id);
      }
    } else {
      if (item.type === 'group') {
        return this.#groupSelection.has(item.id);
      } else {
        return this.#selection.has(item.id);
      }
    }
  }

  /** Selects all items in the data source. */
  selectAll(update = true): void {
    if (this.#selects !== 'multiple') {
      return;
    }

    this.#selectAll = true;
    this.#selection.clear();
    this.#groupSelection.clear();

    if (update) {
      this.dispatchEvent(new CustomEvent('sl-selection-change'));
    }
  }

  /** Deselects all items in the data source. */
  deselectAll(update = true): void {
    this.#selectAll = false;
    this.#selection.clear();
    this.#groupSelection.clear();

    if (update) {
      this.dispatchEvent(new CustomEvent('sl-selection-change'));
    }
  }

  /** Returns whether the "select all" state is active. */
  isSelectAllToggled(): boolean {
    return !!this.#selectAll;
  }

  /** Returns whether all items are selected. */
  areAllSelected(): boolean {
    if (this.#selectAll) {
      return this.#selection.size === 0;
    } else {
      return this.#selection.size === this.size;
    }
  }

  /** Returns whether some items are selected. */
  areSomeSelected(): boolean {
    const { size } = this.#selection;

    if (this.#selectAll) {
      return size > 0 && size !== this.size;
    } else {
      return size > 0 && size < this.size;
    }
  }

  /**
   * Expands the group with the given id.
   * @param id  - The id of the group to expand
   */
  abstract expandGroup(id: unknown): void;

  /**
   * Collapses the group with the given id.
   * @param id  - The id of the group to collapse
   */
  abstract collapseGroup(id: unknown): void;

  /**
   * Toggles the expansion state of the group with the given id.
   * @param id  - The id of the group to toggle
   * @param force - If true, the group will be expanded. If false, it will be collapsed.
   */
  abstract toggleGroup(id: unknown, force?: boolean): void;

  /**
   * Returns whether the group with the given id is collapsed.
   * @param id  - The id of the group to check
   */
  abstract isGroupCollapsed(id: unknown): boolean;

  /**
   * Reorder the item in the data source.
   * @param item The item to reorder.
   * @param relativeItem The item to reorder relative to.
   * @param position The position relative to the relativeItem.
   * @returns True if the items were reordered, false if not.
   */
  abstract reorder(item: U, relativeItem: U, position: 'before' | 'after'): void;
}
