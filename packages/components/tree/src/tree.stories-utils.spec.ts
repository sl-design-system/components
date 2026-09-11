import { describe, expect, it } from 'vitest';
import { NestedTreeDataSource } from './nested-tree-data-source.js';
import { type TreeDataSourceNode } from './tree-data-source.js';
import {
  getTopLevelSelectedNodes,
  toggleSelectedDescendants,
  toggleSelectedNodes
} from './tree.stories-utils.js';

interface TestNode {
  id: number;
  name: string;
  children?: TestNode[];
}

const data: TestNode[] = [
  {
    id: 1,
    name: 'Parent',
    children: [
      {
        id: 2,
        name: 'Child A',
        children: [{ id: 3, name: 'Grandchild' }]
      },
      {
        id: 4,
        name: 'Child B',
        children: [{ id: 5, name: 'Leaf' }]
      }
    ]
  }
];

const createDataSource = () =>
  new NestedTreeDataSource<TestNode>(data, {
    getChildren: ({ children }) => children,
    getId: ({ id }) => id,
    getLabel: ({ name }) => name,
    isExpandable: ({ children }) => !!children,
    isExpanded: () => true,
    multiple: true
  });

const getExpandableStates = (node: TreeDataSourceNode<TestNode>): boolean[] => [
  node.expanded,
  ...(node.children ?? []).flatMap(getExpandableStates)
];

describe('tree story utils', () => {
  it('should only return selected nodes without a selected ancestor', () => {
    const dataSource = createDataSource(),
      parent = dataSource.nodes[0],
      child = parent.children![0],
      grandchild = child.children![0];

    dataSource.selection.add(parent);
    dataSource.selection.add(child);
    dataSource.selection.add(grandchild);

    expect(getTopLevelSelectedNodes(dataSource.selection)).to.deep.equal([parent]);
  });

  it('should toggle only the top-level selected node', () => {
    const dataSource = createDataSource(),
      parent = dataSource.nodes[0],
      child = parent.children![0];

    dataSource.select(parent);

    toggleSelectedNodes(dataSource);

    expect(parent.expanded).to.be.false;
    expect(child.expanded).to.be.true;
  });

  it('should force toggle descendants to the selected node state', () => {
    const dataSource = createDataSource(),
      parent = dataSource.nodes[0],
      child = parent.children![0];

    dataSource.collapse(child);
    dataSource.select(parent);

    toggleSelectedDescendants(dataSource);

    expect(getExpandableStates(parent).every(expanded => !expanded)).to.be.true;
  });
});
