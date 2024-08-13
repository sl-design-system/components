import { setupIgnoreWindowResizeObserverLoopErrors } from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { type Grid } from './grid.js';
import {type CheckboxGroup} from "@sl-design-system/checkbox";
import {GridFilterColumn} from "./filter-column";

setupIgnoreWindowResizeObserverLoopErrors(beforeEach, afterEach);

describe('sl-grid-filter-column', () => {
  let el: Grid;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid>
          <sl-grid-filter-column path="profession" value="Endocrinologist"></sl-grid-filter-column>
          <sl-grid-filter-column mode="text" path="status"></sl-grid-filter-column>
          <sl-grid-filter-column path="membership"></sl-grid-filter-column>
        </sl-grid>
      `);
      el.items = [
        {
          firstName: 'John',
          lastName: 'Doe',
          profession: 'Endocrinologist',
          status: 'Available',
          membership: 'Regular'
        },
        {
          firstName: 'Jane',
          lastName: 'Smith',
          profession: 'Anesthesiologist',
          status: 'Busy',
          membership: 'Premium'
        }
      ];
      await el.updateComplete;

      // Give grid time to render the table structure
      await new Promise(resolve => setTimeout(resolve, 500));
      await el.updateComplete;

      // cells = Array.from(el.renderRoot.querySelectorAll('tbody tr:first-of-type td'));
    });

    it('should render column and filter column headers', () => {
      const columns = Array.from(el.renderRoot.querySelectorAll('th'));
       // .map(col => col.textContent);
       // .slice(0, 2);
      // const filterColumns = el.renderRoot?.querySelectorAll('sl-grid-filter');
      const filterColumns = Array.from(el.renderRoot?.querySelectorAll('sl-grid-filter')).map(col =>
        col.textContent?.trim()
      );
    //  console.log('el ---grid', el);

      // console.log('coolumns', columns, el.renderRoot.querySelectorAll('th'));

      // console.log('coolumns--2', columns);
      // console.log('filterColumns', filterColumns, Array.from(filterColumns).map(col => col.textContent.trim()));
      // console.log('filterColumns trimmed', Array.from(filterColumns).map(col => col.textContent.trim()));
      // console.log('filterColumnsTrimmedfilterColumnsTrimmedfilterColumnsTrimmed', filterColumnsTrimmed);

      expect(columns).to.exist;
      expect(filterColumns).to.exist;

      // expect(columns).to.deep.equal(['First name', 'Last name']);
      expect(columns.map(col => col.getAttribute('part')?.trim())).to.deep.equal([
        'header filter profession',
        'header filter status',
        'header filter membership'
      ]);
      expect(filterColumns).to.deep.equal(['Profession', 'Status', 'Membership']);
    });

    // TODO: with no filter mode by default

    it('should have no filter mode by default', () => {
      const filterColumn = Array.from(el.querySelectorAll('sl-grid-filter-column'))[0];
      const filterMode = filterColumn.getAttribute('mode');

      expect(filterMode).not.to.exist;
    });

    it('should have no active filter by default', () => {
      const columns = Array.from(el.renderRoot.querySelectorAll('sl-grid-filter')).map(filter => filter.hasAttribute('active'));

      expect(columns).to.eql([false, false, false]);
    });

    // TODO: should have a header with proper filter options when there is no mode

    it('should have a header with proper filter options when there is no mode', async () => {
      const columns = el.renderRoot.querySelectorAll('sl-grid-filter'); //Array.from(el.renderRoot.querySelectorAll('sl-grid-filter'));
      const popover = columns[0]?.renderRoot.querySelector('sl-popover');
      const checkboxGroup = popover.querySelector('sl-checkbox-group') as CheckboxGroup;
      const filterColumns = Array.from(popover?.querySelectorAll('sl-checkbox')).map(col =>
        col.textContent?.trim()
      );

      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('checkboxgroup no mode---', checkboxGroup, filterColumns, Array.from(checkboxGroup?.querySelectorAll('sl-checkbox')));

      expect(checkboxGroup).to.have.trimmed.text('Endocrinologist');
    });

    it('should have a filter button and popover with filter options', async () => {
      // console.log('el', el);
      const columnHeaders = Array.from(el.renderRoot.querySelectorAll('th')).map(col => col.textContent);
      const columns = el.renderRoot.querySelectorAll('sl-grid-filter'); //Array.from(el.renderRoot.querySelectorAll('sl-grid-filter'));
      const button = columns[0]?.renderRoot.querySelector('.toggle');
      const popover = columns[0]?.renderRoot.querySelector('sl-popover');
      const checkbox = columns[0]?.renderRoot.querySelectorAll('sl-checkbox');
      const checkboxGroup = popover.querySelector('sl-checkbox-group') as CheckboxGroup;
      const title = popover?.querySelector('#title');
      const dataSource = el?.dataSource as DataSource<T> | undefined;
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('dataSource1', dataSource, dataSource.items, 'eeeeeeel options', el.dataSource?.filters);
      console.log('columns1', columns, 'has attribute??', (columns[0] as GridFilterColumn).hasAttribute('active'), (columns[0] as GridFilterColumn).options, (columns[0] as GridFilterColumn).internalOptions, popover?.querySelector('#title'));
      console.log('button and popover', button, popover);
      console.log('cheeeckbox', checkbox, 'pooopover checkbox', popover.querySelectorAll('sl-checkbox'), Array.from(checkboxGroup.querySelectorAll('sl-checkbox')),
        'checkboxGroupcheckboxGroupcheckboxGroupcheckboxGroup', checkboxGroup, checkboxGroup.renderRoot);
     // console.log('ccccolumns', columns, columns[0]?.renderRoot, 'popoooover', columns[0]?.renderRoot.querySelector('sl-checkbox-group').renderRoot);

      expect(title).to.have.trimmed.text('Filter by Profession');

      // expect(checkbox).to.exist;

      // TODO: why I cannot get renderRoot from sl-grid-filter?

      // TODO check title - 'filter by profession'

      await new Promise(resolve => setTimeout(resolve, 500));

      // const gridFilters = columns?.querySelectorAll('sl-grid-filter') as GridFilter[]; //el.renderRoor?.querySelectorAll('sl-grid-filter');
      // const filterColumns = Array.from(el.renderRoot?.querySelectorAll('sl-grid-filter'))[0];
      //const filterColumnsNew = Array.from(el.querySelectorAll('sl-grid-filter-column'))[1];

      // console.log('gridFilters', gridFilters, 'el.renderRoor', el.renderRoor, 'eeeel', el, el.renderRoot.querySelectorAll('th'));

      // console.log('filterColumns for mode default', filterColumnsNew);

      // expect(columns).to.deep.equal(['First name', 'Last name', 'Age']);

      expect(button).to.exist;
      expect(popover).to.exist;

      // TODO: need to check whether there is a button and popover inside
    });

    // TODO: check options

    // TODO: no value by default?

    // TODO:  check filter icon when filtered and not filtered

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
});

// TODO: a list of options based on the column's values - I cannot get checkboxes from checkbox group

