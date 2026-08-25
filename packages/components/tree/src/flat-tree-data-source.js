import { TreeDataSource } from './tree-data-source.js';
export class FlatTreeDataSource extends TreeDataSource {
  /** The mapping from the source model to the tree model. */
  #mapping;
  /** Array of tree nodes that were mapped from the source model. */
  #nodes = [];
  /** Array of view nodes that represent the current state of the tree. */
  #viewNodes = [];
  get items() {
    return this.#viewNodes;
  }
  get nodes() {
    return this.#nodes;
  }
  get size() {
    return this.#nodes.length;
  }
  constructor(items, options) {
    let loadChildren = void 0;
    if (options.loadChildren) {
      loadChildren = async node => {
        const children = await options.loadChildren(node.dataNode);
        return children.map((child, index) => {
          const childNode = this.#mapToTreeNode(child, node, index === children.length - 1);
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
      isSelectable: options.isSelectable,
      isSelected: options.isSelected
    };
    this.#nodes = this.#mapToTreeNodes(items);
    if (this.multiple) {
      this.syncSelection();
    }
  }
  update(sync = true) {
    if (sync) {
      this.syncSelection();
    }
    this.#viewNodes = this.toViewArray();
    this.dispatchEvent(new CustomEvent('sl-update'));
  }
  #mapToTreeNodes(items) {
    const levelMap = /* @__PURE__ */ new Map(),
      rootNodes = [];
    items.forEach((item, index) => {
      const nextLevel = index < items.length - 1 ? this.#mapping.getLevel(items[index + 1]) : 0,
        level = this.#mapping.getLevel(item);
      const treeNode = this.#mapToTreeNode(item, void 0, level > nextLevel);
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
      levelMap.get(level).push(treeNode);
    });
    return rootNodes;
  }
  #mapToTreeNode(item, parent, lastNodeInLevel) {
    const {
      getAriaDescription,
      getChildrenCount,
      getIcon,
      getId,
      getLabel,
      getLevel,
      isExpandable,
      isExpanded,
      isSelectable,
      isSelected
    } = this.#mapping;
    const expandable = isExpandable(item),
      selectable = isSelectable?.(item) ?? true;
    const treeNode = {
      id: getId(item),
      childrenCount: getChildrenCount?.(item),
      dataNode: item,
      description: getAriaDescription?.(item),
      expandable,
      expanded: (expandable && isExpanded?.(item)) ?? false,
      expandedIcon: expandable ? getIcon?.(item, true) : void 0,
      icon: getIcon?.(item, false),
      label: getLabel(item),
      lastNodeInLevel,
      level: getLevel(item),
      parent,
      selectable,
      selected: selectable ? isSelected?.(item) : false,
      type: 'node'
    };
    return treeNode;
  }
}
//# sourceMappingURL=flat-tree-data-source.js.map
