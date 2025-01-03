import { TreeModel, type TreeModelNode, type TreeModelNodeMapping, type TreeModelOptions } from './tree-model.js';

export interface NestedTreeModelNodeMapping<T> extends TreeModelNodeMapping<T> {
  getChildren(dataNode: T): T[] | Promise<T[]> | undefined;
}

export interface NestedTreeModelOptions<T> extends NestedTreeModelNodeMapping<T> {
  loadChildren?(node: T): Promise<T[]>;
  selects?: 'single' | 'multiple';
}

/**
 * A tree model that represents a nested list of nodes.
 */
export class NestedTreeModel<T> extends TreeModel<T> {
  #mapping: NestedTreeModelNodeMapping<T>;

  override treeNodes: Array<TreeModelNode<T>>;

  constructor(dataNodes: T[], options: NestedTreeModelOptions<T>) {
    let loadChildren: TreeModelOptions<T>['loadChildren'] | undefined = undefined;
    if (options.loadChildren) {
      loadChildren = async (node: TreeModelNode<T>) => {
        const children = await options.loadChildren!(node.dataNode);

        return children.map((child, index) => this.#mapToTreeNode(child, node, index === children.length - 1));
      };
    }

    super(dataNodes, { ...options, loadChildren });

    this.#mapping = {
      getChildren: options.getChildren,
      getChildrenCount: options.getChildrenCount,
      getIcon: options.getIcon,
      getId: options.getId ?? (dataNode => dataNode),
      getLabel: options.getLabel ?? (() => ''),
      isExpandable: options.isExpandable ?? (() => false),
      isExpanded: options.isExpanded,
      isSelected: options.isSelected
    };

    this.treeNodes = dataNodes.map(dataNode => this.#mapToTreeNode(dataNode));

    if (this.selects === 'multiple') {
      Array.from(this.selection)
        .filter(node => node.parent)
        .forEach(node => {
          this.#updateSelected(node.parent!);
        });
    }
  }

  #mapToTreeNode(dataNode: T, parent?: TreeModelNode<T>, lastNodeInLevel?: boolean): TreeModelNode<T> {
    const { getChildren, getChildrenCount, getIcon, getId, getLabel, isExpandable, isExpanded, isSelected } =
      this.#mapping;

    const treeNode: TreeModelNode<T> = {
      id: getId(dataNode),
      childrenCount: getChildrenCount?.(dataNode),
      dataNode,
      expandable: isExpandable(dataNode),
      expanded: isExpanded?.(dataNode) ?? false,
      expandedIcon: getIcon?.(dataNode, true),
      icon: getIcon?.(dataNode, false),
      label: getLabel(dataNode),
      lastNodeInLevel,
      level: parent ? parent.level + 1 : 0,
      parent,
      selected: isSelected?.(dataNode)
    };

    if (treeNode.selected) {
      this.selection.add(treeNode);
    }

    if (treeNode.expandable && treeNode.expanded) {
      const children = getChildren(dataNode);

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
  #updateSelected(treeNode: TreeModelNode<T>): void {
    this.selection.add(treeNode);

    treeNode.selected = treeNode.children?.every(child => child.selected) ?? false;
    treeNode.indeterminate =
      (!treeNode.selected && treeNode.children?.some(child => child.indeterminate || child.selected)) ?? false;

    if (treeNode.parent) {
      this.#updateSelected(treeNode.parent);
    }
  }
}
