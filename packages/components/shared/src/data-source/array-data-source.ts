import { getStringByPath, getValueByPath } from '../path.js';
import { DataSource, type DataSourceSortFunction } from './data-source.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ArrayDataSource<T = any> extends DataSource<T> {
  #filteredItems: T[] = [];
  #items: T[];

  get filteredItems(): T[] {
    return this.#filteredItems;
  }

  get items(): T[] {
    return this.#items;
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
    for (const filter of this.filters.values()) {
      if ('filter' in filter && filter.filter) {
        items = items.filter(filter.filter);
      } else if ('path' in filter && filter.path) {
        const { path, value } = filter;

        const regexes = (Array.isArray(value) ? value : [value])
          .filter((v): v is string => typeof v === 'string')
          .map(v => (v === '' ? /^\s*$/ : new RegExp(v, 'i')));

        items = items.filter(item => {
          const v = getValueByPath(item, path);

          return regexes.some(regex => regex.test(v?.toString() ?? ''));
        });
      }
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
    this.dispatchEvent(new CustomEvent<void>('sl-update'));
  }
}
