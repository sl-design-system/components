import { type DataSource } from '@sl-design-system/data-source';
import { getStringByPath, getValueByPath } from '@sl-design-system/shared';
import { GridColumnGroup } from './column-group.js';
import { GridColumn } from './column.js';
import { GridDragHandleColumn } from './drag-handle-column.js';
import { type Grid } from './grid.js';

export class GridViewModelGroup {
  constructor(
    public path: string,
    public value: string
  ) {}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GridViewModel<T = any> {
  #columnDefinitions: Array<GridColumn<T>> = [];
  #columns: Array<GridColumn<T>> = [];
  #dataSource?: DataSource<T>;
  #grid: Grid<T>;
  #groups = new Map<string, boolean>();
  #headerRows: Array<Array<GridColumn<T>>> = [[]];
  #rows: T[] = [];

  /** Returns the available columns for this grid. */
  get columnDefinitions(): Array<GridColumn<T>> {
    return this.#columnDefinitions;
  }

  /** Sets the available columns. Not all columns may be rendered, depending on the view state. */
  set columnDefinitions(value: Array<GridColumn<T>>) {
    this.#columnDefinitions = value;
    this.update();
  }

  /** Returns an array of visible columns. */
  get columns(): Array<GridColumn<T>> {
    return this.#columns;
  }

  get dataSource(): DataSource<T> | undefined {
    return this.#dataSource;
  }

  set dataSource(dataSource: DataSource<T> | undefined) {
    if (this.#dataSource) {
      this.#dataSource.removeEventListener('sl-data-source-update', this.update);
    }

    this.#dataSource = dataSource;
    this.#dataSource?.addEventListener('sl-data-source-update', this.update);

    this.update();
  }

  get groups(): string[] {
    return Array.from(this.#groups.keys());
  }

  get headerRows(): Array<Array<GridColumn<T>>> {
    return this.#headerRows;
  }

  get rows(): T[] {
    return this.#rows;
  }

  update = (): void => {
    this.#columns = this.#columnDefinitions.filter(col => !col.hidden);
    this.#headerRows = this.#flattenColumnGroups(this.#columnDefinitions);

    if (this.#dataSource?.groupBy) {
      const groupByPath = this.#dataSource.groupBy.path,
        groups: string[] = [];

      this.#rows = this.#dataSource.items
        .map(item => {
          const value = getStringByPath(item, groupByPath);

          if (groups.includes(value)) {
            return this.getGroupState(value) ? item : undefined;
          } else {
            groups.push(value);

            // If this is the start of a new group, insert a group item
            const group = new GridViewModelGroup(groupByPath, value);

            return this.getGroupState(value) ? [group, item] : group;
          }
        })
        .flatMap(item => item)
        .filter((item): item is T => item !== undefined);

      // Update the groups state
      groups.forEach(group => {
        if (!this.#groups.has(group)) {
          this.#groups.set(group, true);
        }
      });
    } else {
      this.#rows = this.#dataSource?.items ?? [];
    }

    this.#grid.requestUpdate('view');
  };

  constructor(grid: Grid<T>) {
    this.#grid = grid;
  }

  refresh(): void {
    this.#rows = [...this.#rows];

    this.#grid.requestUpdate('view');
  }

  /** Toggle the visibility of the column. */
  toggleColumn(id: string, visible?: boolean): void {
    const column = this.#columnDefinitions.find(col => col.id === id);
    if (column) {
      column.hidden = !(visible ?? column.hidden);
      this.update();
    }
  }

  /** Toggle the visibility of the group. */
  toggleGroup(value: string, collapse?: boolean): void {
    this.#groups.set(value, collapse ?? !this.#groups.get(value));
    this.update();
  }

  /** Returns the selected state of the group. */
  getGroupSelection(value?: string): 'all' | 'some' | 'none' {
    if (this.#grid.selection.areAllSelected()) {
      return 'all';
    } else if (this.#grid.selection.size === 0) {
      return 'none';
    } else {
      const groupByPath = this.#dataSource?.groupBy?.path,
        items = this.#dataSource?.items.filter(item => getValueByPath(item, groupByPath) === value);

      const some = items?.some(item => this.#grid.selection.isSelected(item)),
        all = items?.every(item => this.#grid.selection.isSelected(item));

      return all ? 'all' : some ? 'some' : 'none';
    }
  }

  /** Returns true if the group is expanded, false if collapsed. */
  getGroupState(value?: string): boolean {
    return value ? (this.#groups.get(value) ?? true) : true;
  }

  getItemAtIndex(index: number): T {
    return this.#rows[index];
  }

  /** Returns the left offset, taking any sticky columns into account. */
  getStickyColumnOffset(index: number): number {
    return this.#columnDefinitions
      .slice(0, index)
      .filter(col => !col.hidden)
      .reduce((acc, { width = 0 }) => {
        return acc + width;
      }, 0);
  }

  /** Returns whether the item is fixed (not draggable). */
  isFixedItem(item: T): boolean {
    const column = this.columns.find(col => col instanceof GridDragHandleColumn);

    return !!column?.path && !getValueByPath(item, column.path);
  }

  /**
   * Reorder the item in the view model.
   * @param item The item to reorder.
   * @param relativeItem The item to reorder relative to.
   * @param position The position relative to the relativeItem.
   */
  reorderItem(item: T, relativeItem: T | undefined, position: 'before' | 'after'): void {
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
   * - group 1
   *   - column 1
   *   - column 2
   * - group 2
   *   - column 3
   *   - column 4
   * - group 3
   *   - column 5
   *
   * Will be flattened to:
   * [
   *  [ group 1, group 2, group 3 ],
   *  [ column 1, column 2, column 3, column 4, column 5 ]
   * ]
   */
  #flattenColumnGroups(columns: Array<GridColumn<T>>): Array<Array<GridColumn<T>>> {
    const groups = columns.filter((col): col is GridColumnGroup<T> => col instanceof GridColumnGroup);

    if (groups.length) {
      return [groups, groups.flatMap(group => this.#flattenColumnGroups(group.columns)).flat()];
    } else {
      return [columns];
    }
  }
}
