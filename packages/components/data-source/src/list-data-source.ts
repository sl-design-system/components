import { type PathKeys } from '@sl-design-system/shared';
import { DataSource, type DataSourceSortDirection, type DataSourceSortFunction } from './data-source.js';

export type ListDataSourceGroupBy<T> = {
  path: PathKeys<T>;
  sorter?: DataSourceSortFunction<T>;
  direction?: DataSourceSortDirection;
};

export type ListDataSourcePagination = { page: number; pageSize: number; totalItems: number };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class ListDataSource<T = any, U = T> extends DataSource<T, U> {
  /** Order the items by grouping them on the given attributes. */
  #groupBy?: ListDataSourceGroupBy<T>;

  /** Parameters for pagination, contains page number, page size and total items amount. */
  #page?: ListDataSourcePagination;

  get groupBy(): ListDataSourceGroupBy<T> | undefined {
    return this.#groupBy;
  }

  get page(): ListDataSourcePagination | undefined {
    return this.#page;
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
  setGroupBy(path: PathKeys<T>, sorter?: DataSourceSortFunction<T>, direction?: DataSourceSortDirection): void {
    this.#groupBy = { path, sorter, direction };
  }

  /**
   * Remove the groupBy attribute. This will cause the data to be sorted as if it was not grouped.
   */
  removeGroupBy(): void {
    this.#groupBy = undefined;
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

  setTotalItems(totalItems: number): void {
    if (this.#page) {
      this.paginate(this.#page.page, this.#page.pageSize, totalItems);
    }
  }

  /** Use to get the paginated data for usage with the sl-paginator component. */
  paginate(page: number, pageSize: number, totalItems: number): void {
    this.#page = { page: page, pageSize: pageSize, totalItems: totalItems };
  }

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
