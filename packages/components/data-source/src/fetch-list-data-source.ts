import { type DataSourceSort } from './data-source.js';
import {
  ListDataSource,
  type ListDataSourceGroupItem,
  type ListDataSourceItem,
  type ListDataSourceMapping,
  type ListDataSourceOptions,
  ListDataSourcePlaceholder
} from './list-data-source.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface FetchListDataSourceCallbackOptions<T = any> {
  page: number;
  pageSize: number;
  sort?: DataSourceSort<T>;
  [key: string]: unknown;
}

export interface FetchListDataSourceCallbackResult<T> {
  items: T[];
  totalItems?: number;
}

export type FetchListDataSourceCallback<T> = (
  options: FetchListDataSourceCallbackOptions
) => Promise<FetchListDataSourceCallbackResult<T>>;

export type FetchListDataSourcePlaceholder<T> = (n: number) => T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface FetchListDataSourceGroupItem<T = any> extends ListDataSourceGroupItem<T> {
  /** The pages that have been fetched for this group. */
  pages: Record<number, Promise<void> | undefined>;
}

export interface FetchListDataSourceOptions<T> extends ListDataSourceOptions<T> {
  /**
   * The function to call to fetch the data. This function should return a promise
   * that resolves to an object containing the items and the total number of items.
   */
  fetchPage: FetchListDataSourceCallback<T>;

  /**
   * An explicit array of groups. Use this when you initially only want to show the groups.
   * The groups can be collapsed by default. When the user expands a group, the items
   * can then be loaded on demand.
   */
  groups?: Array<Partial<ListDataSourceGroupItem>>;

  /** The number of items to fetch per page. */
  pageSize: number;

  /** Callback for customizing the placeholder value for the given index. */
  placeholder?: FetchListDataSourcePlaceholder<T>;

  /**
   * The total number of items in the data source. If not provided, the data source will
   * use the total number of items returned by the fetch function. This is useful when
   * the data source is paginated and the total number of items is not known in advance.
   */
  size?: number;
}

export type FetchListDataSourceEvent = CustomEvent<FetchListDataSourceCallbackOptions>;

export const FetchListDataSourceError = class extends Error {
  constructor(
    message: string,
    public response: Response
  ) {
    super(message);
  }
};

