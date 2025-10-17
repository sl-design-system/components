import { beforeEach, describe, expect, it } from 'vitest';
import { NestedTreeDataSource } from './nested-tree-data-source';

type TestItem = {
  id: number | string;
  name: string;
  expanded?: boolean;
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
});
