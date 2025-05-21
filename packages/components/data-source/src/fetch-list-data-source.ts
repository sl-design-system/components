import { type DataSourceSort } from './data-source.js';
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
  options: FetchListDataSourceCallbackOptions
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

/** Symbol used as the ID for the dummy group when no groups are provided */
const FetchListDataSourceDummyGroup = Symbol('FetchListDataSourceDummyGroup');

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
            collapsed: group.collapsed ?? true,
            members: Array.from({ length: group.size ?? FetchListDataSource.defaultSize }),
            pages: {}
          }
        ])
      );
    } else {
      // Create a dummy group for managing the pages when no groups are provided
      this.#groups = new Map([
        [
          FetchListDataSourceDummyGroup,
          {
            id: FetchListDataSourceDummyGroup,
            type: 'group',
            collapsed: false,
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
    const group = this.#groups.get(id);
    if (group) {
      group.collapsed = false;
    }
  }

  override collapseGroup(id: unknown): void {
    const group = this.#groups.get(id);
    if (group) {
      group.collapsed = true;
    }
  }

  override toggleGroup(id: unknown): void {
    if (this.isGroupCollapsed(id)) {
      this.expandGroup(id);
    } else {
      this.collapseGroup(id);
    }
  }

  override isGroupCollapsed(id: unknown): boolean {
    return this.#groups.get(id)?.collapsed ?? false;
  }

  update(emitEvent = true): void {
    // let length = this.totalSize;

    // if (this.pagination) {
    //   const pageCount = Math.ceil(this.size / this.pageSize),
    //     lastPageSize = this.size % this.pageSize;

    //   if (this.page === pageCount - 1 && lastPageSize > 0) {
    //     length = lastPageSize;
    //   } else {
    //     length = this.pageSize;
    //   }
    // }

    // Reset the cached items
    this.#groups.forEach(group => (group.pages = {}));

    this.#items = this.#createItemsArray();
    this.#proxy = this.#createProxy(this.#items);

    if (emitEvent) {
      this.dispatchEvent(new CustomEvent('sl-update', { detail: { dataSource: this } }));
    }
  }

  /**
   * Override this function if you are extending the `FetchListDataSource` class to
   * provide any additional options you may need when `fetchPage` is called.
   */
  getFetchOptions(
    group: FetchListDataSourceGroupItem<T>,
    page: number,
    pageSize: number
  ): FetchListDataSourceCallbackOptions {
    return { filters: Array.from(this.filters.values()), group: group.id, page, pageSize, sort: this.sort };
  }

  #createItemsArray(): Array<ListDataSourceItem<T>> {
    if (this.#groups.has(FetchListDataSourceDummyGroup)) {
      return this.#groups.values().next().value?.members ?? [];
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

  #flattenGroups(groups: Map<unknown, FetchListDataSourceGroupItem<T>>): Array<ListDataSourceItem<T>> {
    const items: Array<ListDataSourceItem<T>> = [];

    let index = 0;

    groups.forEach(group => {
      items.push(group);

      group.startIndex = index;

      if (!group.collapsed && group.members) {
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
      if (!group.collapsed && group.members) {
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
      group.pages[page] = (async () => {
        const options = this.getFetchOptions(group, page, pageSize),
          res = await this.fetchPage(options);

        // If the size of the group changes, we need to recreate the Proxy object
        let recreateProxy = false;

        if (res.totalItems !== undefined) {
          group.size = Number(res.totalItems);

          if (group.size !== group.members?.length) {
            recreateProxy = true;

            const members = group.members ?? [];
            group.members = Array.from({ length: group.size });

            for (let i = 0; i < group.size; i++) {
              group.members[i] = members[i];
            }
          }
        }

        for (let i = 0; i < res.items.length; i++) {
          const index = this.pagination ? i : pageSize * page + i,
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
      })();
    }

    return {
      id: ListDataSourcePlaceholder,
      type: 'data',
      data: ListDataSourcePlaceholder
    } as ListDataSourceDataItem<T>;
  }
}
