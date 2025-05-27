import { expect } from '@open-wc/testing';
import { spy } from 'sinon';
import { ArrayListDataSource } from './array-list-data-source.js';
import {
  LIST_DATA_SOURCE_DEFAULT_PAGE_SIZE,
  type ListDataSourceDataItem,
  isListDataSourceDataItem,
  isListDataSourceGroupItem
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

    it('should not have any selected items', () => {
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
      expect(ds.pageSize).to.equal(LIST_DATA_SOURCE_DEFAULT_PAGE_SIZE);
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

    it('should have unfiltered items when filtered', () => {
      ds.addFilter('id', 'profession', 'Gastroenterologist');
      ds.update();

      expect(ds.items).to.have.length(2);
      expect(ds.unfilteredItems).to.have.length(people.length);
    });
  });

  describe('grouping', () => {
    describe('basic', () => {
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

      it('should have group items at the start of each group', () => {
        const types = ds.items.map(({ type }) => type);

        expect(types).to.deep.equal(['group', 'data', 'group', 'data', 'data', 'group', 'data', 'group', 'data']);
      });

      it('should have expanded groups by default', () => {
        const groups = ds.items.filter(item => isListDataSourceGroupItem(item));

        expect(groups.some(({ id }) => ds.isGroupCollapsed(id))).to.be.false;
      });

      it('should hide the group members when the group is collapsed', () => {
        const group = ds.items.filter(item => isListDataSourceGroupItem(item)).at(0)!;

        ds.collapseGroup(group.id);
        ds.update();

        const types = ds.items.map(({ type }) => type);

        expect(types).to.deep.equal(['group', 'group', 'data', 'data', 'group', 'data', 'group', 'data']);
      });
    });

    describe('sorting', () => {
      it('should sort the groups in a descending direction', () => {
        ds = new ArrayListDataSource(people, { groupBy: 'profession', groupSortDirection: 'desc' });

        const groupLabels = ds.items.filter(item => isListDataSourceGroupItem(item)).map(({ label }) => label);

        expect(groupLabels).to.deep.equal(['Ophthalmologist', 'Nephrologist', 'Gastroenterologist', 'Endocrinologist']);
      });

      it('should sort the groups using a custom function', () => {
        ds = new ArrayListDataSource(people, {
          groupBy: 'profession',
          groupSortBy: (a, b) => {
            const valueA = (isListDataSourceGroupItem(a) ? a.label : a.group?.label) ?? '',
              valueB = (isListDataSourceGroupItem(b) ? b.label : b.group?.label) ?? '';

            if (valueA === valueB) {
              return 0;
            } else if (valueA === 'Nephrologist') {
              return -1;
            } else if (valueB === 'Nephrologist') {
              return 1;
            } else {
              return valueA?.localeCompare(valueB);
            }
          }
        });

        const groupLabels = ds.items.filter(item => isListDataSourceGroupItem(item)).map(({ label }) => label);

        expect(groupLabels).to.deep.equal(['Nephrologist', 'Endocrinologist', 'Gastroenterologist', 'Ophthalmologist']);
      });
    });

    describe('with a label path', () => {
      beforeEach(() => {
        ds = new ArrayListDataSource(people, { groupBy: 'profession', groupLabelPath: 'membership' });
      });

      it('should use the label path for the group label', () => {
        const groupLabels = ds.items.filter(item => isListDataSourceGroupItem(item)).map(({ label }) => label);

        expect(groupLabels).to.deep.equal(['Premium', 'Regular', 'Regular', 'VIP']);
      });
    });
  });

  describe('pagination', () => {
    beforeEach(() => {
      ds = new ArrayListDataSource(people, { pagination: true, page: 1, pageSize: 3 });
    });

    it('should paginate people', () => {
      const firstNames = ds.items
        .filter(item => isListDataSourceDataItem(item))
        .map(({ data: { firstName } }) => firstName);

      expect(firstNames).to.deep.equal(['Ann', 'Bob']);
    });

    it('should update pagination after changing the page', () => {
      ds.setPage(0);
      ds.update();

      const firstNames = ds.items
        .filter(item => isListDataSourceDataItem(item))
        .map(({ data: { firstName } }) => firstName);

      expect(firstNames).to.deep.equal(['Ann', 'John', 'Jane']);
    });

    it('should update pagination after changing the page size', () => {
      ds.setPageSize(2);
      ds.update();

      const firstNames = ds.items
        .filter(item => isListDataSourceDataItem(item))
        .map(({ data: { firstName } }) => firstName);

      expect(firstNames).to.deep.equal(['Jane', 'Ann']);
    });
  });

  describe('selection', () => {
    describe('none', () => {
      beforeEach(() => {
        ds = new ArrayListDataSource(people);
      });

      it('should not have a selected any items', () => {
        expect(ds.selection.size).to.equal(0);
      });

      it('should do nothing when calling select()', () => {
        spy(ds.selection, 'add');

        ds.select(ds.items.at(0)!);

        expect(ds.selection.add).not.to.have.been.called;
      });

      it('should do nothing when calling deselect()', () => {
        spy(ds.selection, 'delete');

        ds.deselect(ds.items.at(0)!);

        expect(ds.selection.delete).not.to.have.been.called;
      });

      it('should do nothing when calling toggle()', () => {
        spy(ds.selection, 'add');
        spy(ds.selection, 'delete');

        ds.toggle(ds.items.at(0)!);

        expect(ds.selection.add).not.to.have.been.called;
        expect(ds.selection.delete).not.to.have.been.called;
      });

      it('should always return false when calling isSelected()', () => {
        expect(ds.isSelected(ds.items.at(0))).to.be.false;
      });
    });

    describe('single select', () => {
      beforeEach(() => {
        ds = new ArrayListDataSource(people, { selects: 'single' });
      });

      it('should have a selection mode', () => {
        expect(ds.selects).to.equal('single');
      });

      it('should select an item', () => {
        ds.select(ds.items.at(0)!);

        expect(ds.selection.size).to.equal(1);
        expect(ds.isSelected(ds.items.at(0))).to.be.true;
      });

      it('should deselect the previous item when calling select()', () => {
        ds.select(ds.items.at(0)!);
        ds.select(ds.items.at(1)!);

        expect(ds.selection.size).to.equal(1);
        expect(ds.isSelected(ds.items.at(0))).to.be.false;
        expect(ds.isSelected(ds.items.at(1))).to.be.true;
      });

      it('should deselect an item', () => {
        ds.select(ds.items.at(0)!);
        ds.deselect(ds.items.at(0)!);

        expect(ds.selection.size).to.equal(0);
        expect(ds.isSelected(ds.items.at(0))).to.be.false;
      });

      it('should toggle an item', () => {
        ds.toggle(ds.items.at(0)!);

        expect(ds.selection.size).to.equal(1);
        expect(ds.isSelected(ds.items.at(0))).to.be.true;

        ds.toggle(ds.items.at(0)!);

        expect(ds.selection.size).to.equal(0);
        expect(ds.isSelected(ds.items.at(0))).to.be.false;
      });
    });

    describe('multiple select', () => {
      beforeEach(() => {
        ds = new ArrayListDataSource(people, { selects: 'multiple' });
      });

      it('should have a selection mode', () => {
        expect(ds.selects).to.equal('multiple');
      });

      it('should select an item', () => {
        ds.select(ds.items.at(0)!);

        expect(ds.selection.size).to.equal(1);
        expect(ds.isSelected(ds.items.at(0))).to.be.true;
      });

      it('should select multiple items when calling select()', () => {
        ds.select(ds.items.at(0)!);
        ds.select(ds.items.at(1)!);

        expect(ds.selection.size).to.equal(2);
        expect(ds.isSelected(ds.items.at(0))).to.be.true;
        expect(ds.isSelected(ds.items.at(1))).to.be.true;
      });

      it('should deselect an item', () => {
        ds.select(ds.items.at(0)!);
        ds.deselect(ds.items.at(0)!);

        expect(ds.selection.size).to.equal(0);
        expect(ds.isSelected(ds.items.at(0))).to.be.false;
      });

      it('should toggle an item', () => {
        ds.toggle(ds.items.at(0)!);

        expect(ds.selection.size).to.equal(1);
        expect(ds.isSelected(ds.items.at(0))).to.be.true;

        ds.toggle(ds.items.at(0)!);

        expect(ds.selection.size).to.equal(0);
        expect(ds.isSelected(ds.items.at(0))).to.be.false;
      });
    });

    describe('select all', () => {
      beforeEach(() => {
        ds = new ArrayListDataSource(people, { selects: 'multiple' });
      });

      it('should toggle isSelectAllToggled() after calling selectAll()', () => {
        expect(ds.isSelectAllToggled()).to.be.false;

        ds.selectAll();

        expect(ds.isSelectAllToggled()).to.be.true;
      });

      it('should toggle isSelectAllToggled() after calling deselectAll()', () => {
        ds.selectAll();
        expect(ds.isSelectAllToggled()).to.be.true;

        ds.deselectAll();
        expect(ds.isSelectAllToggled()).to.be.false;
      });

      it('should clear the selection when calling selectAll()', () => {
        ds.select(ds.items.at(0)!);
        ds.selectAll();

        expect(ds.selection.size).to.equal(0);
      });

      it('should list all items as selected even though the selection is empty', () => {
        ds.selectAll();
        ds.update();

        expect(ds.selection.size).to.equal(0);
        expect(ds.items.filter(item => isListDataSourceDataItem(item)).every(({ selected }) => selected)).to.be.true;
      });

      it('should add a selection for every not selected item', () => {
        ds.selectAll();
        ds.deselect(ds.items.at(0)!);

        expect(ds.selection.size).to.equal(1);
        expect(ds.selection.has(ds.items.at(0)?.id)).to.be.true;
        expect(ds.isSelected(ds.items.at(0))).to.be.false;
      });

      it('should return a boolean when calling areAllSelected()', () => {
        expect(ds.areAllSelected()).to.be.false;

        ds.selectAll();
        expect(ds.areAllSelected()).to.be.true;

        ds.deselect(ds.items.at(0)!);
        expect(ds.areAllSelected()).to.be.false;
      });

      it('should return a boolean when calling areSomeSelected()', () => {
        expect(ds.areSomeSelected()).to.be.false;

        ds.selectAll();
        expect(ds.areSomeSelected()).to.be.false;

        ds.deselect(ds.items.at(0)!);
        expect(ds.areSomeSelected()).to.be.true;
      });
    });

    describe('group select', () => {
      beforeEach(() => {
        ds = new ArrayListDataSource(people, { selects: 'multiple', groupBy: 'profession' });
      });

      it('should select all items in a group when calling select() with the group', () => {
        const group = ds.items
          .filter(item => isListDataSourceGroupItem(item))
          .find(({ id }) => id === 'Gastroenterologist')!;

        ds.select(group);

        expect(ds.selection.size).to.equal(2);
        expect(ds.isSelected(group)).to.be.true;
        expect(ds.isSelected(group.members?.at(0))).to.be.true;
        expect(ds.isSelected(group.members?.at(1))).to.be.true;
      });

      it('should deselect all items in a group when calling deselect() with the group', () => {
        const group = ds.items
          .filter(item => isListDataSourceGroupItem(item))
          .find(({ id }) => id === 'Gastroenterologist')!;

        ds.select(group);
        expect(ds.selection.size).to.equal(2);

        ds.deselect(group);

        expect(ds.selection.size).to.equal(0);
        expect(ds.isSelected(group.members?.at(0))).to.be.false;
        expect(ds.isSelected(group.members?.at(1))).to.be.false;
      });

      it('should deselect the group if an item in the group is deselected', () => {
        const group = ds.items
          .filter(item => isListDataSourceGroupItem(item))
          .find(({ id }) => id === 'Gastroenterologist')!;

        ds.select(group);
        expect(ds.selection.size).to.equal(2);

        ds.deselect(group.members!.at(0)!);

        expect(ds.selection.size).to.equal(1);
        expect(ds.isSelected(group)).to.be.false;
        expect(ds.isSelected(group.members?.at(0))).to.be.false;
        expect(ds.isSelected(group.members?.at(1))).to.be.true;
      });

      it('should select the group if all items in the group are selected', () => {
        const group = ds.items
          .filter(item => isListDataSourceGroupItem(item))
          .find(({ id }) => id === 'Gastroenterologist')!;

        ds.select(group.members!.at(0)!);
        ds.select(group.members!.at(1)!);

        expect(ds.selection.size).to.equal(2);
        expect(ds.isSelected(group)).to.be.true;
        expect(ds.isSelected(group.members?.at(0))).to.be.true;
        expect(ds.isSelected(group.members?.at(1))).to.be.true;
      });
    });
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
