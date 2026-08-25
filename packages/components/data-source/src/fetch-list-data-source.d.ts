import { type DataSourceFilter, type DataSourceSort } from './data-source.js';
import {
  ListDataSource,
  type ListDataSourceGroupItem,
  type ListDataSourceItem,
  type ListDataSourceOptions
} from './list-data-source.js';
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
  groups?: Array<
    Partial<ListDataSourceGroupItem> & {
      collapsed?: boolean;
    }
  >;
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
export type FetchListDataSourceEvent<T = any> = CustomEvent<FetchListDataSourceCallbackOptions<T>>;
export declare class FetchListDataSourceError extends Error {
  response: Response;
  constructor(message: string, response: Response);
}
/** Symbol used as a placeholder for items that are being loaded. */
export declare const FetchListDataSourcePlaceholder: unique symbol;
export declare class FetchListDataSource<T = any> extends ListDataSource<T> {
  #private;
  /** The default size of the item collection if not explicitly set. */
  static defaultSize: number;
  /** The callback for retrieving data. */
  fetchPage: FetchListDataSourceCallback<T>;
  /** Returns placeholder data for items not yet loaded. */
  placeholder: FetchListDataSourcePlaceholder<T>;
  get items(): ListDataSourceItem<T>[];
  get size(): number;
  get totalSize(): number;
  constructor(options: FetchListDataSourceOptions<T>);
  reorder(
    _item: ListDataSourceItem<T>,
    _relativeItem: ListDataSourceItem<T>,
    _position: 'before' | 'after'
  ): void;
  update(emitEvent?: boolean): void;
  /**
   * Override this function if you are extending the `FetchListDataSource` class to provide any
   * additional options you may need when `fetchPage` is called.
   */
  getFetchOptions(
    group: FetchListDataSourceGroupItem<T>,
    page: number,
    pageSize: number
  ): FetchListDataSourceCallbackOptions<T>;
}
