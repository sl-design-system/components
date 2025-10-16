import { beforeEach, describe, expect, it } from 'vitest';
import { TreeDataSource, type TreeDataSourceOptions } from './tree-data-source';

type TestItem = {
  id: number | string;
  name: string;
  children?: TestItem[];
};

class TestTreeDataSource extends TreeDataSource<TestItem> {
  override nodes: [];
  override items: [];
  override size = 0;

  constructor(_items: TestItem[], options?: TreeDataSourceOptions<TestItem>) {
    super(options);
    this.nodes = [];
    this.items = [];
  }

  override update(): void {
    throw new Error('Method not implemented.');
  }
}

describe('TreeDataSource', () => {
  let ds: TestTreeDataSource;

  describe('defaults', () => {
    beforeEach(() => {
      ds = new TestTreeDataSource([]);
    });

    it('should not support multiple selection', () => {
      expect(ds.multiple).not.to.be.true;
    });
  });

  describe('filtering', () => {
    beforeEach(() => {
      ds = new TestTreeDataSource([]);
    });

    it('should throw an error when calling addFilter', () => {
      expect(() => ds.addFilter('dummy', 'dummy')).to.throw('Filtering is not yet supported in tree data sources.');
    });

    it('should throw an error when calling removeFilter', () => {
      expect(() => ds.removeFilter('dummy')).to.throw('Filtering is not yet supported in tree data sources.');
    });
  });

  describe('selection', () => {
    describe('single', () => {
      beforeEach(() => {
        ds = new TestTreeDataSource([]);
      });

      it('not support multiple selection by default', () => {
        expect(ds.multiple).not.to.be.true;
      });
    });

    describe('multiple', () => {
      beforeEach(() => {
        ds = new TestTreeDataSource([], { multiple: true });
      });

      it('should support multiple selection when enabled', () => {
        expect(ds.multiple).to.be.true;
      });
    });
  });

  describe('sorting', () => {
    beforeEach(() => {
      ds = new TestTreeDataSource([]);
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
  });
});
