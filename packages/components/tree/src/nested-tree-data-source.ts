import {
  TreeDataSource,
  type TreeDataSourceMapping,
  type TreeDataSourceNode,
  type TreeDataSourceOptions
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

/**
 * A tree model that represents a nested list of nodes.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class NestedTreeDataSource<T = any> extends TreeDataSource<T> {
  /** The mapping from the source model to the tree model. */
  #mapping: NestedTreeDataSourceMapping<T>;

  /** Array of tree nodes that were mapped from the source model. */
  #nodes: Array<TreeDataSourceNode<T>> = [];

  /** Array of view nodes that represent the current state of the tree. */
  #viewNodes: Array<TreeDataSourceNode<T>> = [];

  get items(): Array<TreeDataSourceNode<T>> {
    return this.#viewNodes;
  }

  get nodes(): Array<TreeDataSourceNode<T>> {
    return this.#nodes;
  }

  get size() {
    return this.#nodes.length;
  }

  constructor(items: T[], options: NestedTreeDataSourceOptions<T>) {
    let loadChildren: TreeDataSourceOptions<T>['loadChildren'] | undefined = undefined;
    if (options.loadChildren) {
      loadChildren = async (node: TreeDataSourceNode<T>) => {
        const children = await options.loadChildren!(node.dataNode);

        return children.map((child, index) => {
          const childNode = this.#mapToTreeNode(child, node, index === children.length - 1);

          // If the parent is selected and we have multiple selection enabled,
          // ensure all lazy-loaded children are also selected
          if (this.multiple && node.selected) {
            childNode.selected = true;
            this.selection.add(childNode);
          }

          return childNode;
        });
      };
    }

    super({ ...options, loadChildren });

    this.#mapping = {
      getAriaDescription: options.getAriaDescription,
      getChildren: options.getChildren,
      getChildrenCount: options.getChildrenCount,
      getIcon: options.getIcon,
      getId: options.getId ?? (item => item),
      getLabel: options.getLabel ?? (() => ''),
      isExpandable: options.isExpandable ?? (() => false),
      isExpanded: options.isExpanded,
      isSelected: options.isSelected
    };

    this.#nodes = items.map(item => this.#mapToTreeNode(item));

    if (this.multiple) {
      this.syncSelection();
    }
  }

  override update(sync = true): void {
    if (sync) {
      this.syncSelection();
    }

    this.#viewNodes = this.toViewArray();

    this.dispatchEvent(new CustomEvent('sl-update'));
  }

  #mapToTreeNode(item: T, parent?: TreeDataSourceNode<T>, lastNodeInLevel?: boolean): TreeDataSourceNode<T> {
    const {
      getAriaDescription,
      getChildren,
      getChildrenCount,
      getIcon,
      getId,
      getLabel,
      isExpandable,
      isExpanded,
      isSelected
    } = this.#mapping;

    const expandable = isExpandable(item);

    const treeNode: TreeDataSourceNode<T> = {
      id: getId(item),
      childrenCount: getChildrenCount?.(item),
      dataNode: item,
      description: getAriaDescription?.(item),
      expandable,
      expanded: (expandable && isExpanded?.(item)) ?? false,
      expandedIcon: expandable ? getIcon?.(item, true) : undefined,
      icon: getIcon?.(item, false),
      label: getLabel(item),
      lastNodeInLevel,
      level: parent ? parent.level + 1 : 0,
      parent,
      selected: isSelected?.(item),
      type: 'node'
    };

    if (treeNode.selected) {
      this.selection.add(treeNode);
    }

    if (treeNode.expandable) {
      const children = getChildren(item);

      if (Array.isArray(children)) {
        treeNode.children = children.map((child, index) =>
          this.#mapToTreeNode(child, treeNode, index === children.length - 1)
        );
      } else if (children instanceof Promise) {
        treeNode.childrenLoading = new Promise(resolve => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          children.then(loadedChildren => {
            treeNode.children = loadedChildren.map((child, index) =>
              this.#mapToTreeNode(child, treeNode, index === loadedChildren.length - 1)
            );
            treeNode.childrenLoading = undefined;

            resolve();
          });
        });
      }
    }

    return treeNode;
  }

}
