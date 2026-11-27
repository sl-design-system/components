import { describe, expect, it } from 'vitest';
import { ArrayListDataSource } from './array-list-data-source.js';
import { FetchListDataSource } from './fetch-list-data-source.js';
import { people } from './list-data-source.spec.js';

const totals = (sum: number) => ({
  grade: { evaluated: 2, nonEmpty: 2, sum, totalRecords: 2, trueCount: 0 }
});

describe('grand totals', () => {
  it('should not provide grand totals for an ArrayListDataSource', () => {
    expect(new ArrayListDataSource(people).grandTotals).to.be.undefined;
  });

  it('should not have grand totals before the first page is fetched', () => {
    const ds = new FetchListDataSource({
      pageSize: 2,
      fetchPage: () =>
        Promise.resolve({
          items: people.slice(0, 2),
          totalItems: people.length
        })
    });

    expect(ds.grandTotals).to.be.undefined;
  });

  it('should store the grand totals returned by the fetch callback', async () => {
    const ds = new FetchListDataSource({
      pageSize: 2,
      fetchPage: () =>
        Promise.resolve({
          items: people.slice(0, 2),
          grandTotals: totals(10),
          totalItems: people.length
        })
    });

    void ds.items[0];
    await new Promise(resolve => setTimeout(resolve));

    expect(ds.grandTotals).to.deep.equal(totals(10));
  });

  it('should replace the grand totals with the latest response after the filters change', async () => {
    const ds = new FetchListDataSource({
      pageSize: 2,
      fetchPage: ({ filters }) =>
        Promise.resolve({
          items: people.slice(0, 2),
          grandTotals: totals(filters?.length ? 3 : 10),
          totalItems: people.length
        })
    });

    void ds.items[0];
    await new Promise(resolve => setTimeout(resolve));

    ds.addFilter('firstName', 'firstName', 'Ann');
    ds.update();
    void ds.items[0];
    await new Promise(resolve => setTimeout(resolve));

    expect(ds.grandTotals).to.deep.equal(totals(3));
  });

  it('should clear the grand totals when a later response omits them', async () => {
    const ds = new FetchListDataSource({
      pageSize: 2,
      fetchPage: ({ filters }) =>
        Promise.resolve({
          items: people.slice(0, 2),
          ...(filters?.length ? {} : { grandTotals: totals(10) }),
          totalItems: people.length
        })
    });

    void ds.items[0];
    await new Promise(resolve => setTimeout(resolve));

    expect(ds.grandTotals).to.deep.equal(totals(10));

    ds.addFilter('firstName', 'firstName', 'Ann');
    ds.update();
    void ds.items[0];
    await new Promise(resolve => setTimeout(resolve));

    expect(ds.grandTotals).to.be.undefined;
  });

  it('should clear the grand totals as soon as the filters change, before the new response', async () => {
    let fail = false;

    const ds = new FetchListDataSource({
      pageSize: 2,
      fetchPage: () =>
        fail
          ? Promise.reject(new Error('Failed'))
          : Promise.resolve({
              items: people.slice(0, 2),
              grandTotals: totals(10),
              totalItems: people.length
            })
    });

    void ds.items[0];
    await new Promise(resolve => setTimeout(resolve));

    expect(ds.grandTotals).to.deep.equal(totals(10));

    fail = true;
    ds.addFilter('firstName', 'firstName', 'Ann');
    ds.update();

    expect(ds.grandTotals).to.be.undefined;
  });

  it('should keep the grand totals when update() is called without a filter change', async () => {
    const ds = new FetchListDataSource({
      pageSize: 2,
      fetchPage: () =>
        Promise.resolve({
          items: people.slice(0, 2),
          grandTotals: totals(10),
          totalItems: people.length
        })
    });

    void ds.items[0];
    await new Promise(resolve => setTimeout(resolve));

    ds.update();

    expect(ds.grandTotals).to.deep.equal(totals(10));
  });

  it('should dispatch sl-update when the grand totals arrive', async () => {
    const ds = new FetchListDataSource({
      pageSize: 2,
      fetchPage: () =>
        Promise.resolve({
          items: people.slice(0, 2),
          grandTotals: totals(10),
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
