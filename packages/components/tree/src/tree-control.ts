export abstract class TreeControl<T> {
  dataNodes?: T[];

  isExpanded(_dataNode: T): boolean {
    return false;
  }

  isExpandable(_dataNode: T): boolean {
    return false;
  }

  abstract getDescendants(_dataNode: T): T[];
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
