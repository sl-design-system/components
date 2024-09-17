import { setupIgnoreWindowResizeObserverLoopErrors } from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { Grid } from './grid.js';
import { GridSortColumn } from './sort-column.js';
import { GridSorter } from './sorter.js';

setupIgnoreWindowResizeObserverLoopErrors(beforeEach, afterEach);

describe('sl-sort-column', () => {
  let el: Grid;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid>
          <sl-grid-sort-column path="firstName"></sl-grid-sort-column>
          <sl-grid-sort-column path="lastName"></sl-grid-sort-column>
          <sl-grid-sort-column path="age"></sl-grid-sort-column>
        </sl-grid>
      `);
      el.items = [
        { firstName: 'John', lastName: 'Doe', age: 20 },
        { firstName: 'Jane', lastName: 'Smith', age: 40 },
        { firstName: 'Jimmy', lastName: 'Adams', age: 30 },
        { firstName: 'Jane', lastName: 'Brown', age: 15 }
      ];
      await el.updateComplete;

      // Give grid time to render the table structure
      await new Promise(resolve => setTimeout(resolve, 100));
      await el.updateComplete;
    });

    it('should render column headers', () => {
      const columns = Array.from(el.renderRoot.querySelectorAll('th'));
      const sortColumns = Array.from(el.querySelectorAll<GridSortColumn>('sl-grid-sort-column'));

      expect(columns.map(col => col.textContent?.trim())).to.deep.equal(['First name', 'Last name', 'Age']);
      expect(columns.map(col => col.getAttribute('part')?.trim())).to.deep.equal([
        'header sort first-name',
        'header sort last-name',
        'header sort age'
      ]);
      expect(sortColumns.map(col => col.direction)).to.deep.equal([undefined, undefined, undefined]);
    });

    it('should pass the right information to the sorter element', async () => {
      const sortColumns = Array.from(el.querySelectorAll<GridSortColumn>('sl-grid-sort-column'));
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 100));
      sortColumns.forEach(col => {
        const sorter = el.querySelector<GridSorter>(`#${col.id} sl-grid-sorter`);
        expect(col.direction).to.equal(sorter?.direction);
        expect(col.sorter).to.equal(sorter?.sorter);

        // TODO: checking for these doesn't work?
        // expect(col).to.equal(sorter?.column);
        // expect(col.path).to.equal(sorter?.path);
      });
    });

    // it('should set the directions correctly when the sorting is set for the first time ', async () => {
    //   const gridCols = Array.from(el.querySelectorAll<GridSortColumn>('sl-grid-sort-column'));
    //   el.dataSource?.setSort(gridCols[0].id, 'string', 'asc');
    //   const allUpdated = gridCols.map(el => {
    //     el.stateChanged();
    //     return el.updateComplete;
    //   });

    //   await el.updateComplete;
    //   await Promise.all(allUpdated);
    //   await new Promise(resolve => setTimeout(resolve, 1000));
    //   await el.updateComplete;

    //   expect(gridCols.map(col => col.direction)).to.deep.equal(['asc', undefined, undefined]);

    //   const ths = gridCols.map(col => col.shadowRoot?.querySelector('th'));

    //   // expect(ths.map(th => th.getAttribute('aria-sort'))).to.deep.equal(['ascending', undefined, undefined]);
    // });

    it('should set the directions correctly when the sorting is set switched from another column ', async () => {
      const gridCols = Array.from(el.querySelectorAll<GridSortColumn>('sl-grid-sort-column'));

      el.dataSource?.setSort(gridCols[0].id, 'string', 'asc');
      let allUpdated = gridCols.map(el => {
        el.stateChanged();
        return el.updateComplete;
      });

      await Promise.all(allUpdated);

      expect(gridCols.map(col => col.direction)).to.deep.equal(['asc', undefined, undefined]);

      el.dataSource?.setSort(gridCols[1].id, 'string', 'asc');
      allUpdated = gridCols.map(el => {
        el.stateChanged();
        return el.updateComplete;
      });

      await Promise.all(allUpdated);
      expect(gridCols.map(col => col.direction)).to.deep.equal([undefined, 'asc', undefined]);
    });
  });
});
