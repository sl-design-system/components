import { type TreeDataSourceNode } from './tree-data-source.js';

export const getTopLevelSelectedNodes = <T>(
  selection: Iterable<TreeDataSourceNode<T>>
): Array<TreeDataSourceNode<T>> => {
  const selectedNodes = Array.from(selection),
    selectionSet = new Set(selectedNodes);

  return selectedNodes.filter(node => {
    let parent = node.parent;

    while (parent) {
      if (selectionSet.has(parent)) {
        return false;
      }

      parent = parent.parent;
    }

    return true;
  });
};
