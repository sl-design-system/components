import {
  FetchListDataSource,
  type FetchListDataSourceCallbackResult
} from '@sl-design-system/data-source';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { spy } from 'sinon';
import { expect, it } from 'vitest';
import { type Grid } from './grid.js';
import './register.js';

it.each([false, true])(
  'should not duplicate pending requests when two grids mount and rerender (shared source: %s)',
  async shared => {
    type Item = { id: number };
    const request = Promise.withResolvers<FetchListDataSourceCallbackResult<Item>>();
    const fetchPage = spy(() => request.promise);
    const first = new FetchListDataSource({ fetchPage, pageSize: 30 });
    const second = shared ? first : new FetchListDataSource({ fetchPage, pageSize: 30 });

    // Start loading before mounting, so the grid's initial update overlaps the request.
    void first.items[0];
    void second.items[0];

    const container = await fixture<HTMLDivElement>(html`
      <div>
        <div style="height: 200px">
          <sl-grid .dataSource=${first}><sl-grid-column path="id"></sl-grid-column></sl-grid>
        </div>
        <div style="height: 200px">
          <sl-grid .dataSource=${second}><sl-grid-column path="id"></sl-grid-column></sl-grid>
        </div>
      </div>
    `);

    const grids = container.querySelectorAll<Grid<Item>>('sl-grid');
    await new Promise(resolve => setTimeout(resolve, 50));

    grids.forEach(grid => grid.requestUpdate());
    await Promise.all(Array.from(grids, grid => grid.updateComplete));
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(fetchPage.callCount).to.equal(shared ? 1 : 2);

    request.resolve({ items: [{ id: 1 }], totalItems: 1 });
    await expect
      .poll(() => grids[0].renderRoot.querySelector('td')?.textContent?.trim())
      .to.equal('1');
    await expect
      .poll(() => grids[1].renderRoot.querySelector('td')?.textContent?.trim())
      .to.equal('1');
    expect(fetchPage.callCount).to.equal(shared ? 1 : 2);
  }
);
