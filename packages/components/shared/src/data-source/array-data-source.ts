import type { DataSourceSortFunction } from './data-source.js';
import { getStringByPath, getValueByPath } from '../path.js';
import { DataSource, DataSourceGroup } from './data-source.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ArrayDataSource<T = any> extends DataSource<T> {
  #filteredItems: T[] = [];
  #groups = new Map<string, boolean>();
  #items: T[];

  get filteredItems(): T[] {
    return this.#filteredItems;
  }

  get groups(): string[] {
    return Array.from(this.#groups.keys());
  }

  get items(): T[] {
    return this.#items;
  }

  get size(): number {
    return this.#items.length;
  }

  constructor(items: T[]) {
    super();
    this.#filteredItems = [...items];
    this.#items = [...items];
  }

  toggleGroup(value: string, collapse = false): void {
    this.#groups.set(value, collapse ?? !this.#groups.get(value));
  }

  isGroupExpanded(value?: string | undefined): boolean {
    return value ? this.#groups.get(value) ?? true : true;
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

      const groups: string[] = [];
      items = items
        .map(item => {
          const value = getStringByPath(item, this.groupBy!.path);

          if (groups.includes(value)) {
            return this.isGroupExpanded(value) ? item : undefined;
          } else {
            groups.push(value);

            // If this is the start of a new group, insert a group item
            const group = new DataSourceGroup(this.groupBy!.path, value);

            return this.isGroupExpanded(value) ? [group, item] : group;
          }
        })
        .flatMap(item => item)
        .filter((item): item is T => item !== undefined);

      // Update the groups state
      groups.forEach(group => {
        if (!this.#groups.has(group)) {
          this.#groups.set(group, true);
        }
      });
    }

    this.#filteredItems = items;
    this.dispatchEvent(new CustomEvent<void>('sl-update'));
  }
}
