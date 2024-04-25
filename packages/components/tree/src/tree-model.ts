import { type SelectionController } from '@sl-design-system/shared';

/**
 * Abstract class used to provide a common interface for tree data.
 */
export abstract class TreeModel<T> {
  dataNodes: T[] = [];

  /** Returns whether the given node is expandable. */
  isExpandable(_dataNode: T): boolean {
    return false;
  }

  abstract getDescendants(_dataNode: T): T[];
  abstract getLabel(_dataNode: T): T[keyof T];
  abstract getLevel(_dataNode: T): number;

  getIcon(_dataNode: T, _expanded?: boolean): T[keyof T] | undefined {
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
  abstract toArray(expansion: SelectionController<T>): T[];
}
