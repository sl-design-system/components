import { TreeDataSource } from './tree-data-source.js';
export class NestedTreeDataSource extends TreeDataSource {
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
      getChildren: options.getChildren,
      getChildrenCount: options.getChildrenCount,
      getIcon: options.getIcon,
      getId: options.getId ?? (item => item),
      getLabel: options.getLabel ?? (() => ''),
      isExpandable: options.isExpandable ?? (() => false),
      isExpanded: options.isExpanded,
      isSelectable: options.isSelectable,
      isSelected: options.isSelected
    };
    this.#nodes = items.map(item => this.#mapToTreeNode(item));
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
  #mapToTreeNode(item, parent, lastNodeInLevel) {
    const {
      getAriaDescription,
      getChildren,
      getChildrenCount,
      getIcon,
      getId,
      getLabel,
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
      level: parent ? parent.level + 1 : 0,
      parent,
      selectable,
      selected: selectable ? isSelected?.(item) : false,
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
          children.then(loadedChildren => {
            treeNode.children = loadedChildren.map((child, index) =>
              this.#mapToTreeNode(child, treeNode, index === loadedChildren.length - 1)
            );
            treeNode.childrenLoading = void 0;
            resolve();
          });
        });
      }
    }
    return treeNode;
  }
}
//# sourceMappingURL=nested-tree-data-source.js.map
