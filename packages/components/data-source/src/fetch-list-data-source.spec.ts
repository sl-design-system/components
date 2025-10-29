import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import { FetchListDataSource, type FetchListDataSourceCallbackOptions } from './fetch-list-data-source.js';
import { type ListDataSourceDataItem, ListDataSourcePlaceholder } from './list-data-source.js';
import { type Person, people } from './list-data-source.spec.js';

describe('FetchListDataSource', () => {
  let ds: FetchListDataSource<Person>;

  describe('defaults', () => {
    beforeEach(() => {
      ds = new FetchListDataSource<Person>({
        fetchPage: ({ page, pageSize }) => {
          const start = page * pageSize,
            end = Math.min(start + pageSize, people.length);

          return Promise.resolve({ items: people.slice(start, end), totalItems: people.length });
        },
        pageSize: 2
      });
    });

    it('should have a size', () => {
      expect(ds.size).to.equal(FetchListDataSource.defaultSize);
    });

    it('should update the size after fetching for the first time', async () => {
      ds.update();

      // eslint-disable-next-line chai-friendly/no-unused-expressions
      ds.items[0];

      // Wait for the fetch to complete
      await new Promise(resolve => setTimeout(resolve));

      expect(ds.size).to.equal(people.length);
    });

    it('should have a page', () => {
      expect(ds.page).to.equal(0);
    });

    it('should have a page size', () => {
      expect(ds.pageSize).to.equal(2);
    });

    it('should not fetch the first page when calling update()', () => {
      spy(ds, 'fetchPage');

      ds.update();

      expect(ds.fetchPage).not.to.have.been.called;
    });

    it('should emit an update event when calling update()', () => {
      const onUpdate = spy();

      ds.addEventListener('sl-update', onUpdate);
      ds.update();

      expect(onUpdate).to.have.been.calledOnce;
      expect(onUpdate).to.have.been.calledWithMatch({ detail: { dataSource: ds } });
    });

    it('should return a placeholder item when the item is not yet available', async () => {
      ds.update();

      let item = ds.items[0] as ListDataSourceDataItem<Person>;
      expect(item.data).to.equal(ListDataSourcePlaceholder);

      await new Promise(resolve => setTimeout(resolve));

      item = ds.items[0] as ListDataSourceDataItem<Person>;
      expect(item.data).to.deep.equal(people[0]);
    });

    describe('fetchPage', () => {
      beforeEach(() => ds.update());

      it('should be called when accessing the first item', () => {
        spy(ds, 'fetchPage');

        // eslint-disable-next-line chai-friendly/no-unused-expressions
        ds.items[0];

        expect(ds.fetchPage).to.have.been.calledOnce;
        expect(ds.fetchPage).to.have.been.calledWithMatch({ page: 0, pageSize: 2 });
      });

      it('should not be called again when accessing another item on the same page', () => {
        spy(ds, 'fetchPage');

        ds.items.at(0);
        expect(ds.fetchPage).to.have.been.calledOnce;

        ds.items.at(1);
        expect(ds.fetchPage).to.have.been.calledOnce;
      });

      it('should be called for the second page when accessing an item with a greater index than the page size', () => {
        spy(ds, 'fetchPage');

        ds.items.at(3);

        expect(ds.fetchPage).to.have.been.calledOnce;
        expect(ds.fetchPage).to.have.been.calledWithMatch({ page: 1, pageSize: 2 });
      });

      it('should be called for the last page when accessing the last item', () => {
        spy(ds, 'fetchPage');

        ds.items.at(-1);

        expect(ds.fetchPage).to.have.been.calledOnce;
        expect(ds.fetchPage).to.have.been.calledWithMatch({ page: 4, pageSize: 2 });
      });

      it('should update the size when the total items are returned', async () => {
        ds.items.at(0);

        await new Promise(resolve => setTimeout(resolve));

        expect(ds.size).to.equal(people.length);
      });

      it('should provide the page and page size when fetching a page', () => {
        spy(ds, 'fetchPage');

        ds.items.at(2);

        expect(ds.fetchPage).to.have.been.calledOnce;
        expect(ds.fetchPage).to.have.been.calledWithMatch({ page: 1, pageSize: 2 });
      });

      it('should provide any custom options when fetching a page', () => {
        spy(ds, 'fetchPage');

        ds.getFetchOptions = (group, page, pageSize) => ({ group, page, pageSize, foo: 'bar' });
        ds.items.at(0);

        expect(ds.fetchPage).to.have.been.calledOnce;
        expect(ds.fetchPage).to.have.been.calledWithMatch({ foo: 'bar' });
      });

      it('should provide filter options when fetching a page', () => {
        let options: FetchListDataSourceCallbackOptions | undefined;

        ds.fetchPage = _options => {
          options = _options;

          return Promise.resolve({ items: [...people], totalItems: people.length });
        };

        ds.addFilter('membership', 'membership', 'Regular');
        ds.addFilter('profession', 'profession', 'Gastroenterologist');
        ds.items.at(0);

        expect(options).to.not.be.undefined;
        expect(options?.filters).to.have.length(2);
        expect(options?.filters).to.deep.equal([
          { id: 'membership', by: 'membership', value: 'Regular' },
          { id: 'profession', by: 'profession', value: 'Gastroenterologist' }
        ]);
      });

      it('should invalidate cached data and call fetchPage again when adding a filter and calling update()', () => {
        const fetchPageSpy = spy(ds, 'fetchPage');

        // First fetch to populate cache
        ds.items.at(0);
        expect(fetchPageSpy).to.have.been.calledOnce;

        // Add a filter and call update() - this should invalidate cache
        ds.addFilter('membership', 'membership', 'Regular');
        ds.update();

        // Access the data again - this should trigger another fetch due to cache invalidation
        ds.items.at(0);
        expect(fetchPageSpy).to.have.been.calledTwice;
        expect(fetchPageSpy.secondCall.args[0].filters).to.have.length(1);
        expect(fetchPageSpy.secondCall.args[0].filters).to.deep.equal([
          { id: 'membership', by: 'membership', value: 'Regular' }
        ]);
      });

      it('should provide sort options when fetching a page', () => {
        spy(ds, 'fetchPage');

        ds.setSort('firstName', 'desc');
        ds.items.at(0);

        expect(ds.fetchPage).to.have.been.calledOnce;
        expect(ds.fetchPage).to.have.been.calledWithMatch({ sort: { by: 'firstName', direction: 'desc' } });
      });

      it('should emit an update event after fetching a page', async () => {
        const onUpdate = spy();

        ds.update();
        ds.addEventListener('sl-update', onUpdate);
        ds.items.at(0);

        expect(onUpdate).not.to.have.been.called;

        await new Promise(resolve => setTimeout(resolve));

        expect(onUpdate).to.have.been.calledOnce;
      });
    });
  });

  describe('pagination', () => {
    beforeEach(() => {
      ds = new FetchListDataSource<Person>({
        fetchPage: ({ page, pageSize }) => {
          const start = page * pageSize,
            end = Math.min(start + pageSize, people.length);

          return Promise.resolve({ items: people.slice(start, end), totalItems: people.length });
        },
        pageSize: 2,
        pagination: true
      });
    });

    it('should have a page', () => {
      expect(ds.page).to.equal(0);
    });

    it('should have a page size', () => {
      expect(ds.pageSize).to.equal(2);
    });

    it('should have an array of items with the same length as the page size', async () => {
      ds.update();

      // eslint-disable-next-line chai-friendly/no-unused-expressions
      ds.items[0];

      // Wait for the fetch to complete
      await new Promise(resolve => setTimeout(resolve));

      expect(ds.items.length).to.equal(ds.pageSize);
    });

    it('should have an array of items that is smaller than the page size on the last page', async () => {
      ds.setPage(2);
      ds.update();

      // eslint-disable-next-line chai-friendly/no-unused-expressions
      ds.items[0];

      // Wait for the fetch to complete
      await new Promise(resolve => setTimeout(resolve));

      expect(ds.items.length).to.equal(1);
    });

    describe('fetchPage', () => {
      beforeEach(() => ds.update());

      it('should be called with the current page', () => {
        spy(ds, 'fetchPage');

        ds.setPage(1);

        // eslint-disable-next-line chai-friendly/no-unused-expressions
        ds.items[0];

        expect(ds.fetchPage).to.have.been.calledOnce;
        expect(ds.fetchPage).to.have.been.calledWithMatch({ page: 1, pageSize: 2 });
      });
    });
  });
});
