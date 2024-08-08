import { setupIgnoreWindowResizeObserverLoopErrors } from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { type Grid } from './grid.js';

setupIgnoreWindowResizeObserverLoopErrors(beforeEach, afterEach);

describe('sl-column', () => {
  let el: Grid;
  // let cells: HTMLElement[];

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid>
          <sl-grid-column path="firstName"></sl-grid-column>
          <sl-grid-column path="lastName"></sl-grid-column>
          <sl-grid-filter-column path="profession"></sl-grid-filter-column>
          <sl-grid-filter-column mode="text" path="status"></sl-grid-filter-column>
          <sl-grid-filter-column path="membership"></sl-grid-filter-column>
        </sl-grid>
      `);
      el.items = [
        {
          firstName: 'John',
          lastName: 'Doe',
          age: 20,
          profession: 'Endocrinologist',
          status: 'Available',
          membership: 'Regular'
        },
        {
          firstName: 'Jane',
          lastName: 'Smith',
          age: 40,
          profession: 'Anesthesiologist',
          status: 'Busy',
          membership: 'Premium'
        }
      ];
      await el.updateComplete;

      // Give grid time to render the table structure
      await new Promise(resolve => setTimeout(resolve, 100));
      await el.updateComplete;

      cells = Array.from(el.renderRoot.querySelectorAll('tbody tr:first-of-type td'));
    });

    it('should render column and filter column headers', () => {
      const columns = Array.from(el.renderRoot.querySelectorAll('th'))
        .map(col => col.textContent)
        .slice(0, 2);
      // const filterColumns = el.renderRoot?.querySelectorAll('sl-grid-filter');
      const filterColumns = Array.from(el.renderRoot?.querySelectorAll('sl-grid-filter')).map(col =>
        col.textContent.trim()
      );

      // console.log('coolumns', columns, el.renderRoot.querySelectorAll('th'));

      // console.log('coolumns--2', columns);
      // console.log('filterColumns', filterColumns, Array.from(filterColumns).map(col => col.textContent.trim()));
      // console.log('filterColumns trimmed', Array.from(filterColumns).map(col => col.textContent.trim()));
      // console.log('filterColumnsTrimmedfilterColumnsTrimmedfilterColumnsTrimmed', filterColumnsTrimmed);

      expect(columns).to.exist;
      expect(filterColumns).to.exist;

      expect(columns).to.deep.equal(['First name', 'Last name']);
      expect(filterColumns).to.deep.equal(['Profession', 'Status', 'Membership']);
    });

    // TODO: with no filter mode by default

    it('should have no filter mode by default', () => {
      const filterColumn = Array.from(el.querySelectorAll('sl-grid-filter-column'))[0]; //[0];
      const filterMode = filterColumn.getAttribute('mode');

      // console.log('filterColumns for mode', filterColumns, filterColumnsNew, filterMode);
      expect(filterMode).not.to.exist;
      // expect(columns).to.deep.equal(['First name', 'Last name', 'Age']);
    });

    // TODO: check whether there are right parts added when it's a filter column - also by default and when there is exact mode used

    it('should have a filter column header with a proper mode when it is set', () => {
      console.log('el', el);
      const columns = Array.from(el.renderRoot.querySelectorAll('th')).map(col => col.textContent);
      // const filterColumns = Array.from(el.renderRoot?.querySelectorAll('sl-grid-filter'))[0];
      const filterColumnsNew = Array.from(el.querySelectorAll('sl-grid-filter-column'))[1];

      console.log('filterColumns for mode default', filterColumnsNew);

      expect(columns).to.deep.equal(['First name', 'Last name', 'Age']);

      // TODO: need to check whether there is a button and popover inside
    });

    // it('should have the right justify-content value', () => {
    //   expect(cells.map(cell => getComputedStyle(cell).justifyContent)).to.deep.equal(['start', 'start', 'end']);
    // });
    //
    // it('should have the right grow value', () => {
    //   expect(cells.map(cell => getComputedStyle(cell).flexGrow)).to.deep.equal(['1', '1', '3']);
    // });
    //
    // it('should have the right parts', () => {
    //   expect(cells.map(cell => cell.getAttribute('part'))).to.deep.equal([
    //     'data first-name',
    //     'data last-name',
    //     'data age'
    //   ]);
    // });
  });

  // describe('custom renderer', () => {
  //   beforeEach(async () => {
  //     const avatarRenderer: GridColumnDataRenderer<Person> = ({ firstName, lastName }) => {
  //       return html`<sl-avatar .displayName=${[firstName, lastName].join(' ')} size="sm"></sl-avatar>`;
  //     };
  //
  //     el = await fixture(html`
  //       <sl-grid>
  //         <sl-grid-column
  //           header="Person"
  //           .renderer=${avatarRenderer}
  //           .scopedElements=${{
  //       'sl-avatar': Avatar
  //     }}
  //         ></sl-grid-column>
  //         <sl-grid-column path="age" parts="number"></sl-grid-column>
  //       </sl-grid>
  //     `);
  //     el.items = [
  //       { firstName: 'John', lastName: 'Doe', age: 20 },
  //       { firstName: 'Jane', lastName: 'Smith', age: 40 }
  //     ];
  //     await el.updateComplete;
  //
  //     // Give grid time to render the table structure
  //     await new Promise(resolve => setTimeout(resolve, 100));
  //     await el.updateComplete;
  //
  //     cells = Array.from(el.renderRoot.querySelectorAll('tbody tr:first-of-type td'));
  //   });
  //
  //   it('should render the elements set with the custom renderer', () => {
  //     expect(cells[0]).to.contain('sl-avatar');
  //   });
  //
  //   it('should have the right parts, including one set on the column', () => {
  //     expect(cells.map(cell => cell.getAttribute('part'))).to.deep.equal(['data', 'data number age']);
  //   });
  // });
});

// TODO: test mode text and select
