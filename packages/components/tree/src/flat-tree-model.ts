import { TreeModel } from './tree-model.js';

export class FlatTreeModel<T> extends TreeModel<T> {
  constructor(
    public override dataNodes: T[],
    public levelKey: keyof T,
    public labelKey: keyof T,
    public iconKey?: keyof T
  ) {
    super();
  }

  getDescendants(_dataNode: T): T[] {
    return [];
  }

  override getIcon(dataNode: T): T[keyof T] | undefined {
    return this.iconKey ? dataNode[this.iconKey] : undefined;
  }

  override getLabel(dataNode: T): T[keyof T] {
    return dataNode[this.labelKey];
  }

  override getLevel(dataNode: T): number {
    return dataNode[this.levelKey] as number;
  }

  override isExpandable(dataNode: T): boolean {
    const index = this.dataNodes.indexOf(dataNode);

    if (index === this.dataNodes.length - 1) {
      return false;
    } else {
      const nextNode = this.dataNodes[index + 1];

      return this.getLevel(nextNode) > this.getLevel(dataNode);
    }
  }
}