import { type PathKeys, getStringByPath, getValueByPath } from '@sl-design-system/shared';
import {
  DataSource,
  type DataSourceFilterByFunction,
  type DataSourceFilterByPath,
  type DataSourceSortFunction
} from './data-source.js';

/**
 * A data source that can be used to filter, group by, sort,
 * and paginate an array of items. Use this data source when
 * you have all the data you need in memory and you don't need
 * to load any additional data.
 */
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

    if (this.filters.size) {
      const filters = Array.from(this.filters.values());

      const pathFilters = filters
        .filter((f): f is DataSourceFilterByPath<T> => 'path' in f && !!f.path)
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
          {} as Record<PathKeys<T>, string[]>
        );

      for (const [path, values] of Object.entries<string[]>(pathFilters)) {
        /**
         * Convert the value to a string and trim it, so we can match
         * an empty string to:
         * - ''
         * - '   '
         * - null
         * - undefined
         */
        items = items.filter(item =>
          values.includes(
            getValueByPath(item, path as PathKeys<T>)
              ?.toString()
              ?.trim() ?? ''
          )
        );
      }

      filters
        .filter((f): f is DataSourceFilterByFunction<T> => 'filter' in f && !!f.filter)
        .forEach(f => {
          items = items.filter(f.filter);
        });
    }

    if (this.sort) {
      const ascending = this.sort.direction === 'asc';

      let sortFn: DataSourceSortFunction<T>;

      if ('path' in this.sort && this.sort.path) {
        const path = this.sort.path;

        sortFn = (a: T, b: T): number => {
          const valueA = getStringByPath(a, path),
            valueB = getStringByPath(b, path);

          const numberA = parseFloat(valueA),
            numberB = parseFloat(valueB);

          if (!isNaN(numberA) && !isNaN(numberB)) {
            return numberA - numberB;
          }

          return valueA.toLowerCase() === valueB.toLowerCase()
            ? 0
            : valueA.toLowerCase() < valueB.toLowerCase()
              ? -1
              : 1;
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

    // Paginate items
    if (this.page !== undefined && this.pageSize) {
      const start = this.page * this.pageSize,
        end = Math.min(start + this.pageSize, this.size);

      items = items.slice(start, end);
    }

    this.#filteredItems = items;
    this.dispatchEvent(new CustomEvent('sl-update', { detail: { dataSource: this } }));
  }
}
