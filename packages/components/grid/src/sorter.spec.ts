import { setupIgnoreWindowResizeObserverLoopErrors } from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { expect, fixture } from '@open-wc/testing';
import { ArrayListDataSource, DataSource } from '@sl-design-system/data-source';
import { Icon } from '@sl-design-system/icon';
import { html } from 'lit';
import '../register.js';
import { GridSortColumn } from './sort-column.js';
import { GridSorter } from './sorter.js';

setupIgnoreWindowResizeObserverLoopErrors(beforeEach, afterEach);
customElements.define('sl-grid-sorter', GridSorter);

describe('sl-grid-sorter', () => {
  let el: GridSorter;
  const items = [{ name: 'John' }, { name: 'Jane' }, { name: 'Jimmy' }, { name: 'Jane' }];

  const column = new GridSortColumn();
  const dataSource = new ArrayListDataSource(items) as DataSource;
  dataSource.setSort('', 'name', 'asc');

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid-sorter .column=${column} direction="asc" name="name" .sorter=${dataSource.sort}> Name </sl-grid-sorter>
      `);
      await el.updateComplete;

      // Give grid time to render the table structure
      await new Promise(resolve => setTimeout(resolve, 100));
      await el.updateComplete;
    });

    it('should render the correct icon', async () => {
      el.direction = 'asc';
      await el.updateComplete;
      expect(el.renderRoot.querySelector<Icon>('sl-icon')?.getAttribute('name')).to.equal('sort-up');

      el.direction = 'desc';
      await el.updateComplete;
      expect(el.renderRoot.querySelector<Icon>('sl-icon')?.getAttribute('name')).to.equal('sort-down');

      el.reset();
      await el.updateComplete;
      expect(el.renderRoot.querySelector<Icon>('sl-icon')?.getAttribute('name')).to.equal('sort');
    });
  });
});
