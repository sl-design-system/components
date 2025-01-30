import { DataSource } from '@sl-design-system/data-source';
import { type TreeNodeType } from './tree-node.js';

export interface TreeDataSourceNode<T> {
  id: unknown;
  children?: Array<TreeDataSourceNode<T>>;
  childrenCount?: number;
  childrenLoading?: Promise<void>;
  dataNode: T;
  expandable: boolean;
  expanded: boolean;
  expandedIcon?: string;
  icon?: string;
  indeterminate?: boolean;
  label: string;
  lastNodeInLevel?: boolean;
  level: number;
  parent?: TreeDataSourceNode<T>;
  selected?: boolean;
  type: TreeNodeType;
}

export interface TreeDataSourceMapping<T> {
  /**
   * Returns the number of children. This can be used in combination with
   * lazy loading children. This way, the tree component can show skeletons
   * for the children while they are being loaded.
   */
  getChildrenCount?(item: T): number | undefined;

  /** Optional method for returning a custom icon for a tree node. */
  getIcon?(item: T, expanded: boolean): string;

  /** Used to identify a tree node. */
  getId(item: T): unknown;

  /**
   * Returns a string that is used as the label for the tree node.
   * If you want to customize how the tree node is rendered, you can
   * provide your own `TreeItemRenderer` function to the tree component.
   */
  getLabel(item: T): string;

  /** Returns whether the given node is expandable. */
  isExpandable(item: T): boolean;

  /**
   * Returns whether the given node is expanded. This is only used for the initial
   * expanded state of the node. If you want to expand/collapse a node programmatically,
   * use the `expand` and `collapse` methods on the tree model.
   */
  isExpanded?(item: T): boolean;

  /**
   * Returns whether the given node is selected. This is only used for the initial
   * selected state of the node. If you want to select/deselect a node programmatically,
   * use the `select` and `deselect` methods on the tree model.
   */
  isSelected?(item: T): boolean;
}

export interface TreeDataSourceOptions<T> {
  /** Provide this method to lazy load child nodes when a parent node is expanded. */
  loadChildren?(node: TreeDataSourceNode<T>): Promise<Array<TreeDataSourceNode<T>>>;

  /** Enables single or multiple selection of tree nodes. */
  selects?: 'single' | 'multiple';
}

