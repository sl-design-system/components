import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import { NestedTreeDataSource } from './nested-tree-data-source';

type TestItem = {
  id: number | string;
  name: string;
  expanded?: boolean;
  selected?: boolean;
  children?: TestItem[];
};

describe('NestedTreeDataSource', () => {
  let ds: NestedTreeDataSource<TestItem>;

  describe('defaults', () => {
    beforeEach(() => {
      ds = new NestedTreeDataSource<TestItem>(
        [
          {
            id: 1,
            name: '1',
            children: [
              { id: 11, name: '1.1' },
              { id: 12, name: '1.2' }
            ]
          },
          { id: 2, name: '2', children: [{ id: 21, name: '2.1' }] },
          { id: 3, name: '3' }
        ],
        {
          getId: ({ id }) => id,
          getLabel: ({ name }) => name,
          getChildren: ({ children }) => children,
          isExpandable: ({ children }) => !!children?.length,
          isExpanded: () => true
        }
      );
      ds.update();
    });

    it('should not support multiple selection', () => {
      expect(ds.multiple).not.to.be.true;
    });

    it('should have the correct size', () => {
      expect(ds.size).to.equal(3);
    });

    it('should have the correct number of items', () => {
      expect(ds.items).to.have.length(6);
    });

    it('should have the correct labels', () => {
      const labels = ds.items.map(n => n.label);

      expect(labels).to.deep.equal(['1', '1.1', '1.2', '2', '2.1', '3']);
    });

    it('should have the correct expandable state', () => {
      const expandables = ds.items.map(n => n.expandable);

      expect(expandables).to.deep.equal([true, false, false, true, false, false]);
    });

    it('should have the correct expanded state', () => {
      const expanded = ds.items.map(n => n.expanded);

      expect(expanded).to.deep.equal([true, false, false, true, false, false]);
    });

    it('should have the correct levels', () => {
      const levels = ds.items.map(n => n.level);

      expect(levels).to.deep.equal([0, 1, 1, 0, 1, 0]);
    });
  });

  describe('expanded state', () => {
    beforeEach(() => {
      ds = new NestedTreeDataSource<TestItem>(
        [
          {
            id: 1,
            name: '1',
            expanded: true,
            children: [
              { id: 11, name: '1.1', expanded: false, children: [{ id: 111, name: '1.1.1' }] },
              { id: 12, name: '1.2' }
            ]
          },
          { id: 2, name: '2', expanded: false, children: [{ id: 21, name: '2.1' }] },
          { id: 3, name: '3' }
        ],
        {
          getId: ({ id }) => id,
          getLabel: ({ name }) => name,
          getChildren: ({ children }) => children,
          isExpandable: ({ children }) => !!children?.length,
          isExpanded: ({ expanded }) => expanded ?? false
        }
      );
      ds.update();
    });

    it('should expand a node when calling expand()', () => {
      const node = ds.items[3];

      expect(node.expanded).to.be.false;
      expect(ds.items).to.have.length(5);

      ds.expand(node);

      expect(node.expanded).to.be.true;
      expect(ds.items).to.have.length(6);
    });

    it('should collapse a node when calling collapse()', () => {
      const node = ds.items[0];

      expect(node.expanded).to.be.true;
      expect(ds.items).to.have.length(5);

      ds.collapse(node);

      expect(node.expanded).to.be.false;
      expect(ds.items).to.have.length(3);
    });

    it('should toggle the expanded state of a node when calling toggle()', () => {
      const node = ds.items[0];

      expect(node.expanded).to.be.true;
      expect(ds.items).to.have.length(5);

      ds.toggle(node);

      expect(node.expanded).to.be.false;
      expect(ds.items).to.have.length(3);

      ds.toggle(node);

      expect(node.expanded).to.be.true;
      expect(ds.items).to.have.length(5);
    });

    it('should expand all descendants when calling expandDescendants()', () => {
      const node = ds.items[3];

      expect(ds.items).to.have.length(5);

      ds.expandDescendants(node);

      expect(ds.items.filter(i => i.expandable).map(i => i.expanded)).to.deep.equal([true, false, true]);
      expect(ds.items).to.have.length(6);
    });

    it('should collapse all descendants when calling collapseDescendants()', () => {
      const node = ds.items[0];

      expect(ds.items).to.have.length(5);

      ds.collapseDescendants(node);

      expect(ds.items.every(i => !i.expanded)).to.be.true;
      expect(ds.items).to.have.length(3);
    });

    it('should toggle all descendants when calling toggleDescendants()', () => {
      const node = ds.items[0];

      expect(ds.items).to.have.length(5);

      ds.toggleDescendants(node);

      expect(ds.items.map(i => i.expanded)).to.deep.equal([false, false, false]);
      expect(ds.items).to.have.length(3);
    });

    it('should expand all nodes when calling expandAll()', async () => {
      await ds.expandAll();

      expect(ds.items.filter(i => i.expandable).every(i => i.expanded)).to.be.true;
      expect(ds.items).to.have.length(7);
    });

    it('should collapse all nodes when calling collapseAll()', () => {
      ds.collapseAll();

      expect(ds.items.filter(i => i.expandable).every(i => !i.expanded)).to.be.true;
      expect(ds.items).to.have.length(3);
    });
  });

  describe('level guides', () => {
    beforeEach(() => {
      /**
       * A (level 0, not last)
       * └─ A.1 (level 1, last child)
       *   ├─ A.1.1 (level 2, not last child)
       *   └─ A.1.2 (level 2, last child)
       * B (level 0, last child)
       * └─ B.1 (level 1, last child)
       */
      ds = new NestedTreeDataSource<TestItem>(
        [
          {
            id: 'A',
            name: 'A',
            children: [
              {
                id: 'A.1',
                name: 'A.1',
                children: [
                  { id: 'A.1.1', name: 'A.1.1' },
                  { id: 'A.1.2', name: 'A.1.2' }
                ]
              }
            ]
          },
          {
            id: 'B',
            name: 'B',
            children: [{ id: 'B.1', name: 'B.1' }]
          }
        ],
        {
          getId: ({ id }) => id,
          getLabel: ({ name }) => name,
          getChildren: ({ children }) => children,
          isExpandable: ({ children }) => !!children?.length,
          isExpanded: () => true
        }
      );
      ds.update();
    });

    it('should set the correct levels', () => {
      const levels = ds.items.map(n => n.level);

      expect(levels).to.deep.equal([0, 1, 2, 2, 0, 1]);
    });

    it('should set the correct lastNodeInLevel values', () => {
      const lastNodeInLevels = ds.items.map(n => n.lastNodeInLevel);

      expect(lastNodeInLevels).to.deep.equal([false, true, false, true, true, true]);
    });

    it('should set the correct levelGuides values', () => {
      const levelGuides = ds.items.map(n => n.levelGuides);

      expect(levelGuides).to.deep.equal([
        [], // A
        [0], // A.1
        [1], // A.1.1
        [1], // A.1.2
        [], // B
        [0] // B.1
      ]);
    });
  });

  describe('lazy loading children', () => {
    let loadChildrenSpy: ReturnType<typeof spy>;

    beforeEach(() => {
      loadChildrenSpy = spy((node: TestItem) => {
        if (node.id === 1) {
          return Promise.resolve([
            { id: 11, name: 'Child 1.1', selected: true }, // This child should be selected
            { id: 12, name: 'Child 1.2', selected: false }
          ]);
        } else if (node.id === 2) {
          return Promise.resolve([{ id: 21, name: 'Child 2.1' }]);
        }

        return Promise.resolve([]);
      });

      ds = new NestedTreeDataSource<TestItem>(
        [
          {
            id: 1,
            name: 'Parent 1'
          },
          {
            id: 2,
            name: 'Parent 2'
          },
          { id: 3, name: 'Leaf node' }
        ],
        {
          getId: ({ id }) => id,
          getLabel: ({ name }) => name,
          getChildren: ({ children }) => children,
          isExpandable: item => item.id === 1 || item.id === 2, // Only items 1 and 2 are expandable
          isExpanded: ({ expanded }) => expanded ?? false,
          isSelected: ({ selected }) => selected ?? false,
          loadChildren: loadChildrenSpy as (node: TestItem) => Promise<TestItem[]>,
          multiple: true
        }
      );
      ds.update();
    });

    it('should call loadChildren when expanding a node without children', () => {
      const parentNode = ds.items[0];

      expect(parentNode.expanded).to.be.false;
      expect(parentNode.children).to.be.undefined;
      expect(loadChildrenSpy).not.to.have.been.called;

      ds.expand(parentNode);

      expect(loadChildrenSpy).to.have.been.calledOnce;
      expect(loadChildrenSpy).to.have.been.calledWith(parentNode.dataNode);
    });

    it('should set childrenLoading promise when expanding a node', () => {
      const parentNode = ds.items[0];

      ds.expand(parentNode);

      expect(parentNode.childrenLoading).to.be.instanceof(Promise);
    });

    it('should load and display children after expansion', async () => {
      const parentNode = ds.items[0];

      expect(ds.items).to.have.length(3);

      ds.expand(parentNode);
      await parentNode.childrenLoading;

      expect(parentNode.children).to.have.length(2);
      expect(parentNode.children![0].label).to.equal('Child 1.1');
      expect(parentNode.children![1].label).to.equal('Child 1.2');
      expect(parentNode.childrenLoading).to.be.undefined;
      expect(ds.items).to.have.length(5);
    });

    it('should not call loadChildren again if children are already loaded', async () => {
      const parentNode = ds.items[0];

      // First expansion
      ds.expand(parentNode);
      await parentNode.childrenLoading;

      expect(loadChildrenSpy).to.have.been.calledOnce;

      // Collapse and expand again
      ds.collapse(parentNode);
      ds.expand(parentNode);

      expect(loadChildrenSpy).to.have.been.calledOnce; // Should not be called again
    });

    it('should handle multiple lazy loading operations simultaneously', async () => {
      const parentNode1 = ds.items[0];
      const parentNode2 = ds.items[1];

      ds.expand(parentNode1);
      ds.expand(parentNode2);

      await Promise.all([parentNode1.childrenLoading, parentNode2.childrenLoading]);

      expect(loadChildrenSpy).to.have.been.calledTwice;
      expect(parentNode1.children).to.have.length(2);
      expect(parentNode2.children).to.have.length(1);
      expect(ds.items).to.have.length(6);
    });

    it('should handle expandAll with lazy loading', async () => {
      expect(ds.items).to.have.length(3);

      await ds.expandAll();

      expect(loadChildrenSpy).to.have.been.calledTwice;
      expect(ds.items).to.have.length(6);
      expect(ds.items.filter(item => item.expandable).every(item => item.expanded)).to.be.true;
    });

    it('should maintain correct tree structure after lazy loading', async () => {
      const parentNode = ds.items[0];

      ds.expand(parentNode);
      await parentNode.childrenLoading;

      const children = parentNode.children!;
      expect(children[0].parent).to.equal(parentNode);
      expect(children[1].parent).to.equal(parentNode);
      expect(children[0].level).to.equal(1);
      expect(children[1].level).to.equal(1);
      expect(children[0].lastNodeInLevel).to.be.false;
      expect(children[1].lastNodeInLevel).to.be.true;
    });

    it('should handle lazy loading errors gracefully', async () => {
      const errorSpy = spy(() => Promise.reject(new Error('Failed to load children')));

      const errorDs = new NestedTreeDataSource<TestItem>([{ id: 1, name: 'Parent 1' }], {
        getId: ({ id }) => id,
        getLabel: ({ name }) => name,
        getChildren: ({ children }) => children,
        isExpandable: () => true,
        isExpanded: ({ expanded }) => expanded ?? false,
        loadChildren: errorSpy as (node: TestItem) => Promise<TestItem[]>
      });
      errorDs.update();

      const parentNode = errorDs.items[0];

      errorDs.expand(parentNode);

      try {
        await parentNode.childrenLoading;
      } catch (error) {
        expect(error).to.be.instanceof(Error);
        expect((error as Error).message).to.equal('Failed to load children');
      }

      expect(parentNode.children).to.be.undefined;
      expect(parentNode.childrenLoading).to.be.instanceof(Promise);
    });

    it('should select all lazy loaded children when parent is already selected', async () => {
      const parentNode = ds.items[0];

      // Select the parent node before expanding
      ds.selection.add(parentNode);
      parentNode.selected = true;

      expect(parentNode.selected).to.be.true;
      expect(parentNode.children).to.be.undefined;

      // Expand the parent to load children
      ds.expand(parentNode);
      await parentNode.childrenLoading;

      // Check that children exist
      const children = parentNode.children!;
      expect(children).to.have.length(2);

      // When a selected parent is expanded and lazy-loads children, all children
      // should automatically be selected to maintain consistent selection state
      expect(children[0].selected).to.be.true; // Child 1.1 should be selected
      expect(children[1].selected).to.be.true; // Child 1.2 should also be selected

      // All children should be in the selection
      expect(ds.selection.has(children[0])).to.be.true;
      expect(ds.selection.has(children[1])).to.be.true;
    });
  });

  describe('sorting', () => {
    beforeEach(() => {
      ds = new NestedTreeDataSource<TestItem>(
        [
          {
            id: 3,
            name: 'C',
            children: [
              { id: '3.1', name: 'Z' },
              { id: '3.2', name: 'Y' }
            ]
          },
          { id: 1, name: 'A' },
          { id: 2, name: 'B' }
        ],
        {
          getId: ({ id }) => id,
          getLabel: ({ name }) => name,
          getChildren: ({ children }) => children,
          isExpandable: ({ children }) => !!children?.length,
          isExpanded: () => true
        }
      );
      ds.update();
    });

    it('should not have a sort by default', () => {
      expect(ds.sort).to.be.undefined;
    });

    it('should have a sort after calling setSort', () => {
      ds.setSort('name', 'asc');

      expect(ds.sort).to.deep.equal({ by: 'name', direction: 'asc' });
    });

    it('should remove the sort after calling removeSort', () => {
      ds.setSort('name', 'asc');
      ds.removeSort();

      expect(ds.sort).to.be.undefined;
    });

    it('should sort the nodes when sorting is applied', () => {
      expect(ds.items.map(n => n.label)).to.deep.equal(['C', 'Z', 'Y', 'A', 'B']);

      ds.setSort('name', 'asc');
      ds.update();

      expect(ds.items.map(n => n.label)).to.deep.equal(['A', 'B', 'C', 'Y', 'Z']);

      ds.setSort('name', 'desc');
      ds.update();

      expect(ds.items.map(n => n.label)).to.deep.equal(['C', 'Z', 'Y', 'B', 'A']);
    });
  });
});
