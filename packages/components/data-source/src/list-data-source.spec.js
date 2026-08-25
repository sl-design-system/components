import { beforeEach, describe, expect, it } from 'vitest';
import { ListDataSource } from './list-data-source.js';
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
class TestListDataSource extends ListDataSource {
  get items() {
    return [];
  }
  constructor() {
    super({});
    this.size = people.length;
    this.totalSize = people.length;
  }
  expandGroup(id) {
    console.log('expand group', id);
  }
  collapseGroup(id) {
    console.log('collapse group', id);
  }
  toggleGroup(id) {
    console.log('toggle group', id);
  }
  isGroupCollapsed(_id) {
    return false;
  }
  reorder(_item, _relativeItem, _position) {}
  update() {}
}
describe('ListDataSource', () => {
  let ds;
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
});
//# sourceMappingURL=list-data-source.spec.js.map
