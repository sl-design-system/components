/** Symbol used as a placeholder for tree nodes that are being loaded. */
export const TreeModelNodePlaceholder = Symbol('TreeModelItemPlaceholder');

export interface TreeModelNode<T> {
  id: unknown;
  children?: Array<TreeModelNode<T>>;
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
  parent?: TreeModelNode<T>;
  selected?: boolean;
}

export interface TreeModelNodeMapping<T> {
  /**
   * Returns the number of children. This can be used in combination with
   * lazy loading children. This way, the tree component can show skeletons
   * for the children while they are being loaded.
   */
  getChildrenCount?(dataNode: T): number;

  /** Optional method for returning a custom icon for a tree node. */
  getIcon?(dataNode: T, expanded: boolean): string;

  /** Used to identify a tree node. */
  getId(dataNode: T): unknown;

  /**
   * Returns a string that is used as the label for the tree node.
   * If you want to customize how the tree node is rendered, you can
   * provide your own `TreeItemRenderer` function to the tree component.
   */
  getLabel(dataNode: T): string;

  /** Returns whether the given node is expandable. */
  isExpandable(dataNode: T): boolean;

  /**
   * Returns whether the given node is expanded. This is only used for the initial
   * expanded state of the node. If you want to expand/collapse a node programmatically,
   * use the `expand` and `collapse` methods on the tree model.
   */
  isExpanded?(dataNode: T): boolean;

  /**
   * Returns whether the given node is selected. This is only used for the initial
   * selected state of the node. If you want to select/deselect a node programmatically,
   * use the `select` and `deselect` methods on the tree model.
   */
  isSelected?(dataNode: T): boolean;
}

export interface TreeModelOptions<T> {
  /** Provide this method to lazy load child nodes when a parent node is expanded. */
  loadChildren?(node: TreeModelNode<T>): Promise<Array<TreeModelNode<T>>>;

  /** Enables single or multiple selection of tree nodes. */
  selects?: 'single' | 'multiple';
}

/**
 * Abstract class used to provide a common interface for tree data.
 */
export abstract class TreeModel<T> extends EventTarget {
  #loadChildren?: TreeModelOptions<T>['loadChildren'];
  #selection: Set<TreeModelNode<T>> = new Set();
  #selects?: 'single' | 'multiple';

  /** The current selection of tree node(s). */
  get selection() {
    return this.#selection;
  }

  /** Indicates whether the tree model allows single or multiple selection. */
  get selects() {
    return this.#selects;
  }

  /** An optimized representation of the data nodes for rendering in a tree. */
  abstract get treeNodes(): Array<TreeModelNode<T>>;

  constructor(
    public readonly dataNodes: T[],
    options: TreeModelOptions<T> = {}
  ) {
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
  toggle(node: TreeModelNode<T>, force?: boolean, emitEvent?: boolean): void {
    if ((typeof force === 'boolean' && !force) || node.expanded) {
      this.collapse(node, emitEvent);
    } else {
      this.expand(node, emitEvent);
    }
  }

  /** Expands a tree node. */
  expand(node: TreeModelNode<T>, emitEvent = true): void {
    if (!node.expandable) {
      return;
    }

    node.expanded = true;

    if (!node.children) {
      node.childrenLoading = this.#loadChildren?.(node).then(children => {
        node.children = children;
        node.childrenLoading = undefined;

        this.#update(true);
      });
    }

    this.#update(emitEvent);
  }

  /** Collapses a tree node. */
  collapse(node: TreeModelNode<T>, emitEvent = true): void {
    if (!node.expandable) {
      return;
    }

    node.expanded = false;

    this.#update(emitEvent);
  }

  /** Toggles the expansion state of all descendants of a given tree node. */
  toggleDescendants(node: TreeModelNode<T>, force?: boolean): void {
    const traverse = (node: TreeModelNode<T>): void => {
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

    this.dispatchEvent(new Event('sl-update'));
  }

  /** Expands all descendants of a given tree node. */
  expandDescendants(node: TreeModelNode<T>): void {
    this.toggleDescendants(node, true);
  }

  /** Collapses all descendants of a given tree node. */
  collapseDescendants(node: TreeModelNode<T>): void {
    this.toggleDescendants(node, false);
  }

  /** Expands all expandable tree nodes. */
  async expandAll(): Promise<void> {
    const traverse = async (node: TreeModelNode<T>): Promise<void> => {
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

    for (const node of this.treeNodes) {
      await traverse(node);
    }

    this.#update(true);
  }

  /** Collapses all expandable tree nodes. */
  collapseAll(): void {
    const traverse = (node: TreeModelNode<T>): void => {
      if (node.expandable) {
        this.collapse(node, false);

        (node.children || []).forEach(traverse);
      }
    };

    this.treeNodes.forEach(traverse);

    this.#update(true);
  }

  /** Selects the given node and any children. */
  select(node: TreeModelNode<T>, emitEvent = true): void {
    if (this.selects === 'single') {
      this.deselectAll();
    }

    node.indeterminate = false;
    node.selected = true;
    this.#selection.add(node);

    if (this.selects === 'multiple') {
      // Select all children
      if (node.expandable) {
        const traverse = (node: TreeModelNode<T>): void => {
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

    this.#update(emitEvent);
  }

  /** Deselects the given node and any children. */
  deselect(node: TreeModelNode<T>, emitEvent = true): void {
    node.indeterminate = node.selected = false;
    this.#selection.delete(node);

    if (this.selects === 'multiple') {
      // Deselect all children
      if (node.expandable) {
        const traverse = (node: TreeModelNode<T>): void => {
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

    this.#update(emitEvent);
  }

  /** Selects all nodes in the tree. */
  selectAll(): void {
    const traverse = (node: TreeModelNode<T>): void => {
      node.indeterminate = false;
      node.selected = true;
      this.#selection.add(node);

      if (node.expandable) {
        (node.children || []).forEach(traverse);
      }
    };

    this.treeNodes.forEach(traverse);

    this.#update(true);
  }

  /** Deselects all nodes in the tree. */
  deselectAll(): void {
    const traverse = (node: TreeModelNode<T>): void => {
      node.indeterminate = node.selected = false;
      this.#selection.delete(node);

      if (node.expandable) {
        (node.children || []).forEach(traverse);
      }
    };

    this.treeNodes.forEach(traverse);

    this.#update(true);
  }

  /** Flattens the tree nodes to an array based on the expansion state. */
  toArray(): Array<TreeModelNode<T> | typeof TreeModelNodePlaceholder> {
    const traverse = (treeNode: TreeModelNode<T>): Array<TreeModelNode<T> | typeof TreeModelNodePlaceholder> => {
      if (treeNode.expandable && treeNode.expanded) {
        if (Array.isArray(treeNode.children)) {
          const array = treeNode.children.map(childNode => {
            if (childNode instanceof Promise) {
              return TreeModelNodePlaceholder;
            } else {
              return traverse(childNode);
            }
          });

          return [treeNode, ...array.flat()];
        } else if (treeNode.childrenLoading instanceof Promise) {
          return [treeNode, TreeModelNodePlaceholder];
        }
      }

      return [treeNode];
    };

    return this.treeNodes.flatMap(treeNode => traverse(treeNode));
  }

  #update(emitEvent: boolean): void {
    if (emitEvent) {
      this.dispatchEvent(new Event('sl-update'));
    }
  }
}
