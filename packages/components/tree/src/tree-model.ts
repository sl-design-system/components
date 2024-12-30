import { type SelectionController } from '@sl-design-system/shared';

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
export abstract class TreeModel<T> {
  /** The nodes of the tree. */
  dataNodes: T[] = [];

  constructor(options: TreeModelOptions<T>) {
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

  toggle(_dataNode: T): void {}
  expand(_dataNode: T): void {}
  collapse(_dataNode: T): void {}

  expandAll(): void {}
  collapseAll(): void {}

  toggleDescendants(_dataNode: T): void {}
  expandDescendants(_dataNode: T): void {}
  collapseDescendants(_dataNode: T): void {}

  /** Flattens the tree to an array based on the expansion state. */
  abstract toArray(expansion: SelectionController): Array<TreeModelArrayItem<T>>;
}
