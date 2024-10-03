import { getStringByPath, getValueByPath } from '../path.js';
import {
  DataSource,
  type DataSourceFilterByFunction,
  type DataSourceFilterByPath,
  type DataSourceSortFunction
} from './data-source.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ArrayDataSource<T = any> extends DataSource<T> {
  #filteredItems: T[] = [];
  #items: T[];

  get items(): T[] {
    return this.#filteredItems;
  }

  set items(items: T[]) {
    this.#items = items;
    this.update();
  }

  get size(): number {
    return this.#items.length;
  }

  constructor(items: T[]) {
    super();
    this.#filteredItems = [...items];
    this.#items = [...items];
  }

  update(): void {
    let items: T[] = [...this.#items];

    // Filter the items
    if (this.filters.size) {
      const filters = Array.from(this.filters.values());

      const pathFilters = filters
        .filter((f): f is DataSourceFilterByPath => 'path' in f && !!f.path)
        .reduce(
          (acc, { path, value }) => {
            if (!acc[path]) {
              acc[path] = [];
            }

            if (Array.isArray(value)) {
              acc[path].push(...value);
            } else {
              acc[path].push(value);
            }

            return acc;
          },
          {} as Record<string, string[]>
        );

      Object.entries(pathFilters).forEach(([path, values]) => {
        /**
         * Convert the value to a string and trim it, so we can match
         * an empty string to:
         * - ''
         * - '   '
         * - null
         * - undefined
         */
        items = items.filter(item => values.includes(getValueByPath(item, path)?.toString()?.trim() ?? ''));
      });

      filters
        .filter((f): f is DataSourceFilterByFunction<T> => 'filter' in f && !!f.filter)
        .forEach(f => {
          items = items.filter(f.filter);
        });
    }

    // Sort the items
    if (this.sort) {
      const ascending = this.sort.direction === 'asc';

      let sortFn: DataSourceSortFunction<T>;

      if ('path' in this.sort && this.sort.path) {
        const path = this.sort.path;

        sortFn = (a: T, b: T): number => {
          const valueA = getStringByPath(a, path),
            valueB = getStringByPath(b, path);

          return valueA === valueB ? 0 : valueA < valueB ? -1 : 1;
        };
      } else if ('sorter' in this.sort && this.sort.sorter) {
        sortFn = this.sort.sorter;
      }

      items.sort((a, b) => {
        const result = sortFn(a, b);

        return ascending ? result : -result;
      });
    }

    // Group the items by first filtering them and then sorting
    if (this.groupBy) {
      const ascending = this.groupBy.direction === 'asc';

      let sortFn: DataSourceSortFunction<T>;

      if ('sorter' in this.groupBy && this.groupBy.sorter) {
        sortFn = this.groupBy.sorter;
      } else {
        const path = this.groupBy.path;

        sortFn = (a: T, b: T): number => {
          const valueA = getStringByPath(a, path),
            valueB = getStringByPath(b, path);

          return valueA === valueB ? 0 : valueA < valueB ? -1 : 1;
        };
      }

      items.sort((a, b) => {
        const result = sortFn(a, b);

        return ascending ? result : -result;
      });
    }

    this.#filteredItems = items;
    this.dispatchEvent(new CustomEvent('sl-data-source-update', { detail: { dataSource: this } }));
  }
}
