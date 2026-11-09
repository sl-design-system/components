import { describe, expect, it } from 'vitest';
import { ArrayListDataSource } from './array-list-data-source.js';
import { FetchListDataSource } from './fetch-list-data-source.js';
import { people } from './list-data-source.spec.js';

const totals = (sum: number) => ({
  grade: { evaluated: 2, nonEmpty: 2, sum, totalRecords: 2, trueCount: 0 }
});

describe('summary', () => {
  it('should not provide a summary for an ArrayListDataSource', () => {
    expect(new ArrayListDataSource(people).summary).to.be.undefined;
  });

  it('should not have a summary before the first page is fetched', () => {
    const ds = new FetchListDataSource({
      pageSize: 2,
      fetchPage: () =>
        Promise.resolve({
          items: people.slice(0, 2),
          totalItems: people.length
        })
    });

    expect(ds.summary).to.be.undefined;
  });

  it('should store the summary returned by the fetch callback', async () => {
    const ds = new FetchListDataSource({
      pageSize: 2,
      fetchPage: () =>
        Promise.resolve({
          items: people.slice(0, 2),
          summary: totals(10),
          totalItems: people.length
        })
    });

    void ds.items[0];
    await new Promise(resolve => setTimeout(resolve));

    expect(ds.summary).to.deep.equal(totals(10));
  });

  it('should replace the summary with the latest response after the filters change', async () => {
    const ds = new FetchListDataSource({
      pageSize: 2,
      fetchPage: ({ filters }) =>
        Promise.resolve({
          items: people.slice(0, 2),
          summary: totals(filters?.length ? 3 : 10),
          totalItems: people.length
        })
    });

    void ds.items[0];
    await new Promise(resolve => setTimeout(resolve));

    ds.addFilter('firstName', 'firstName', 'Ann');
    ds.update();
    void ds.items[0];
    await new Promise(resolve => setTimeout(resolve));

    expect(ds.summary).to.deep.equal(totals(3));
  });

  it('should dispatch sl-update when the summary arrives', async () => {
    const ds = new FetchListDataSource({
      pageSize: 2,
      fetchPage: () =>
        Promise.resolve({
          items: people.slice(0, 2),
          summary: totals(10),
          totalItems: 5
        })
    });

    let updated = false;
    ds.addEventListener('sl-update', () => (updated = true));

    void ds.items[0];
    await new Promise(resolve => setTimeout(resolve));

    expect(updated).to.be.true;
  });
});
