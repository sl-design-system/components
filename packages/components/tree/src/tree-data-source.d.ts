import {
  DataSource,
  type DataSourceFilter,
  type DataSourceFilterFunction,
  type DataSourceSort,
  type DataSourceSortDirection,
  type DataSourceSortFunction
} from '@sl-design-system/data-source';
import { type PathKeys } from '@sl-design-system/shared';
import { type TreeNodeType } from './tree-node.js';
export interface TreeDataSourceNode<T> {
  id: unknown;
  children?: Array<TreeDataSourceNode<T>>;
  childrenCount?: number;
  childrenLoading?: Promise<void>;
  dataNode: T;
  description?: string;
  expandable: boolean;
  expanded: boolean;
  expandedIcon?: string;
  icon?: string;
  indeterminate?: boolean;
  label: string;
  lastNodeInLevel?: boolean;
  level: number;
  levelGuides?: number[];
  parent?: TreeDataSourceNode<T>;
  selectable?: boolean;
  selected?: boolean;
  type: TreeNodeType;
}
export interface TreeDataSourceMapping<T> {
  /** Optional method for returning a custom aria description for a tree node. */
  getAriaDescription?(item: T): string | undefined;
  /**
   * Returns the number of children. This can be used in combination with lazy loading children.
   * This way, the tree component can show skeletons for the children while they are being loaded.
   */
  getChildrenCount?(item: T): number | undefined;
  /** Optional method for returning a custom icon for a tree node. */
  getIcon?(item: T, expanded: boolean): string;
  /** Used to identify a tree node. */
  getId(item: T): unknown;
  /**
   * Returns a string that is used as the label for the tree node. If you want to customize how the
   * tree node is rendered, you can provide your own `TreeItemRenderer` function to the tree
   * component.
   */
  getLabel(item: T): string;
  /** Returns whether the given node is expandable. */
  isExpandable(item: T): boolean;
  /**
   * Returns whether the given node can be selected. If not provided, all nodes are selectable by
   * default. Use this to create a tree where only some nodes can be selected, for example a tree
   * where the parent nodes are selectable, but the leaf nodes are not.
   */
  isSelectable?(item: T): boolean;
  /**
   * Returns whether the given node is expanded. This is only used for the initial expanded state of
   * the node. If you want to expand/collapse a node programmatically, use the `expand` and
   * `collapse` methods on the data source.
   */
  isExpanded?(item: T): boolean;
  /**
   * Returns whether the given node is selected. This is only used for the initial selected state of
   * the node. If you want to select/deselect a node programmatically, use the `select` and
   * `deselect` methods on the data source.
   */
  isSelected?(item: T): boolean;
}
export interface TreeDataSourceOptions<T> {
  /** Provide this method to lazy load child nodes when a parent node is expanded. */
  loadChildren?(node: TreeDataSourceNode<T>): Promise<Array<TreeDataSourceNode<T>>>;
  /** Enables multiple selection of tree nodes. */
  multiple?: boolean;
}
/** Abstract class used to provide a common interface for tree data. */
export declare abstract class TreeDataSource<T = any> extends DataSource<T, TreeDataSourceNode<T>> {
  #private;
  get filters(): Map<string, DataSourceFilter<T>>;
  /** Indicates whether the data source allows single or multiple selection. */
  get multiple(): boolean | undefined;
  /** A hierarchical representation of the items in the tree. */
  abstract readonly nodes: Array<TreeDataSourceNode<T>>;
  /** The current selection of tree node(s). */
  get selection(): Set<TreeDataSourceNode<T>>;
  get sort(): DataSourceSort<T> | undefined;
  constructor(options?: TreeDataSourceOptions<T>);
  addFilter(
    _id: string,
    _by: string | PathKeys<T> | DataSourceFilterFunction<T>,
    _value?: unknown
  ): void;
  removeFilter(_id: string): void;
  setSort(
    by: string | PathKeys<T> | DataSourceSortFunction<T>,
    direction: DataSourceSortDirection
  ): void;
  removeSort(): void;
  /**
   * Toggles the expansion state of a tree node. You can optionally force the state to a specific
   * value using the `force` parameter. The `emitEvent` parameter determines whether the model
   * should emit an `sl-update` event after changing the state.
   */
  toggle(node: TreeDataSourceNode<T>, force?: boolean, emitEvent?: boolean): void;
  /** Expands a tree node. */
  expand(node: TreeDataSourceNode<T>, emitEvent?: boolean): void;
  /** Collapses a tree node. */
  collapse(node: TreeDataSourceNode<T>, emitEvent?: boolean): void;
  /** Toggles the expansion state of all descendants of a given tree node. */
  toggleDescendants(node: TreeDataSourceNode<T>, force?: boolean): void;
  /** Expands all descendants of a given tree node. */
  expandDescendants(node: TreeDataSourceNode<T>): void;
  /** Collapses all descendants of a given tree node. */
  collapseDescendants(node: TreeDataSourceNode<T>): void;
  /** Expands all expandable tree nodes. */
  expandAll(): Promise<void>;
  /** Collapses all expandable tree nodes. */
  collapseAll(): void;
  /** Selects the given node and any children. */
  select(node: TreeDataSourceNode<T>, emitEvent?: boolean): void;
  /** Deselects the given node and any children. */
  deselect(node: TreeDataSourceNode<T>, emitEvent?: boolean): void;
  /** Selects all selectable nodes in the tree. */
  selectAll(): void;
  /** Deselects all nodes in the tree. */
  deselectAll(): void;
  /** Flattens the tree nodes to an array based on the expansion state. */
  toViewArray(): Array<TreeDataSourceNode<T>>;
  /**
   * Updates the view of the data source.
   *
   * @param sync Whether to synchronize the selection state of the tree.
   */
  abstract update(sync?: boolean): void;
  /**
   * Synchronizes the selection state of the entire tree.
   *
   * @internal
   */
  protected syncSelection(): void;
}
