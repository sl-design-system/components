import { type PathKeys } from '@sl-design-system/shared';
import { DataSource, type DataSourceSortDirection, type DataSourceSortFunction } from './data-source.js';

export type ListDataSourceItemType = 'group' | 'item' | 'placeholder';

export type ListDataSourceItem<T> = {
  id: unknown;
  collapsed?: boolean;
  count?: number;
  group?: unknown;
  item: T;
  label?: string;
  selected?: boolean;
  type: ListDataSourceItemType;
};

export interface ListDataSourceMapping<T> {
  /**
   * Returns a unique identifier for the group the item belongs to. Use this
   * if the group cannot easily be derived from the item itself. If it can,
   * use the `groupBy` option instead.
   */
  getGroup?(item: T): unknown;

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
  /**
   * An explicit array of groups. Use this when you initially only want to show the groups.
   * The groups can be collapsed by default. When the user expands a group, the items
   * can then be loaded on demand.
   */
  groups?: Array<Partial<ListDataSourceItem<T>>>;

  /** The path to the group by attribute. */
  groupBy?: PathKeys<T>;

  /** The path to the group label. */
  groupLabelPath?: PathKeys<T>;

  /** Whether this data source supports pagination. */
  pagination?: boolean;

  /** Indicates the selection type for the data source. */
  selects?: 'single' | 'multiple';
}

/** The default page size, if not explicitly set. */
export const DATA_SOURCE_DEFAULT_PAGE_SIZE = 10;

/** Symbol used as a placeholder for items that are being loaded. */
export const ListDataSourcePlaceholder = Symbol('ListDataSourcePlaceholder');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class ListDataSource<T = any, U = ListDataSourceItem<T>> extends DataSource<T, U> {
  /** The path to the group by attribute. */
  #groupBy?: PathKeys<T>;

  /** The path to the group label. */
  #groupLabelPath?: PathKeys<T>;

  /** The index of the page. */
  #page = 0;

  /** The number of items on a single page. */
  #pageSize = DATA_SOURCE_DEFAULT_PAGE_SIZE;

  /** Whether this data source uses pagination. */
  #pagination: boolean;

  /** Whether all items are selected. */
  #selectAll?: boolean;

  /** A set containing the selected ids in the data source. */
  #selection: Set<unknown> = new Set();

  /** Indicates the selection type for the data source. */
  #selects?: 'single' | 'multiple';

  get groupBy() {
    return this.#groupBy;
  }

  get groupLabelPath() {
    return this.#groupLabelPath;
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

  /** Indicates whether the data source allows single or multiple selection. */
  get selects() {
    return this.#selects;
  }

  /** The total number of (unfiltered) items in the data source. */
  abstract readonly totalSize: number;

  /** The unfiltered items in the data source. */
  abstract readonly unfilteredItems: U[];

  constructor(options: ListDataSourceOptions<T>) {
    super();

    this.#groupBy = options.groupBy;
    this.#groupLabelPath = options.groupLabelPath;
    this.#pagination = options.pagination ?? false;
    this.#selects = options.selects;
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

  override setSort<U extends PathKeys<T> | DataSourceSortFunction<T>>(
    id: string,
    pathOrSorter: U,
    direction: DataSourceSortDirection
  ): void {
    super.setSort(id, pathOrSorter, direction);

    if (this.#page) {
      this.setPage(0);
    }
  }

  override removeSort(): void {
    super.removeSort();

    if (this.#page) {
      this.setPage(0);
    }
  }

  /**
   * Selects the item. Whether it is added to the selection or replaces
   * any previously selected item is based on the `selects` value.
   * @param item - The item to select
   */
  select(item: ListDataSourceItem<T>): void {
    if (this.#selects === undefined) {
      return;
    } else if (this.#selectAll) {
      this.#selection.delete(item.id);
    } else if (this.#selects === 'single') {
      this.#selection.clear();
    }

    this.#selection.add(item.id);
  }

  /**
   * Deselects the item.
   * @param item - The item to deselect
   */
  deselect(item: ListDataSourceItem<T>): void {
    if (this.#selects === undefined) {
      return;
    } else if (this.#selectAll) {
      this.#selection.add(item.id);
    } else {
      this.#selection.delete(item.id);
    }
  }

  /**
   * Toggles the selection state of an item.
   * @param item - The item to toggle the selection state for
   */
  toggle(item: ListDataSourceItem<T>): void {
    if (this.isSelected(item)) {
      this.deselect(item);
    } else {
      this.select(item);
    }
  }

  /**
   * Returns whether the item is selected.
   * @param item - The item to check
   */
  isSelected(item: ListDataSourceItem<T>): boolean {
    if (this.#selectAll) {
      return !this.#selection.has(item.id);
    } else {
      return this.#selection.has(item.id);
    }
  }

  /** Selects all items in the data source. */
  selectAll(): void {
    this.#selectAll = true;
    this.#selection.clear();
  }

  /** Deselects all items in the data source. */
  deselectAll(): void {
    this.#selectAll = false;
    this.#selection.clear();
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
   */
  abstract toggleGroup(id: unknown): void;

  /**
   * Reorder the item in the data source.
   * @param item The item to reorder.
   * @param relativeItem The item to reorder relative to.
   * @param position The position relative to the relativeItem.
   * @returns True if the items were reordered, false if not.
   */
  reorder(item: U, relativeItem: U, position: 'before' | 'after'): void {
    const items = this.items,
      from = items.indexOf(item),
      to = items.indexOf(relativeItem) + (position === 'before' ? 0 : 1);

    if (from === -1 || to === -1 || from === to) {
      return;
    }

    items.splice(from, 1);
    items.splice(to + (from < to ? -1 : 0), 0, item);

    this.update();
  }
}
