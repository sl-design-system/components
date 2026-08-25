import {
  TreeDataSource,
  type TreeDataSourceMapping,
  type TreeDataSourceNode
} from './tree-data-source.js';
export interface NestedTreeDataSourceMapping<T> extends TreeDataSourceMapping<T> {
  /** Returns the children of the given item. */
  getChildren(item: T): T[] | Promise<T[]> | undefined;
}
export interface NestedTreeDataSourceOptions<T> extends NestedTreeDataSourceMapping<T> {
  /** Provide this method to lazy load child nodes when a parent node is expanded. */
  loadChildren?(node: T): Promise<T[]>;
  /** Enables multiple selection of tree nodes. */
  multiple?: boolean;
}
/** A tree model that represents a nested list of nodes. */
export declare class NestedTreeDataSource<T = any> extends TreeDataSource<T> {
  #private;
  get items(): Array<TreeDataSourceNode<T>>;
  get nodes(): Array<TreeDataSourceNode<T>>;
  get size(): number;
  constructor(items: T[], options: NestedTreeDataSourceOptions<T>);
  update(sync?: boolean): void;
}
