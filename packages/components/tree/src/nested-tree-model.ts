import { type SelectionController } from '@sl-design-system/shared';
import { TreeModel, type TreeModelArrayItem, type TreeModelOptions } from './tree-model.js';

export class NestedTreeModel<T> extends TreeModel<T> {
  constructor(
    public override dataNodes: T[],
    public getChildren: (dataNode: T) => T[] | undefined,
    public getLabel: TreeModel<T>['getLabel'],
    public isExpandable: TreeModel<T>['isExpandable'],
    options: Partial<TreeModelOptions<T>> = {}
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

    return children.reduce((dataNodes: Array<TreeModelArrayItem<T>>, childNode) => {
      const expanded = expansion.isSelected(dataNode),
        expandable = this.isExpandable(dataNode);

      dataNodes.push({ dataNode: childNode, expandable, expanded, level });

      if (expandable && expanded) {
        dataNodes.push(...this.nestedToArray(expansion, childNode, level + 1));
      }

      return dataNodes;
    }, []);
  }
}
