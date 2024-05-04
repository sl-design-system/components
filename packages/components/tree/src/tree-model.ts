import { type SelectionController } from '@sl-design-system/shared';

export interface TreeModelArrayItem<T> {
  dataNode: T;
  expanded: boolean;
  expandable: boolean;
  lastNodeInLevel?: boolean;
  level: number;
}

export interface TreeModelOptions<T> {
  getIcon: TreeModel<T>['getIcon'];
  trackBy(dataNode: T, index: number): unknown;
}

/**
 * Abstract class used to provide a common interface for tree data.
 */
export abstract class TreeModel<T> {
  /** The nodes of the tree. */
  dataNodes: T[] = [];

  /** Used during rendering to determine if a tree node needs to be rerendered. */
  trackBy?(dataNode: T, index: number): unknown;

  constructor(options: Partial<TreeModelOptions<T>> = {}) {
    if (options.getIcon) {
      this.getIcon = options.getIcon;
    }

    this.trackBy = options.trackBy;
  }

  /** Returns whether the given node is expandable. */
  abstract isExpandable(dataNode: T): boolean;

  /** Returns a string that is used as the label for the treenode. */
  abstract getLabel(dataNode: T): string;

  /** Optional method for returning a custom icon for a treenode. */
  getIcon(_dataNode: T, _expanded?: boolean): string | undefined {
    return undefined;
  }

  toggle(_dataNode: T): void {}
  expand(_dataNode: T): void {}
  collapse(_dataNode: T): void {}

  expandAll(): void {}
  collapseAll(): void {}

  toggleDescendants(_dataNode: T): void {}
  expandDescendants(_dataNode: T): void {}
  collapseDescendants(_dataNode: T): void {}

  /** Flattens the tree to an array based on the expansion state. */
  abstract toArray(expansion: SelectionController<T>): Array<TreeModelArrayItem<T>>;
}
