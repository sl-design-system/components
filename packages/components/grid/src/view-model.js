import { getValueByPath } from '@sl-design-system/shared';
import { GridColumnGroup } from './column-group.js';
import { GridDragHandleColumn } from './drag-handle-column.js';
export class GridViewModelGroup {
  constructor(path, label, value) {
    this.path = path;
    this.label = label;
    this.value = value;
  }
}
export class GridViewModel {
  constructor(grid) {
    this.#columnDefinitions = [];
    this.#columns = [];
    this.#groups = /* @__PURE__ */ new Map();
    this.#headerRows = [[]];
    this.#rows = [];
    this.update = () => {
      if (this.#columnDefinitions.length === 0 || !this.#dataSource) {
        return;
      }
      this.#columns = this.#columnDefinitions.filter(col => !col.hidden);
      this.#headerRows = this.#flattenColumnGroups(this.#columnDefinitions);
      this.#rows = [];
      this.#grid.requestUpdate('view');
    };
    this.#grid = grid;
  }
  #columnDefinitions;
  #columns;
  #dataSource;
  #grid;
  #groups;
  #headerRows;
  #rows;
  /** Returns the available columns for this grid. */
  get columnDefinitions() {
    return this.#columnDefinitions;
  }
  /** Sets the available columns. Not all columns may be rendered, depending on the view state. */
  set columnDefinitions(value) {
    this.#columnDefinitions = value;
    this.update();
  }
  /** Returns an array of visible columns. */
  get columns() {
    return this.#columns;
  }
  get dataSource() {
    return this.#dataSource;
  }
  set dataSource(dataSource) {
    if (this.#dataSource) {
      this.#dataSource.removeEventListener('sl-update', this.update);
    }
    this.#dataSource = dataSource;
    this.#dataSource?.addEventListener('sl-update', this.update);
    this.update();
  }
  get groups() {
    return Array.from(this.#groups.keys());
  }
  get headerRows() {
    return this.#headerRows;
  }
  get rows() {
    return this.#rows;
  }
  refresh() {
    this.#rows = [...this.#rows];
    this.#grid.requestUpdate('view');
  }
  /** Toggle the visibility of the column. */
  toggleColumn(id, visible) {
    const column = this.#columnDefinitions.find(col => col.id === id);
    if (column) {
      column.hidden = !(visible ?? column.hidden);
      this.update();
    }
  }
  /** Toggle the visibility of the group. */
  toggleGroup(value, collapse) {
    this.#groups.set(value, collapse ?? !this.#groups.get(value));
    this.update();
  }
  /** Returns the selected state of the group. */
  getGroupSelection(_value) {
    return 'none';
  }
  getActiveRow(_value) {
    return 'none';
  }
  /** Returns true if the group is expanded, false if collapsed. */
  getGroupState(value) {
    return value ? (this.#groups.get(value) ?? true) : true;
  }
  getItemAtIndex(index) {
    return this.#rows[index];
  }
  /** Returns the left offset, taking any sticky columns into account. */
  getStickyColumnOffset(index) {
    let columns;
    if (this.#columns[index].stickyPosition === 'end') {
      columns = this.#columnDefinitions.slice(index, this.#columnDefinitions.length - 1).reverse();
    } else {
      columns = this.#columnDefinitions.slice(0, index);
    }
    return columns.filter(col => !col.hidden).reduce((acc, { width = 0 }) => acc + width, 0);
  }
  /** Returns whether the item is fixed (not draggable). */
  isFixedItem(item) {
    const column = this.columns.find(col => col instanceof GridDragHandleColumn);
    return !!column?.path && !getValueByPath(item, column.path);
  }
  /**
   * Reorder the item in the view model.
   *
   * @param item The item to reorder.
   * @param relativeItem The item to reorder relative to.
   * @param position The position relative to the relativeItem.
   */
  reorderItem(item, relativeItem, position) {
    const rows = this.#rows,
      from = rows.indexOf(item),
      to = (relativeItem ? rows.indexOf(relativeItem) : -1) + (position === 'before' ? 0 : 1);
    if (from === -1 || to === -1 || from === to) {
      return;
    }
    rows.splice(from, 1);
    rows.splice(to + (from < to ? -1 : 0), 0, item);
    this.#rows = [...rows];
  }
  /**
   * Flattens the column groups.
   *
   * So the following column definitions:
   *
   *     - group 1
   *       - column 1
   *       - column 2
   *     - group 2
   *       - column 3
   *       - column 4
   *     - group 3
   *       - column 5
   *
   * Will be flattened to:
   *
   * [ [ group 1, group 2, group 3 ], [ column 1, column 2, column 3, column 4, column 5 ] ]
   */
  #flattenColumnGroups(columns) {
    const groups = columns.filter(col => col instanceof GridColumnGroup);
    if (groups.length) {
      return [groups, groups.flatMap(group => this.#flattenColumnGroups(group.columns)).flat()];
    } else {
      return [columns];
    }
  }
}
//# sourceMappingURL=view-model.js.map
