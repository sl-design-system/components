import { type Person, getPeople } from '@sl-design-system/example-data';
import { spy } from 'sinon';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { ArrayListDataSource } from './array-list-data-source.js';
import {
  LIST_DATA_SOURCE_DEFAULT_PAGE_SIZE,
  type ListDataSourceDataItem,
  isListDataSourceDataItem,
  isListDataSourceGroupItem
} from './list-data-source.js';

// First 10 people from example-data (count: 10):
//  0: Aria Bailey,    Endocrinologist,   Busy,      Premium
//  1: Aaliyah Butler, Nephrologist,      Available, VIP
//  2: Eleanor Price,  Ophthalmologist,   Available, Regular
//  3: Allison Torres, Allergist,         Available, Regular
//  4: Madeline Lewis, Gastroenterologist,Busy,      VIP
//  5: Anna Myers,     Anesthesiologist,  Available, Premium
//  6: Ashley Howard,  Urologist,         Available, Regular
//  7: Cooper Phillips,Cardiologist,      Busy,      Premium
//  8: Lauren Wright,  Pediatrician,      Available, Regular
//  9: Abigail Lewis,  Nephrologist,      Available, Regular

describe('ArrayListDataSource', () => {
  let people: Person[];
  let ds: ArrayListDataSource<Person>;

  beforeAll(async () => {
    ({ people } = await getPeople({ count: 10 }));
  });

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

      expect(ds.items).to.have.length(1);
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

      expect(ds.items).to.have.length(8);
      expect(
        ds.items
          .filter(item => isListDataSourceDataItem(item))
          .every(({ data: { membership } }) => ['Regular', 'Premium'].includes(membership))
      ).to.be.true;
    });

    it('should filter by status', () => {
      ds.addFilter('id', 'status', 'Busy');
      ds.update();

      expect(ds.items).to.have.length(3);
      expect(
        ds.items
          .filter(item => isListDataSourceDataItem(item))
          .every(({ data: { status } }) => status === 'Busy')
      ).to.be.true;
    });

    it('should filter whitespace, null and undefined as blank values', () => {
      type PersonWithPicture = Person & { pictureUrl?: string | null };
      const dsWithBlanks = new ArrayListDataSource<PersonWithPicture>([
        { ...people[0], pictureUrl: '' },
        { ...people[1], pictureUrl: null },
        { ...people[2], pictureUrl: '  ' },
        { ...people[3], pictureUrl: undefined },
        { ...people[4], pictureUrl: 'https://example.com' }
      ]);

      dsWithBlanks.addFilter('id', 'pictureUrl', '');
      dsWithBlanks.update();

      expect(dsWithBlanks.items).to.have.length(4);
    });

    it('should filter by function', () => {
      ds.addFilter('search', ({ firstName, lastName }) => {
        return /Ann/.test(firstName) || /Ann/.test(lastName);
      });
      ds.update();

      expect(ds.items).to.have.length(1);
      expect(
        ds.items
          .filter(item => isListDataSourceDataItem(item))
          .every(({ data }) => /Ann/.test(data.firstName) || /Ann/.test(data.lastName))
      ).to.be.true;
    });

    it('should combine filters', () => {
      ds.addFilter('id1', 'profession', 'Nephrologist');
      ds.addFilter('id2', 'status', 'Available');
      ds.addFilter('id3', ({ firstName }) => /Abigail/.test(firstName));
      ds.update();

      expect(ds.items).to.have.length(1);

      const { data } = ds.items[0] as ListDataSourceDataItem<Person>;
      expect(data.firstName).to.equal('Abigail');
      expect(data.profession).to.equal('Nephrologist');
      expect(data.status).to.equal('Available');
    });

    it('should reset the filtered items when removing a filter', () => {
      ds.addFilter('id', 'profession', 'Gastroenterologist');
      ds.update();

      expect(ds.items).to.have.length(1);

      ds.removeFilter('id');
      ds.update();

      expect(ds.items).to.have.length(people.length);
    });

    it('should have unfiltered items when filtered', () => {
      ds.addFilter('id', 'profession', 'Gastroenterologist');
      ds.update();

      expect(ds.items).to.have.length(1);
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
        // 10 people in 9 profession groups (Nephrologist has 2 members)
        expect(ds.items.length).to.equal(people.length + 9);
      });

      it('should have group items at the start of each group', () => {
        const types = ds.items.map(({ type }) => type);

        expect(types).to.deep.equal([
          'group',
          'data', // Allergist
          'group',
          'data', // Anesthesiologist
          'group',
          'data', // Cardiologist
          'group',
          'data', // Endocrinologist
          'group',
          'data', // Gastroenterologist
          'group',
          'data',
          'data', // Nephrologist (2 members)
          'group',
          'data', // Ophthalmologist
          'group',
          'data', // Pediatrician
          'group',
          'data' // Urologist
        ]);
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

        expect(types).to.deep.equal([
          'group', // Allergist (collapsed, member hidden)
          'group',
          'data', // Anesthesiologist
          'group',
          'data', // Cardiologist
          'group',
          'data', // Endocrinologist
          'group',
          'data', // Gastroenterologist
          'group',
          'data',
          'data', // Nephrologist
          'group',
          'data', // Ophthalmologist
          'group',
          'data', // Pediatrician
          'group',
          'data' // Urologist
        ]);
      });
    });

    describe('sorting', () => {
      it('should sort the groups in a descending direction', () => {
        ds = new ArrayListDataSource(people, { groupBy: 'profession', groupSortDirection: 'desc' });

        const groupLabels = ds.items
          .filter(item => isListDataSourceGroupItem(item))
          .map(({ label }) => label);

        expect(groupLabels).to.deep.equal([
          'Urologist',
          'Pediatrician',
          'Ophthalmologist',
          'Nephrologist',
          'Gastroenterologist',
          'Endocrinologist',
          'Cardiologist',
          'Anesthesiologist',
          'Allergist'
        ]);
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

        const groupLabels = ds.items
          .filter(item => isListDataSourceGroupItem(item))
          .map(({ label }) => label);

        expect(groupLabels).to.deep.equal([
          'Nephrologist',
          'Allergist',
          'Anesthesiologist',
          'Cardiologist',
          'Endocrinologist',
          'Gastroenterologist',
          'Ophthalmologist',
          'Pediatrician',
          'Urologist'
        ]);
      });
    });

    describe('with a label path', () => {
      beforeEach(() => {
        ds = new ArrayListDataSource(people, {
          groupBy: 'profession',
          groupLabelPath: 'membership'
        });
      });

      it('should use the label path for the group label', () => {
        const groups = ds.items.filter(item => isListDataSourceGroupItem(item));

        // Each group's label should equal the membership of the first person with that profession
        groups.forEach(group => {
          const firstMember = people.find(p => p.profession === group.id);
          expect(group.label).to.equal(firstMember?.membership);
        });

        // Groups should be sorted by their label (membership value)
        const labels = groups.map(({ label }) => label ?? '');
        expect(labels).to.deep.equal([...labels].sort((a, b) => a.localeCompare(b)));
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

      expect(firstNames).to.deep.equal(['Allison', 'Madeline', 'Anna']);
    });

    it('should update pagination after changing the page', () => {
      ds.setPage(0);
      ds.update();

      const firstNames = ds.items
        .filter(item => isListDataSourceDataItem(item))
        .map(({ data: { firstName } }) => firstName);

      expect(firstNames).to.deep.equal(['Aria', 'Aaliyah', 'Eleanor']);
    });

    it('should update pagination after changing the page size', () => {
      ds.setPageSize(2);
      ds.update();

      const firstNames = ds.items
        .filter(item => isListDataSourceDataItem(item))
        .map(({ data: { firstName } }) => firstName);

      expect(firstNames).to.deep.equal(['Eleanor', 'Allison']);
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

      it('should toggle isSelectAllToggled() after calling deselect() on every item', () => {
        ds.selectAll();
        expect(ds.isSelectAllToggled()).to.be.true;

        ds.items.forEach(item => ds.deselect(item));
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
        expect(
          ds.items.filter(item => isListDataSourceDataItem(item)).every(({ selected }) => selected)
        ).to.be.true;
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
          .find(({ id }) => id === 'Nephrologist')!;

        ds.select(group);

        expect(ds.selection.size).to.equal(2);
        expect(ds.isSelected(group)).to.be.true;
        expect(ds.isSelected(group.members?.at(0))).to.be.true;
        expect(ds.isSelected(group.members?.at(1))).to.be.true;
      });

      it('should deselect all items in a group when calling deselect() with the group', () => {
        const group = ds.items
          .filter(item => isListDataSourceGroupItem(item))
          .find(({ id }) => id === 'Nephrologist')!;

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
          .find(({ id }) => id === 'Nephrologist')!;

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
          .find(({ id }) => id === 'Nephrologist')!;

        ds.select(group.members!.at(0)!);
        ds.select(group.members!.at(1)!);

        expect(ds.selection.size).to.equal(2);
        expect(ds.isSelected(group)).to.be.true;
        expect(ds.isSelected(group.members?.at(0))).to.be.true;
        expect(ds.isSelected(group.members?.at(1))).to.be.true;
      });
    });

    describe('getSelectedItems', () => {
      it('should return an empty array when nothing is selected', () => {
        ds = new ArrayListDataSource(people, { selects: 'single' });

        expect(ds.getSelectedItems()).to.deep.equal([]);
      });

      it('should return the selected item in single select mode', () => {
        ds = new ArrayListDataSource(people, { selects: 'single' });
        ds.select(ds.items.at(0)!);

        const selected = ds.getSelectedItems();

        expect(selected).to.have.length(1);
        expect(selected[0]).to.equal(people[0]);
      });

      it('should return all selected items in multiple select mode', () => {
        ds = new ArrayListDataSource(people, { selects: 'multiple' });
        ds.select(ds.items.at(0)!);
        ds.select(ds.items.at(1)!);

        const selected = ds.getSelectedItems();

        expect(selected).to.have.length(2);
        expect(selected).to.include(people[0]);
        expect(selected).to.include(people[1]);
      });

      it('should return the raw data objects, not wrapped items', () => {
        ds = new ArrayListDataSource(people, { selects: 'single' });
        ds.select(ds.items.at(0)!);

        const selected = ds.getSelectedItems();

        expect(selected[0]).to.not.have.property('type');
        expect(selected[0]).to.have.property('firstName');
      });

      it('should not include deselected items', () => {
        ds = new ArrayListDataSource(people, { selects: 'multiple' });
        ds.select(ds.items.at(0)!);
        ds.select(ds.items.at(1)!);
        ds.deselect(ds.items.at(0)!);

        const selected = ds.getSelectedItems();

        expect(selected).to.have.length(1);
        expect(selected[0]).to.equal(people[1]);
      });

      it('should return all items when selectAll is used', () => {
        ds = new ArrayListDataSource(people, { selects: 'multiple' });
        ds.selectAll();
        ds.update();

        const selected = ds.getSelectedItems();

        expect(selected).to.have.length(people.length);
      });

      it('should exclude items deselected after selectAll', () => {
        ds = new ArrayListDataSource(people, { selects: 'multiple' });
        ds.selectAll();
        ds.update();
        ds.deselect(ds.items.at(0)!);

        const selected = ds.getSelectedItems();

        expect(selected).to.have.length(people.length - 1);
        expect(selected).to.not.include(people[0]);
      });

      it('should return an empty array when selects is not set', () => {
        ds = new ArrayListDataSource(people);

        expect(ds.getSelectedItems()).to.deep.equal([]);
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

      expect(firstNames).to.deep.equal([
        'Aaliyah',
        'Abigail',
        'Allison',
        'Anna',
        'Aria',
        'Ashley',
        'Cooper',
        'Eleanor',
        'Lauren',
        'Madeline'
      ]);
    });

    it('should sort in a descending direction', () => {
      ds.setSort('firstName', 'desc');
      ds.update();

      const firstNames = ds.items
        .filter(item => isListDataSourceDataItem(item))
        .map(({ data: { firstName } }) => firstName);

      expect(firstNames).to.deep.equal([
        'Madeline',
        'Lauren',
        'Eleanor',
        'Cooper',
        'Ashley',
        'Aria',
        'Anna',
        'Allison',
        'Abigail',
        'Aaliyah'
      ]);
    });

    it('should sort by another field', () => {
      ds.setSort('lastName', 'desc');
      ds.update();

      const lastNames = ds.items
        .filter(item => isListDataSourceDataItem(item))
        .map(({ data: { lastName } }) => lastName);

      expect(lastNames).to.deep.equal([
        'Wright',
        'Torres',
        'Price',
        'Phillips',
        'Myers',
        'Lewis',
        'Lewis',
        'Howard',
        'Butler',
        'Bailey'
      ]);
    });

    it('should reset the original order when removing a sort', () => {
      ds.setSort('profession', 'asc');
      ds.update();

      let professions = ds.items
        .filter(item => isListDataSourceDataItem(item))
        .map(({ data: { profession } }) => profession);

      expect(professions).to.deep.equal([
        'Allergist',
        'Anesthesiologist',
        'Cardiologist',
        'Endocrinologist',
        'Gastroenterologist',
        'Nephrologist',
        'Nephrologist',
        'Ophthalmologist',
        'Pediatrician',
        'Urologist'
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
        'Allergist',
        'Gastroenterologist',
        'Anesthesiologist',
        'Urologist',
        'Cardiologist',
        'Pediatrician',
        'Nephrologist'
      ]);
    });
  });

  describe('updating', () => {
    beforeEach(() => {
      ds = new ArrayListDataSource(people);
    });

    it('should replace items when setData is called with new data', () => {
      const newPeople: Person[] = [
        {
          firstName: 'Alice',
          lastName: 'Wonder',
          email: 'alice@example.com',
          profession: 'Surgeon',
          status: 'Available',
          membership: 'Regular'
        }
      ];

      ds.setData(newPeople);
      ds.update();

      const items = ds.items.filter(item => isListDataSourceDataItem(item)).map(({ data }) => data);

      expect(items).to.have.length(1);
      expect(items[0]).to.deep.equal(newPeople[0]);
    });

    it('should update size after setData', () => {
      const newPeople: Person[] = [
        {
          firstName: 'Alice',
          lastName: 'Wonder',
          email: 'alice@example.com',
          profession: 'Surgeon',
          status: 'Available',
          membership: 'Regular'
        },
        {
          firstName: 'Bob',
          lastName: 'Builder',
          email: 'bob@example.com',
          profession: 'Surgeon',
          status: 'Busy',
          membership: 'Premium'
        }
      ];

      ds.setData(newPeople);
      ds.update();

      expect(ds.size).to.equal(2);
      expect(ds.totalSize).to.equal(2);
    });

    it('should handle setData with an empty array', () => {
      ds.setData([]);
      ds.update();

      expect(ds.items).to.have.length(0);
      expect(ds.size).to.equal(0);
    });

    it('should preserve filters when updating data', () => {
      ds.addFilter('status', 'status', 'Available');
      ds.update();

      const newPeople: Person[] = [
        {
          firstName: 'Alice',
          lastName: 'Wonder',
          email: 'alice@example.com',
          profession: 'Surgeon',
          status: 'Available',
          membership: 'Regular'
        },
        {
          firstName: 'Bob',
          lastName: 'Builder',
          email: 'bob@example.com',
          profession: 'Surgeon',
          status: 'Busy',
          membership: 'Premium'
        }
      ];

      ds.setData(newPeople);
      ds.update();

      const items = ds.items.filter(item => isListDataSourceDataItem(item)).map(({ data }) => data);

      expect(items).to.have.length(1);
      expect(items[0].firstName).to.equal('Alice');
    });

    it('should preserve sorting when updating data', () => {
      ds.setSort('firstName', 'asc');
      ds.update();

      const newPeople: Person[] = [
        {
          firstName: 'Charlie',
          lastName: 'Brown',
          email: 'charlie@example.com',
          profession: 'Surgeon',
          status: 'Available',
          membership: 'Regular'
        },
        {
          firstName: 'Alice',
          lastName: 'Wonder',
          email: 'alice@example.com',
          profession: 'Surgeon',
          status: 'Available',
          membership: 'Premium'
        }
      ];

      ds.setData(newPeople);
      ds.update();

      const items = ds.items.filter(item => isListDataSourceDataItem(item)).map(({ data }) => data);

      expect(items[0].firstName).to.equal('Alice');
      expect(items[1].firstName).to.equal('Charlie');
    });

    it('should preserve selection when updating data', () => {
      ds = new ArrayListDataSource(people, { selects: 'multiple' });

      ds.select(ds.items.at(0)!);
      ds.select(ds.items.at(2)!);

      expect(ds.selection.size).to.equal(2);

      ds.setData([...people]);
      ds.update();

      expect(ds.selection.size).to.equal(2);
      expect(ds.isSelected(ds.items.at(0))).to.be.true;
      expect(ds.isSelected(ds.items.at(2))).to.be.true;
    });

    it('should remove selection for deleted items after setData', () => {
      ds = new ArrayListDataSource(people, { selects: 'multiple' });

      ds.select(ds.items.at(0)!);
      ds.select(ds.items.at(1)!);

      expect(ds.selection.size).to.equal(2);

      // Remove the first person from the data
      ds.setData(people.slice(1));
      ds.update();

      expect(ds.selection.size).to.equal(1);
      expect(ds.isSelected(ds.items.at(0))).to.be.true;
    });

    it('should emit sl-selection-change when a selected item is removed', () => {
      ds = new ArrayListDataSource(people, { selects: 'multiple' });

      ds.select(ds.items.at(0)!);

      const onSelectionChange = spy();
      ds.addEventListener('sl-selection-change', onSelectionChange);

      // Remove the first person (which is selected)
      ds.setData(people.slice(1));

      expect(onSelectionChange).to.have.been.calledOnce;
    });

    it('should not emit sl-selection-change when no selected items are removed', () => {
      ds = new ArrayListDataSource(people, { selects: 'multiple' });

      ds.select(ds.items.at(0)!);

      const onSelectionChange = spy();
      ds.addEventListener('sl-selection-change', onSelectionChange);

      // Replace data but keep all items (selection stays intact)
      ds.setData([...people]);

      expect(onSelectionChange).not.to.have.been.called;
    });

    it('should recalculate groups after setData and update', () => {
      ds = new ArrayListDataSource(people, { groupBy: 'profession' });

      const groupsBefore = ds.items
        .filter(item => isListDataSourceGroupItem(item))
        .map(({ label }) => label);

      expect(groupsBefore).to.deep.equal([
        'Allergist',
        'Anesthesiologist',
        'Cardiologist',
        'Endocrinologist',
        'Gastroenterologist',
        'Nephrologist',
        'Ophthalmologist',
        'Pediatrician',
        'Urologist'
      ]);

      // Replace with data that has different professions
      ds.setData([
        {
          firstName: 'Alice',
          lastName: 'Wonder',
          email: 'alice@example.com',
          profession: 'Surgeon',
          status: 'Available',
          membership: 'Regular'
        },
        {
          firstName: 'Bob',
          lastName: 'Builder',
          email: 'bob@example.com',
          profession: 'Dermatologist',
          status: 'Busy',
          membership: 'Premium'
        }
      ]);
      ds.update();

      const groupsAfter = ds.items
        .filter(item => isListDataSourceGroupItem(item))
        .map(({ label }) => label);

      expect(groupsAfter).to.deep.equal(['Dermatologist', 'Surgeon']);
    });

    it('should remember collapsed group state after setData when the group still exists', () => {
      ds = new ArrayListDataSource(people, { groupBy: 'profession' });

      // Collapse the 'Nephrologist' group
      ds.collapseGroup('Nephrologist');
      ds.update();

      expect(ds.isGroupCollapsed('Nephrologist')).to.be.true;

      // Update with data that still contains the 'Nephrologist' group
      ds.setData([
        {
          firstName: 'Ann',
          lastName: 'A',
          email: 'ann.a@example.com',
          profession: 'Nephrologist',
          status: 'Available',
          membership: 'Regular'
        },
        {
          firstName: 'Bob',
          lastName: 'B',
          email: 'bob.b@example.com',
          profession: 'Endocrinologist',
          status: 'Busy',
          membership: 'Premium'
        }
      ]);
      ds.update();

      expect(ds.isGroupCollapsed('Nephrologist')).to.be.true;
      expect(ds.isGroupCollapsed('Endocrinologist')).to.be.false;

      // Verify the collapsed group's members are hidden
      const types = ds.items.map(({ type }) => type);

      expect(types).to.deep.equal(['group', 'data', 'group']);
    });

    it('should remember collapsed state even for groups no longer present in the data', () => {
      ds = new ArrayListDataSource(people, { groupBy: 'profession' });

      // Collapse 'Ophthalmologist'
      ds.collapseGroup('Ophthalmologist');
      ds.update();

      expect(ds.isGroupCollapsed('Ophthalmologist')).to.be.true;

      // Replace with data that does not contain 'Ophthalmologist'
      ds.setData([
        {
          firstName: 'Ann',
          lastName: 'A',
          email: 'ann.a@example.com',
          profession: 'Surgeon',
          status: 'Available',
          membership: 'Regular'
        },
        {
          firstName: 'Bob',
          lastName: 'B',
          email: 'bob.b@example.com',
          profession: 'Dermatologist',
          status: 'Busy',
          membership: 'Premium'
        }
      ]);
      ds.update();

      // The collapsed state is still remembered
      expect(ds.isGroupCollapsed('Ophthalmologist')).to.be.true;
      expect(ds.isGroupCollapsed('Surgeon')).to.be.false;
      expect(ds.isGroupCollapsed('Dermatologist')).to.be.false;
    });
  });
});
