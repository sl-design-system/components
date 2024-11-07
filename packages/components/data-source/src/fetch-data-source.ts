import { DataSource, type DataSourceSort } from './data-source.js';

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

export interface FetchDataSourceOptions<T> {
  fetchPage: FetchDataSourceCallback<T>;
  pageSize: number;
  placeholder?: FetchDataSourcePlaceholder<T>;
  size?: number;
}

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

  /** The page size when retrieving data. */
  pageSize: number;

  /** Returns placeholder data for items not yet loaded. */
  placeholder: FetchDataSourcePlaceholder<T> = () => FetchDataSourcePlaceholder as T;

  get items(): T[] {
    return this.#proxy;
  }

  get size(): number {
    return this.#size;
  }

  constructor({ fetchPage, pageSize, placeholder, size }: FetchDataSourceOptions<T>) {
    super();
    this.#size = size ?? FetchDataSource.defaultSize;
    this.fetchPage = fetchPage;
    this.pageSize = pageSize;

    if (placeholder) {
      this.placeholder = placeholder;
    }
  }

  update(): void {
    this.#items = new Array<T>(this.size);
    this.#pages = {};
    // this.#proxy = this.#createProxy(this.#items);
    if (this.page) {
      console.log('this.page in update', this.page);
      this.paginate(this.page.page, this.pageSize, this.page.totalItems);
    }
    this.#proxy = this.#createProxy(this.#items);
    console.log('proxy in update', this.#proxy, this.items, this.#items, this.#pages, this.#proxy.length);
    this.dispatchEvent(new CustomEvent('sl-update', { detail: { dataSource: this } }));
  }

  /**
   * Override this function if you are extending the `FetchDataSource` class to
   * provide any additional options you may need when `fetchPage` is called.
   */
  getFetchOptions(page: number, pageSize: number): FetchDataSourceCallbackOptions {
    return { filters: Array.from(this.filters.values()), page, pageSize, sort: this.sort, pagination: this.page };
  }

  #createProxy(items: T[]): T[] {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;

    return new Proxy(items, {
      get: function (target, property) {
        // if (that.page) {
        //   // page = this.page.page;
        //   property = 'at';
        // }

        console.log('items in proxy', items);

        console.log('111target, property in proxy', target, property, that);
        if (property === 'length') {
          return that.size;
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
        } else {
          const n = Number(property);
          if (!isNaN(n) && Math.round(n) === n) {
            return target[n] ?? that.#requestFetch(n);
          }

          return target[property as keyof T[]];
        }

        // console.log('target, property in proxy', target, property);
      }
    });
  }

  #requestFetch(n: number): T {
    const { pageSize } = this;

    let page = Math.ceil((n + 1) / pageSize);

    console.log('n in requestFetch22', n, pageSize, page, this.#pages, this.#pages[page], this.page);

    if (this.page) {
      page = this.page.page;

      this.#pages[page] = (async () => {
        const options = this.getFetchOptions(page, pageSize),
          res = await this.fetchPage(options);

        console.log('options,', options, res, 'nnn', n, options.pagination, res.items.length);

        if (res.totalItems !== undefined) {
          this.#size = Number(res.totalItems);
        }

        // if (res.pagination) {
        //   page = res.pagination.page;
        // }

        // console.log('res.totalItems', res.totalItems, this.#size, res.items.length);

        for (let i = 0; i < res.items.length; i++) {
          this.#items[pageSize * (page - 1) + i] = res.items[i];
          console.log(
            'in if request fetch',
            (this.#items[pageSize * (page - 1) + i] = res.items[i]),
            page,
            i,
            this.#items
          );
        }

        this.dispatchEvent(new CustomEvent('sl-update', { detail: { dataSource: this } }));
      })();

      console.log('this.#pages11', this.#pages);
    } else if (!this.#pages[page]) {
      this.#pages[page] = (async () => {
        const options = this.getFetchOptions(page, pageSize),
          res = await this.fetchPage(options);

        console.log('options,', options, res, 'nnn', n, options.pagination);

        if (res.totalItems !== undefined) {
          this.#size = Number(res.totalItems);
        }

        // if (res.pagination) {
        //   page = res.pagination.page;
        // }

        // console.log('res.totalItems', res.totalItems, this.#size, res.items.length);

        for (let i = 0; i < res.items.length; i++) {
          this.#items[pageSize * (page - 1) + i] = res.items[i];
        }

        this.dispatchEvent(new CustomEvent('sl-update', { detail: { dataSource: this } }));
      })();
    }

    return (this.#items[n] = this.placeholder(n));
  }
}
