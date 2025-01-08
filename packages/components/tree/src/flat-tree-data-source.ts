import {
  TreeDataSource,
  type TreeDataSourceMapping,
  TreeDataSourceNode,
  type TreeDataSourceOptions
} from './tree-data-source.js';

export interface FlatTreeDataSourceMapping<T> extends TreeDataSourceMapping<T> {
  getLevel(item: T): number;
}

export interface FlatTreeDataSourceOptions<T> extends FlatTreeDataSourceMapping<T> {
  loadChildren?(node: T): Promise<T[]>;
  selects?: 'single' | 'multiple';
}

/**
 * A tree model that represents a flat list of nodes.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class FlatTreeDataSource<T = any> extends TreeDataSource<T> {
  #mapping: FlatTreeDataSourceMapping<T>;
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

  constructor(items: T[], options: FlatTreeDataSourceOptions<T>) {
    let loadChildren: TreeDataSourceOptions<T>['loadChildren'] | undefined = undefined;
    if (options.loadChildren) {
      loadChildren = async (node: TreeDataSourceNode<T>) => {
        const children = await options.loadChildren!(node.dataNode);

        return children.map((child, index) => this.#mapToTreeNode(child, node, index === children.length - 1));
      };
    }

    super({ ...options, loadChildren });

    this.#mapping = {
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
    const { getChildrenCount, getIcon, getId, getLabel, getLevel, isExpandable, isExpanded, isSelected } =
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
      level: getLevel(item),
      parent,
      selected: isSelected?.(item),
      type: 'node'
    };

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
