declare global {
  interface GlobalEventHandlersEventMap {
    'sl-update': DataSourceUpdateEvent;
  }
}

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
  direction?: DataSourceSortDirection;
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

export type DataSourcePagination = { page: number; pageSize: number; totalItems: number };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataSourceUpdateEvent<T = any> = CustomEvent<{ dataSource: DataSource<T> }>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class DataSource<T = any> extends EventTarget {
  /** Map of all active filters. */
  #filters: Map<string, DataSourceFilter<T>> = new Map();

  /** Order the items by grouping them on the given attributes. */
  #groupBy?: DataSourceGroupBy<T>;

  /** Parameters for pagination, contains page number, page size and total items amount. */
  #page?: DataSourcePagination;

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

  get page(): DataSourcePagination | undefined {
    return this.#page;
  }

  get sort(): DataSourceSort<T> | undefined {
    return this.#sort;
  }

  /** The filtered & sorted array of items. */
  abstract items: T[];

  /** Total number of items in this data source. */
  abstract readonly size: number;

  /** Updates the list of items using filter, sorting and pagination if available. */
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

  /**
   * Group the items by the given path. Optionally, you can provide a sorter and direction.
   *
   * This is part of the DataSource interface, because it changes how the data is sorted. You
   * may want to pass the groupBy attribute to the server, so it can sort the data for you.
   *
   * @param path Path to group by attribute.
   * @param sorter Optional sorter function.
   * @param direction Optional sort direction.
   */
  setGroupBy(path: string, sorter?: DataSourceSortFunction<T>, direction?: DataSourceSortDirection): void {
    this.#groupBy = { path, sorter, direction };
  }

  /**
   * Remove the groupBy attribute. This will cause the data to be sorted as if it was not grouped.
   */
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

    if (this.#page) {
      this.setPage(0);
    }
  }

  removeSort(): void {
    this.#sort = undefined;

    if (this.#page) {
      this.setPage(0);
    }
  }

  /**
   * Reorder the item in the data source.
   * @param item The item to reorder.
   * @param relativeItem The item to reorder relative to.
   * @param position The position relative to the relativeItem.
   * @returns True if the items were reordered, false if not.
   */
  reorder(item: T, relativeItem: T, position: 'before' | 'after'): void {
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

  setPage(page: number): void {
    if (this.#page) {
      this.paginate(page, this.#page.pageSize, this.#page.totalItems);
    }
  }

  setPageSize(pageSize: number): void {
    if (this.#page) {
      this.paginate(0, pageSize, this.#page.totalItems);
    }
  }

  setTotalItems(totalItems: number): void {
    if (this.#page) {
      this.paginate(this.#page.page, this.#page.pageSize, totalItems);
    }
  }

  /**
   * Use to get the paginated data for usage with the sl-paginator component.
   * */
  paginate(page: number, pageSize: number, totalItems: number): void {
    console.log('paginate', page, pageSize, totalItems);
    this.#page = { page: page, pageSize: pageSize, totalItems: totalItems };
  }
}
