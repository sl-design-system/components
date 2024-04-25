import { SelectionController } from '@sl-design-system/shared';
import { TreeModel } from './tree-model.js';

export class FlatTreeModel<T> extends TreeModel<T> {
  constructor(
    public override dataNodes: T[],
    public override getLevel: TreeModel<T>['getLevel'],
    public override getLabel: TreeModel<T>['getLabel'],
    getIcon?: TreeModel<T>['getIcon']
  ) {
    super();

    if (getIcon) {
      this.getIcon = getIcon;
    }
  }

  getDescendants(_dataNode: T): T[] {
    return [];
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

  override toArray(expansion: SelectionController<T>): T[] {
    let currentLevel = 0;

    return this.dataNodes.reduce((nodes: T[], node) => {
      const level = this.getLevel(node);

      if (level === currentLevel) {
        if (expansion.isSelected(node)) {
          currentLevel++;
        }

        return [...nodes, node];
      } else {
        if (level < currentLevel) {
          currentLevel = level;
        }

        return nodes;
      }
    }, []);
  }
}
