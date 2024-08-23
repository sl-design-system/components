import { setupIgnoreWindowResizeObserverLoopErrors } from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { expect, fixture } from '@open-wc/testing';
import { ArrayDataSource, DataSource } from '@sl-design-system/shared';
import { html } from 'lit';
import '../register.js';
import { GridFilterColumn } from './filter-column.js';
import { GridFilter } from './filter.js';

setupIgnoreWindowResizeObserverLoopErrors(beforeEach, afterEach);

describe('sl-grid-filter', () => {
  let wrapper: HTMLElement;
  let el: GridFilter;

  const items = [{ membership: 'Premium' }, { membership: 'VIP' }, { membership: 'Regular' }];

  const column = new GridFilterColumn();
  const dataSource = new ArrayDataSource(items) as DataSource;
  dataSource.addFilter('', 'membership', ['Premium']);

  const options = [
    {
      label: 'Premium',
      value: 'Premium'
    },
    {
      label: 'Regular',
      value: 'Regular'
    },
    {
      label: 'VIP',
      value: 'VIP'
    }
  ];

  // TODO: test mode -> .mode=${this.mode || 'select'}
  // TODO: test options -> .options=${this.options ?? this.internalOptions}

  // .value=${dataSource.filters.values()}

  // .filter=...

  //           path="membership"
  //           value="Premium"

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid-filter .column=${column} .options=${options} mode="select" path="membership" value="Premium">
          Membership
        </sl-grid-filter>
      `);
      await el.updateComplete;

      // Give grid time to render the table structure
      await new Promise(resolve => setTimeout(resolve, 200));
      await el.updateComplete;

      console.log('wrapper before and el', wrapper, el, dataSource);
      // console.log('el before', el, el.renderRoot);
      // el = await fixture(html`
      //   <sl-grid>
      //     <sl-grid-filter-column path="profession"></sl-grid-filter-column>
      //     <sl-grid-filter-column mode="text" path="status"></sl-grid-filter-column>
      //     <sl-grid-filter-column path="membership"></sl-grid-filter-column>
      //   </sl-grid>
      // `);
      // el.items = [
      //   {
      //     firstName: 'John',
      //     lastName: 'Doe',
      //     age: 20,
      //     profession: 'Endocrinologist',
      //     status: 'Available',
      //     membership: 'Regular'
      //   },
      //   {
      //     firstName: 'Jane',
      //     lastName: 'Smith',
      //     age: 40,
      //     profession: 'Anesthesiologist',
      //     status: 'Busy',
      //     membership: 'Premium'
      //   }
      // ];
      // await el.updateComplete;
      //
      // // Give grid time to render the table structure
      // await new Promise(resolve => setTimeout(resolve, 100));
      // await el.updateComplete;
    });

    it('should render correct checkboxes', () => {
      // console.log('wrapper', wrapper, wrapper.renderRoot);
      console.log('eeeeeel1', el);
      expect(wrapper).not.to.exist;
    });

    // it('should render column and filter column headers', () => {
    //   const columns = Array.from(el.renderRoot.querySelectorAll('th'));
    //   // .map(col => col.textContent);
    //   // .slice(0, 2);
    //   // const filterColumns = el.renderRoot?.querySelectorAll('sl-grid-filter');
    //   const filterColumns = Array.from(el.renderRoot?.querySelectorAll('sl-grid-filter')).map(col =>
    //     col.textContent?.trim()
    //   );
    //
    //   console.log('coolumns', columns, el.renderRoot.querySelectorAll('th'));
    //
    //   // console.log('coolumns--2', columns);
    //   // console.log('filterColumns', filterColumns, Array.from(filterColumns).map(col => col.textContent.trim()));
    //   // console.log('filterColumns trimmed', Array.from(filterColumns).map(col => col.textContent.trim()));
    //   // console.log('filterColumnsTrimmedfilterColumnsTrimmedfilterColumnsTrimmed', filterColumnsTrimmed);
    //
    //   expect(columns).to.exist;
    //   expect(filterColumns).to.exist;
    //
    //   // expect(columns).to.deep.equal(['First name', 'Last name']);
    //   expect(columns.map(col => col.getAttribute('part')?.trim())).to.deep.equal([
    //     'header filter profession',
    //     'header filter status',
    //     'header filter membership'
    //   ]);
    //   expect(filterColumns).to.deep.equal(['Profession', 'Status', 'Membership']);
    // });

    // it('should have no filter mode by default', () => {
    //   const filterColumn = Array.from(el.querySelectorAll('sl-grid-filter-column'))[0]; //[0];
    //   const filterMode = filterColumn.getAttribute('mode');
    //
    //   // console.log('filterColumns for mode', filterColumns, filterColumnsNew, filterMode);
    //   expect(filterMode).not.to.exist;
    //   // expect(columns).to.deep.equal(['First name', 'Last name', 'Age']);
    // });

    // it('should have a filter column header with a proper mode when it is set', () => {
    //   console.log('el', el);
    //   const columns = Array.from(el.renderRoot.querySelectorAll('th')).map(col => col.textContent);
    //   // const filterColumns = Array.from(el.renderRoot?.querySelectorAll('sl-grid-filter'))[0];
    //   const filterColumnsNew = Array.from(el.querySelectorAll('sl-grid-filter-column'))[1];
    //
    //   console.log('filterColumns for mode default', filterColumnsNew);
    //
    //   expect(columns).to.deep.equal(['First name', 'Last name', 'Age']);
    //
    //   // TODO: need to check whether there is a button and popover inside
    // });

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

// TODO: events emitting tests

// TODO: test this exactly (inside th, similar to sorter.spec.ts?):
/*
<sl-grid-filter
  .column=${this}
.mode=${this.mode || 'select'}
.options=${this.options ?? this.internalOptions}
.path=${this.path}
.value=${this.value}
>
${this.header ?? getNameByPath(this.path)}
</sl-grid-filter>*/

// TODO: test mode text and select
