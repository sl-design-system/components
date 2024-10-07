import { expect } from '@open-wc/testing';
import { spy } from 'sinon';
import { type Person, people } from './data-source.spec.js';
import {
  FetchDataSource,
  type FetchDataSourceCallbackOptions,
  FetchDataSourcePlaceholder
} from './fetch-data-source.js';

describe('FetchDataSource', () => {
  let ds: FetchDataSource<Person>;

  beforeEach(() => {
    ds = new FetchDataSource<Person>({
      fetchPage: () => Promise.resolve({ items: [...people], totalItems: people.length }),
      pageSize: 2
    });
  });

  it('should have a size', () => {
    expect(ds.size).to.equal(FetchDataSource.defaultSize);
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

    expect(ds.items[0]).to.equal(FetchDataSourcePlaceholder);

    await new Promise(resolve => setTimeout(resolve));

    expect(ds.items[0]).to.deep.equal(people[0]);
  });

  describe('fetchPage', () => {
    beforeEach(() => ds.update());

    it('should be called when accessing the first item', () => {
      spy(ds, 'fetchPage');

      // eslint-disable-next-line chai-friendly/no-unused-expressions
      ds.items[0];

      expect(ds.fetchPage).to.have.been.calledOnce;
      expect(ds.fetchPage).to.have.been.calledWithMatch({ page: 1, pageSize: 2 });
    });

    it('should be called for the second page when accessing an item with a greater index than the page size', () => {
      spy(ds, 'fetchPage');

      ds.items.at(3);

      expect(ds.fetchPage).to.have.been.calledOnce;
      expect(ds.fetchPage).to.have.been.calledWithMatch({ page: 2, pageSize: 2 });
    });

    it('should be called for the last page when accessing the last item', () => {
      spy(ds, 'fetchPage');

      ds.items.at(-1);

      expect(ds.fetchPage).to.have.been.calledOnce;
      expect(ds.fetchPage).to.have.been.calledWithMatch({ page: 5, pageSize: 2 });
    });

    it('should update the size when the total items are returned', async () => {
      ds.items.at(0);

      await new Promise(resolve => setTimeout(resolve));

      expect(ds.size).to.equal(people.length);
    });

    it('should provide the page and page size when fetching a page', () => {
      spy(ds, 'fetchPage');

      ds.items.at(0);

      expect(ds.fetchPage).to.have.been.calledOnce;
      expect(ds.fetchPage).to.have.been.calledWithMatch({ page: 1, pageSize: 2 });
    });

    it('should provide any custom options when fetching a page', () => {
      spy(ds, 'fetchPage');

      ds.getFetchOptions = (page, pageSize) => ({ page, pageSize, foo: 'bar' });
      ds.items.at(0);

      expect(ds.fetchPage).to.have.been.calledOnce;
      expect(ds.fetchPage).to.have.been.calledWithMatch({ foo: 'bar' });
    });

    it('should provide filter options when fetching a page', () => {
      let options: FetchDataSourceCallbackOptions | undefined;

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
        { path: 'membership', value: 'Regular' },
        { path: 'profession', value: 'Gastroenterologist' }
      ]);
    });

    it('should provide sort options when fetching a page', () => {
      spy(ds, 'fetchPage');

      ds.setSort('id', 'firstName', 'desc');
      ds.items.at(0);

      expect(ds.fetchPage).to.have.been.calledOnce;
      expect(ds.fetchPage).to.have.been.calledWithMatch({ sort: { id: 'id', path: 'firstName', direction: 'desc' } });
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
