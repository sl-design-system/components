import { fixture } from '@sl-design-system/vitest-browser-lit';
import { describe, expect, it } from 'vitest';
import { NestedTreeDataSource } from './nested-tree-data-source.js';
import { type TreeDataSourceNode } from './tree-data-source.js';
import { getTopLevelSelectedNodes } from './tree.stories-utils.js';
import meta from './tree.stories.js';

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

const renderStory = async (dataSource: NestedTreeDataSource<TestNode>) => {
  const render = meta.render as (args: { dataSource: NestedTreeDataSource<TestNode> }) => unknown;

  return await fixture(render({ dataSource }));
};

const getButton = (el: Element, label: string): HTMLElement =>
  Array.from(el.querySelectorAll<HTMLElement>('sl-button')).find(
    button => button.textContent?.trim() === label
  )!;

const getExpandableStates = (node: TreeDataSourceNode<TestNode>): boolean[] => [
  node.expanded,
  ...(node.children ?? []).flatMap(getExpandableStates)
];

describe('tree stories', () => {
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

  it('should toggle only the top-level selected node', async () => {
    const dataSource = createDataSource(),
      parent = dataSource.nodes[0],
      child = parent.children![0],
      el = await renderStory(dataSource);

    dataSource.select(parent);

    getButton(el, 'Toggle selected').click();
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(parent.expanded).to.be.false;
    expect(child.expanded).to.be.true;
  });

  it('should force toggle descendants to the selected node state', async () => {
    const dataSource = createDataSource(),
      parent = dataSource.nodes[0],
      child = parent.children![0],
      el = await renderStory(dataSource);

    dataSource.collapse(child);
    dataSource.select(parent);

    getButton(el, 'Toggle descendants').click();
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(getExpandableStates(parent).every(expanded => !expanded)).to.be.true;
  });
});
