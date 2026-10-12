import { spy } from 'sinon';
import { beforeEach, describe, expect, expectTypeOf, it } from 'vitest';
import { type DataSourceFilter } from './data-source.js';
import {
  FetchListDataSource,
  type FetchListDataSourceCallback,
  type FetchListDataSourceCallbackOptions,
  type FetchListDataSourceCallbackResult
} from './fetch-list-data-source.js';
import {
  type ListDataSourceDataItem,
  ListDataSourcePlaceholder,
  isListDataSourceGroupItem
} from './list-data-source.js';
import { type Person, people } from './list-data-source.spec.js';

describe('FetchListDataSource', () => {
  let ds: FetchListDataSource<Person>;

  it.each([false, true])(
    'should recover from empty results when refetch omits totalItems (pagination: %s)',
    async pagination => {
      ds = new FetchListDataSource({
        pageSize: 2,
        pagination,
        fetchPage: ({ filters }) =>
          Promise.resolve(
            filters?.length ? { items: [], totalItems: 0 } : { items: people.slice(0, 2) }
          )
      });

      ds.addFilter('firstName', 'firstName', 'xyz');
      void ds.items[0];
      await new Promise(resolve => setTimeout(resolve));
      expect(ds.size).to.equal(0);

      ds.removeFilter('firstName');
      ds.update();
      await new Promise(resolve => setTimeout(resolve));

      expect(ds.size).to.equal(2);
      expect(ds.items.length).to.equal(2);
      expect((ds.items[0] as ListDataSourceDataItem<Person>).data).to.equal(people[0]);
    }
  );

  it.each([
    { size: 1, page: 1, expectedSize: 4 },
    { size: 10, page: 1, expectedSize: 10 }
  ])(
    'should infer at least the fetched page extent without reducing a known size ($size)',
    async ({ size, page, expectedSize }) => {
      ds = new FetchListDataSource({
        size,
        pageSize: 2,
        pagination: true,
        fetchPage: () => Promise.resolve({ items: people.slice(2, 4) })
      });

      ds.setPage(page);
      ds.update();
      void ds.items[0];
      await new Promise(resolve => setTimeout(resolve));

      expect(ds.size).to.equal(expectedSize);
      expect(ds.items.length).to.equal(2);
      expect((ds.items[0] as ListDataSourceDataItem<Person>).data).to.equal(people[2]);
    }
  );

  it('should reuse unchanged nested options, cycles and function-based filters and sorting', async () => {
    const request = Promise.withResolvers<FetchListDataSourceCallbackResult<Person>>();
    const fetchPage = spy(() => request.promise);
    const query: { values: string[]; self?: unknown } = { values: ['Regular'] };
    query.self = query;
    ds = new FetchListDataSource({ fetchPage, pageSize: 2 });
    const getFetchOptions = ds.getFetchOptions.bind(ds);
    ds.getFetchOptions = (...args) => ({ ...getFetchOptions(...args), query });
    ds.addFilter('membership', person => person.membership === 'Regular', ['Regular']);
    ds.setSort((a, b) => a.firstName.localeCompare(b.firstName), 'asc');

    void ds.items[0];
    ds.update();
    void ds.items[0];
    expect(fetchPage).to.have.been.calledOnce;

    request.resolve({ items: [people[0]], totalItems: 1 });
    await new Promise(resolve => setTimeout(resolve));
    expect((ds.items[0] as ListDataSourceDataItem<Person>).data).to.equal(people[0]);
  });

  it.each(['array filter', 'nested custom option'])(
    'should invalidate a pending request after mutating an %s in place',
    async kind => {
      const previous = Promise.withResolvers<FetchListDataSourceCallbackResult<Person>>();
      const current = Promise.withResolvers<FetchListDataSourceCallbackResult<Person>>();
      let calls = 0;
      const fetchPage = spy(() => (++calls === 1 ? previous.promise : current.promise));
      const values = ['Regular'];
      const query = { membership: { values } };
      ds = new FetchListDataSource({ fetchPage, pageSize: 2 });

      if (kind === 'array filter') {
        ds.addFilter('membership', 'membership', values);
      } else {
        const getFetchOptions = ds.getFetchOptions.bind(ds);
        ds.getFetchOptions = (...args) => ({ ...getFetchOptions(...args), query });
      }

      void ds.items[0];
      values.push('Premium');
      ds.update();
      void ds.items[0];
      expect(fetchPage).to.have.been.calledTwice;

      current.resolve({ items: [people[1]], totalItems: 1 });
      await new Promise(resolve => setTimeout(resolve));
      previous.resolve({ items: people, totalItems: people.length });
      await new Promise(resolve => setTimeout(resolve));

      expect(ds.size).to.equal(1);
      expect((ds.items[0] as ListDataSourceDataItem<Person>).data).to.equal(people[1]);
    }
  );

  it.each([false, true])(
    'should reuse a pending page request across updates (pagination: %s)',
    async pagination => {
      const request = Promise.withResolvers<FetchListDataSourceCallbackResult<Person>>();
      const fetchPage = spy(() => request.promise);
      ds = new FetchListDataSource({ fetchPage, pageSize: 2, pagination });

      void ds.items[0];
      ds.update();
      ds.update();
      void ds.items[0];
      void ds.items[1];
      expect(fetchPage).to.have.been.calledOnce;

      request.resolve({ items: people.slice(0, 2), totalItems: people.length });
      await new Promise(resolve => setTimeout(resolve));

      expect((ds.items[0] as ListDataSourceDataItem<Person>).data).to.equal(people[0]);
      expect((ds.items[1] as ListDataSourceDataItem<Person>).data).to.equal(people[1]);

      // A completed request must still be invalidated by an explicit update.
      ds.update();
      void ds.items[0];
      expect(fetchPage).to.have.been.calledTwice;
      await new Promise(resolve => setTimeout(resolve));
    }
  );

  it.each(['filter', 'sort', 'pageSize', 'callback', 'custom option'])(
    'should ignore an outdated response after changing the %s',
    async change => {
      const previous = Promise.withResolvers<FetchListDataSourceCallbackResult<Person>>();
      const current = Promise.withResolvers<FetchListDataSourceCallbackResult<Person>>();
      let calls = 0;
      const fetchPage = spy(() => (++calls === 1 ? previous.promise : current.promise));
      ds = new FetchListDataSource({ fetchPage, pageSize: 2 });

      void ds.items[0];

      switch (change) {
        case 'filter':
          ds.addFilter('firstName', 'firstName', 'xyz');
          break;
        case 'sort':
          ds.setSort('firstName', 'desc');
          break;
        case 'pageSize':
          ds.setPageSize(3);
          break;
        case 'callback':
          ds.fetchPage = () => current.promise;
          break;
        case 'custom option': {
          const getFetchOptions = ds.getFetchOptions.bind(ds);
          ds.getFetchOptions = (...args) => ({ ...getFetchOptions(...args), query: 'changed' });
          break;
        }
      }

      ds.update();
      void ds.items[0];
      current.resolve({ items: [people[1]], totalItems: 1 });
      await new Promise(resolve => setTimeout(resolve));

      const onUpdate = spy();
      ds.addEventListener('sl-update', onUpdate);
      previous.resolve({ items: people.slice(0, 2), totalItems: people.length });
      await new Promise(resolve => setTimeout(resolve));

      expect(ds.size).to.equal(1);
      expect((ds.items[0] as ListDataSourceDataItem<Person>).data).to.equal(people[1]);
      expect(onUpdate).not.to.have.been.called;
    }
  );

  it('should keep pending requests independent across data source instances', async () => {
    const request = Promise.withResolvers<FetchListDataSourceCallbackResult<Person>>();
    const fetchPage = spy(() => request.promise);
    const sources = [
      new FetchListDataSource({ fetchPage, pageSize: 30 }),
      new FetchListDataSource({ fetchPage, pageSize: 30 })
    ];

    for (const source of sources) {
      void source.items[0];
      source.update();
      void source.items[0];
    }

    expect(fetchPage).to.have.been.calledTwice;
    request.resolve({ items: people, totalItems: people.length });
    await new Promise(resolve => setTimeout(resolve));

    for (const source of sources) {
      expect((source.items[0] as ListDataSourceDataItem<Person>).data).to.equal(people[0]);
    }
  });

  it('should reuse a pending request when an equivalent filter is reapplied', async () => {
    const request = Promise.withResolvers<FetchListDataSourceCallbackResult<Person>>();
    const fetchPage = spy(() => request.promise);
    ds = new FetchListDataSource({ fetchPage, pageSize: 2 });

    ds.addFilter('firstName', 'firstName', 'John');
    void ds.items[0];
    ds.addFilter('firstName', 'firstName', 'John');
    ds.update();
    void ds.items[0];

    expect(fetchPage).to.have.been.calledOnce;
    request.resolve({ items: [people[0]], totalItems: 1 });
    await new Promise(resolve => setTimeout(resolve));
    expect((ds.items[0] as ListDataSourceDataItem<Person>).data).to.equal(people[0]);
  });

  it('should reuse a pending refetch after clearing an empty filter result', async () => {
    const request = Promise.withResolvers<FetchListDataSourceCallbackResult<Person>>();
    const fetchPage = spy<FetchListDataSourceCallback<Person>>(({ filters }) =>
      filters?.length ? Promise.resolve({ items: [], totalItems: 0 }) : request.promise
    );
    ds = new FetchListDataSource({ fetchPage, pageSize: 2 });

    ds.addFilter('firstName', 'firstName', 'xyz');
    void ds.items[0];
    await new Promise(resolve => setTimeout(resolve));

    ds.removeFilter('firstName');
    ds.update();
    ds.update();
    expect(fetchPage).to.have.been.calledTwice;

    request.resolve({ items: people.slice(0, 2), totalItems: people.length });
    await new Promise(resolve => setTimeout(resolve));
    expect(ds.size).to.equal(people.length);
    expect((ds.items[0] as ListDataSourceDataItem<Person>).data).to.equal(people[0]);
  });

  it.each([
    { pagination: false, filteredSize: 0 },
    { pagination: true, filteredSize: 0 },
    { pagination: false, filteredSize: 1 },
    { pagination: true, filteredSize: 1 }
  ])(
    'should refetch after removing a filter with $filteredSize results (pagination: $pagination)',
    async ({ pagination, filteredSize }) => {
      const fetchPage = spy<FetchListDataSourceCallback<Person>>(({ filters, page, pageSize }) => {
        const items = filters?.length ? people.slice(0, filteredSize) : people;

        return Promise.resolve({
          items: items.slice(page * pageSize, (page + 1) * pageSize),
          totalItems: items.length
        });
      });

      ds = new FetchListDataSource<Person>({ fetchPage, pageSize: 2, pagination });

      void ds.items[0];
      await new Promise(resolve => setTimeout(resolve));

      ds.addFilter('firstName', 'firstName', 'xyz');
      ds.update();
      void ds.items[0];
      await new Promise(resolve => setTimeout(resolve));

      expect(ds.size).to.equal(filteredSize);
      expect(ds.items.length).to.equal(filteredSize);

      ds.removeFilter('firstName');
      ds.update();

      if (filteredSize === 0) {
        expect(fetchPage).to.have.been.calledThrice;
      }

      void ds.items[0];
      await new Promise(resolve => setTimeout(resolve));

      expect(fetchPage).to.have.been.calledThrice;
      expect(fetchPage.lastCall.args[0]).to.include({ page: 0, pageSize: 2 });
      expect(fetchPage.lastCall.args[0].filters).to.deep.equal([]);
      expect(ds.size).to.equal(people.length);
      expect(ds.items.length).to.equal(pagination ? ds.pageSize : people.length);
      expect((ds.items[0] as ListDataSourceDataItem<Person>).data).to.deep.equal(people[0]);
    }
  );

  it('should provide typed filter options to the fetchPage callback', () => {
    const fetchPage: FetchListDataSourceCallback<Person> = options => {
      expectTypeOf(options.filters).toEqualTypeOf<Array<DataSourceFilter<Person>> | undefined>();
      expectTypeOf(options.filters?.[0]?.by).toEqualTypeOf<
        DataSourceFilter<Person>['by'] | undefined
      >();

      return Promise.resolve({ items: [] });
    };

    expectTypeOf(fetchPage).toEqualTypeOf<FetchListDataSourceCallback<Person>>();
  });

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
        expect(ds.fetchPage).to.have.been.calledWithMatch({
          sort: { by: 'firstName', direction: 'desc' }
        });
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

  describe('group selection', () => {
    beforeEach(() => {
      ds = new FetchListDataSource<Person>({
        fetchPage: () => Promise.resolve({ items: [] }),
        groups: [{ id: 'Premium', label: 'Premium', size: 2 }],
        pageSize: 2,
        selects: 'multiple'
      });
    });

    it('should keep the group selected after update, even when no members are present', () => {
      const group = ds.items.at(0);

      expect(isListDataSourceGroupItem(group)).to.be.true;
      if (!isListDataSourceGroupItem(group)) {
        throw new Error('Expected the first item to be a group');
      }

      expect(group.members).to.be.undefined;

      ds.select(group);
      expect(ds.isSelected(group)).to.be.true;

      ds.update();

      const updatedGroup = ds.items.at(0);

      expect(isListDataSourceGroupItem(updatedGroup)).to.be.true;
      if (!isListDataSourceGroupItem(updatedGroup)) {
        throw new Error('Expected the first item to remain a group after update');
      }

      expect(updatedGroup.members).to.be.undefined;
      expect(ds.isSelected(updatedGroup)).to.be.true;
    });
  });
});
