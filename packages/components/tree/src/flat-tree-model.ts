import { SelectionController } from '@sl-design-system/shared';
import { TreeModel, type TreeModelArrayItem, type TreeModelOptions } from './tree-model.js';

export class FlatTreeModel<T> extends TreeModel<T> {
  constructor(
    public override dataNodes: T[],
    public getLabel: TreeModel<T>['getLabel'],
    public getLevel: (dataNode: T) => number,
    public isExpandable: TreeModel<T>['isExpandable'],
    options: Partial<TreeModelOptions<T>> = {}
  ) {
    super(options);
  }

  override toArray(expansion: SelectionController<T>): Array<TreeModelArrayItem<T>> {
    let currentLevel = 0;

    return this.dataNodes.reduce((dataNodes: Array<TreeModelArrayItem<T>>, dataNode) => {
      const expanded = expansion.isSelected(dataNode),
        expandable = this.isExpandable(dataNode),
        level = this.getLevel(dataNode);

      if (level === currentLevel) {
        if (expanded) {
          currentLevel++;
        }

        return [...dataNodes, { dataNode, expandable, expanded, level }];
      } else {
        if (level < currentLevel) {
          currentLevel = level;
        }

        return dataNodes;
      }
    }, []);
  }
}
