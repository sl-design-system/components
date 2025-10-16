import { beforeEach, describe, expect, it } from 'vitest';
import { FlatTreeDataSource } from './flat-tree-data-source.js';

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

    it('should expand all nodes when calling expandAll()', () => {
      ds.expandAll();

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
});
