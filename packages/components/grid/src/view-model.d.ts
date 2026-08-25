import { type ListDataSource } from '@sl-design-system/data-source';
import { GridColumn } from './column.js';
import { type Grid } from './grid.js';
export declare class GridViewModelGroup {
  path: string;
  label: string;
  value: string;
  constructor(path: string, label: string, value: string);
}
export declare class GridViewModel<T = any> {
  #private;
  /** Returns the available columns for this grid. */
  get columnDefinitions(): Array<GridColumn<T>>;
  /** Sets the available columns. Not all columns may be rendered, depending on the view state. */
  set columnDefinitions(value: Array<GridColumn<T>>);
  /** Returns an array of visible columns. */
  get columns(): Array<GridColumn<T>>;
  get dataSource(): ListDataSource<T> | undefined;
  set dataSource(dataSource: ListDataSource<T> | undefined);
  get groups(): string[];
  get headerRows(): Array<Array<GridColumn<T>>>;
  get rows(): T[];
  update: () => void;
  constructor(grid: Grid<T>);
  refresh(): void;
  /** Toggle the visibility of the column. */
  toggleColumn(id: string, visible?: boolean): void;
  /** Toggle the visibility of the group. */
  toggleGroup(value: string, collapse?: boolean): void;
  /** Returns the selected state of the group. */
  getGroupSelection(_value?: string): 'all' | 'some' | 'none';
  getActiveRow(_value?: string): 'all' | 'some' | 'none';
  /** Returns true if the group is expanded, false if collapsed. */
  getGroupState(value?: string): boolean;
  getItemAtIndex(index: number): T;
  /** Returns the left offset, taking any sticky columns into account. */
  getStickyColumnOffset(index: number): number;
  /** Returns whether the item is fixed (not draggable). */
  isFixedItem(item: T): boolean;
  /**
   * Reorder the item in the view model.
   *
   * @param item The item to reorder.
   * @param relativeItem The item to reorder relative to.
   * @param position The position relative to the relativeItem.
   */
  reorderItem(item: T, relativeItem: T | undefined, position: 'before' | 'after'): void;
}
