import { TreeModel, type TreeModelArrayItem, type TreeModelId, type TreeModelOptions } from './tree-model.js';

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

  override toggleDescendants(id: TreeModelId<T>, force?: boolean): void {
    const node = this.dataNodes.find(n => this.getId(n) === id);
    if (!node) {
      return;
    }

    const index = this.dataNodes.indexOf(node),
      level = this.getLevel(node);

    for (let i = index + 1; i < this.dataNodes.length; i++) {
      const nextNode = this.dataNodes[i];

      if (this.getLevel(nextNode) <= level) {
        break;
      }

      this.toggle(this.getId(nextNode), force, false);
    }

    this.dispatchEvent(new Event('sl-update'));
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
