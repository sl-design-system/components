import { DataSource } from '@sl-design-system/data-source';
import { getStringByPath } from '@sl-design-system/shared';
export class TreeDataSource extends DataSource {
  /** Map of all active filters. */
  #filters = /* @__PURE__ */ new Map();
  /** An optional callback for loading additional tree nodes. */
  #loadChildren;
  /** A set containing the selected node(s) in the tree. */
  #selection = /* @__PURE__ */ new Set();
  /** Whether multiple nodes can be selected. */
  #multiple;
  /**
   * The value and path/function to use for sorting. When setting this property, it will cause the
   * data to be automatically sorted.
   */
  #sort;
  get filters() {
    return this.#filters;
  }
  /** Indicates whether the data source allows single or multiple selection. */
  get multiple() {
    return this.#multiple;
  }
  /** The current selection of tree node(s). */
  get selection() {
    return this.#selection;
  }
  get sort() {
    return this.#sort;
  }
  constructor(options = {}) {
    super();
    this.#loadChildren = options.loadChildren;
    this.#multiple = options.multiple;
  }
  addFilter(_id, _by, _value) {
    throw new Error('Filtering is not yet supported in tree data sources.');
  }
  removeFilter(_id) {
    throw new Error('Filtering is not yet supported in tree data sources.');
  }
  setSort(by, direction) {
    this.#sort = { by, direction };
  }
  removeSort() {
    this.#sort = void 0;
  }
  /**
   * Toggles the expansion state of a tree node. You can optionally force the state to a specific
   * value using the `force` parameter. The `emitEvent` parameter determines whether the model
   * should emit an `sl-update` event after changing the state.
   */
  toggle(node, force, emitEvent) {
    if ((typeof force === 'boolean' && !force) || node.expanded) {
      this.collapse(node, emitEvent);
    } else {
      this.expand(node, emitEvent);
    }
  }
  /** Expands a tree node. */
  expand(node, emitEvent = true) {
    if (!node.expandable) {
      return;
    }
    node.expanded = true;
    if (!node.children) {
      node.childrenLoading = this.#loadChildren?.(node).then(children => {
        node.children = children;
        node.childrenLoading = void 0;
        this.update();
      });
    }
    if (emitEvent) {
      this.update(false);
    }
  }
  /** Collapses a tree node. */
  collapse(node, emitEvent = true) {
    if (!node.expandable) {
      return;
    }
    node.expanded = false;
    if (emitEvent) {
      this.update(false);
    }
  }
  /** Toggles the expansion state of all descendants of a given tree node. */
  toggleDescendants(node, force) {
    const traverse = node2 => {
      if (node2.expandable) {
        if (typeof force === 'boolean') {
          if (force) {
            this.expand(node2, false);
          } else {
            this.collapse(node2, false);
          }
        } else if (node2.expanded) {
          this.collapse(node2, false);
        } else {
          this.expand(node2, false);
        }
        (node2.children || []).forEach(traverse);
      }
    };
    traverse(node);
    this.update(false);
  }
  /** Expands all descendants of a given tree node. */
  expandDescendants(node) {
    this.toggleDescendants(node, true);
  }
  /** Collapses all descendants of a given tree node. */
  collapseDescendants(node) {
    this.toggleDescendants(node, false);
  }
  /** Expands all expandable tree nodes. */
  async expandAll() {
    const traverse = async node => {
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
    for (const node of this.nodes) {
      await traverse(node);
    }
    this.update(true);
  }
  /** Collapses all expandable tree nodes. */
  collapseAll() {
    const traverse = node => {
      if (node.expandable) {
        this.collapse(node, false);
        (node.children || []).forEach(traverse);
      }
    };
    this.nodes.forEach(traverse);
    this.update(false);
  }
  /** Selects the given node and any children. */
  select(node, emitEvent = true) {
    if (node.selectable === false) {
      return;
    }
    if (!this.multiple) {
      this.deselectAll();
    }
    node.indeterminate = false;
    node.selected = true;
    this.#selection.add(node);
    if (this.multiple) {
      if (node.expandable) {
        const traverse = node2 => {
          if (node2.selectable !== false) {
            node2.indeterminate = false;
            node2.selected = true;
            this.#selection.add(node2);
          }
          if (node2.expandable) {
            (node2.children || []).forEach(traverse);
          }
        };
        node.children?.forEach(traverse);
      }
      let parent = node.parent;
      while (parent) {
        this.#updateParent(parent);
        parent = parent.parent;
      }
    }
    if (emitEvent) {
      this.update(false);
    }
  }
  /** Deselects the given node and any children. */
  deselect(node, emitEvent = true) {
    node.indeterminate = node.selected = false;
    this.#selection.delete(node);
    if (this.multiple) {
      if (node.expandable) {
        const traverse = node2 => {
          node2.indeterminate = node2.selected = false;
          this.#selection.delete(node2);
          if (node2.expandable) {
            (node2.children || []).forEach(traverse);
          }
        };
        node.children?.forEach(traverse);
      }
      let parent = node.parent;
      while (parent) {
        this.#updateParent(parent);
        parent = parent.parent;
      }
    }
    if (emitEvent) {
      this.update(false);
    }
  }
  /** Selects all selectable nodes in the tree. */
  selectAll() {
    const traverse = node => {
      if (node.selectable !== false) {
        node.indeterminate = false;
        node.selected = true;
        this.#selection.add(node);
      }
      if (node.expandable) {
        (node.children || []).forEach(traverse);
      }
    };
    this.nodes.forEach(traverse);
    this.update(false);
  }
  /** Deselects all nodes in the tree. */
  deselectAll() {
    const traverse = node => {
      node.indeterminate = node.selected = false;
      this.#selection.delete(node);
      if (node.expandable) {
        (node.children || []).forEach(traverse);
      }
    };
    this.nodes.forEach(traverse);
    this.update(false);
  }
  /** Flattens the tree nodes to an array based on the expansion state. */
  toViewArray() {
    const calculateLevelGuides = node => {
      const guides = [];
      let current = node.parent;
      while (current) {
        const siblings = current.parent?.children ?? this.nodes;
        guides.push(current.level);
        if (siblings?.at(-1) === current) {
          break;
        }
        current = current.parent;
      }
      return guides;
    };
    const sortNodes = nodes => {
      if (!this.sort) {
        return nodes;
      }
      let sortFn;
      if (typeof this.sort.by === 'function') {
        sortFn = this.sort.by;
      } else {
        const path = this.sort.by;
        sortFn = (a, b) => {
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
        const result2 = sortFn(a.dataNode, b.dataNode);
        return this.sort?.direction === 'asc' ? result2 : -result2;
      });
    };
    const traverse = treeNode => {
      if (treeNode.expandable && treeNode.expanded) {
        if (Array.isArray(treeNode.children)) {
          const sortedChildren = sortNodes(treeNode.children);
          treeNode.children = sortedChildren;
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
              ...Array.from({ length: treeNode.childrenCount }).map(() =>
                this.#createSkeletonTreeNode(treeNode)
              )
            ];
          } else {
            return [treeNode, this.#createPlaceholderTreeNode(treeNode)];
          }
        }
      }
      return [treeNode];
    };
    const sortedRootNodes = sortNodes(this.nodes);
    const result = sortedRootNodes.flatMap(treeNode => traverse(treeNode));
    result.forEach(node => {
      node.levelGuides = calculateLevelGuides(node);
      const siblings = node.parent?.children ?? sortedRootNodes;
      node.lastNodeInLevel = siblings?.at(-1) === node;
    });
    return result;
  }
  #createPlaceholderTreeNode(parent) {
    let levelGuides = [];
    const siblings = parent.parent?.children ?? this.nodes;
    if (siblings?.at(-1) === parent && parent.levelGuides) {
      levelGuides = [parent.level];
    } else {
      levelGuides = [parent.level, ...(parent.levelGuides ?? [])];
    }
    return {
      dataNode: null,
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
  #createSkeletonTreeNode(parent) {
    let levelGuides = [];
    const siblings = parent.parent?.children ?? this.nodes;
    if (siblings?.at(-1) === parent && parent.levelGuides) {
      levelGuides = [parent.level];
    } else {
      levelGuides = [parent.level, ...(parent.levelGuides ?? [])];
    }
    return {
      dataNode: null,
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
  /**
   * Synchronizes the selection state of the entire tree.
   *
   * @internal
   */
  syncSelection() {
    if (!this.multiple) {
      return;
    }
    const traverse = node => {
      if (node.expandable && node.children && node.children.length > 0) {
        node.children.forEach(traverse);
        this.#updateParent(node);
      } else if (node.selected) {
        this.#selection.add(node);
      } else {
        this.#selection.delete(node);
      }
    };
    this.nodes.forEach(traverse);
  }
  /** Update the selected and indeterminate state of the given parent node. */
  #updateParent(node) {
    if (!node.children) {
      return;
    }
    const selectableChildren = node.children.filter(child => child.selectable !== false);
    if (selectableChildren.length === 0) {
      if (node.selected) {
        this.#selection.add(node);
      } else {
        this.#selection.delete(node);
      }
      return;
    }
    node.selected = selectableChildren.every(child => child.selected);
    node.indeterminate =
      !node.selected && selectableChildren.some(child => child.indeterminate || child.selected);
    if (node.selected) {
      this.#selection.add(node);
    } else {
      this.#selection.delete(node);
    }
  }
}
//# sourceMappingURL=tree-data-source.js.map
