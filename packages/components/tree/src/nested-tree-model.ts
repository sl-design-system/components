import { type SelectionController } from '@sl-design-system/shared';
import { TreeModel } from './tree-model.js';

export class NestedTreeModel<T> extends TreeModel<T> {
  constructor(
    public override dataNodes: T[],
    public getChildren: (dataNode: T) => T[] | undefined,
    public override getLabel: TreeModel<T>['getLabel'],
    getIcon?: TreeModel<T>['getIcon']
  ) {
    super();

    if (getIcon) {
      this.getIcon = getIcon;
    }
  }

  override toArray(_expansion: SelectionController<T>): T[] {
    return this.dataNodes;
  }
}
