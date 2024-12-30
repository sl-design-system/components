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

  /** Returns whether the given node is expandable. */
  isExpandable(_dataNode: T): boolean {
    return false;
  }

  /** Returns a string that is used as the label for the tree node. */
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

  toggle(id: TreeModelId<T>): void {
    if (this.isExpanded(id)) {
      this.collapse(id);
    } else {
      this.expand(id);
    }
  }

  expand(id: TreeModelId<T>): void {
    this.#expansion.add(id);
    this.#update();
  }

  collapse(id: TreeModelId<T>): void {
    this.#expansion.delete(id);
    this.#update();
  }

  isExpanded(id: TreeModelId<T>): boolean {
    return this.#expansion.has(id);
  }

  expandAll(): void {
    this.#expansion = new Set(this.dataNodes.map(n => this.getId(n)));
    this.#update();
  }

  collapseAll(): void {
    this.#expansion.clear();
    this.#update();
  }

  toggleDescendants(id: TreeModelId<T>): void {
    console.log('toggleDescendants', id);
  }
  expandDescendants(id: TreeModelId<T>): void {
    console.log('expandDescendants', id);
  }
  collapseDescendants(id: TreeModelId<T>): void {
    console.log('collapseDescendants', id);
  }

  /** Flattens the tree to an array based on the expansion state. */
  abstract toArray(): Array<TreeModelArrayItem<T>>;

  #update(): void {
    this.dispatchEvent(new Event('sl-update'));
  }
}
