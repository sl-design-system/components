import { TreeControl } from './tree-control.js';

export class FlatTreeControl<T> extends TreeControl<T> {
  constructor(public override readonly dataNodes: T[]) {
    super();
  }

  getDescendants(_dataNode: T): T[] {
    return [];
  }
}
