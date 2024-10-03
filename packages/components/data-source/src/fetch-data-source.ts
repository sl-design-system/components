import { DataSource } from './data-source.js';

export interface FetchDataSourceCallbackOptions {
  page: number;
  pageSize: number;
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
    this.#proxy = this.#createProxy(this.#items);
    this.dispatchEvent(new CustomEvent('sl-data-source-update', { detail: { dataSource: this } }));
  }

  /**
   * Override this function if you are extending the `FetchDataSource` class to
   * provide any additional options you may need when `fetchPage` is called.
   */
  protected getFetchOptions(page: number, pageSize: number): FetchDataSourceCallbackOptions {
    return { page, pageSize };
  }

  #createProxy(items: T[]): T[] {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;

    return new Proxy(items, {
      get: function (target, property) {
        if (property === 'length') {
          return that.size;
        }
        const n = Number(property);
        if (!isNaN(n) && Math.round(n) === n) {
          return target[n] || that.#requestFetch(n);
        }
        return target[property as keyof T[]];
      }
    });
  }

  #requestFetch(n: number): T {
    const { pageSize } = this,
      page = Math.ceil((n + 1) / pageSize);

    if (!this.#pages[page]) {
      this.#pages[page] = (async () => {
        const options = this.getFetchOptions(page, pageSize),
          res = await this.fetchPage(options);

        if (res.totalItems !== undefined) {
          this.#size = Number(res.totalItems);
        }

        for (let i = 0; i < res.items.length; i++) {
          this.#items[pageSize * (page - 1) + i] = res.items[i];
        }

        this.dispatchEvent(new CustomEvent('sl-data-source-update', { detail: { dataSource: this } }));
        // this.dispatchEvent(new CustomEvent<FetchDataSourceCallbackOptions>('data', { detail: options }));
      })();
    }

    return (this.#items[n] = this.placeholder(n));
  }
}
