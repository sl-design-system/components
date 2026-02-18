import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import { FlatTreeDataSource } from './flat-tree-data-source.js';

type TestItem = {
  id: number | string;
  name: string;
  level: number;
  expandable: boolean;
  expanded?: boolean;
  selected?: boolean;
};

describe('FlatTreeDataSource', () => {
  let ds: FlatTreeDataSource;

  describe('defaults', () => {
    beforeEach(() => {
      ds = new FlatTreeDataSource(
        [
          { id: 1, name: '1', level: 0, expandable: true },
          { id: 2, name: '2', level: 1, expandable: true },
          { id: 3, name: '3', level: 2, expandable: false },
          { id: 4, name: '4', level: 1, expandable: false },
          { id: 5, name: '5', level: 0, expandable: false }
        ],
        {
          getId: ({ id }) => id,
          getLabel: ({ name }) => name,
          getLevel: ({ level }) => level,
          isExpandable: ({ expandable }) => expandable,
          isExpanded: () => true
        }
      );
      ds.update();
    });

    it('should not support multiple selection', () => {
      expect(ds.multiple).not.to.be.true;
    });

    it('should have the correct size', () => {
      expect(ds.size).to.equal(2);
    });

    it('should have the correct number of items', () => {
      expect(ds.items).to.have.length(5);
    });

    it('should have the correct labels', () => {
      const labels = ds.items.map(n => n.label);

      expect(labels).to.deep.equal(['1', '2', '3', '4', '5']);
    });

    it('should have the correct expandable state', () => {
      const expandables = ds.items.map(n => n.expandable);

      expect(expandables).to.deep.equal([true, true, false, false, false]);
    });

    it('should have the correct expanded state', () => {
      const expanded = ds.items.map(n => n.expanded);

      expect(expanded).to.deep.equal([true, true, false, false, false]);
    });

    it('should have the correct levels', () => {
      const levels = ds.items.map(n => n.level);

      expect(levels).to.deep.equal([0, 1, 2, 1, 0]);
    });
  });

  describe('expanded state', () => {
    beforeEach(() => {
      ds = new FlatTreeDataSource(
        [
          { id: 1, name: '1', level: 0, expandable: true, expanded: true },
          { id: 2, name: '2', level: 1, expandable: true, expanded: false },
          { id: 3, name: '3', level: 2, expandable: false },
          { id: 4, name: '4', level: 1, expandable: false },
          { id: 5, name: '5', level: 0, expandable: false }
        ],
        {
          getId: ({ id }) => id,
          getLabel: ({ name }) => name,
          getLevel: ({ level }) => level,
          isExpandable: ({ expandable }) => expandable,
          isExpanded: ({ expanded }) => expanded ?? false
        }
      );
      ds.update();
    });

    it('should expand a node when calling expand()', () => {
      const node = ds.items[1];

      expect(node.expanded).to.be.false;
      expect(ds.items).to.have.length(4);

      ds.expand(node);

      expect(node.expanded).to.be.true;
      expect(ds.items).to.have.length(5);
    });

    it('should collapse a node when calling collapse()', () => {
      const node = ds.items[0];

      expect(node.expanded).to.be.true;
      expect(ds.items).to.have.length(4);

      ds.collapse(node);

      expect(node.expanded).to.be.false;
      expect(ds.items).to.have.length(2);
    });

    it('should toggle the expanded state of a node when calling toggle()', () => {
      const node = ds.items[1];

      expect(node.expanded).to.be.false;
      expect(ds.items).to.have.length(4);

      ds.toggle(node);

      expect(node.expanded).to.be.true;
      expect(ds.items).to.have.length(5);

      ds.toggle(node);

      expect(node.expanded).to.be.false;
      expect(ds.items).to.have.length(4);
    });

    it('should expand all descendants when calling expandDescendants()', () => {
      const node = ds.items[0];

      expect(ds.items).to.have.length(4);

      ds.expandDescendants(node);

      expect(ds.items.filter(i => i.expandable).every(i => i.expanded)).to.be.true;
      expect(ds.items).to.have.length(5);
    });

    it('should collapse all descendants when calling collapseDescendants()', () => {
      const node = ds.items[0];

      expect(ds.items).to.have.length(4);

      ds.collapseDescendants(node);

      expect(ds.items.every(i => !i.expanded)).to.be.true;
      expect(ds.items).to.have.length(2);
    });

    it('should toggle all descendants when calling toggleDescendants()', () => {
      const node = ds.items[0];

      expect(ds.items).to.have.length(4);

      ds.toggleDescendants(node);

      expect(ds.items.map(i => i.expanded)).to.deep.equal([false, false]);
      expect(ds.items).to.have.length(2);
    });

    it('should expand all nodes when calling expandAll()', async () => {
      await ds.expandAll();

      expect(ds.items.filter(i => i.expandable).every(i => i.expanded)).to.be.true;
      expect(ds.items).to.have.length(5);
    });

    it('should collapse all nodes when calling collapseAll()', () => {
      ds.collapseAll();

      expect(ds.items.filter(i => i.expandable).every(i => !i.expanded)).to.be.true;
      expect(ds.items).to.have.length(2);
    });
  });

  describe('level guides', () => {
    beforeEach(() => {
      /**
       * A (level 0, not last)
       * ├─ A.1 (level 1, not last)
       * └─ A.2 (level 1, last child)
       *    └─ A.2.a (level 2, last child)
       *       └─ A.2.a.1 (level 3, last child)
       * B (level 0, last child)
       */
      ds = new FlatTreeDataSource(
        [
          { id: 'A', name: 'A', level: 0, expandable: true },
          { id: 'A.1', name: 'A.1', level: 1, expandable: false },
          { id: 'A.2', name: 'A.2', level: 1, expandable: true },
          { id: 'A.2.a', name: 'A.2.a', level: 2, expandable: true },
          { id: 'A.2.a.1', name: 'A.2.a.1', level: 3, expandable: false },
          { id: 'B', name: 'B', level: 0, expandable: false }
        ],
        {
          getId: ({ id }) => id,
          getLabel: ({ name }) => name,
          getLevel: ({ level }) => level,
          isExpandable: ({ expandable }) => expandable,
          isExpanded: () => true
        }
      );
      ds.update();
    });

    it('should set the correct levels', () => {
      const levels = ds.items.map(n => n.level);

      expect(levels).to.deep.equal([0, 1, 1, 2, 3, 0]);
    });

    it('should set the correct lastNodeInLevel values', () => {
      const lastNodeInLevels = ds.items.map(n => n.lastNodeInLevel);

      expect(lastNodeInLevels).to.deep.equal([false, false, true, true, true, true]);
    });

    it('should set the correct levelGuides values', () => {
      const levelGuides = ds.items.map(n => n.levelGuides);

      expect(levelGuides).to.deep.equal([
        [], // A
        [0], // A.1
        [0], // A.2
        [1], // A.2.a
        [2], // A.2.a.1
        [] // B
      ]);
    });
  });

  describe('sorting', () => {
    beforeEach(() => {
      ds = new FlatTreeDataSource(
        [
          { id: 3, name: 'C', level: 0, expandable: true },
          { id: '3.1', name: 'Z', level: 1, expandable: false },
          { id: '3.2', name: 'Y', level: 1, expandable: false },
          { id: 1, name: 'A', level: 0, expandable: false },
          { id: 2, name: 'B', level: 0, expandable: false }
        ],
        {
          getId: ({ id }) => id,
          getLabel: ({ name }) => name,
          getLevel: ({ level }) => level,
          isExpandable: ({ expandable }) => expandable,
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

  describe('lazy loading children', () => {
    let loadChildrenSpy: ReturnType<typeof spy>;

    beforeEach(() => {
      loadChildrenSpy = spy((node: TestItem) => {
        if (node.id === 1) {
          return Promise.resolve([
            { id: 11, name: 'Child 1.1', level: 1, expandable: false },
            { id: 12, name: 'Child 1.2', level: 1, expandable: false }
          ]);
        } else if (node.id === 3) {
          return Promise.resolve([{ id: 31, name: 'Child 3.1', level: 1, expandable: false }]);
        }

        return Promise.resolve([]);
      });

      ds = new FlatTreeDataSource<TestItem>(
        [
          { id: 1, name: 'Parent 1', level: 0, expandable: true },
          { id: 2, name: 'Leaf node at level 0', level: 0, expandable: false },
          { id: 3, name: 'Parent 3', level: 0, expandable: true }
        ],
        {
          getId: ({ id }) => id,
          getLabel: ({ name }) => name,
          getLevel: ({ level }) => level,
          isExpandable: ({ expandable }) => expandable,
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

      expect(ds.items).to.have.length(3); // All 3 nodes at level 0

      ds.expand(parentNode);
      await parentNode.childrenLoading;

      expect(parentNode.children).to.have.length(2);
      expect(parentNode.children![0].label).to.equal('Child 1.1');
      expect(parentNode.children![1].label).to.equal('Child 1.2');
      expect(parentNode.childrenLoading).to.be.undefined;
      expect(ds.items).to.have.length(5); // Now includes the 2 loaded children
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
      const parentNode1 = ds.items[0]; // Parent 1
      const parentNode3 = ds.items[2]; // Parent 3

      ds.expand(parentNode1);
      ds.expand(parentNode3);

      await Promise.all([parentNode1.childrenLoading, parentNode3.childrenLoading]);

      expect(loadChildrenSpy).to.have.been.calledTwice;
      expect(parentNode1.children).to.have.length(2);
      expect(parentNode3.children).to.have.length(1);
      expect(ds.items).to.have.length(6); // 3 original + 2 from parent1 + 1 from parent3
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

      const errorDs = new FlatTreeDataSource<TestItem>([{ id: 1, name: 'Parent 1', level: 0, expandable: true }], {
        getId: ({ id }) => id,
        getLabel: ({ name }) => name,
        getLevel: ({ level }) => level,
        isExpandable: ({ expandable }) => expandable,
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

  describe('selection sync', () => {
    beforeEach(() => {
      ds = new FlatTreeDataSource(
        [
          { id: 1, name: 'Parent 1', level: 0, expandable: true, selected: true },
          { id: 11, name: 'Child 1.1', level: 1, expandable: false, selected: true },
          { id: 12, name: 'Child 1.2', level: 1, expandable: false, selected: true },
          { id: 2, name: 'Parent 2', level: 0, expandable: true, selected: false },
          { id: 21, name: 'Child 2.1', level: 1, expandable: false, selected: false },
          { id: 22, name: 'Child 2.2', level: 1, expandable: false, selected: false }
        ],
        {
          getId: ({ id }) => id,
          getLabel: ({ name }) => name,
          getLevel: ({ level }) => level,
          isExpandable: ({ expandable }) => expandable,
          isExpanded: () => true,
          isSelected: ({ selected }) => selected ?? false,
          multiple: true
        }
      );
      ds.update();
    });

    it('should update parent selection state when a child selection changes', () => {
      const parent = ds.items[0],
            child1 = ds.items[1];

      // Initial state: all selected
      expect(parent.selected).to.be.true;
      expect(child1.selected).to.be.true;

      // Deselect one child
      child1.selected = false;
      ds.update();

      // Parent should become indeterminate
      expect(parent.selected).to.be.false;
      expect(parent.indeterminate).to.be.true;
    });

    it('should update parent selection state when all children are selected', () => {
      const parent = ds.items[3];
      const child1 = ds.items[4];
      const child2 = ds.items[5];

      // Initial state: none selected
      expect(parent.selected).to.be.false;

      // Select all children manually
      child1.selected = true;
      child2.selected = true;
      ds.update();

      // Parent should become selected
      expect(parent.selected).to.be.true;
      expect(parent.indeterminate).to.be.false;
    });
    it('should not deselect a parent node if it has empty children array (e.g. lazy loaded empty)', () => {
      const parent = ds.items[0];
      parent.children = []; // Simulate lazy loaded but empty
      parent.selected = true;

      ds.update();

      expect(parent.selected).to.be.true;
    });
  });
});