/** Symbol used as a placeholder for items that are being loaded. */
export const FetchListDataSourcePlaceholder = Symbol('FetchListDataSourcePlaceholder');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class FetchListDataSource<T = any> extends ListDataSource<T> {
  /** The default size of the item collection if not explicitly set. */
  static defaultSize = 10;

  /** The groups within the data source. */
  // eslint-disable-next-line no-unused-private-class-members
  #groups?: Map<unknown, FetchListDataSourceGroupItem<T>>;

  /** Array containing all the loaded items. */
  #items: Array<ListDataSourceItem<T>> = [];

  /** The mapping from the source items to the ListDataSourceItem. */
  #mapping: ListDataSourceMapping<T>;

  /** Object for keeping track of outstanding fetch calls. */
  #pages: Record<number, Promise<void> | undefined> = {};

  /** Proxy of the items array. */
  #proxy: Array<ListDataSourceItem<T>> = [];

  /** The total number of items in the data source. */
  #totalSize: number;

  /** The callback for retrieving data. */
  fetchPage: FetchListDataSourceCallback<T>;

  /** Returns placeholder data for items not yet loaded. */
  placeholder: FetchListDataSourcePlaceholder<T> = () => FetchListDataSourcePlaceholder as T;

  get items() {
    return this.#proxy;
  }

  get size(): number {
    return this.#items.length;
  }

  get totalSize(): number {
    return this.#totalSize;
  }

  constructor(options: FetchListDataSourceOptions<T>) {
    super(options);

    if (options.groups) {
      this.#groups = new Map(
        options.groups.map(group => [
          group.id,
          {
            ...group,
            id: group.id ?? group,
            type: 'group',
            members: []
          }
        ])
      );
    }

    this.#mapping = {
      getGroupId: options.getGroupId,
      getId: options.getId ?? (item => item),
      isSelected: options.isSelected
    };

    this.#totalSize = options.size ?? FetchListDataSource.defaultSize;
    this.fetchPage = options.fetchPage;

    if (typeof options.pageSize === 'number') {
      this.setPageSize(options.pageSize);
    }

    if (options.placeholder) {
      this.placeholder = options.placeholder;
    }

    // Initialize the items array, but do not emit an event yet
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

  override isGroupCollapsed(_id: unknown): boolean {
    return false;
  }

  update(emitEvent = true): void {
    let length = this.totalSize;

    if (this.pagination) {
      const pageCount = Math.ceil(this.size / this.pageSize),
        lastPageSize = this.size % this.pageSize;

      if (this.page === pageCount - 1 && lastPageSize > 0) {
        length = lastPageSize;
      } else {
        length = this.pageSize;
      }
    }

    this.#items = Array.from({ length });
    this.#pages = {};
    this.#proxy = this.#createProxy(this.#items);

    if (emitEvent) {
      this.dispatchEvent(new CustomEvent('sl-update', { detail: { dataSource: this } }));
    }
  }

  /**
   * Override this function if you are extending the `FetchListDataSource` class to
   * provide any additional options you may need when `fetchPage` is called.
   */
  getFetchOptions(page: number, pageSize: number): FetchListDataSourceCallbackOptions {
    return { filters: Array.from(this.filters.values()), page, pageSize, sort: this.sort };
  }

  #createProxy(items: Array<ListDataSourceItem<T>>): Array<ListDataSourceItem<T>> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;

    return new Proxy(items, {
      get: function (target, property) {
        const length = that.pagination ? Math.min(target.length, that.pageSize) : that.totalSize;

        if (property === 'length') {
          return length;
        } else if (property === 'at') {
          return (n: number) => {
            let index = n;
            if (n < 0) {
              index = that.size + n;
            } else if (n >= that.size) {
              index = n % that.size;
            }

            return target[index] ?? that.#requestFetch(index);
          };
        } else if (property === Symbol.iterator) {
          return function* () {
            for (let i = 0; i < length; i++) {
              yield target[i] ?? that.#requestFetch(i);
            }
          };
        } else {
          const n = Number(property);
          if (!isNaN(n) && Math.round(n) === n) {
            return target[n] ?? that.#requestFetch(n);
          }

          return target[property as keyof T[]];
        }
      }
    });
  }

  #mapToItem(item: T): ListDataSourceItem<T> {
    return {
      id: this.#mapping.getId!(item),
      data: item,
      type: 'data'
    };
  }

  #requestFetch(n: number): ListDataSourceItem<T> {
    const { pageSize } = this,
      page = this.pagination ? this.page : Math.floor(n / pageSize);

    if (!this.#pages[page]) {
      this.#pages[page] = (async () => {
        const options = this.getFetchOptions(page, pageSize),
          res = await this.fetchPage(options);

        if (res.totalItems !== undefined) {
          this.#totalSize = Number(res.totalItems);
        }

        for (let i = 0; i < res.items.length; i++) {
          const index = this.pagination ? i : pageSize * page + i;

          this.#items[index] = this.#mapToItem(res.items[i]);
        }

        /**
         * When pagination is enabled and we are fetching a page for the first time,
         * the size may be smaller than the initial size. In this case, we need to
         * recreate the Proxy object to reflect the new size.
         */
        if (this.pagination && this.#items.length !== res.items.length) {
          this.#proxy = this.#createProxy(this.#items.slice(0, res.items.length));
        }

        this.dispatchEvent(new CustomEvent('sl-update', { detail: { dataSource: this } }));
      })();
    }

    return (this.#items[n] = { id: ListDataSourcePlaceholder, type: 'data' } as ListDataSourceItem<T>);
  }
}
