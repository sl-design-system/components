export type DataSourceFilterValue = { path: string; value?: string | string[] };

export type DataSourceFilterFunction<T> = (item: T, index: number, array: T[]) => boolean;

export type DataSourceFilter<T> = (filters: DataSourceFilterValue[]) => DataSourceFilterFunction<T>;

export type DataSourceSortDirection = 'asc' | 'desc';

export type DataSourceSortValue = { path: string; direction: DataSourceSortDirection };

export type DataSourceSortFunction<T> = (a: T, b: T) => number;

export type DataSourceSorter<T> = (sort: DataSourceSortValue) => DataSourceSortFunction<T>;

export abstract class DataSource<T> extends EventTarget {
  /** The filter implementation. */
  filter?: DataSourceFilter<T>;

  /** The values to filter on. */
  filterValues?: DataSourceFilterValue[];

  /** The sorter implementation. */
  sorter?: DataSourceSorter<T>;

  /** The path & direction to sort on. */
  sortValue?: DataSourceSortValue;

  /** The array of items. */
  abstract readonly items: T[];

  /** Size of the item collection. */
  abstract readonly size: number;

  /** Updates the list of items using filter and sorting if available. */
  abstract update(): void;
}
