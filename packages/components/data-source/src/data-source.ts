// import { SlChangeEvent, type SlChangeEvent } from '@sl-design-system/shared/events.js';

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

export type DataSourcePagination = { pageNumber: number; pageSize: number; total: number };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataSourceUpdateEvent<T = any> = CustomEvent<{ dataSource: DataSource<T> }>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class DataSource<T = any> extends EventTarget {
  /** Map of all active filters. */
  #filters: Map<string, DataSourceFilter<T>> = new Map();

  /** Order the items by grouping them on the given attributes. */
  #groupBy?: DataSourceGroupBy<T>;

  /** Parameters for pagination, contains page number and page size. */
  #paginateItems?: DataSourcePagination;

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

  get paginateItems(): DataSourcePagination | undefined {
    return this.#paginateItems;
  }

  get sort(): DataSourceSort<T> | undefined {
    return this.#sort;
  }

  /** The filtered & sorted array of items. */
  abstract items: T[];

  /** The paginated array of items (filtered and sorted). */
  // abstract readonly paginatedItems: T[];

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
    console.log('addfilter in datasource', pathOrFilter, value);
  }

  removeFilter(id: string): void {
    this.#filters.delete(id);
    console.log('addfilter in datasource remove', id);
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
    console.log('setsort in datasource', pathOrSorter, direction);
    if (typeof pathOrSorter === 'string') {
      this.#sort = { id, path: pathOrSorter, direction };
    } else {
      this.#sort = { id, sorter: pathOrSorter, direction };
    }

    if (this.#paginateItems) {
      this.setPage(1);
    }
  }

  removeSort(): void {
    this.#sort = undefined;

    if (this.#paginateItems) {
      this.setPage(1);
    }
    console.log('setsort in datasource remove');
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

  setPage(pageNumber: number /*, pageSize: number, total: number*/): void {
    console.log('this.#paginateItems in setPage', this.#paginateItems, pageNumber);

    // this.paginate(pageNumber, pageSize, total);

    if (this.#paginateItems) {
      this.paginate(pageNumber, this.#paginateItems.pageSize, this.#paginateItems.total);
    }

    this.addEventListener('sl-filter-value-change', event => {
      console.log('event on sl-filter-value-change', event);
      // go back to the first page on filter change
      // paginator.activePage = 1;
      // this.paginate(1, pageSize);
    });
  }

  setPageSize(pageSize: number): void {
    if (this.#paginateItems) {
      // this.#paginateItems.pageSize = pageSize;
      this.paginate(
        /*this.#paginateItems.pageNumber*/ 1,
        pageSize /*this.#paginateItems.pageSize*/,
        this.#paginateItems.total
      );

      // 'sl-page-size-change'

      // this.update();

      // this.dispatchEvent(new SlChangeEvent('sl-page-size-change', { detail: pageSize }));

      // TODO: or keep here items per page and observe it in the paginator? so pageSize?

      // this.addEventListener('sl-page-size-change', () => {
      //   // go back to the first page on filter change
      //   // paginator.activePage = 1;
      //   // const detail = event.detail as number;
      //   // this.itemsPerPage = detail;
      //   if (this.#paginateItems) {
      //     this.paginate(/*this.#paginateItems.pageNumber*/ 1, this.#paginateItems.pageSize, this.#paginateItems.total);
      //   }
      // });
    }
    console.log('pageSize?', pageSize, this.#paginateItems);
  }

  /**
   * Use to get the paginated data for usage with the sl-paginator component.
   * */
  paginate(pageNumber: number, pageSize: number, total: number): void {
    console.log('in paginate filters', this.#filters, this.filters);
    this.#paginateItems = { pageNumber: pageNumber, pageSize: pageSize, total: total };
    console.log('this.#paginateItems in paginate event', this.#paginateItems);

    this.update();
  }
}
