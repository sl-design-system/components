import { TreeModel, type TreeModelArrayItem, type TreeModelOptions } from './tree-model.js';

export interface FlatTreeModelOptions<T> extends TreeModelOptions<T> {
  getLevel(dataNode: T): number;
}

/**
 * A tree model that represents a flat list of nodes.
 */
export class FlatTreeModel<T> extends TreeModel<T> {
  constructor(dataNodes: T[], options: FlatTreeModelOptions<T>) {
    super(dataNodes, options);

    this.getLevel = options.getLevel;
  }

  getLevel(_dataNode: T): number {
    return 0;
  }

  override toArray(): Array<TreeModelArrayItem<T>> {
    let currentLevel = 0;

    return this.dataNodes.reduce((dataNodes: Array<TreeModelArrayItem<T>>, dataNode, index, array) => {
      const expanded = this.isExpanded(this.getId(dataNode)),
        expandable = this.isExpandable(dataNode),
        level = this.getLevel(dataNode),
        nextLevel = index < array.length - 1 ? this.getLevel(array[index + 1]) : level;

      if (level > currentLevel) {
        return dataNodes;
      } else {
        currentLevel = expanded ? level + 1 : level;

        return [...dataNodes, { dataNode, expandable, expanded, lastNodeInLevel: level > nextLevel, level }];
      }
    }, []);
  }
}
