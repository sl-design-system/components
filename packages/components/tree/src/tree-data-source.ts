import {
  DataSource,
  type DataSourceFilter,
  type DataSourceFilterFunction,
  type DataSourceSort,
  type DataSourceSortDirection,
  type DataSourceSortFunction
} from '@sl-design-system/data-source';
import { type PathKeys, getStringByPath } from '@sl-design-system/shared';
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
  selected?: boolean;
  type: TreeNodeType;
}

export interface TreeDataSourceMapping<T> {
  /** Optional method for returning a custom aria description for a tree node. */
  getAriaDescription?(item: T): string | undefined;

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
   * use the `expand` and `collapse` methods on the data source.
   */
  isExpanded?(item: T): boolean;

  /**
   * Returns whether the given node is selected. This is only used for the initial
   * selected state of the node. If you want to select/deselect a node programmatically,
   * use the `select` and `deselect` methods on the data source.
   */
  isSelected?(item: T): boolean;
}

export interface TreeDataSourceOptions<T> {
  /** Provide this method to lazy load child nodes when a parent node is expanded. */
  loadChildren?(node: TreeDataSourceNode<T>): Promise<Array<TreeDataSourceNode<T>>>;

  /** Enables multiple selection of tree nodes. */
  multiple?: boolean;
}

/**
 * Abstract class used to provide a common interface for tree data.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class TreeDataSource<T = any> extends DataSource<T, TreeDataSourceNode<T>> {
  /** Map of all active filters. */
  #filters: Map<string, DataSourceFilter<T>> = new Map();

  /** An optional callback for loading additional tree nodes. */
  #loadChildren?: TreeDataSourceOptions<T>['loadChildren'];

  /** A set containing the selected node(s) in the tree. */
  #selection: Set<TreeDataSourceNode<T>> = new Set();

  /** Whether multiple nodes can be selected. */
  #multiple?: boolean;

  /**
   * The value and path/function to use for sorting. When setting this property,
   * it will cause the data to be automatically sorted.
   */
  #sort?: DataSourceSort<T>;

  get filters() {
    return this.#filters;
  }

  /** Indicates whether the data source allows single or multiple selection. */
  get multiple() {
    return this.#multiple;
  }

  /** A hierarchical representation of the items in the tree. */
  abstract readonly nodes: Array<TreeDataSourceNode<T>>;

  /** The current selection of tree node(s). */
  get selection() {
    return this.#selection;
  }

  get sort() {
    return this.#sort;
  }

  constructor(options: TreeDataSourceOptions<T> = {}) {
    super();

    this.#loadChildren = options.loadChildren;
    this.#multiple = options.multiple;
  }

  addFilter(_id: string, _by: string | PathKeys<T> | DataSourceFilterFunction<T>, _value?: unknown): void {
    throw new Error('Filtering is not yet supported in tree data sources.');
  }

  removeFilter(_id: string): void {
    throw new Error('Filtering is not yet supported in tree data sources.');
  }

  setSort(by: string | PathKeys<T> | DataSourceSortFunction<T>, direction: DataSourceSortDirection): void {
    this.#sort = { by, direction };
  }

  removeSort(): void {
    this.#sort = undefined;
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
        if (typeof force === 'boolean') {
          if (force) {
            this.expand(node, true);
          } else {
            this.collapse(node, true);
          }
        } else if (node.expanded) {
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
        this.expand(node, true);

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
    if (!this.multiple) {
      this.deselectAll();
    }

    node.indeterminate = false;
    node.selected = true;
    this.#selection.add(node);

    if (this.multiple) {
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

    if (this.multiple) {
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
    /**
     * Calculate level guides for a node by walking up the parent chain.
     * Always add the parent's level, but stop walking up when we reach a last child.
     */
    const calculateLevelGuides = (node: TreeDataSourceNode<T>): number[] => {
      const guides: number[] = [];

      let current = node.parent;
      while (current) {
        const siblings = current.parent?.children ?? this.nodes;

        // Always add the current parent's level
        guides.push(current.level);

        // Stop propagating if this parent is the last child
        if (siblings?.at(-1) === current) {
          break;
        }

        // Move up to the next parent
        current = current.parent;
      }

      return guides;
    };

    /** Sort nodes at the same level using the configured sort function. */
    const sortNodes = (nodes: Array<TreeDataSourceNode<T>>): Array<TreeDataSourceNode<T>> => {
      if (!this.sort) {
        return nodes;
      }

      let sortFn: DataSourceSortFunction<T>;

      if (typeof this.sort.by === 'function') {
        sortFn = this.sort.by;
      } else {
        const path = this.sort.by as PathKeys<T>;

        sortFn = (a: T, b: T): number => {
          const valueA = getStringByPath(a, path),
            valueB = getStringByPath(b, path);

          const numberA = Number(valueA),
            numberB = Number(valueB);

          if (!isNaN(numberA) && !isNaN(numberB)) {
            return numberA - numberB;
          }

          return valueA.toLowerCase() === valueB.toLowerCase()
            ? 0
            : valueA.toLowerCase() < valueB.toLowerCase()
              ? -1
              : 1;
        };
      }

      return [...nodes].sort((a, b) => {
        const result = sortFn(a.dataNode, b.dataNode);

        return this.sort?.direction === 'asc' ? result : -result;
      });
    };

    const traverse = (treeNode: TreeDataSourceNode<T>): Array<TreeDataSourceNode<T>> => {
      // Calculate and set level guides for the current node
      treeNode.levelGuides = calculateLevelGuides(treeNode);

      // Set lastNodeInLevel based on whether this is the last child of its parent
      const siblings = treeNode.parent?.children ?? this.nodes;

      treeNode.lastNodeInLevel = siblings?.at(-1) === treeNode;

      if (treeNode.expandable && treeNode.expanded) {
        if (Array.isArray(treeNode.children)) {
          // Sort children before traversing
          const sortedChildren = sortNodes(treeNode.children);

          const array = sortedChildren.map(childNode => {
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

    // Sort root nodes before traversing
    const sortedRootNodes = sortNodes(this.nodes);

    return sortedRootNodes.flatMap(treeNode => traverse(treeNode));
  }

  #createPlaceholderTreeNode(parent: TreeDataSourceNode<T>): TreeDataSourceNode<T> {
    let levelGuides: number[] = [];

    const siblings = parent.parent?.children ?? this.nodes;
    if (siblings?.at(-1) === parent && parent.levelGuides) {
      // If parent is last child, don't include guides from higher levels
      levelGuides = [parent.level];
    } else {
      levelGuides = [parent.level, ...(parent.levelGuides ?? [])];
    }

    return {
      dataNode: null as unknown as T,
      expandable: false,
      expanded: false,
      id: 'placeholder',
      label: '',
      level: parent.level + 1,
      levelGuides,
      parent,
      type: 'placeholder'
    };
  }

  #createSkeletonTreeNode(parent: TreeDataSourceNode<T>): TreeDataSourceNode<T> {
    let levelGuides: number[] = [];

    const siblings = parent.parent?.children ?? this.nodes;
    if (siblings?.at(-1) === parent && parent.levelGuides) {
      // If parent is last child, don't include guides from higher levels
      levelGuides = [parent.level];
    } else {
      levelGuides = [parent.level, ...(parent.levelGuides ?? [])];
    }

    return {
      dataNode: null as unknown as T,
      expandable: false,
      expanded: false,
      id: 'skeleton',
      label: '',
      level: parent.level + 1,
      levelGuides,
      parent,
      type: 'skeleton'
    };
  }
}
