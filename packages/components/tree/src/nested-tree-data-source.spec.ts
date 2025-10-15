import { beforeEach, describe, expect, it } from 'vitest';
import { NestedTreeDataSource } from './nested-tree-data-source';

describe('NestedTreeDataSource', () => {
  let ds: NestedTreeDataSource;

  describe('defaults', () => {
    beforeEach(() => {
      ds = new NestedTreeDataSource(
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
});
