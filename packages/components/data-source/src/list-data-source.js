import { DataSource } from './data-source.js';
export const LIST_DATA_SOURCE_DEFAULT_PAGE_SIZE = 10;
export const ListDataSourcePlaceholder = Symbol('ListDataSourcePlaceholder');
export function isListDataSourceDataItem(item) {
  return item?.type === 'data';
}
export function isListDataSourceGroupItem(item) {
  return item?.type === 'group';
}
export class ListDataSource extends DataSource {
  /** The set of collapsed group ids. */
  #collapsedGroups = /* @__PURE__ */ new Set();
  /** Map of all active filters. */
  #filters = /* @__PURE__ */ new Map();
  /** The path to the group by attribute. */
  #groupBy;
  /** The path to the group label. */
  #groupLabelPath;
  /**
   * The set of selected groups in the data source. This selection is kept separate from the
   * selection of items, so that they do not interfere with each other.
   */
  #groupSelection = /* @__PURE__ */ new Set();
  /** The sort configuration for the groups. */
  #groupSort;
  /** The index of the page. */
  #page = 0;
  /** The number of items on a single page. */
  #pageSize = LIST_DATA_SOURCE_DEFAULT_PAGE_SIZE;
  /** Whether this data source uses pagination. */
  #pagination;
  /** Whether all items are selected. */
  #selectAll;
  /** A set containing the selected ids in the data source. */
  #selection = /* @__PURE__ */ new Set();
  /** Indicates the selection type for the data source. */
  #selects;
  /**
   * The value and path/function to use for sorting. When setting this property, it will cause the
   * data to be automatically sorted.
   */
  #sort;
  get filters() {
    return this.#filters;
  }
  get groupBy() {
    return this.#groupBy;
  }
  get groupLabelPath() {
    return this.#groupLabelPath;
  }
  get groupSort() {
    return this.#groupSort;
  }
  get page() {
    return this.#page;
  }
  get pageSize() {
    return this.#pageSize;
  }
  get pagination() {
    return this.#pagination;
  }
  /** The number of selected items in the data source. */
  get selected() {
    if (this.#selectAll) {
      return this.totalSize - this.#selection.size;
    } else {
      return this.#selection.size;
    }
  }
  /**
   * The current selection of item(s).
   *
   * This is a set of ids. Depending on the "select all" state, it either are the selected ids or
   * the deselected ids. If you want to use the selection, take the select all state into account.
   * If you want to know the state of a single item, use the `isSelected` method.
   */
  get selection() {
    return this.#selection;
  }
  get selects() {
    return this.#selects;
  }
  /** Indicates whether the data source allows single, multiple or no selection at all. */
  set selects(value) {
    this.#selects = value;
  }
  get sort() {
    return this.#sort;
  }
  constructor(options) {
    super();
    if (options.filters) {
      options.filters.forEach(filter => this.#filters.set(filter.id, filter));
    }
    this.#groupBy = options.groupBy;
    this.#groupLabelPath = options.groupLabelPath;
    if (options.groupSortBy || options.groupSortDirection) {
      this.#groupSort = {
        by: options.groupSortBy,
        direction: options.groupSortDirection ?? 'asc'
      };
    }
    this.#pagination = options.pagination ?? false;
    this.#page = options.page ?? 0;
    this.#pageSize = options.pageSize ?? LIST_DATA_SOURCE_DEFAULT_PAGE_SIZE;
    this.#selects = options.selects;
    if (options.sortBy) {
      this.#sort = { by: options.sortBy, direction: options.sortDirection ?? 'asc' };
    }
    if (this.#groupBy && this.#pagination) {
      console.warn(
        'Grouping and pagination are both enabled for the list data source. This may cause unexpected behavior. It is recommended to use grouping without pagination.'
      );
    }
  }
  addFilter(id, by, value) {
    this.#filters.set(id, { id, by, value });
  }
  removeFilter(id) {
    this.#filters.delete(id);
  }
  /**
   * Groups the items in the data source by the specified property path.
   *
   * @param path - The path to the property used for grouping the items
   * @param labelPath - Optional path to the property used for generating group labels
   */
  setGroupBy(path, labelPath) {
    this.#groupBy = path;
    this.#groupLabelPath = labelPath;
  }
  /** Removes the grouping from the list. */
  removeGroupBy() {
    this.#groupBy = void 0;
    this.#groupLabelPath = void 0;
  }
  /**
   * Sets the current page.
   *
   * @param page - The page number to set
   */
  setPage(page) {
    this.#page = page;
  }
  /**
   * Sets the number of items that are shown on a page.
   *
   * @param pageSize - The number of items per page
   */
  setPageSize(pageSize) {
    this.#pageSize = pageSize;
  }
  setSort(by, direction) {
    this.#sort = { by, direction };
    if (this.page) {
      this.setPage(0);
    }
  }
  removeSort() {
    if (this.#sort && this.page) {
      this.setPage(0);
    }
    this.#sort = void 0;
  }
  /**
   * Selects the item. Whether it is added to the selection or replaces any previously selected item
   * is based on the `selects` value.
   *
   * @param item - The item to select
   */
  select(item, update = true) {
    if (this.#selects === void 0) {
      return;
    } else if (this.#selectAll) {
      if (item.type === 'group') {
        this.#groupSelection.delete(item.id);
      } else {
        this.#selection.delete(item.id);
      }
    } else {
      if (this.#selects === 'single') {
        this.#selection.clear();
      }
      if (item.type === 'group') {
        this.#groupSelection.add(item.id);
      } else {
        this.#selection.add(item.id);
      }
    }
    if (update) {
      if (isListDataSourceGroupItem(item)) {
        item.members?.forEach(member => this.select(member, false));
      } else if (
        isListDataSourceDataItem(item) &&
        item.group?.members?.every(member => this.isSelected(member))
      ) {
        this.select(item.group, false);
      }
      this.dispatchEvent(new CustomEvent('sl-selection-change'));
    }
  }
  /**
   * Deselects the item.
   *
   * @param item - The item to deselect
   */
  deselect(item, update = true) {
    if (this.#selects === void 0) {
      return;
    } else if (this.#selectAll) {
      if (item.type === 'group') {
        this.#groupSelection.add(item.id);
      } else {
        this.#selection.add(item.id);
      }
      if (this.#selection.size === this.size) {
        this.deselectAll(false);
      }
    } else {
      if (item.type === 'group') {
        this.#groupSelection.delete(item.id);
      } else {
        this.#selection.delete(item.id);
      }
    }
    if (update) {
      if (isListDataSourceGroupItem(item)) {
        item.members?.forEach(member => this.deselect(member, false));
      } else if (
        isListDataSourceDataItem(item) &&
        item.group?.members?.some(member => !this.isSelected(member))
      ) {
        this.deselect(item.group, false);
      }
      this.dispatchEvent(new CustomEvent('sl-selection-change'));
    }
  }
  /**
   * Toggles the selection state of an item.
   *
   * @param item - The item to toggle the selection state for
   * @param force - If true, the item will be selected. If false, it will be deselected.
   */
  toggle(item, force, update) {
    force ??= !this.isSelected(item);
    if (force) {
      this.select(item, update);
    } else {
      this.deselect(item, update);
    }
    if (isListDataSourceGroupItem(item)) {
      item.members?.forEach(member => this.toggle(member, force, false));
    }
    if (update) {
      this.dispatchEvent(new CustomEvent('sl-selection-change'));
    }
  }
  /**
   * Returns whether the item is selected.
   *
   * @param item - The item to check
   */
  isSelected(item) {
    if (!item || !('id' in item)) {
      return false;
    }
    if (this.#selectAll) {
      if (item.type === 'group') {
        return !this.#groupSelection.has(item.id);
      } else {
        return !this.#selection.has(item.id);
      }
    } else {
      if (item.type === 'group') {
        return this.#groupSelection.has(item.id);
      } else {
        return this.#selection.has(item.id);
      }
    }
  }
  /** Selects all items in the data source. */
  selectAll(update = true) {
    if (this.#selects !== 'multiple') {
      return;
    }
    this.#selectAll = true;
    this.#selection.clear();
    this.#groupSelection.clear();
    if (update) {
      this.dispatchEvent(new CustomEvent('sl-selection-change'));
    }
  }
  /** Deselects all items in the data source. */
  deselectAll(update = true) {
    this.#selectAll = false;
    this.#selection.clear();
    this.#groupSelection.clear();
    if (update) {
      this.dispatchEvent(new CustomEvent('sl-selection-change'));
    }
  }
  /** Returns whether the "select all" state is active. */
  isSelectAllToggled() {
    return !!this.#selectAll;
  }
  /** Returns whether all items are selected. */
  areAllSelected() {
    if (this.#selectAll) {
      return this.#selection.size === 0;
    } else {
      return this.#selection.size === this.size;
    }
  }
  /** Returns whether some items are selected. */
  areSomeSelected() {
    const { size } = this.#selection;
    if (this.#selectAll) {
      return size > 0 && size !== this.size;
    } else {
      return size > 0 && size < this.size;
    }
  }
  /**
   * Expands the group with the given id.
   *
   * @param id - The id of the group to expand
   */
  expandGroup(id) {
    this.#collapsedGroups.delete(id);
  }
  /**
   * Collapses the group with the given id.
   *
   * @param id - The id of the group to collapse
   */
  collapseGroup(id) {
    this.#collapsedGroups.add(id);
  }
  /**
   * Toggles the expansion state of the group with the given id.
   *
   * @param id - The id of the group to toggle
   * @param force - If true, the group will be collapsed. If false, it will be expanded.
   */
  toggleGroup(id, force) {
    if (force ?? !this.isGroupCollapsed(id)) {
      this.collapseGroup(id);
    } else {
      this.expandGroup(id);
    }
  }
  /**
   * Returns whether the group with the given id is collapsed.
   *
   * @param id - The id of the group to check
   */
  isGroupCollapsed(id) {
    return this.#collapsedGroups.has(id);
  }
}
//# sourceMappingURL=list-data-source.js.map
