import { beforeEach, describe, expect, it } from 'vitest';
import { NestedTreeDataSource } from './nested-tree-data-source';

type TestItem = {
  id: number | string;
  name: string;
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

    it('should have the correct levels', () => {
      const levels = ds.items.map(n => n.level);

      expect(levels).to.deep.equal([0, 1, 1, 0, 1, 0]);
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
