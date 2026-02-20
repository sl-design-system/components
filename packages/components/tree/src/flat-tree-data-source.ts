import {
  TreeDataSource,
  type TreeDataSourceMapping,
  TreeDataSourceNode,
  type TreeDataSourceOptions
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

/**
 * A tree model that represents a flat list of nodes.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class FlatTreeDataSource<T = any> extends TreeDataSource<T> {
  /** The mapping from the source model to the tree model. */
  #mapping: FlatTreeDataSourceMapping<T>;

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

  constructor(items: T[], options: FlatTreeDataSourceOptions<T>) {
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
      getChildrenCount: options.getChildrenCount,
      getIcon: options.getIcon,
      getId: options.getId ?? (item => item),
      getLabel: options.getLabel ?? (() => ''),
      getLevel: options.getLevel ?? (() => 0),
      isExpandable: options.isExpandable ?? (() => false),
      isExpanded: options.isExpanded,
      isSelected: options.isSelected
    };

    this.#nodes = this.#mapToTreeNodes(items);

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

  #mapToTreeNodes(items: T[]): Array<TreeDataSourceNode<T>> {
    const levelMap: Map<number, Array<TreeDataSourceNode<T>>> = new Map(),
      rootNodes: Array<TreeDataSourceNode<T>> = [];

    items.forEach((item, index) => {
      const nextLevel = index < items.length - 1 ? this.#mapping.getLevel(items[index + 1]) : 0,
        level = this.#mapping.getLevel(item);

      const treeNode = this.#mapToTreeNode(item, undefined, level > nextLevel);

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

  #mapToTreeNode(item: T, parent?: TreeDataSourceNode<T>, lastNodeInLevel?: boolean): TreeDataSourceNode<T> {
    const {
      getAriaDescription,
      getChildrenCount,
      getIcon,
      getId,
      getLabel,
      getLevel,
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
      level: getLevel(item),
      parent,
      selected: isSelected?.(item),
      type: 'node'
    };

    return treeNode;
  }

}