/**
 * Abstract class used to provide a common interface for tree data.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class TreeDataSource<T = any> extends DataSource<T, TreeDataSourceNode<T>> {
  /** An optional callback for loading additional tree nodes. */
  #loadChildren?: TreeDataSourceOptions<T>['loadChildren'];
  /** A set containing the selected node(s) in the tree. */
  #selection: Set<TreeDataSourceNode<T>> = new Set();

  /** The selection type for the tree model. */
  #selects?: 'single' | 'multiple';

  /** A hierarchical representation of the items in the tree. */
  abstract readonly nodes: Array<TreeDataSourceNode<T>>;

  /** The current selection of tree node(s). */
  get selection() {
    return this.#selection;
  }

  /** Indicates whether the tree model allows single or multiple selection. */
  get selects() {
    return this.#selects;
  }

  constructor(options: TreeDataSourceOptions<T> = {}) {
    super();

    this.#loadChildren = options.loadChildren;
    this.#selects = options.selects;
  }

  /**
   * Toggles the expansion state of a tree node. You can optionally force the
   * state to a specific value using the `force` parameter. The `emitEvent`
   * parameter determines whether the model should emit an `sl-update` event
   * after changing the state.
   */
  toggle(node: TreeDataSourceNode<T>, force?: boolean, emitEvent?: boolean): void {
    if ((typeof force === 'boolean' && !force) || node.expanded) {
      this.collapse(node, emitEvent);
    } else {
      this.expand(node, emitEvent);
    }
  }

  /** Expands a tree node. */
  expand(node: TreeDataSourceNode<T>, emitEvent = true): void {
    if (!node.expandable) {
      return;
    }

    node.expanded = true;

    if (!node.children) {
      node.childrenLoading = this.#loadChildren?.(node).then(children => {
        node.children = children;
        node.childrenLoading = undefined;

        this.update();
      });
    }

    if (emitEvent) {
      this.update();
    }
  }

  /** Collapses a tree node. */
  collapse(node: TreeDataSourceNode<T>, emitEvent = true): void {
    if (!node.expandable) {
      return;
    }

    node.expanded = false;

    if (emitEvent) {
      this.update();
    }
  }

  /** Toggles the expansion state of all descendants of a given tree node. */
  toggleDescendants(node: TreeDataSourceNode<T>, force?: boolean): void {
    const traverse = (node: TreeDataSourceNode<T>): void => {
      if (node.expandable) {
        if ((typeof force === 'boolean' && !force) || node.expanded) {
          this.collapse(node, false);
        } else {
          this.expand(node, false);
        }

        (node.children || []).forEach(traverse);
      }
    };

    traverse(node);

    this.update();
  }

  /** Expands all descendants of a given tree node. */
  expandDescendants(node: TreeDataSourceNode<T>): void {
    this.toggleDescendants(node, true);
  }

  /** Collapses all descendants of a given tree node. */
  collapseDescendants(node: TreeDataSourceNode<T>): void {
    this.toggleDescendants(node, false);
  }

  /** Expands all expandable tree nodes. */
  async expandAll(): Promise<void> {
    const traverse = async (node: TreeDataSourceNode<T>): Promise<void> => {
      if (node.expandable) {
        this.expand(node, false);

        if (node.childrenLoading) {
          await node.childrenLoading;
        }

        for (const child of node.children || []) {
          await traverse(child);
        }
      }
    };

    for (const node of this.nodes) {
      await traverse(node);
    }

    this.update();
  }

  /** Collapses all expandable tree nodes. */
  collapseAll(): void {
    const traverse = (node: TreeDataSourceNode<T>): void => {
      if (node.expandable) {
        this.collapse(node, false);

        (node.children || []).forEach(traverse);
      }
    };

    this.nodes.forEach(traverse);

    this.update();
  }

  /** Selects the given node and any children. */
  select(node: TreeDataSourceNode<T>, emitEvent = true): void {
    if (this.selects === 'single') {
      this.deselectAll();
    }

    node.indeterminate = false;
    node.selected = true;
    this.#selection.add(node);

    if (this.selects === 'multiple') {
      // Select all children
      if (node.expandable) {
        const traverse = (node: TreeDataSourceNode<T>): void => {
          node.indeterminate = false;
          node.selected = true;
          this.#selection.add(node);

          if (node.expandable) {
            (node.children || []).forEach(traverse);
          }
        };

        node.children?.forEach(traverse);
      }

      // Update parent nodes
      let parent = node.parent;
      while (parent) {
        parent.selected = parent.children!.every(child => child.selected);
        parent.indeterminate =
          !parent.selected && parent.children!.some(child => child.indeterminate || child.selected);
        parent = parent.parent;
      }
    }

    if (emitEvent) {
      this.update();
    }
  }

  /** Deselects the given node and any children. */
  deselect(node: TreeDataSourceNode<T>, emitEvent = true): void {
    node.indeterminate = node.selected = false;
    this.#selection.delete(node);

    if (this.selects === 'multiple') {
      // Deselect all children
      if (node.expandable) {
        const traverse = (node: TreeDataSourceNode<T>): void => {
          node.indeterminate = node.selected = false;
          this.#selection.delete(node);

          if (node.expandable) {
            (node.children || []).forEach(traverse);
          }
        };

        node.children?.forEach(traverse);
      }

      // Update parent nodes
      let parent = node.parent;
      while (parent) {
        parent.selected = parent.children!.every(child => child.selected);
        parent.indeterminate =
          !parent.selected && parent.children!.some(child => child.indeterminate || child.selected);
        parent = parent.parent;
      }
    }

    if (emitEvent) {
      this.update();
    }
  }

  /** Selects all nodes in the tree. */
  selectAll(): void {
    const traverse = (node: TreeDataSourceNode<T>): void => {
      node.indeterminate = false;
      node.selected = true;
      this.#selection.add(node);

      if (node.expandable) {
        (node.children || []).forEach(traverse);
      }
    };

    this.nodes.forEach(traverse);

    this.update();
  }

  /** Deselects all nodes in the tree. */
  deselectAll(): void {
    const traverse = (node: TreeDataSourceNode<T>): void => {
      node.indeterminate = node.selected = false;
      this.#selection.delete(node);

      if (node.expandable) {
        (node.children || []).forEach(traverse);
      }
    };

    this.nodes.forEach(traverse);

    this.update();
  }

  /** Flattens the tree nodes to an array based on the expansion state. */
  toViewArray(): Array<TreeDataSourceNode<T>> {
    const traverse = (treeNode: TreeDataSourceNode<T>): Array<TreeDataSourceNode<T>> => {
      if (treeNode.expandable && treeNode.expanded) {
        if (Array.isArray(treeNode.children)) {
          const array = treeNode.children.map(childNode => {
            if (childNode instanceof Promise) {
              return this.#createPlaceholderTreeNode(treeNode);
            } else {
              return traverse(childNode);
            }
          });

          return [treeNode, ...array.flat()];
        } else if (treeNode.childrenLoading instanceof Promise) {
          if (typeof treeNode.childrenCount === 'number') {
            return [
              treeNode,
              ...Array.from({ length: treeNode.childrenCount }).map(() => this.#createSkeletonTreeNode(treeNode))
            ];
          } else {
            return [treeNode, this.#createPlaceholderTreeNode(treeNode)];
          }
        }
      }

      return [treeNode];
    };

    return this.nodes.flatMap(treeNode => traverse(treeNode));
  }

  #createPlaceholderTreeNode(parent: TreeDataSourceNode<T>): TreeDataSourceNode<T> {
    return {
      dataNode: null as unknown as T,
      expandable: false,
      expanded: false,
      id: 'placeholder',
      label: '',
      level: parent.level + 1,
      parent,
      type: 'placeholder'
    };
  }

  #createSkeletonTreeNode(parent: TreeDataSourceNode<T>): TreeDataSourceNode<T> {
    return {
      dataNode: null as unknown as T,
      expandable: false,
      expanded: false,
      id: 'skeleton',
      label: '',
      level: parent.level + 1,
      parent,
      type: 'skeleton'
    };
  }
}
