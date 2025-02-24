import { expect } from '@open-wc/testing';
import { spy } from 'sinon';
import { type Person, people } from './data-source.spec.js';
import { ListDataSource } from './list-data-source.js';

class TestListDataSource extends ListDataSource<Person> {
  override items: Person[];
  override size: number;

  constructor() {
    super();

    this.items = [...people];
    this.size = people.length;
  }

  override update(): void {
    // empty
  }
}

describe('ListDataSource', () => {
  let ds: TestListDataSource;

  beforeEach(() => {
    ds = new TestListDataSource();
  });

  it('should not group by by default', () => {
    expect(ds.groupBy).to.be.undefined;
  });

  it('should group by after setting one', () => {
    ds.setGroupBy('profession');

    expect(ds.groupBy).to.deep.equal({ path: 'profession', sorter: undefined, direction: undefined });
  });

  it('should not group by after removing it', () => {
    ds.setGroupBy('profession');
    ds.removeGroupBy();

    expect(ds.groupBy).to.be.undefined;
  });

  it('should reorder items', () => {
    spy(ds, 'update');

    expect(ds.items.map(({ id }) => id)).to.deep.equal([1, 2, 3, 4, 5]);

    ds.reorder(people[0], people[4], 'before');

    expect(ds.items.map(({ id }) => id)).to.deep.equal([2, 3, 4, 1, 5]);
    expect(ds.update).to.have.been.calledOnce;
  });
});
