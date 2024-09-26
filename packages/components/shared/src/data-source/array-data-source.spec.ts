import { expect } from '@open-wc/testing';
import { spy } from 'sinon';
import { ArrayDataSource } from './array-data-source.js';

const people = [
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

describe('ArrayDataSource', () => {
  let ds: ArrayDataSource<(typeof people)[0]>;

  describe('basics', () => {
    beforeEach(() => {
      ds = new ArrayDataSource(people);
    });

    it('should have items', () => {
      expect(ds.items).to.deep.equal(people);
    });

    it('should not have filtered any items', () => {
      expect(ds.filteredItems).to.deep.equal(people);
    });

    it('should have a size', () => {
      expect(ds.size).to.equal(people.length);
    });

    it('should not have filtering', () => {
      expect(ds.filters.size).to.equal(0);
    });

    it('should not have grouping', () => {
      expect(ds.groupBy).to.be.undefined;
    });

    it('should not have sorting', () => {
      expect(ds.sort).to.be.undefined;
    });

    it('should emit an sl-update event when calling update()', () => {
      const onUpdate = spy();

      ds.addEventListener('sl-update', onUpdate);
      ds.update();

      expect(onUpdate).to.have.been.calledOnce;
    });
  });

  describe('filtering', () => {
    beforeEach(() => {
      ds = new ArrayDataSource(people);
    });

    it('should filter by path', () => {
      ds.addFilter('id', 'profession', 'Gastroenterologist');
      ds.update();

      expect(ds.filteredItems).to.have.length(2);
      expect(ds.filteredItems.every(({ profession }) => profession === 'Gastroenterologist')).to.be.true;
    });

    it('should filter the same path using an OR operator', () => {
      ds.addFilter('id1', 'membership', 'Regular');
      ds.addFilter('id2', 'membership', 'Premium');
      ds.update();

      expect(ds.filteredItems).to.have.length(4);
      expect(ds.filteredItems.every(({ membership }) => ['Regular', 'Premium'].includes(membership))).to.be.true;
    });

    it('should filter numbers as well as strings', () => {
      ds.addFilter('id', 'id', '1');
      ds.update();

      expect(ds.filteredItems).to.have.length(1);
      expect(ds.filteredItems[0].id).to.equal(1);
    });

    it('should filter whitespace, null and undefined as blank values', () => {
      ds.addFilter('id', 'pictureUrl', '');
      ds.update();

      expect(ds.filteredItems).to.have.length(4);
    });

    it('should filter by function', () => {
      ds.addFilter('search', ({ firstName, lastName }) => {
        return /Ann/.test(firstName) || /Ann/.test(lastName);
      });
      ds.update();

      expect(ds.filteredItems).to.have.length(2);
      expect(ds.filteredItems.every(({ firstName, lastName }) => /Ann/.test(firstName) || /Ann/.test(lastName))).to.be
        .true;
    });

    it('should combine filters', () => {
      ds.addFilter('id1', 'profession', 'Gastroenterologist');
      ds.addFilter('id2', 'status', 'Busy');
      ds.addFilter('id3', ({ firstName }) => /Bob/.test(firstName));
      ds.update();

      expect(ds.filteredItems).to.have.length(1);
      expect(ds.filteredItems[0].firstName).to.equal('Bob');
      expect(ds.filteredItems[0].profession).to.equal('Gastroenterologist');
      expect(ds.filteredItems[0].status).to.equal('Busy');
    });

    it('should reset the filtered items when removing a filter', () => {
      ds.addFilter('id', 'profession', 'Gastroenterologist');
      ds.update();

      expect(ds.filteredItems).to.have.length(2);

      ds.removeFilter('id');
      ds.update();

      expect(ds.filteredItems).to.deep.equal(people);
    });
  });

  describe('grouping', () => {});

  describe('sorting', () => {
    beforeEach(() => {
      ds = new ArrayDataSource(people);
    });

    it('should sort by path', () => {
      ds.setSort('id', 'firstName', 'asc');
      ds.update();

      expect(ds.filteredItems.map(({ firstName }) => firstName)).to.deep.equal(['Ann', 'Ann', 'Bob', 'Jane', 'John']);
    });

    it('should reset the filtered items when removing a sort', () => {
      ds.setSort('id', 'firstName', 'asc');
      ds.update();

      expect(ds.filteredItems.map(({ firstName }) => firstName)).to.deep.equal(['Ann', 'Ann', 'Bob', 'Jane', 'John']);

      ds.removeSort();
      ds.update();

      expect(ds.filteredItems.map(({ firstName }) => firstName)).to.deep.equal(['Ann', 'John', 'Jane', 'Ann', 'Bob']);
    });
  });
});
