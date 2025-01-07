import { DataSource, type DataSourceOptions, type DataSourceSort } from './data-source.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface FetchDataSourceCallbackOptions<T = any> {
  page: number;
  pageSize: number;
  sort?: DataSourceSort<T>;
  [key: string]: unknown;
}

export interface FetchDataSourceCallbackResult<T> {
  items: T[];
  totalItems?: number;
}

export type FetchDataSourceCallback<T> = (
  options: FetchDataSourceCallbackOptions
) => Promise<FetchDataSourceCallbackResult<T>>;

export type FetchDataSourcePlaceholder<T> = (n: number) => T;

export type FetchDataSourceOptions<T> = DataSourceOptions & {
  fetchPage: FetchDataSourceCallback<T>;
  pageSize?: number;
  placeholder?: FetchDataSourcePlaceholder<T>;
  size?: number;
};

export type FetchDataSourceEvent = CustomEvent<FetchDataSourceCallbackOptions>;

export const FetchDataSourceError = class extends Error {
  constructor(
    message: string,
    public response: Response
  ) {
    super(message);
  }
};

/** Symbol used as a placeholder for items that are being loaded. */
export const FetchDataSourcePlaceholder = Symbol('FetchDataSourcePlaceholder');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class FetchDataSource<T = any> extends DataSource<T> {
  /** The default size of the item collection if not explicitly set. */
  static defaultSize = 10;

  /** Array containing all the loaded items. */
  #items: T[] = [];

  /** Object for keeping track of outstanding fetch calls. */
  #pages: Record<number, Promise<void> | undefined> = {};

  /** Proxy of the items array. */
  #proxy: T[] = [];

  /** The total number of items in the data source. */
  #size: number;

  /** The callback for retrieving data. */
  fetchPage: FetchDataSourceCallback<T>;

  /** Returns placeholder data for items not yet loaded. */
  placeholder: FetchDataSourcePlaceholder<T> = () => FetchDataSourcePlaceholder as T;

  get items(): T[] {
    return this.#proxy;
  }

  get size(): number {
    return this.#size;
  }

  constructor(options: FetchDataSourceOptions<T>) {
    super(options);

    this.#size = options.size ?? FetchDataSource.defaultSize;
    this.fetchPage = options.fetchPage;

    if (typeof options.pageSize === 'number') {
      this.setPageSize(options.pageSize);
    }

    if (options.placeholder) {
      this.placeholder = options.placeholder;
    }
  }

  update(): void {
    let length = this.size;

    if (this.pagination) {
      const pageCount = Math.ceil(this.size / this.pageSize),
        lastPageSize = this.size % this.pageSize;

      if (this.page === pageCount - 1 && lastPageSize > 0) {
        length = lastPageSize;
      } else {
        length = this.pageSize;
      }
    }

    this.#items = new Array<T>(length);
    this.#pages = {};
    this.#proxy = this.#createProxy(this.#items);

    this.dispatchEvent(new CustomEvent('sl-update', { detail: { dataSource: this } }));
  }

  /**
   * Override this function if you are extending the `FetchDataSource` class to
   * provide any additional options you may need when `fetchPage` is called.
   */
  getFetchOptions(page: number, pageSize: number): FetchDataSourceCallbackOptions {
    return { filters: Array.from(this.filters.values()), page, pageSize, sort: this.sort };
  }

  #createProxy(items: T[]): T[] {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;

    return new Proxy(items, {
      get: function (target, property) {
        const length = that.pagination ? Math.min(target.length, that.pageSize) : that.size;

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

  #requestFetch(n: number): T {
    const { pageSize } = this,
      page = this.pagination ? this.page : Math.floor(n / pageSize);

    if (!this.#pages[page]) {
      this.#pages[page] = (async () => {
        const options = this.getFetchOptions(page, pageSize),
          res = await this.fetchPage(options);

        if (res.totalItems !== undefined) {
          this.#size = Number(res.totalItems);
        }

        for (let i = 0; i < res.items.length; i++) {
          const index = this.pagination ? i : pageSize * page + i;

          this.#items[index] = res.items[i];
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

    return (this.#items[n] = this.placeholder(n));
  }
}
