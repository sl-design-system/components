import {
  ListDataSource,
  type ListDataSourceDataItem,
  type ListDataSourceItem,
  type ListDataSourceOptions
} from './list-data-source.js';
/**
 * A data source that can be used to filter, group by, sort, and paginate an array of items. Use
 * this data source when you have all the data you need in memory and you don't need to load any
 * additional data.
 */
export declare class ArrayListDataSource<T = any> extends ListDataSource<T> {
  #private;
  get items(): ListDataSourceItem<T>[];
  get size(): number;
  get totalSize(): number;
  get unfilteredItems(): ListDataSourceDataItem<T>[];
  constructor(items: T[], options?: ListDataSourceOptions<T>);
  reorder(
    item: ListDataSourceItem<T>,
    relativeItem: ListDataSourceItem<T>,
    position: 'before' | 'after'
  ): void;
  /** Returns the selected data objects (raw {@link T} items). */
  getSelectedItems(): T[];
  /** Update the data source with a new array of items. */
  setData(items: T[]): void;
  update(emitEvent?: boolean): void;
}
