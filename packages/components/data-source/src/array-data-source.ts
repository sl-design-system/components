import { getStringByPath, getValueByPath } from '@sl-design-system/shared';
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
  #paginatedItems: T[] = [];

  get items(): T[] {
    return this.#filteredItems;
  }

  set items(items: T[]) {
    this.#items = items;
    this.update();
  }

  get paginatedItems(): T[] {
    return this.#paginatedItems;
  }

  set paginatedItems(items: T[]) {
    this.#paginatedItems = items;
    console.log('test', this.#paginatedItems, items, this.items);
    this.update();
  }

  get size(): number {
    return this.#items.length;
  }

  constructor(items: T[]) {
    super();
    this.#filteredItems = [...items];
    this.#items = [...items];
    this.#paginatedItems = [...items];
  }

  update(): void {
    let items: T[] = [...this.#items];

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

    this.#paginatedItems = items;

    // paginate items
    if (this.paginateItems) {
      console.log('this.paginateItems', this.paginateItems);
      // const pagination = {pageNumber: pageNumber, pageSize: pageSize};
      // console.log('pagination in paginate', pagination);

      // const pageNumber = /*filtersChanged /!*this.filters.size > 0*!/ ? 1 :*/ this.paginateItems.pageNumber;
      // this.paginateItems.pageNumber = pageNumber;
      //  this.paginate(10, pageNumber);
      //   this.paginateItems.pageNumber = pageNumber;

      const startIndex = (this.paginateItems.pageNumber /*pageNumber*/ - 1) * this.paginateItems.pageSize;
      const endIndex = startIndex + this.paginateItems.pageSize;
      // console.log('pageNumber in array data source', pageNumber, filtersChanged, startIndex);
      // Get the items for the current page
      /*const paginatedItems*/
      items = items.slice(startIndex, endIndex);
      // console.log('paginated data', paginatedItems);
      // Update this.items with the paginated items
      // this.paginatedItems/*items*/ = paginatedItems;
      //  console.log('updated items', this.items, this.paginatedItems, items);
    }

    // TODO: I need to have amount of all filtered data for total to show in the paginator...

    console.log('paginateditems?', this.paginatedItems);
    console.log('items in array data', items);

    this.#filteredItems = items;
    this.dispatchEvent(new CustomEvent('sl-update', { detail: { dataSource: this } }));
  }
}
