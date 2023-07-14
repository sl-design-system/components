import type { DataSourceFilterFunction, DataSourceFilterValue } from './data-source.js';
import { getStringByPath, getValueByPath } from '../path.js';
import { DataSource } from './data-source.js';

export class ArrayDataSource<T> extends DataSource<T> {
  /** Array of filtered & sorted items. */
  #items: T[] = [];

  /** The original array of items as passed to the constructor. */
  #originalItems: T[];

  get items(): T[] {
    return this.#items;
  }

  get size(): number {
    return this.#items.length;
  }

  constructor(items: T[]) {
    super();
    this.#items = [...items];
    this.#originalItems = [...items];
  }

  update(): void {
    let items = [...this.#originalItems];

    if (this.filterValues) {
      const filterFn: DataSourceFilterFunction<T> = this.filter?.(this.filterValues) || this.#filter(this.filterValues);

      items = items.filter(filterFn);
    }

    if (this.sortValue) {
      const { direction, path } = this.sortValue,
        ascending = direction === 'asc';

      const sortFn =
        this.sortFunction ||
        this.sorter?.(this.sortValue) ||
        ((a, b) => {
          const valueA = getStringByPath(a, path),
            valueB = getStringByPath(b, path);

          return valueA === valueB ? 0 : valueA < valueB ? -1 : 1;
        });

      items.sort((a, b) => {
        const result = sortFn(a, b);

        return ascending ? result : -result;
      });
    }

    this.#items = items;
    this.dispatchEvent(new CustomEvent<void>('sl-update'));
  }

  #filter(values: DataSourceFilterValue[]): DataSourceFilterFunction<T> {
    const filters = values.map(({ path, value }) => {
      const regexes = (Array.isArray(value) ? value : [value])
        .filter((v): v is string => !!v)
        .map(v => new RegExp(v, 'i'));

      return (item: T) => {
        const value = getValueByPath(item, path)?.toString() ?? '';

        return regexes.some(regex => regex.test(value));
      };
    });

    return item => filters.every(fn => fn(item));
  }
}
