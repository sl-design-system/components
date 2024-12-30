import { type SelectionController } from '@sl-design-system/shared';
import { TreeModel, type TreeModelArrayItem, type TreeModelOptions } from './tree-model.js';

/**
 * A tree model that represents a nested list of nodes.
 */
export class NestedTreeModel<T, U extends keyof T> extends TreeModel<T, U> {
  constructor(
    public override dataNodes: T[],
    public getChildren: (dataNode: T) => T[] | undefined,
    public getLabel: TreeModel<T, U>['getLabel'],
    public isExpandable: TreeModel<T, U>['isExpandable'],
    options: Partial<TreeModelOptions<T, U>> = {}
  ) {
    super(options);
  }

  override toArray(expansion: SelectionController<T>): Array<TreeModelArrayItem<T>> {
    return this.dataNodes.reduce((dataNodes: Array<TreeModelArrayItem<T>>, dataNode) => {
      const expandable = this.isExpandable(dataNode),
        expanded = expansion.isSelected(dataNode);

      dataNodes.push({ dataNode, expandable, expanded, level: 0 });

      if (expandable && expanded) {
        dataNodes.push(...this.nestedToArray(expansion, dataNode, 1));
      }

      return dataNodes;
    }, []);
  }

  nestedToArray(expansion: SelectionController<T>, dataNode: T, level: number): Array<TreeModelArrayItem<T>> {
    const children = this.getChildren(dataNode);

    if (!Array.isArray(children)) {
      return [];
    }

    return children.reduce((dataNodes: Array<TreeModelArrayItem<T>>, childNode, index, array) => {
      const expanded = expansion.isSelected(childNode),
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
