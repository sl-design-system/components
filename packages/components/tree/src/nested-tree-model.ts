import { TreeModel } from './tree-model.js';

export class NestedTreeModel<T> extends TreeModel<T> {
  constructor(
    public override dataNodes: T[],
    public childrenKey: keyof T,
    public labelKey: keyof T,
    public iconKey?: keyof T
  ) {
    super();
  }

  override getDescendants(_dataNode: T): T[] {
    return _dataNode[this.childrenKey] as T[];
  }

  override getIcon(_dataNode: T): T[keyof T] | undefined {
    return this.iconKey ? _dataNode[this.iconKey] : undefined;
  }

  override getLabel(_dataNode: T): T[keyof T] {
    return _dataNode[this.labelKey];
  }
}
