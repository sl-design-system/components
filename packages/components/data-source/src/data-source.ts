import { type PathKeys } from '@sl-design-system/shared';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-update': DataSourceUpdateEvent;
  }
}

export type DataSourceFilterFunction<Model> = (item: Model, value: string | string[] | undefined) => boolean;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataSourceFilterByFunction<Model = any> = {
  filter: DataSourceFilterFunction<Model>;
  value?: string | string[];
};

export type DataSourceFilterByPath<Model> = { path: PathKeys<Model>; value: string | string[] };

export type DataSourceFilter<Model> = DataSourceFilterByFunction<Model> | DataSourceFilterByPath<Model>;

export type DataSourceSortDirection = 'asc' | 'desc';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataSourceSortFunction<Model = any> = (a: Model, b: Model) => number;

export type DataSourceSortByPath<Model> = { id?: string; path: PathKeys<Model>; direction: DataSourceSortDirection };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataSourceSortByFunction<Model = any> = {
  id?: string;
  sorter: DataSourceSortFunction<Model>;
  direction: DataSourceSortDirection;
};

export type DataSourceSort<Model> = DataSourceSortByFunction<Model> | DataSourceSortByPath<Model>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataSourceUpdateEvent<Model = any> = CustomEvent<{ dataSource: DataSource<Model> }>;

/**
 * Base class for all data sources. Data sources are used to filter and sort. Data sources
 * can be used for components such as combobox, grid, listbox, paginator, tree etc.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class DataSource<Model = any, ViewModel = Model> extends EventTarget {
  /** Map of all active filters. */
  #filters: Map<string, DataSourceFilter<Model>> = new Map();

  /**
   * The value and path/function to use for sorting. When setting this property,
   * it will cause the data to be automatically sorted.
   */
  #sort?: DataSourceSort<Model>;

  get filters(): Map<string, DataSourceFilter<Model>> {
    return this.#filters;
  }

  get sort(): DataSourceSort<Model> | undefined {
    return this.#sort;
  }

  /** The filtered & sorted array of view models. */
  abstract readonly items: ViewModel[];

  /** Total number of items in this data source. */
  abstract readonly size: number;

  /** Updates items using filter and sorting if available. */
  abstract update(): void;

  /**
   * Adds a filter to this data source. Filters can be used to filter the data
   * in the data source. Filters are applied in the order they are added.
   *
   * @param id - Unique identifier for the filter
   * @param pathOrFilter - Either a property path (string) or a custom filter function
   * @param value - The value to filter by, if applicable
   *
   * When a property path is provided, items will be filtered by that property.
   * When a filter function is provided, it will be used to determine if an item
   * should be included in the filtered results.
   */
  addFilter<T extends PathKeys<Model> | DataSourceFilterFunction<Model>>(
    id: string,
    pathOrFilter: T,
    value?: string | string[]
  ): void {
    if (typeof pathOrFilter === 'string') {
      this.#filters.set(id, { path: pathOrFilter as PathKeys<Model>, value: value ?? '' });
    } else {
      this.#filters.set(id, { filter: pathOrFilter, value });
    }
  }

  /**
   * Removes a filter from this data source.
   *
   * @param id - Unique identifier for the filter to remove
   *
   * This will remove the filter with the specified ID from the data source.
   */
  removeFilter(id: string): void {
    this.#filters.delete(id);
  }

  /**
   * Sets a sort configuration for this data source.
   *
   * @param id - Unique identifier for the sort configuration
   * @param pathOrSorter - Either a property path (string) or a custom sort function
   * @param direction - Sort direction, either 'asc' (ascending) or 'desc' (descending)
   *
   * When a property path is provided, items will be sorted by that property.
   * When a sort function is provided, it will be used to compare items during sorting.
   * Setting a sort configuration will replace any existing sort configuration.
   */
  setSort<T extends PathKeys<Model> | DataSourceSortFunction<Model>>(
    id: string,
    pathOrSorter: T,
    direction: DataSourceSortDirection
  ): void {
    if (typeof pathOrSorter === 'string') {
      this.#sort = { id, path: pathOrSorter as PathKeys<Model>, direction };
    } else {
      this.#sort = { id, sorter: pathOrSorter, direction };
    }
  }

  /**
   * Removes the current sort configuration. This will clear any existing sort
   * settings, allowing for unsorted data.
   */
  removeSort(): void {
    this.#sort = undefined;
  }
}
