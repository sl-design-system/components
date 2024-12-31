import { TreeModel, type TreeModelArrayItem, type TreeModelId, type TreeModelOptions } from './tree-model.js';

export interface NestedTreeModelOptions<T> extends TreeModelOptions<T> {
  getChildren(dataNode: T): T[] | undefined;
}

/**
 * A tree model that represents a nested list of nodes.
 */
export class NestedTreeModel<T> extends TreeModel<T> {
  constructor(dataNodes: T[], options: NestedTreeModelOptions<T>) {
    super(dataNodes, options);

    this.getChildren = options.getChildren;
  }

  getChildren(_dataNode: T): T[] | undefined {
    return undefined;
  }

  override getDescendants(id: TreeModelId<T>): T[] {
    const node = this.#findById(id, this.dataNodes);
    if (!node) {
      return [];
    }

    const descendants: T[] = [];

    const traverse = (dataNode: T) => {
      const children = this.getChildren(dataNode);

      if (Array.isArray(children)) {
        descendants.push(...children);
        children.forEach(traverse);
      }
    };

    traverse(node);

    return descendants;
  }

  override getParent(id: TreeModelId<T>): T | undefined {
    const traverse = (dataNodes: T[]): T | undefined => {
      for (const dataNode of dataNodes) {
        const children = this.getChildren(dataNode);

        if (Array.isArray(children)) {
          if (children.find(child => this.getId(child) === id)) {
            return dataNode;
          } else {
            const found = traverse(children);

            if (found) {
              return found;
            }
          }
        }
      }

      return undefined;
    };

    return traverse(this.dataNodes);
  }

  override getSiblings(id: TreeModelId<T>): T[] {
    for (const dataNode of this.dataNodes) {
      const children = this.getChildren(dataNode);

      if (Array.isArray(children) && children.find(child => this.getId(child) === id)) {
        return children;
      }
    }

    return [];
  }

  override toArray(): Array<TreeModelArrayItem<T>> {
    return this.dataNodes.reduce((dataNodes: Array<TreeModelArrayItem<T>>, dataNode) => {
      const expandable = this.isExpandable(dataNode),
        expanded = this.isExpanded(this.getId(dataNode));

      dataNodes.push({ dataNode, expandable, expanded, level: 0 });

      if (expandable && expanded) {
        dataNodes.push(...this.nestedToArray(dataNode, 1));
      }

      return dataNodes;
    }, []);
  }

  nestedToArray(dataNode: T, level: number): Array<TreeModelArrayItem<T>> {
    const children = this.getChildren(dataNode);

    if (!Array.isArray(children)) {
      return [];
    }

    return children.reduce((dataNodes: Array<TreeModelArrayItem<T>>, childNode, index, array) => {
      const expanded = this.isExpanded(this.getId(childNode)),
        expandable = this.isExpandable(childNode),
        lastNodeInLevel = index === array.length - 1;

      dataNodes.push({ dataNode: childNode, expandable, expanded, lastNodeInLevel, level });

      if (expandable && expanded) {
        dataNodes.push(...this.nestedToArray(childNode, level + 1));
      }

      return dataNodes;
    }, []);
  }

  #findById(id: TreeModelId<T>, dataNodes: T[]): T | undefined {
    for (const dataNode of dataNodes) {
      if (this.getId(dataNode) === id) {
        return dataNode;
      }

      const children = this.getChildren(dataNode);
      if (Array.isArray(children)) {
        const found = this.#findById(id, children);

        if (found) {
          return found;
        }
      }
    }

    return undefined;
  }
}
