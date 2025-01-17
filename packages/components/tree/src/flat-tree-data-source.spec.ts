import { expect } from '@open-wc/testing';
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
          isExpandable: ({ expandable }) => expandable
        }
      );
    });

    it('should not be selectable', () => {
      expect(ds.selects).to.be.undefined;
    });

    it('should have the correct size', () => {
      expect(ds.size).to.equal(2);
    });
  });
});
