export type DataSourceFilter<T> = (value: unknown, labelPath?: string) => DataSourceFilterFunction<T>;

export type DataSourceFilterFunction<T> = (item: T, index: number, array: T[]) => boolean;

export type DataSourceSortDirection = 'asc' | 'desc';

export type DataSourceSortValue = { path: string; direction: DataSourceSortDirection };

export type DataSourceSortFunction<T> = (a: T, b: T) => number;

export type DataSourceSorter<T> = (sort: DataSourceSortValue) => DataSourceSortFunction<T>;

export abstract class DataSource<T> extends EventTarget {
  /** The filter implementation. */
  filter?: DataSourceFilter<T>;

  /** The path to the label for use when filtering. */
  filterLabelPath?: string;

  /** The value to filter on. */
  filterValue?: string;

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
