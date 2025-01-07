import {
  TreeDataSource,
  type TreeDataSourceMapping,
  type TreeDataSourceNode,
  type TreeDataSourceOptions
} from './tree-data-source.js';

export interface NestedTreeDataSourceMapping<T> extends TreeDataSourceMapping<T> {
  getChildren(item: T): T[] | Promise<T[]> | undefined;
}

export interface NestedTreeDataSourceOptions<T> extends NestedTreeDataSourceMapping<T> {
  loadChildren?(node: T): Promise<T[]>;
  selects?: 'single' | 'multiple';
}

/**
 * A tree model that represents a nested list of nodes.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class NestedTreeDataSource<T = any> extends TreeDataSource<T> {
  #mapping: NestedTreeDataSourceMapping<T>;
  #nodes: Array<TreeDataSourceNode<T>> = [];
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

        return children.map((child, index) => this.#mapToTreeNode(child, node, index === children.length - 1));
      };
    }

    super({ ...options, loadChildren });

    this.#mapping = {
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

    if (this.selects === 'multiple') {
      Array.from(this.selection)
        .filter(node => node.parent)
        .forEach(node => {
          this.#updateSelected(node.parent!);
        });
    }
  }

  override update(): void {
    this.#viewNodes = this.toViewArray();

    this.dispatchEvent(new CustomEvent('sl-update'));
  }

  #mapToTreeNode(item: T, parent?: TreeDataSourceNode<T>, lastNodeInLevel?: boolean): TreeDataSourceNode<T> {
    const { getChildren, getChildrenCount, getIcon, getId, getLabel, isExpandable, isExpanded, isSelected } =
      this.#mapping;

    const treeNode: TreeDataSourceNode<T> = {
      id: getId(item),
      childrenCount: getChildrenCount?.(item),
      dataNode: item,
      expandable: isExpandable(item),
      expanded: isExpanded?.(item) ?? false,
      expandedIcon: getIcon?.(item, true),
      icon: getIcon?.(item, false),
      label: getLabel(item),
      lastNodeInLevel,
      level: parent ? parent.level + 1 : 0,
      parent,
      selected: isSelected?.(item)
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

  /** Traverse up the tree and update the selected/indeterminate state. */
  #updateSelected(node: TreeDataSourceNode<T>): void {
    this.selection.add(node);

    node.selected = node.children?.every(child => child.selected) ?? false;
    node.indeterminate =
      (!node.selected && node.children?.some(child => child.indeterminate || child.selected)) ?? false;

    if (node.parent) {
      this.#updateSelected(node.parent);
    }
  }
}
