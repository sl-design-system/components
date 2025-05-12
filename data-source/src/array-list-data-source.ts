import { type PathKeys, getStringByPath, getValueByPath } from '@sl-design-system/shared';
import {
  type DataSourceFilterByFunction,
  type DataSourceFilterByPath,
  type DataSourceSortFunction
} from './data-source.js';
import { ListDataSource, type ListDataSourceItem, type ListDataSourceOptions } from './list-data-source.js';

/**
 * A data source that can be used to filter, group by, sort,
 * and paginate an array of items. Use this data source when
 * you have all the data you need in memory and you don't need
 * to load any additional data.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ArrayListDataSource<T = any> extends ListDataSource<T> {
  /** The groups within the data source. */
  #groups?: Map<unknown, ListDataSourceItem<T>>;

  /** The filtered, grouped and sorted items. */
  #items: Array<ListDataSourceItem<T>> = [];

  /** The mapped array of items, as provided in the constructor. */
  #mappedItems: Array<ListDataSourceItem<T>> = [];

  /** The items, including any group items. This is used for rendering the list. */
  #viewItems: Array<ListDataSourceItem<T>> = [];

  /** Set of collapsed group ids. */
  collapsedGroups: Set<unknown> = new Set();

  get items() {
    return this.#viewItems;
  }

  get size(): number {
    return this.#items.length;
  }

  get totalSize(): number {
    return this.#mappedItems.length;
  }

  get unfilteredItems() {
    return this.#mappedItems;
  }

  constructor(items: T[], options: ListDataSourceOptions<T> = {}) {
    super(options);

    if (options.groups) {
      this.#groups = new Map(
        options.groups.map(group => [
          group.id,
          {
            ...group,
            type: 'group'
          } as ListDataSourceItem<T>
        ])
      );
    }

    this.#mappedItems = items.map(item => ({
      group: options.getGroup?.(item) ?? (options.groupBy ? getValueByPath(item, options.groupBy) : undefined),
      id: options.getId?.(item) ?? item,
      item,
      selected: options.isSelected?.(item),
      type: 'item'
    }));

    this.update(false);
  }

  override expandGroup(id: unknown): void {
    console.log('expand group', id);
  }

  override collapseGroup(id: unknown): void {
    console.log('collapse group', id);
  }

  override toggleGroup(id: unknown): void {
    console.log('toggle group', id);
  }

  update(emitEvent = true): void {
    let items = [...this.#mappedItems];

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
        items = items.filter(
          ({ item }) =>
            item &&
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
          items = items.filter(({ item }) => item && f.filter(item, f.value));
        });
    }

    if (this.sort) {
      let sortFn: DataSourceSortFunction<T>;

      if ('path' in this.sort && this.sort.path) {
        const path = this.sort.path;

        sortFn = (a: T, b: T): number => {
          const valueA = getStringByPath(a, path),
            valueB = getStringByPath(b, path);

          const numberA = Number(valueA),
            numberB = Number(valueB);

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