export interface TreeModelArrayItem<T> {
  dataNode: T;
  expanded: boolean;
  expandable: boolean;
  lastNodeInLevel?: boolean;
  level: number;
}

export interface TreeModelOptions<T> {
  getIcon?: TreeModel<T>['getIcon'];
  getId?: TreeModel<T>['getId'];
  getLabel: TreeModel<T>['getLabel'];
  isExpandable: TreeModel<T>['isExpandable'];
}

export type TreeModelId<T> = ReturnType<TreeModel<T>['getId']>;

/**
 * Abstract class used to provide a common interface for tree data.
 */
export abstract class TreeModel<T> extends EventTarget {
  /** The expansion state of the tree. */
  #expansion = new Set<TreeModelId<T>>();

  /** The nodes of the tree. */
  readonly dataNodes: T[] = [];

  constructor(dataNodes: T[], options: TreeModelOptions<T>) {
    super();

    this.dataNodes = dataNodes;

    if (options.getIcon) {
      this.getIcon = options.getIcon;
    }

    if (options.getId) {
      this.getId = options.getId;
    }

    this.getLabel = options.getLabel;
    this.isExpandable = options.isExpandable;
  }

  /** Returns an array of all the descendants of a given tree node. */
  abstract getDescendants(id: TreeModelId<T>): T[];

  /** Returns the parent node or `undefined` if the node is a root node. */
  abstract getParent(id: TreeModelId<T>): T | undefined;

  /** Returns an array of all siblings of a given tree node. */
  abstract getSiblings(id: TreeModelId<T>): T[];

  /** Flattens the tree to an array based on the expansion state. */
  abstract toArray(): Array<TreeModelArrayItem<T>>;

  /**
   * Returns a string that is used as the label for the tree node.
   * If you want to customize how the tree node is rendered, you can
   * provide your own `TreeItemRenderer` function to the tree component.
   */
  getLabel(_dataNode: T): string {
    return '';
  }

  /** Used to identify a tree node. */
  getId(dataNode: T): unknown {
    return dataNode;
  }

  /** Optional method for returning a custom icon for a tree node. */
  getIcon(_dataNode: T, _expanded?: boolean): string | undefined {
    return undefined;
  }

  /** Returns whether the given node is expandable. */
  isExpandable(_dataNode: T): boolean {
    return false;
  }

  /**
   * Toggles the expansion state of a tree node. You can optionally force the
   * state to a specific value using the `force` parameter. The `emitEvent`
   * parameter determines whether the model should emit an `sl-update` event
   * after changing the state.
   */
  toggle(id: TreeModelId<T>, force?: boolean, emitEvent?: boolean): void {
    if ((typeof force === 'boolean' && !force) || this.isExpanded(id)) {
      this.collapse(id, emitEvent);
    } else {
      this.expand(id, emitEvent);
    }
  }

  /** Expands a tree node. */
  expand(id: TreeModelId<T>, emitEvent = true): void {
    this.#expansion.add(id);
    this.#update(emitEvent);
  }

  /** Collapses a tree node. */
  collapse(id: TreeModelId<T>, emitEvent = true): void {
    this.#expansion.delete(id);
    this.#update(emitEvent);
  }

  /** Returns whether a tree node is expanded. */
  isExpanded(id: TreeModelId<T>): boolean {
    return this.#expansion.has(id);
  }

  /** Expands all expandable tree nodes. */
  expandAll(): void {
    this.dataNodes.forEach(node => {
      const id = this.getId(node);

      this.expand(id, false);
      this.expandDescendants(id);
    });

    this.dispatchEvent(new Event('sl-update'));
  }

  /** Collapses all expandable tree nodes. */
  collapseAll(): void {
    this.#expansion.clear();
    this.#update(true);
  }

  /** Toggles the expansion state of all descendants of a given tree node. */
  toggleDescendants(id: TreeModelId<T>, force?: boolean): void {
    this.getDescendants(id).forEach(nextNode => {
      this.toggle(this.getId(nextNode), force, false);
    });

    this.dispatchEvent(new Event('sl-update'));
  }

  /** Expands all descendants of a given tree node. */
  expandDescendants(id: TreeModelId<T>): void {
    this.toggleDescendants(id, true);
  }

  /** Collapses all descendants of a given tree node. */
  collapseDescendants(id: TreeModelId<T>): void {
    this.toggleDescendants(id, false);
  }

  #update(emitEvent: boolean): void {
    if (emitEvent) {
      this.dispatchEvent(new Event('sl-update'));
    }
  }
}
