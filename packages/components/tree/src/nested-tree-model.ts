import { type SelectionController } from '@sl-design-system/shared';
import { TreeModel, type TreeModelArrayItem, type TreeModelOptions } from './tree-model.js';

export interface NestedTreeModelOptions<T> extends TreeModelOptions<T> {
  getChildren(dataNode: T): T[] | undefined;
}

/**
 * A tree model that represents a nested list of nodes.
 */
export class NestedTreeModel<T> extends TreeModel<T> {
  constructor(
    public override dataNodes: T[],
    options: NestedTreeModelOptions<T>
  ) {
    super(options);

    this.getChildren = options.getChildren;
  }

  getChildren(_dataNode: T): T[] | undefined {
    return undefined;
  }

  override toArray(expansion: SelectionController): Array<TreeModelArrayItem<T>> {
    return this.dataNodes.reduce((dataNodes: Array<TreeModelArrayItem<T>>, dataNode) => {
      const expandable = this.isExpandable(dataNode),
        expanded = expansion.isSelected(this.getId(dataNode));

      dataNodes.push({ dataNode, expandable, expanded, level: 0 });

      if (expandable && expanded) {
        dataNodes.push(...this.nestedToArray(expansion, dataNode, 1));
      }

      return dataNodes;
    }, []);
  }

  nestedToArray(expansion: SelectionController, dataNode: T, level: number): Array<TreeModelArrayItem<T>> {
    const children = this.getChildren(dataNode);

    if (!Array.isArray(children)) {
      return [];
    }

    return children.reduce((dataNodes: Array<TreeModelArrayItem<T>>, childNode, index, array) => {
      const expanded = expansion.isSelected(this.getId(childNode)),
        expandable = this.isExpandable(childNode),
        lastNodeInLevel = index === array.length - 1;

      dataNodes.push({ dataNode: childNode, expandable, expanded, lastNodeInLevel, level });

      if (expandable && expanded) {
        dataNodes.push(...this.nestedToArray(expansion, childNode, level + 1));
      }

      return dataNodes;
    }, []);
  }
}
