import { TreeModel, type TreeModelArrayItem, type TreeModelId, type TreeModelOptions } from './tree-model.js';

export interface NestedTreeModelOptions<T> extends TreeModelOptions<T> {
  getChildren(dataNode: T): T[] | Promise<T[] | undefined> | undefined;
}

/**
 * A tree model that represents a nested list of nodes.
 */
export class NestedTreeModel<T> extends TreeModel<T> {
  constructor(dataNodes: T[], options: NestedTreeModelOptions<T>) {
    super(dataNodes, options);

    this.getChildren = options.getChildren;
  }

  getChildren(_dataNode: T): T[] | Promise<T[] | undefined> | undefined {
    return undefined;
  }

  override async getDescendants(id: TreeModelId<T>): Promise<T[]> {
    const node = await this.#findById(id, this.dataNodes);
    if (!node) {
      return [];
    }

    const descendants: T[] = [];

    const traverse = async (dataNode: T) => {
      const children = await this.getChildren(dataNode);

      if (Array.isArray(children)) {
        descendants.push(...children);
        children.forEach(traverse);
      }
    };

    await traverse(node);

    return descendants;
  }

  override async getParent(id: TreeModelId<T>): Promise<T | undefined> {
    const traverse = async (dataNodes: T[]): Promise<T | undefined> => {
      for (const dataNode of dataNodes) {
        const children = await this.getChildren(dataNode);

        if (Array.isArray(children)) {
          if (children.find(child => this.getId(child) === id)) {
            return dataNode;
          } else {
            const found = await traverse(children);

            if (found) {
              return found;
            }
          }
        }
      }

      return undefined;
    };

    return await traverse(this.dataNodes);
  }

  override async getSiblings(id: TreeModelId<T>): Promise<T[]> {
    for (const dataNode of this.dataNodes) {
      const children = await this.getChildren(dataNode);

      if (Array.isArray(children) && children.find(child => this.getId(child) === id)) {
        return children;
      }
    }

    return [];
  }

  override async toArray(): Promise<Array<TreeModelArrayItem<T>>> {
    const array: Array<TreeModelArrayItem<T>> = [];

    for (const dataNode of this.dataNodes) {
      const expandable = this.isExpandable(dataNode),
        expanded = this.isExpanded(this.getId(dataNode));

      array.push({ dataNode, expandable, expanded, level: 0 });

      if (expandable && expanded) {
        array.push(...(await this.nestedToArray(dataNode, 1)));
      }
    }

    return array;
  }

  async nestedToArray(dataNode: T, level: number): Promise<Array<TreeModelArrayItem<T>>> {
    const children = await this.getChildren(dataNode);

    if (!Array.isArray(children)) {
      return [];
    }

    const array: Array<TreeModelArrayItem<T>> = [];

    for (const [index, childNode] of children.entries()) {
      const expanded = this.isExpanded(this.getId(childNode)),
        expandable = this.isExpandable(childNode),
        lastNodeInLevel = index === children.length - 1;

      array.push({ dataNode: childNode, expandable, expanded, lastNodeInLevel, level });

      if (expandable && expanded) {
        array.push(...(await this.nestedToArray(childNode, level + 1)));
      }
    }

    return array;
  }

  async #findById(id: TreeModelId<T>, dataNodes: T[]): Promise<T | undefined> {
    for (const dataNode of dataNodes) {
      if (this.getId(dataNode) === id) {
        return dataNode;
      }

      const children = await this.getChildren(dataNode);
      if (Array.isArray(children)) {
        const found = await this.#findById(id, children);

        if (found) {
          return found;
        }
      }
    }

    return undefined;
  }
}
