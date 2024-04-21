/**
 * Abstract class used to provide a common interface for tree data.
 */
export abstract class TreeModel<T> {
  dataNodes?: T[];

  /** Returns whether the given node is expanded. */
  isExpanded(_dataNode: T): boolean {
    return false;
  }

  /** Returns whether the given node is expandable. */
  isExpandable(_dataNode: T): boolean {
    return false;
  }

  abstract getDescendants(_dataNode: T): T[];
  abstract getIcon(_dataNode: T): T[keyof T] | undefined;
  abstract getLabel(_dataNode: T): T[keyof T];

  getLevel(_dataNode: T): number {
    return 0;
  }

  toggle(_dataNode: T): void {}
  expand(_dataNode: T): void {}
  collapse(_dataNode: T): void {}

  expandAll(): void {}
  collapseAll(): void {}

  toggleDescendants(_dataNode: T): void {}
  expandDescendants(_dataNode: T): void {}
  collapseDescendants(_dataNode: T): void {}
}
