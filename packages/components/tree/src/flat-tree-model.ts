import { TreeModel, TreeModelNode, type TreeModelNodeMapping, type TreeModelOptions } from './tree-model.js';

export interface FlatTreeModelNodeMapping<T> extends TreeModelNodeMapping<T> {
  getLevel(dataNode: T): number;
}

export interface FlatTreeModelOptions<T> extends FlatTreeModelNodeMapping<T> {
  loadChildren?(node: T): Promise<T[]>;
  selects?: 'single' | 'multiple';
}

/**
 * A tree model that represents a flat list of nodes.
 */
export class FlatTreeModel<T> extends TreeModel<T> {
  #mapping: FlatTreeModelNodeMapping<T>;

  override treeNodes: Array<TreeModelNode<T>>;

  constructor(dataNodes: T[], options: FlatTreeModelOptions<T>) {
    let loadChildren: TreeModelOptions<T>['loadChildren'] | undefined = undefined;
    if (options.loadChildren) {
      loadChildren = async (node: TreeModelNode<T>) => {
        const children = await options.loadChildren!(node.dataNode);

        return children.map((child, index) => this.#mapToTreeNode(child, node, index === children.length - 1));
      };
    }

    super(dataNodes, { ...options, loadChildren });

    this.#mapping = {
      getChildrenCount: options.getChildrenCount,
      getIcon: options.getIcon,
      getId: options.getId ?? (dataNode => dataNode),
      getLabel: options.getLabel ?? (() => ''),
      getLevel: options.getLevel ?? (() => 0),
      isExpandable: options.isExpandable ?? (() => false),
      isExpanded: options.isExpanded,
      isSelected: options.isSelected
    };

    this.treeNodes = this.#mapToTreeNodes(dataNodes);

    if (this.selects === 'multiple') {
      Array.from(this.selection)
        .filter(node => node.parent)
        .forEach(node => {
          this.#updateSelected(node.parent!);
        });
    }
  }

  #mapToTreeNodes(dataNodes: T[]): Array<TreeModelNode<T>> {
    const levelMap: Map<number, Array<TreeModelNode<T>>> = new Map(),
      rootNodes: Array<TreeModelNode<T>> = [];

    dataNodes.forEach((dataNode, index) => {
      const nextLevel = index < dataNodes.length - 1 ? this.#mapping.getLevel(dataNodes[index + 1]) : 0,
        level = this.#mapping.getLevel(dataNode);

      const treeNode = this.#mapToTreeNode(dataNode, undefined, level > nextLevel);

      if (treeNode.selected) {
        this.selection.add(treeNode);
      }

      if (level === 0) {
        rootNodes.push(treeNode);
      } else {
        const parentLevel = level - 1,
          parentNodes = levelMap.get(parentLevel);

        if (parentNodes) {
          const parentNode = parentNodes[parentNodes.length - 1];
          parentNode.children ||= [];
          parentNode.children.push(treeNode);
          treeNode.parent = parentNode;
        }
      }

      if (!levelMap.has(level)) {
        levelMap.set(level, []);
      }

      levelMap.get(level)!.push(treeNode);
    });

    return rootNodes;
  }

  #mapToTreeNode(dataNode: T, parent?: TreeModelNode<T>, lastNodeInLevel?: boolean): TreeModelNode<T> {
    const { getChildrenCount, getIcon, getId, getLabel, getLevel, isExpandable, isExpanded, isSelected } =
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
      level: getLevel(dataNode),
      parent,
      selected: isSelected?.(dataNode)
    };

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
