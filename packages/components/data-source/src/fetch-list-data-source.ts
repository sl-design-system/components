import { type DataSourceFilter, type DataSourceSort } from './data-source.js';
import {
  ListDataSource,
  type ListDataSourceDataItem,
  type ListDataSourceGroupItem,
  type ListDataSourceItem,
  type ListDataSourceMapping,
  type ListDataSourceOptions,
  ListDataSourcePlaceholder
} from './list-data-source.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface FetchListDataSourceCallbackOptions<T = any> {
  filters?: Array<DataSourceFilter<T>>;
  group: FetchListDataSourceGroupItem<T>['id'];
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
  options: FetchListDataSourceCallbackOptions<T>
) => Promise<FetchListDataSourceCallbackResult<T>>;

export type FetchListDataSourcePlaceholder<T> = (n: number) => T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface FetchListDataSourceGroupItem<T = any> extends ListDataSourceGroupItem<T> {
  /** The pages that have been fetched for this group. */
  pages: Record<number, Promise<void> | undefined>;

  /** The start index of the group. */
  startIndex?: number;
}

export interface FetchListDataSourceOptions<T> extends ListDataSourceOptions<T> {
  /**
   * The function to call to fetch the data. This function should return a promise that resolves to
   * an object containing the items and the total number of items.
   */
  fetchPage: FetchListDataSourceCallback<T>;

  /**
   * An explicit array of groups. Use this when you initially only want to show the groups. The
   * groups can be collapsed by default. When the user expands a group, the items can then be loaded
   * on demand.
   */
  groups?: Array<Partial<ListDataSourceGroupItem> & { collapsed?: boolean }>;

  /** The number of items to fetch per page. */
  pageSize: number;

  /** Callback for customizing the placeholder value for the given index. */
  placeholder?: FetchListDataSourcePlaceholder<T>;

