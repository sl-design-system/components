import { ListDataSource, ListDataSourcePlaceholder } from './list-data-source.js';
export class FetchListDataSourceError extends Error {
  constructor(message, response) {
    super(message);
    this.response = response;
  }
}
export const FetchListDataSourcePlaceholder = Symbol('FetchListDataSourcePlaceholder');
const FetchListDataSourceDummyGroup = Symbol('FetchListDataSourceDummyGroup');
export class FetchListDataSource extends ListDataSource {
  constructor(options) {
    super(options);
    /** Array containing all the loaded items. */
    this.#items = [];
    /** Proxy of the items array. */
    this.#proxy = [];
    /** Returns placeholder data for items not yet loaded. */
    this.placeholder = () => FetchListDataSourcePlaceholder;
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
      for (const group of options.groups) {
        if (group.collapsed ?? true) {
          this.collapseGroup(group.id ?? group);
        }
      }
    } else {
      this.#groups = /* @__PURE__ */ new Map([
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
    this.fetchPage = options.fetchPage;
    if (typeof options.pageSize === 'number') {
      this.setPageSize(options.pageSize);
    }
    if (options.placeholder) {
      this.placeholder = options.placeholder;
    }
    this.update(false);
  }
  static {
    /** The default size of the item collection if not explicitly set. */
    this.defaultSize = 10;
  }
  /** The groups within the data source. */
  #groups;
  #items;
  /** The mapping from the source items to the ListDataSourceItem. */
  #mapping;
  #proxy;
  /** The total number of items in the data source. */
  #totalSize;
  get items() {
    return this.#proxy;
  }
  get size() {
    return Array.from(this.#groups.values()).reduce((acc, group) => acc + (group.size ?? 0), 0);
  }
  get totalSize() {
    return this.#totalSize;
  }
  reorder(_item, _relativeItem, _position) {
    console.log('Reordering items is not supported in FetchListDataSource');
  }
  update(emitEvent = true) {
    this.#groups.forEach(group => {
      group.members = void 0;
      group.pages = {};
    });
    this.#items = this.#createItemsArray();
    this.#proxy = this.#createProxy(this.#items);
    if (emitEvent) {
      this.dispatchEvent(new CustomEvent('sl-update', { detail: { dataSource: this } }));
    }
  }
  /**
   * Override this function if you are extending the `FetchListDataSource` class to provide any
   * additional options you may need when `fetchPage` is called.
   */
  getFetchOptions(group, page, pageSize) {
    return {
      filters: Array.from(this.filters.values()),
      group: group.id,
      page,
      pageSize,
      sort: this.sort
    };
  }
  #createItemsArray() {
    if (this.#groups.has(FetchListDataSourceDummyGroup)) {
      const group = this.#groups.values().next().value,
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
  #createProxy(items) {
    const that = this;
    return new Proxy(items, {
      get: function (target, property) {
        const length = that.pagination ? Math.min(target.length, that.pageSize) : target.length;
        if (property === 'length') {
          return length;
        } else if (property === 'at') {
          return n => {
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
              return void 0;
            }
          }
          return target[property];
        }
      }
    });
  }
  #flattenGroups(groups) {
    const items = [];
    let index = 0;
    groups.forEach(group => {
      items.push(group);
      group.startIndex = index;
      if (!this.isGroupCollapsed(group.id) && group.members) {
        items.push(...group.members);
        index += group.members.length;
      }
      index++;
    });
    return items;
  }
  #getGroupAtIndex(index) {
    let currentIndex = 0;
    for (const group of this.#groups.values()) {
      let groupSize = 1;
      if (!this.isGroupCollapsed(group.id) && group.members) {
        groupSize += group.members.length;
      }
      if (index < currentIndex + groupSize) {
        return group;
      }
      currentIndex += groupSize;
    }
    return void 0;
  }
  #requestFetch(n) {
    const group = this.#getGroupAtIndex(n),
      { pageSize } = this,
      page = this.pagination ? this.page : Math.floor((n - (group.startIndex ?? 0)) / pageSize);
    if (!group.pages[page]) {
      group.pages[page] = (async () => {
        const options = this.getFetchOptions(group, page, pageSize),
          res = await this.fetchPage(options);
        let recreateProxy = this.pagination;
        if (res.totalItems !== void 0) {
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
          const index = pageSize * page + i,
            item = res.items[i];
          group.members[index] = {
            id: this.#mapping.getId(item),
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
    };
  }
}
//# sourceMappingURL=fetch-list-data-source.js.map
