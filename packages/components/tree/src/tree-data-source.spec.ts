import { beforeEach, describe, expect, it } from 'vitest';
import { TreeDataSource, type TreeDataSourceNode, type TreeDataSourceOptions } from './tree-data-source';

type TestItem = {
  id: number | string;
  name: string;
  children?: TestItem[];
};

const TEST_ITEMS: TestItem[] = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' }
];

const TEST_NODES: Array<TreeDataSourceNode<TestItem>> = [
  {
    id: 1,
    dataNode: TEST_ITEMS[0],
    expandable: false,
    expanded: false,
    label: 'Item 1',
    level: 0,
    type: 'node'
  },
  {
    id: 2,
    dataNode: TEST_ITEMS[1],
    expandable: true,
    expanded: false,
    label: 'Item 2',
    level: 0,
    type: 'node'
  }
];

class TestTreeDataSource extends TreeDataSource<TestItem> {
  override nodes: Array<TreeDataSourceNode<TestItem>>;
  override items: Array<TreeDataSourceNode<TestItem>>;
  override size: number;

  constructor(nodes: Array<TreeDataSourceNode<TestItem>>, options?: TreeDataSourceOptions<TestItem>) {
    super(options);

    this.items = this.nodes = nodes;
    this.size = this.nodes.length;
  }

  override update(): void {}
}

describe('TreeDataSource', () => {
  let ds: TestTreeDataSource;

  describe('defaults', () => {
    beforeEach(() => {
      ds = new TestTreeDataSource(TEST_NODES);
    });

    it('should not support multiple selection', () => {
      expect(ds.multiple).not.to.be.true;
    });

    it('should have a nodes property', () => {
      expect(ds.nodes).to.be.an('array');
    });

    it('should have an items property', () => {
      expect(ds.items).to.be.an('array');
    });

    it('should have a size property', () => {
      expect(ds.size).to.be.a('number');
    });

    it('should have an empty selection', () => {
      expect(ds.selection.size).to.equal(0);
    });

    it('should not have a filter', () => {
      expect(ds.filters).to.be.empty;
    });

    it('should not have a sort', () => {
      expect(ds.sort).to.be.undefined;
    });
  });

  describe('filtering', () => {
    beforeEach(() => {
      ds = new TestTreeDataSource(TEST_NODES);
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
        ds = new TestTreeDataSource(TEST_NODES);
      });

      it('should not support multiple selection', () => {
        expect(ds.multiple).not.to.be.true;
      });

      it('should start with an empty selection', () => {
        expect(ds.selection.size).to.equal(0);
      });

      it('should only allow a single selected node at a time', () => {
        ds.select(ds.nodes[0]);
        expect(ds.selection.size).to.equal(1);

        ds.select(ds.nodes[1]);
        expect(ds.selection.size).to.equal(1);
      });

      it('should allow deselecting the currently selected node', () => {
        ds.select(ds.nodes[0]);
        expect(ds.selection.size).to.equal(1);

        ds.deselect(ds.nodes[0]);
        expect(ds.selection.size).to.equal(0);
      });

      it('should allow deselecting all nodes', () => {
        ds.select(ds.nodes[0]);
        expect(ds.selection.size).to.equal(1);

        ds.deselectAll();
        expect(ds.selection.size).to.equal(0);
      });
    });

    describe('multiple', () => {
      beforeEach(() => {
        ds = new TestTreeDataSource(TEST_NODES, { multiple: true });
      });

      it('should support multiple selection', () => {
        expect(ds.multiple).to.be.true;
      });

      it('should start with an empty selection', () => {
        expect(ds.selection.size).to.equal(0);
      });

      it('should allow multiple selected nodes', () => {
        ds.select(ds.nodes[0]);
        expect(ds.selection.size).to.equal(1);

        ds.select(ds.nodes[1]);
        expect(ds.selection.size).to.equal(2);
      });

      it('should allow deselecting a node', () => {
        ds.select(ds.nodes[0]);
        ds.select(ds.nodes[1]);
        expect(ds.selection.size).to.equal(2);

        ds.deselect(ds.nodes[0]);
        expect(ds.selection.size).to.equal(1);
      });

      it('should allow selecting all nodes', () => {
        ds.selectAll();
        expect(ds.selection.size).to.equal(2);
      });

      it('should allow deselecting all nodes', () => {
        ds.select(ds.nodes[0]);
        ds.select(ds.nodes[1]);
        expect(ds.selection.size).to.equal(2);

        ds.deselectAll();
        expect(ds.selection.size).to.equal(0);
      });
    });
  });

  describe('sorting', () => {
    beforeEach(() => {
      ds = new TestTreeDataSource(TEST_NODES);
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