  /**
   * The total number of items in the data source. If not provided, the data source will use the
   * total number of items returned by the fetch function. This is useful when the data source is
   * paginated and the total number of items is not known in advance.
   */
  size?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FetchListDataSourceEvent<T = any> = CustomEvent<FetchListDataSourceCallbackOptions<T>>;

export class FetchListDataSourceError extends Error {
  constructor(
    message: string,
    public response: Response
  ) {
    super(message);
  }
}

/** Symbol used as a placeholder for items that are being loaded. */
export const FetchListDataSourcePlaceholder = Symbol('FetchListDataSourcePlaceholder');

/** Symbol used as the ID for the dummy group when no groups are provided */
const FetchListDataSourceDummyGroup = Symbol('FetchListDataSourceDummyGroup');

interface PendingFetch<T> {
  callback: FetchListDataSourceCallback<T>;
  key: readonly unknown[];
  promise: Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class FetchListDataSource<T = any> extends ListDataSource<T> {
  /** The default size of the item collection if not explicitly set. */
  static defaultSize = 10;

  /** The groups within the data source. */
  #groups: Map<unknown, FetchListDataSourceGroupItem<T>>;

  /** Array containing all the loaded items. */
  #items: Array<ListDataSourceItem<T>> = [];

  /** The mapping from the source items to the ListDataSourceItem. */
  #mapping: ListDataSourceMapping<T>;

  /** Proxy of the items array. */
  #proxy: Array<ListDataSourceItem<T>> = [];

  /** In-flight requests that can be reused while their fetch options remain unchanged. */
  #pending = new WeakMap<FetchListDataSourceGroupItem<T>, Map<number, PendingFetch<T>>>();

  /** Whether the unfiltered total is known rather than an estimate. */
  #totalSizeKnown: boolean;

  /** Known unfiltered totals for individual groups. Filtered responses do not update these. */
  #unfilteredGroupSizes = new Map<unknown, number>();

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
    return Array.from(this.#groups.values()).reduce((acc, group) => acc + (group.size ?? 0), 0);
  }

  get totalSize(): number {
    return this.#totalSize;
  }

  protected override get selectionSize(): number | undefined {
    return this.#totalSizeKnown ? this.totalSize : undefined;
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
            members: Array.from({ length: group.size ?? FetchListDataSource.defaultSize }),
            pages: {}
          }
        ])
      );

      // Initialize collapsed state from options
      for (const group of options.groups) {
        if (group.collapsed ?? true) {
          this.collapseGroup(group.id ?? group);
        }
      }
    } else {
      // Create a dummy group for managing the pages when no groups are provided
      this.#groups = new Map([
        [
          FetchListDataSourceDummyGroup,
          {
            id: FetchListDataSourceDummyGroup,
            type: 'group',
            members: Array.from({ length: options.size ?? FetchListDataSource.defaultSize }),
            pages: {},
            size: options.size ?? FetchListDataSource.defaultSize
          }
        ]
      ]);
    }

    this.#mapping = {
      getGroupId: options.getGroupId,
      getId: options.getId ?? (item => item),
      isSelected: options.isSelected
    };

    this.#totalSize = options.size ?? FetchListDataSource.defaultSize;
    this.#totalSizeKnown = options.size !== undefined;
    if (options.groups || options.size !== undefined) {
      this.#groups.forEach(group => {
        if (group.size !== undefined) {
          this.#unfilteredGroupSizes.set(group.id, group.size);
        }
      });
    }
    this.#updateTotalSize();
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

  override reorder(
    _item: ListDataSourceItem<T>,
    _relativeItem: ListDataSourceItem<T>,
    _position: 'before' | 'after'
  ): void {
    console.log('Reordering items is not supported in FetchListDataSource');
  }

  update(emitEvent = true): void {
    // Reset the cached items
    this.#groups.forEach(group => {
      group.members = undefined;
      group.pages = {};

      this.#pending.get(group)?.forEach((request, page) => {
        const key = this.#getFetchOptionsKey(this.getFetchOptions(group, page, this.pageSize));

        if (
          request.callback === this.fetchPage &&
          request.key.length === key.length &&
          request.key.every((value, index) => Object.is(value, key[index]))
        ) {
          group.pages[page] = request.promise;
        } else {
          this.#pending.get(group)!.delete(page);
        }
      });
    });

    this.#items = this.#createItemsArray();
    this.#proxy = this.#createProxy(this.#items);

    if (emitEvent) {
      // An empty list has no items to access, so it cannot trigger a lazy fetch.
      // Refetch the current page explicitly to discover items after an update.
      if (this.#groups.has(FetchListDataSourceDummyGroup) && this.#items.length === 0) {
        this.#requestFetch(0);
      }

      this.dispatchEvent(new CustomEvent('sl-update', { detail: { dataSource: this } }));
    }
  }

  /**
   * Override this function if you are extending the `FetchListDataSource` class to provide any
   * additional options you may need when `fetchPage` is called.
   */
  getFetchOptions(
    group: FetchListDataSourceGroupItem<T>,
    page: number,
    pageSize: number
  ): FetchListDataSourceCallbackOptions<T> {
    return {
      filters: Array.from(this.filters.values()),
      group: group.id,
      page,
      pageSize,
      sort: this.sort
    };
  }

  #createItemsArray(): Array<ListDataSourceItem<T>> {
    if (this.#groups.has(FetchListDataSourceDummyGroup)) {
      const group = this.#groups.values().next().value!,
        size = group.size ?? FetchListDataSource.defaultSize;

      let length = size,
        startIndex = 0;

      if (this.pagination) {
        const pageCount = Math.ceil(size / this.pageSize),
          lastPageSize = size % this.pageSize;

        startIndex = this.page * this.pageSize;

        if (this.page === pageCount - 1 && lastPageSize > 0) {
          length = lastPageSize;
        } else {
          length = this.pageSize;
        }
      }

      // Make sure the members array is initialized
      group.members ??= Array.from({ length: size });

      if (this.pagination) {
        return group.members.slice(startIndex, startIndex + length);
      } else {
        return group.members;
      }
    } else {
      return this.#flattenGroups(this.#groups);
    }
  }

  #createProxy(items: Array<ListDataSourceItem<T>>): Array<ListDataSourceItem<T>> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;

    return new Proxy(items, {
      get: function (target, property) {
        const length = that.pagination ? Math.min(target.length, that.pageSize) : target.length;

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
            if (n >= 0 && n < length) {
              return target[n] ?? that.#requestFetch(n);
            } else {
              return undefined;
            }
          }

          return target[property as keyof T[]];
        }
      }
    });
  }

  #flattenGroups(
    groups: Map<unknown, FetchListDataSourceGroupItem<T>>
  ): Array<ListDataSourceItem<T>> {
    const items: Array<ListDataSourceItem<T>> = [];

    let index = 0;

    groups.forEach(group => {
      items.push(group);

      group.startIndex = index;

      if (!this.isGroupCollapsed(group.id) && group.members) {
        items.push(...group.members);
        index += group.members.length;
      }

      // Add 1 for the group header
      index++;
    });

    return items;
  }

  #getGroupAtIndex(index: number): FetchListDataSourceGroupItem<T> | undefined {
    let currentIndex = 0;

    for (const group of this.#groups.values()) {
      // Always count the group header itself
      let groupSize = 1;
      if (!this.isGroupCollapsed(group.id) && group.members) {
        groupSize += group.members.length;
      }

      if (index < currentIndex + groupSize) {
        return group;
      }

      currentIndex += groupSize;
    }

    return undefined;
  }

  #requestFetch(n: number): ListDataSourceItem<T> {
    const group = this.#getGroupAtIndex(n)!,
      { pageSize } = this,
      page = this.pagination ? this.page : Math.floor((n - (group.startIndex ?? 0)) / pageSize);

    if (!group.pages[page]) {
      const options = this.getFetchOptions(group, page, pageSize),
        callback = this.fetchPage,
        key = this.#getFetchOptionsKey(options);

      let pending = this.#pending.get(group);
      if (!pending) {
        pending = new Map();
        this.#pending.set(group, pending);
      }

      const request = (async () => await callback.call(this, options))()
        .finally(() => {
          if (pending.get(page)?.promise === request) {
            pending.delete(page);
          }
        })
        .then(res => {
          // An update with different options invalidates this response, even if it
          // arrives after the replacement request has completed.
          if (group.pages[page] !== request) {
            return;
          }

          // If the size of the group changes, or pagination is enabled, we need to
          // recreate the proxy to ensure that the array with items is up to date.
          let recreateProxy = this.pagination;

          if (res.totalItems !== undefined) {
            group.size = Number(res.totalItems);
          } else if (res.items.length > 0) {
            // Without a total, fetched items establish a lower bound for the size.
            group.size = Math.max(
              group.size ?? group.members?.length ?? 0,
              page * pageSize + res.items.length
            );
          }

          if (!options.filters?.length && res.totalItems !== undefined) {
            this.#unfilteredGroupSizes.set(group.id, Number(res.totalItems));
            this.#updateTotalSize();
          }

          if (group.size !== undefined && group.size !== group.members?.length) {
            recreateProxy = true;

            const members = group.members ?? [];
            group.members = Array.from({ length: group.size });

            for (let i = 0; i < group.size; i++) {
              group.members[i] = members[i];
            }
          }

          for (let i = 0; i < res.items.length; i++) {
            const index = pageSize * page + i,
              item = res.items[i];

            group.members![index] = {
              id: this.#mapping.getId!(item),
              type: 'data',
              data: item
            };
          }

          if (recreateProxy) {
            this.#items = this.#createItemsArray();
            this.#proxy = this.#createProxy(this.#items);
          }

          this.dispatchEvent(new CustomEvent('sl-update', { detail: { dataSource: this } }));
        });

      group.pages[page] = request;
      pending.set(page, {
        callback,
        key,
        promise: request
      });
    }

    return {
      id: ListDataSourcePlaceholder,
      type: 'data',
      data: ListDataSourcePlaceholder
    } as ListDataSourceDataItem<T>;
  }

  #updateTotalSize(): void {
    if (this.#unfilteredGroupSizes.size === this.#groups.size) {
      this.#totalSize = Array.from(this.#unfilteredGroupSizes.values()).reduce(
        (total, size) => total + size,
        0
      );
      this.#totalSizeKnown = true;
    }
  }

  /**
   * Capture array and plain-object contents without retaining mutable references. Functions and
   * symbols keep their identity. Unsupported objects and accessors conservatively prevent request
   * reuse rather than risk accepting stale data.
   */
  #getFetchOptionsKey(options: FetchListDataSourceCallbackOptions<T>): readonly unknown[] {
    const key: unknown[] = [],
      seen = new Map<object, number>();

    const visit = (value: unknown): void => {
      if (value === null || typeof value !== 'object') {
        key.push(typeof value, value);
        return;
      }

      if (seen.has(value)) {
        key.push('reference', seen.get(value));
        return;
      }

      seen.set(value, seen.size);
      const prototype: unknown = Object.getPrototypeOf(value);

      if (Array.isArray(value)) {
        key.push('array', value.length);
      } else if (value instanceof Date) {
        key.push('date', value.getTime());
      } else if (prototype === Object.prototype || prototype === null) {
        key.push('object', prototype);
      } else {
        key.push('unsupported', Symbol());
        return;
      }

      const properties = Reflect.ownKeys(value).filter(
        property => Object.getOwnPropertyDescriptor(value, property)?.enumerable
      );
      key.push(properties.length);

      for (const property of properties) {
        const descriptor = Object.getOwnPropertyDescriptor(value, property)!;
        key.push(property);
        if ('value' in descriptor) {
          visit(descriptor.value);
        } else {
          key.push('accessor', Symbol());
        }
      }
    };

    visit(options);
    return key;
  }
}
