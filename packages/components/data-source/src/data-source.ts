import { type PathKeys } from '@sl-design-system/shared';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-update': DataSourceUpdateEvent;
  }
}

export type DataSourceFilterFunction<Model> = (item: Model, index: number, array: Model[]) => boolean;

export type DataSourceFilterByFunction<Model = unknown> = {
  filter: DataSourceFilterFunction<Model>;
  value?: string | string[];
};

export type DataSourceFilterByPath<Model> = { path: PathKeys<Model>; value: string | string[] };

export type DataSourceFilter<Model> = DataSourceFilterByFunction<Model> | DataSourceFilterByPath<Model>;

export type DataSourceSortDirection = 'asc' | 'desc';

export type DataSourceSortFunction<Model = unknown> = (a: Model, b: Model) => number;

export type DataSourceSortByPath<Model> = { id?: string; path: PathKeys<Model>; direction: DataSourceSortDirection };

export type DataSourceSortByFunction<Model = unknown> = {
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

  removeFilter(id: string): void {
    this.#filters.delete(id);
  }

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

  removeSort(): void {
    this.#sort = undefined;
  }
}
