import { expect } from '@open-wc/testing';
import { spy } from 'sinon';
import { ArrayListDataSource } from './array-list-data-source.js';
import {
  DATA_SOURCE_DEFAULT_PAGE_SIZE,
  type ListDataSourceDataItem,
  isListDataSourceDataItem
} from './list-data-source.js';
import { type Person, people } from './list-data-source.spec.js';

describe('ArrayListDataSource', () => {
  let ds: ArrayListDataSource<Person>;

  describe('basics', () => {
    beforeEach(() => {
      ds = new ArrayListDataSource(people);
    });

    it('should not have filtered any items', () => {
      const items = ds.items.filter(item => isListDataSourceDataItem(item)).map(({ data }) => data);

      expect(items).to.have.length(people.length);
      expect(items).to.deep.equal(people);
    });

    it('should have items with type data', () => {
      const allData = ds.items.map(({ type }) => type).every(type => type === 'data');

      expect(allData).to.be.true;
    });

    it('should have the unfiltered items', () => {
      expect(ds.unfilteredItems).to.have.length(people.length);
    });

    it('should have a size', () => {
      expect(ds.size).to.equal(people.length);
    });

    it('should have a total size', () => {
      expect(ds.totalSize).to.equal(people.length);
    });

    it('should not have filtering', () => {
      expect(ds.filters.size).to.equal(0);
    });

    it('should not have grouping', () => {
      expect(ds.groupBy).to.be.undefined;
      expect(ds.groupLabelPath).to.be.undefined;
    });

    it('should have any selected items', () => {
      expect(ds.selection.size).to.equal(0);
    });

    it('should not have a selection mode', () => {
      expect(ds.selects).to.be.undefined;
    });

    it('should not have sorting', () => {
      expect(ds.sort).to.be.undefined;
    });

    it('should not have pagination', () => {
      expect(ds.pagination).not.to.be.true;
    });

    it('should default to the first page', () => {
      expect(ds.page).to.equal(0);
    });

    it('should default to a page size of DATA_SOURCE_DEFAULT_PAGE_SIZE', () => {
      expect(ds.pageSize).to.equal(DATA_SOURCE_DEFAULT_PAGE_SIZE);
    });

    it('should emit an sl-update event when calling update()', () => {
      const onUpdate = spy();

      ds.addEventListener('sl-update', onUpdate);
      ds.update();

      expect(onUpdate).to.have.been.calledOnce;
    });

    it('should not emit an sl-update event when calling update(false)', () => {
      const onUpdate = spy();

      ds.addEventListener('sl-update', onUpdate);
      ds.update(false);

      expect(onUpdate).not.to.have.been.called;
    });
  });

  describe('filtering', () => {
    beforeEach(() => {
      ds = new ArrayListDataSource(people);
    });

    it('should filter by path', () => {
      ds.addFilter('id', 'profession', 'Gastroenterologist');
      ds.update();

      expect(ds.items).to.have.length(2);
      expect(
        ds.items
          .filter(item => isListDataSourceDataItem(item))
          .every(({ data: { profession } }) => profession === 'Gastroenterologist')
      ).to.be.true;
    });

    it('should filter the same path using an OR operator', () => {
      ds.addFilter('id1', 'membership', 'Regular');
      ds.addFilter('id2', 'membership', 'Premium');
      ds.update();

      expect(ds.items).to.have.length(4);
      expect(
        ds.items
          .filter(item => isListDataSourceDataItem(item))
          .every(({ data: { membership } }) => ['Regular', 'Premium'].includes(membership))
      ).to.be.true;
    });

    it('should filter numbers as well as strings', () => {
      ds.addFilter('id', 'id', '1');
      ds.update();

      expect(ds.items).to.have.length(1);
      expect(ds.items[0].id).to.equal(1);
    });

    it('should filter whitespace, null and undefined as blank values', () => {
      ds.addFilter('id', 'pictureUrl', '');
      ds.update();

      expect(ds.items).to.have.length(4);
      expect(ds.items.map(({ id }) => id)).to.deep.equal([1, 211, 201, 3]);
    });

    it('should filter by function', () => {
      ds.addFilter('search', ({ firstName, lastName }) => {
        return /Ann/.test(firstName) || /Ann/.test(lastName);
      });
      ds.update();

      expect(ds.items).to.have.length(2);
      expect(
        ds.items
          .filter(item => isListDataSourceDataItem(item))
          .every(({ data }) => /Ann/.test(data.firstName) || /Ann/.test(data.lastName))
      ).to.be.true;
    });

    it('should combine filters', () => {
      ds.addFilter('id1', 'profession', 'Gastroenterologist');
      ds.addFilter('id2', 'status', 'Busy');
      ds.addFilter('id3', ({ firstName }) => /Bob/.test(firstName));
      ds.update();

      expect(ds.items).to.have.length(1);

      const { data } = ds.items[0] as ListDataSourceDataItem<Person>;
      expect(data.firstName).to.equal('Bob');
      expect(data.profession).to.equal('Gastroenterologist');
      expect(data.status).to.equal('Busy');
    });

    it('should reset the filtered items when removing a filter', () => {
      ds.addFilter('id', 'profession', 'Gastroenterologist');
      ds.update();

      expect(ds.items).to.have.length(2);

      ds.removeFilter('id');
      ds.update();

      expect(ds.items).to.have.length(people.length);
    });

    it('should unfiltered items when filtered', () => {
      ds.addFilter('id', 'profession', 'Gastroenterologist');
      ds.update();

      expect(ds.items).to.have.length(2);
      expect(ds.unfilteredItems).to.have.length(people.length);
    });
  });

  describe('grouping', () => {
    beforeEach(() => {
      ds = new ArrayListDataSource(people, { groupBy: 'profession' });
    });

    it('should group by path', () => {
      expect(ds.groupBy).to.equal('profession');
    });

    it('should not have an increased size when grouping', () => {
      expect(ds.size).to.equal(people.length);
    });

    it('should have an increased length to account for the group items', () => {
      expect(ds.items.length).to.equal(people.length + 4);
    });

    it('should have group items at the start of each group', () => {});
  });

  describe('pagination', () => {
    beforeEach(() => {
      ds = new ArrayListDataSource(people, { pagination: true });
      ds.setPage(1);
      ds.setPageSize(3);
      ds.update();
    });

    it('should paginate people', () => {
      expect(ds.items.map(item => (item as ListDataSourceDataItem<Person>).data.firstName)).to.deep.equal([
        'Ann',
        'Bob'
      ]);
    });

    it('should update pagination after changing the page', () => {
      ds.setPage(0);
      ds.update();

      expect(ds.items.map(item => (item as ListDataSourceDataItem<Person>).data.firstName)).to.deep.equal([
        'Ann',
        'John',
        'Jane'
      ]);
    });

    it('should update pagination after changing the page size', () => {
      ds.setPageSize(2);
      ds.update();

      expect(ds.items.map(item => (item as ListDataSourceDataItem<Person>).data.firstName)).to.deep.equal([
        'Jane',
        'Ann'
      ]);
    });
  });

  describe('selection', () => {
    describe('none', () => {
      it('should do nothing when calling select()', () => {});

      it('should do nothing when calling deselect()', () => {});

      it('should do nothing when calling toggle()', () => {});

      it('should always return false when calling isSelected()', () => {});
    });

    describe('single', () => {});

    describe('multiple', () => {});

    describe('with groups', () => {});
  });

  describe('sorting', () => {
    beforeEach(() => {
      ds = new ArrayListDataSource(people, { sortBy: 'firstName', sortDirection: 'asc' });
    });

    it('should have a sorting', () => {
      expect(ds.sort).to.deep.equal({ by: 'firstName', direction: 'asc' });
    });

    it('should have sorted the items in the constructor', () => {
      const firstNames = ds.items
        .filter(item => isListDataSourceDataItem(item))
        .map(({ data: { firstName } }) => firstName);

      expect(firstNames).to.deep.equal(['Ann', 'Ann', 'Bob', 'Jane', 'John']);
    });

    it('should sort in a descending direction', () => {
      ds.setSort('firstName', 'desc');
      ds.update();

      const firstNames = ds.items
        .filter(item => isListDataSourceDataItem(item))
        .map(({ data: { firstName } }) => firstName);

      expect(firstNames).to.deep.equal(['John', 'Jane', 'Bob', 'Ann', 'Ann']);
    });

    it('should sort numbers', () => {
      ds.setSort('id', 'desc');
      ds.update();

      const ids = ds.items.filter(item => isListDataSourceDataItem(item)).map(({ id }) => id);

      expect(ids).to.deep.equal([211, 201, 32, 3, 1]);
    });

    it('should reset the original order when removing a sort', () => {
      ds.setSort('profession', 'asc');
      ds.update();

      let professions = ds.items
        .filter(item => isListDataSourceDataItem(item))
        .map(({ data: { profession } }) => profession);

      expect(professions).to.deep.equal([
        'Endocrinologist',
        'Gastroenterologist',
        'Gastroenterologist',
        'Nephrologist',
        'Ophthalmologist'
      ]);

      ds.removeSort();
      ds.update();

      professions = ds.items
        .filter(item => isListDataSourceDataItem(item))
        .map(({ data: { profession } }) => profession);

      expect(professions).to.deep.equal([
        'Endocrinologist',
        'Nephrologist',
        'Ophthalmologist',
        'Gastroenterologist',
        'Gastroenterologist'
      ]);
    });
  });
});
