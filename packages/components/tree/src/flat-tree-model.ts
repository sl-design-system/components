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

  override getDescendants(id: TreeModelId<T>): T[] {
    const node = this.dataNodes.find(n => this.getId(n) === id);
    if (!node) {
      return [];
    }

    const index = this.dataNodes.indexOf(node),
      level = this.getLevel(node),
      descendants: T[] = [];

    for (let i = index + 1; i < this.dataNodes.length; i++) {
      const nextNode = this.dataNodes[i];

      if (this.getLevel(nextNode) <= level) {
        break;
      }

      descendants.push(nextNode);
    }

    return descendants;
  }

  override getParent(id: TreeModelId<T>): T | undefined {
    const node = this.dataNodes.find(n => this.getId(n) === id);
    if (!node) {
      return undefined;
    }

    const level = this.getLevel(node);

    for (let i = this.dataNodes.indexOf(node) - 1; i >= 0; i--) {
      const prevNode = this.dataNodes[i];

      if (this.getLevel(prevNode) < level) {
        return prevNode;
      }
    }

    return undefined;
  }

  override getSiblings(id: TreeModelId<T>): T[] {
    const node = this.dataNodes.find(n => this.getId(n) === id);
    if (!node) {
      return [];
    }

    const index = this.dataNodes.indexOf(node),
      level = this.getLevel(node),
      siblings: T[] = [];

    // Get siblings before the node
    for (let i = index - 1; i >= 0; i--) {
      const prevNode = this.dataNodes[i],
        prevLevel = this.getLevel(prevNode);

      if (prevLevel < level) {
        break;
      } else if (prevLevel === level) {
        siblings.unshift(prevNode);
      }
    }

    // Get siblings after the node
    for (let i = index + 1; i < this.dataNodes.length; i++) {
      const nextNode = this.dataNodes[i],
        nextLevel = this.getLevel(nextNode);

      if (nextLevel < level) {
        break;
      } else if (nextLevel === level) {
        siblings.push(nextNode);
      }
    }

    return siblings;
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
