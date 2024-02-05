export type DataSourceFilterFunction<T> = (item: T, index: number, array: T[]) => boolean;

export type DataSourceFilterByFunction<T = unknown> = {
  filter: DataSourceFilterFunction<T>;
  value?: string | string[];
};

export type DataSourceFilterByPath = { path: string; value: string | string[] };

export type DataSourceFilter<T> = DataSourceFilterByFunction<T> | DataSourceFilterByPath;

export type DataSourceGroupBy<T> = {
  path: string;
  sorter?: DataSourceSortFunction<T>;
  direction: DataSourceSortDirection;
};

export type DataSourceSortDirection = 'asc' | 'desc';

export type DataSourceSortFunction<T = unknown> = (a: T, b: T) => number;

export type DataSourceSortByPath = { id?: string; path: string; direction: DataSourceSortDirection };

export type DataSourceSortByFunction<T = unknown> = {
  id?: string;
  sorter: DataSourceSortFunction<T>;
  direction: DataSourceSortDirection;
};

export type DataSourceSort<T> = DataSourceSortByFunction<T> | DataSourceSortByPath;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class DataSource<T = any> extends EventTarget {
  /** Map of all active filters. */
  #filters: Map<string, DataSourceFilter<T>> = new Map();

  /** Order the items by grouping them on the given attributes. */
  #groupBy?: DataSourceGroupBy<T>;

  /**
   * The value and path/function to use for sorting. When setting this property,
   * it will cause the data to be automatically sorted.
   */
  #sort?: DataSourceSort<T>;

  get filters(): Map<string, DataSourceFilter<T>> {
    return this.#filters;
  }

  get groupBy(): DataSourceGroupBy<T> | undefined {
    return this.#groupBy;
  }

  get sort(): DataSourceSort<T> | undefined {
    return this.#sort;
  }

  /** The filtered & sorted array of items. */
  abstract readonly filteredItems: T[];

  /** The groups. */
  abstract readonly groups: string[];

  /** The array of all items. */
  abstract readonly items: T[];

  /** Total number of items in this data source. */
  abstract readonly size: number;

  /** Toggles the visibility of the group. */
  abstract toggleGroup(value: string, collapse?: boolean): void;

  /** Returns true if the group is expanded, false if collapsed. */
  abstract isGroupExpanded(value?: string): boolean;

  /** Updates the list of items using filter and sorting if available. */
  abstract update(): void;

  addFilter<U extends string | DataSourceFilterFunction<T>>(
    id: string,
    pathOrFilter: U,
    value?: string | string[]
  ): void {
    if (typeof pathOrFilter === 'string') {
      this.#filters.set(id, { path: pathOrFilter, value: value ?? '' });
    } else {
      this.#filters.set(id, { filter: pathOrFilter, value });
    }
  }

  removeFilter(id: string): void {
    this.#filters.delete(id);
  }

  setGroupBy(path: string, sorter?: DataSourceSortFunction<T>, direction?: DataSourceSortDirection): void {
    this.#groupBy = { path, sorter, direction: direction ?? 'asc' };
  }

  removeGroupBy(): void {
    this.#groupBy = undefined;
  }

  setSort<U extends string | DataSourceSortFunction<T>>(
    id: string,
    pathOrSorter: U,
    direction: DataSourceSortDirection
  ): void {
    if (typeof pathOrSorter === 'string') {
      this.#sort = { id, path: pathOrSorter, direction };
    } else {
      this.#sort = { id, sorter: pathOrSorter, direction };
    }
  }

  removeSort(): void {
    this.#sort = undefined;
  }
}
