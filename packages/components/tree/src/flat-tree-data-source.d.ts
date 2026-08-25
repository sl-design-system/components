import {
  TreeDataSource,
  type TreeDataSourceMapping,
  TreeDataSourceNode
} from './tree-data-source.js';
export interface FlatTreeDataSourceMapping<T> extends TreeDataSourceMapping<T> {
  /** Returns the level in the tree of the given item. */
  getLevel(item: T): number;
}
export interface FlatTreeDataSourceOptions<T> extends FlatTreeDataSourceMapping<T> {
  /** Provide this method to lazy load child nodes when a parent node is expanded. */
  loadChildren?(node: T): Promise<T[]>;
  /** Enables multiple selection of tree nodes. */
  multiple?: boolean;
}
/** A tree model that represents a flat list of nodes. */
export declare class FlatTreeDataSource<T = any> extends TreeDataSource<T> {
  #private;
  get items(): Array<TreeDataSourceNode<T>>;
  get nodes(): Array<TreeDataSourceNode<T>>;
  get size(): number;
  constructor(items: T[], options: FlatTreeDataSourceOptions<T>);
  update(sync?: boolean): void;
}
