import { setupIgnoreWindowResizeObserverLoopErrors } from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { fixture } from '@open-wc/testing';
import { expect } from 'chai';
import { html } from 'lit';
import '../register.js';
import { GridFilter } from './filter.js';
import { Grid } from './grid.js';
import { GridSorter } from './sorter.js';
import { waitForGridToRenderData } from './utils.js';

setupIgnoreWindowResizeObserverLoopErrors(beforeEach, afterEach, { suppressErrorLogging: true });

const ITEMS = [
  {
    fullName: 'John Doe',
    profession: 'Cardiologist',
    status: 'Available',
    membership: 'Regular'
  },
  {
    fullName: 'Jane Smith',
    profession: 'Anesthesiologist',
    status: 'Busy',
    membership: 'Premium'
  },
  {
    fullName: 'Jimmy Adams',
    profession: 'Cardiologist',
    status: 'Busy',
    membership: 'Premium'
  }
];

describe('sl-grid-filter-column', () => {
  let el: Grid;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid .items=${ITEMS}>
          <sl-grid-filter-column path="profession"></sl-grid-filter-column>
          <sl-grid-filter-column mode="select" path="membership"></sl-grid-filter-column>
        </sl-grid>
      `);

      await waitForGridToRenderData(el);
    });

    it('should have a header row count of 2', () => {
      const headerRowCount = Array.from(el.querySelectorAll('sl-grid-filter-column')).map(col => col.headerRowCount);

      expect(headerRowCount).to.deep.equal([2, 2]);
    });

    it('should set the role of the th elements to "columnheader"', () => {
      const ths = Array.from(el.renderRoot.querySelectorAll('th'));

      expect(ths.every(th => th.role === 'columnheader')).to.be.true;
    });

    it('should set the correct parts on the th elements', () => {
      const parts = Array.from(el.renderRoot.querySelectorAll('th')).map(th => th.part.value);

      expect(parts).to.deep.equal([
        'header sort profession',
        'header sort membership',
        'header filter profession',
        'header filter membership'
      ]);
    });

    it('should render the sorter in the first header row', () => {
      const headers = Array.from(el.renderRoot.querySelectorAll('thead tr:first-of-type th > *'));

      expect(headers.every(h => h instanceof GridSorter)).to.be.true;
      expect(headers.map(h => h.textContent?.trim())).to.deep.equal(['Profession', 'Membership']);
    });

    it('should render the filter in the second header row', () => {
      const headers = Array.from<GridFilter>(el.renderRoot.querySelectorAll('thead tr:last-of-type th > *'));

      expect(headers.every(h => h instanceof GridFilter)).to.be.true;
      expect(headers.map(h => h.mode)).to.deep.equal(['text', 'select']);
    });

    it('should have no active filter by default', () => {
      const active = Array.from(el.renderRoot.querySelectorAll('sl-grid-filter')).map(filter =>
        filter.hasAttribute('active')
      );

      expect(active).to.deep.equal([false, false]);
    });
  });

  describe('filtered', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid .items=${ITEMS}>
          <sl-grid-filter-column path="profession" value="Card"></sl-grid-filter-column>
          <sl-grid-filter-column mode="select" path="membership" value="Premium"></sl-grid-filter-column>
        </sl-grid>
      `);

      await waitForGridToRenderData(el);
    });

    it('should have filtered the data', async () => {
      // Give grid time to filter the data
      await new Promise(resolve => setTimeout(resolve, 50));

      const data = Array.from(el.renderRoot.querySelectorAll('td')).map(td => td.textContent?.trim());

      expect(el.renderRoot.querySelectorAll('tbody tr')).to.have.lengthOf(1);
      expect(data).to.deep.equal(['Cardiologist', 'Premium']);
    });

    it('should show the value in the search field', () => {
      const filter = el.renderRoot.querySelector<GridFilter>('thead tr:last-of-type th:first-of-type sl-grid-filter')!,
        searchField = filter.renderRoot.querySelector('sl-search-field');

      expect(searchField).to.exist;
      expect(searchField?.value).to.equal('Card');
    });

    it('should remove the filter when the search field is cleared', async () => {
      const filter = el.renderRoot.querySelector<GridFilter>('thead tr:last-of-type th:first-of-type sl-grid-filter')!,
        searchField = filter.renderRoot.querySelector('sl-search-field');

      expect(filter.value).to.equal('Card');

      searchField?.renderRoot.querySelector('button')?.click();
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(filter.value).to.be.undefined;

      expect(el.renderRoot.querySelectorAll('tbody tr')).to.have.lengthOf(2);
    });

    it('should show the value in the select field', () => {
      const filter = el.renderRoot.querySelector<GridFilter>('thead tr:last-of-type th:last-of-type sl-grid-filter')!,
        selectButton = filter.renderRoot.querySelector('sl-select-button');

      expect(selectButton?.renderRoot).to.have.trimmed.text('Premium');
    });

    it('should remove the filter when the select field is cleared', async () => {
      const filter = el.renderRoot.querySelector<GridFilter>('thead tr:last-of-type th:last-of-type sl-grid-filter')!,
        selectButton = filter.renderRoot.querySelector('sl-select-button');

      expect(filter.value).to.equal('Premium');

      selectButton?.renderRoot.querySelector('button')?.click();
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(filter.value).to.be.undefined;

      expect(el.renderRoot.querySelectorAll('tbody tr')).to.have.lengthOf(2);
    });
  });

  describe('select mode', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid .items=${ITEMS}>
          <sl-grid-filter-column mode="select" path="membership"></sl-grid-filter-column>
        </sl-grid>
      `);

      await waitForGridToRenderData(el);
    });

    it('should support explicit options', async () => {
      const column = el.querySelector('sl-grid-filter-column')!;
      column.options = [
        { label: 'Regular', value: 'regular' },
        { label: 'Premium', value: 'premium' },
        { label: 'VIP', value: 'vip' }
      ];

      await new Promise(resolve => setTimeout(resolve));

      const filter = el.renderRoot.querySelector('sl-grid-filter')!,
        options = Array.from(filter.renderRoot.querySelectorAll('sl-option')).map(o => o.textContent?.trim());

      expect(options).to.deep.equal(['Regular', 'Premium', 'VIP']);
    });
  });
});
