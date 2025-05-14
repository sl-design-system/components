import { expect } from '@open-wc/testing';
import { ListDataSource } from './list-data-source.js';

// eslint-disable-next-line mocha/no-exports
export type Person = {
  id: number;
  firstName: string;
  lastName: string;
  pictureUrl?: string | null;
  profession: string;
  status: string;
  membership: string;
};

// eslint-disable-next-line mocha/no-exports
export const people: Person[] = [
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
    id: 211,
    firstName: 'John',
    lastName: 'Doe',
    pictureUrl: null,
    profession: 'Nephrologist',
    status: 'Busy',
    membership: 'Premium'
  },
  {
    id: 201,
    firstName: 'Jane',
    lastName: 'Doe',
    pictureUrl: '  ',
    profession: 'Ophthalmologist',
    status: 'Available',
    membership: 'Regular'
  },
  {
    id: 3,
    firstName: 'Ann',
    lastName: 'Johnson',
    profession: 'Gastroenterologist',
    status: 'Busy',
    membership: 'VIP'
  },
  {
    id: 32,
    firstName: 'Bob',
    lastName: 'Smith',
    pictureUrl: 'https://example.com',
    profession: 'Gastroenterologist',
    status: 'Busy',
    membership: 'Premium'
  }
];

class TestListDataSource extends ListDataSource<Person> {
  override get items() {
    return [];
  }

  override size: number;
  override totalSize: number;

  override get unfilteredItems() {
    return [];
  }

  constructor() {
    super({});

    this.size = people.length;
    this.totalSize = people.length;
  }

  override expandGroup(id: unknown): void {
    console.log('expand group', id);
  }

  override collapseGroup(id: unknown): void {
    console.log('collapse group', id);
  }

  override toggleGroup(id: unknown): void {
    console.log('toggle group', id);
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

    expect(ds.groupBy).to.equal('profession');
  });

  it('should not group by after removing it', () => {
    ds.setGroupBy('profession');
    ds.removeGroupBy();

    expect(ds.groupBy).to.be.undefined;
  });

  // it('should reorder items', () => {
  //   spy(ds, 'update');

  //   expect(ds.items.map(({ id }) => id)).to.deep.equal([1, 2, 3, 4, 5]);

  //   ds.reorder(people[0], people[4], 'before');

  //   expect(ds.items.map(({ id }) => id)).to.deep.equal([2, 3, 4, 1, 5]);
  //   expect(ds.update).to.have.been.calledOnce;
  // });
});
