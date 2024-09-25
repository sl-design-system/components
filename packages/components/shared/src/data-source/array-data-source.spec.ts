import { expect } from '@open-wc/testing';
import { type Person, getPeople } from '@sl-design-system/example-data';
import { spy } from 'sinon';
import { ArrayDataSource } from './array-data-source.js';

describe('ArrayDataSource', () => {
  let ds: ArrayDataSource<Person>, people: Person[];

  describe('basics', () => {
    beforeEach(async () => {
      people = (await getPeople()).people;
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

  describe('filtering', () => {});

  describe('grouping', () => {});

  describe('sorting', () => {});
});
