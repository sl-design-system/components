import { setupIgnoreWindowResizeObserverLoopErrors } from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { Grid } from './grid.js';
import { GridSorter } from './sorter.js';
import { waitForGridToRenderData } from './utils.js';

setupIgnoreWindowResizeObserverLoopErrors(beforeEach, afterEach, { suppressErrorLogging: true });

const ITEMS = [
  { firstName: 'John', lastName: 'Doe', age: 20 },
  { firstName: 'Jane', lastName: 'Smith', age: 40 },
  { firstName: 'Jimmy', lastName: 'Adams', age: 30 },
  { firstName: 'Jane', lastName: 'Brown', age: 15 }
];

describe('sl-sort-column', () => {
  let el: Grid;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid .items=${ITEMS}>
          <sl-grid-sort-column path="firstName"></sl-grid-sort-column>
          <sl-grid-sort-column path="lastName"></sl-grid-sort-column>
          <sl-grid-sort-column path="age"></sl-grid-sort-column>
        </sl-grid>
      `);

      await waitForGridToRenderData(el);
    });

    it('should have a header row count of 1', () => {
      const headerRowCount = Array.from(el.querySelectorAll('sl-grid-sort-column')).map(col => col.headerRowCount);

      expect(headerRowCount).to.deep.equal([1, 1, 1]);
    });

    it('should set the role of the th elements to "columnheader"', () => {
      const ths = Array.from(el.renderRoot.querySelectorAll('th'));

      expect(ths.every(th => th.role === 'columnheader')).to.be.true;
    });

    it('should not have aria-sort set on the th elements', () => {
      const ths = Array.from(el.renderRoot.querySelectorAll('th'));

      expect(ths.every(th => !th.hasAttribute('aria-sort'))).to.be.true;
    });

    it('should set the correct parts on the th elements', () => {
      const parts = Array.from(el.renderRoot.querySelectorAll('th')).map(th => th.part.value);

      expect(parts).to.deep.equal(['header sort first-name', 'header sort last-name', 'header sort age']);
    });

    it('should render the sorter in the header row', () => {
      const headers = Array.from(el.renderRoot.querySelectorAll('thead tr th > *'));

      expect(headers.every(h => h instanceof GridSorter)).to.be.true;
      expect(headers.map(h => h.textContent?.trim())).to.deep.equal(['First name', 'Last name', 'Age']);
    });

    it('should not be sorted on any column', () => {
      const headers = Array.from(el.renderRoot.querySelectorAll<GridSorter>('thead tr th > *'));

      expect(headers.every(h => h.direction === undefined)).to.be.true;
    });
  });

  describe('sorted', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid .items=${ITEMS}>
          <sl-grid-sort-column path="firstName"></sl-grid-sort-column>
          <sl-grid-sort-column path="lastName"></sl-grid-sort-column>
          <sl-grid-sort-column path="age" direction="asc"></sl-grid-sort-column>
        </sl-grid>
      `);

      await waitForGridToRenderData(el);

      // Give grid time to sort the data
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should have sorted the data', () => {
      const rows = Array.from(el.renderRoot.querySelectorAll('tbody tr')).map(row =>
        Array.from(row.querySelectorAll('td')).map(cell => cell.textContent?.trim())
      );

      expect(rows).to.deep.equal([
        ['Jane', 'Brown', '15'],
        ['John', 'Doe', '20'],
        ['Jimmy', 'Adams', '30'],
        ['Jane', 'Smith', '40']
      ]);
    });

    it('should have aria-sort set on the sorted column', () => {
      const ths = Array.from(el.renderRoot.querySelectorAll('th'));

      expect(ths.map(th => th.getAttribute('aria-sort'))).to.deep.equal([null, null, 'ascending']);
    });

    it('should set the correct direction on the sorter element', () => {
      const headers = Array.from(el.renderRoot.querySelectorAll<GridSorter>('thead tr th > *'));

      expect(headers.map(h => h.direction)).to.deep.equal([undefined, undefined, 'asc']);
    });

    it('should change the aria-sort when the direction changes', async () => {
      const sorter = el.renderRoot.querySelector<GridSorter>('thead th:last-of-type sl-grid-sorter');

      sorter?.renderRoot.querySelector('sl-button')?.click();
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el.renderRoot.querySelector('th:last-of-type')).to.have.attribute('aria-sort', 'descending');
    });

    it('should change the sorting when clicking the sorter in another column', async () => {
      const sorter = el.renderRoot.querySelector<GridSorter>('thead th:first-of-type sl-grid-sorter');

      sorter?.renderRoot.querySelector('sl-button')?.click();
      await new Promise(resolve => setTimeout(resolve, 50));

      const ths = Array.from(el.renderRoot.querySelectorAll('th'));

      expect(ths.map(th => th.getAttribute('aria-sort'))).to.deep.equal(['ascending', null, null]);
    });
  });
});
