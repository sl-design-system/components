import { type PathKeys } from '@sl-design-system/shared';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-update': DataSourceUpdateEvent;
  }
}

export type DataSourceFilterFunction<Model> = (item: Model, value: unknown) => boolean;

export type DataSourceFilter<Model> = {
  id: string;
  by: DataSourceFilterFunction<Model> | PathKeys<Model>;
  value: unknown;
};

export type DataSourceSortDirection = 'asc' | 'desc';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataSourceSortFunction<Model = any> = (a: Model, b: Model) => number;

export type DataSourceSort<Model> = {
  by: DataSourceSortFunction<Model> | PathKeys<Model>;
  direction: DataSourceSortDirection;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataSourceUpdateEvent<Model = any> = CustomEvent<{ dataSource: DataSource<Model> }>;

/**
 * Base class for all data sources. Data sources are used to filter and sort. Data sources
 * can be used for components such as combobox, grid, listbox, paginator, tree etc.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class DataSource<Model = any, ViewModel = Model> extends EventTarget {
  /** The filters applied to this data source. */
  abstract readonly filters: Map<string, DataSourceFilter<Model>>;

  /** The filtered & sorted array of view models. */
  abstract readonly items: ViewModel[];

  /** Total number of items in this data source. */
  abstract readonly size: number;

  /** The current sort configuration. */
  abstract readonly sort: DataSourceSort<Model> | undefined;

  /** Updates items using filter and sorting if available. */
  abstract update(): void;

  /**
   * Adds a filter to this data source. Filters can be used to filter the data
   * in the data source. Filters are applied in the order they are added.
   *
   * @param id - Unique identifier for the filter
   * @param by - Either a property path (string) or a custom filter function
   * @param value - The value to filter by, if applicable
   *
   * When a property path is provided, items will be filtered by that property.
   * When a filter function is provided, it will be used to determine if an item
   * should be included in the filtered results.
   */
  abstract addFilter(id: string, by: PathKeys<Model> | DataSourceFilterFunction<Model>, value?: unknown): void;

  /**
   * Removes a filter from this data source.
   *
   * @param id - Unique identifier for the filter to remove
   */
  abstract removeFilter(id: string): void;

  /**
   * Sets a sort configuration for this data source.
   *
   * @param by - Either a property path (string) or a custom sort function
   * @param direction - Sort direction, either 'asc' (ascending) or 'desc' (descending)
   *
   * When a property path is provided, items will be sorted by that property.
   * When a sort function is provided, it will be used to compare items during sorting.
   * Setting a sort configuration will replace any existing sort configuration.
   */
  abstract setSort(by: PathKeys<Model> | DataSourceSortFunction<Model>, direction: DataSourceSortDirection): void;

  /**
   * Removes the current sort configuration. This will clear any existing sort
   * settings, allowing for unsorted data.
   */
  abstract removeSort(): void;
}
