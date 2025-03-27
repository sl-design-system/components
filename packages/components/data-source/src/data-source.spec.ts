import { expect } from '@open-wc/testing';
import { DataSource } from './data-source.js';

// eslint-disable-next-line mocha/no-exports
export type Person = (typeof people)[0];

// eslint-disable-next-line mocha/no-exports
export const people = [
  {
    id: 1,
    firstName: 'Ann',
    lastName: 'Smith',
    pictureUrl: '',
    profession: 'Endocrinologist',
    status: 'Available',
    membership: 'Regular'
  },
  {
    id: 2,
    firstName: 'John',
    lastName: 'Doe',
    pictureUrl: null,
    profession: 'Nephrologist',
    status: 'Busy',
    membership: 'Premium'
  },
  {
    id: 3,
    firstName: 'Jane',
    lastName: 'Doe',
    pictureUrl: '  ',
    profession: 'Ophthalmologist',
    status: 'Available',
    membership: 'Regular'
  },
  {
    id: 4,
    firstName: 'Ann',
    lastName: 'Johnson',
    profession: 'Gastroenterologist',
    status: 'Busy',
    membership: 'VIP'
  },
  {
    id: 5,
    firstName: 'Bob',
    lastName: 'Smith',
    pictureUrl: 'https://example.com',
    profession: 'Gastroenterologist',
    status: 'Busy',
    membership: 'Premium'
  }
];

class TestDataSource extends DataSource<Person> {
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

describe('DataSource', () => {
  let ds: TestDataSource;

  beforeEach(() => {
    ds = new TestDataSource();
  });

  it('should have items', () => {
    expect(ds.items).to.deep.equal(people);
  });

  it('should have a size', () => {
    expect(ds.size).to.equal(people.length);
  });

  it('should have an update method', () => {
    expect(ds.update).to.be.a('function');
  });

  it('should not have any filters by default', () => {
    expect(ds.filters).to.be.empty;
  });

  it('should have a filter after adding one', () => {
    ds.addFilter('id', 'id', '1');

    expect(ds.filters).to.have.length(1);
    expect(ds.filters.get('id')).to.deep.equal({ path: 'id', value: '1' });
  });

  it('should support adding a filter by function', () => {
    const filter = ({ firstName }: Person) => /Ann/.test(firstName);

    ds.addFilter('id', filter);

    expect(ds.filters).to.have.length(1);
    expect(ds.filters.get('id')).to.deep.equal({ filter, value: undefined });
  });

  it('should not have any filters after removing one', () => {
    ds.addFilter('id', 'id', '1');
    expect(ds.filters).to.have.length(1);

    ds.removeFilter('id');
    expect(ds.filters).to.be.empty;
  });

  it('should not sort by default', () => {
    expect(ds.sort).to.be.undefined;
  });

  it('should sort after setting one', () => {
    ds.setSort('id', 'firstName', 'asc');

    expect(ds.sort).to.deep.equal({ id: 'id', path: 'firstName', direction: 'asc' });
  });

  it('should not sort after removing it', () => {
    ds.setSort('id', 'firstName', 'asc');
    ds.removeSort();

    expect(ds.sort).to.be.undefined;
  });
});
