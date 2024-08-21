import { setupIgnoreWindowResizeObserverLoopErrors } from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { expect, fixture } from '@open-wc/testing';
// import { Checkbox } from '@sl-design-system/checkbox';
import { type CheckboxGroup } from '@sl-design-system/checkbox';
import { html } from 'lit';
import '../register.js';
import { type Grid } from './grid.js';

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
      await new Promise(resolve => setTimeout(resolve, 200));
      await el.updateComplete;
    });

    it('should render column and filter column headers', () => {
      const columns = Array.from(el.renderRoot.querySelectorAll('th'));
      const filterColumns = Array.from(el.renderRoot?.querySelectorAll('sl-grid-filter')).map(col =>
        col.textContent?.trim()
      );

      expect(columns).to.exist;
      expect(filterColumns).to.exist;

      expect(columns.map(col => col.getAttribute('part')?.trim())).to.deep.equal([
        'header filter profession',
        'header filter status',
        'header filter membership'
      ]);
      expect(filterColumns).to.deep.equal(['Profession', 'Status', 'Membership']);
    });

    it('should have no filter mode by default', () => {
      const filterColumn = Array.from(el.querySelectorAll('sl-grid-filter-column'))[0];
      const filterMode = filterColumn.getAttribute('mode');

      expect(filterMode).not.to.exist;
    });

    it('should have no active filter by default', () => {
      const columns = Array.from(el.renderRoot.querySelectorAll('sl-grid-filter')).map(filter =>
        filter.hasAttribute('active')
      );

      expect(columns).to.eql([false, false, false]);
    });

    it('should have proper filter titles', () => {
      const titles = Array.from(el.renderRoot.querySelectorAll('sl-grid-filter')).map(filter =>
        filter?.renderRoot.querySelector('sl-popover')?.querySelector('#title')?.textContent?.trim()
      );

      expect(titles).to.eql(['Filter by Profession', 'Filter by Status', 'Filter by Membership']);
    });

    it('should have filter buttons and popovers with filter options', () => {
      const buttons = Array.from(el.renderRoot.querySelectorAll('sl-grid-filter')).map(filter =>
        filter?.renderRoot.querySelector('.toggle')
      );
      const popovers = Array.from(el.renderRoot.querySelectorAll('sl-grid-filter')).map(filter =>
        filter?.renderRoot.querySelector('sl-popover')
      );

      expect(buttons).to.exist;
      expect(popovers).to.exist;
    });

    // TODO: this one below is not working, I cannot check sl-checkboxes which are rendered options to filter
    it('should have proper filter options when there is no mode', async () => {
      const columns = el.renderRoot.querySelectorAll('sl-grid-filter');
      const popover = columns[0]?.renderRoot.querySelector('sl-popover');
      const filterButton = columns[0]?.renderRoot.querySelector('#anchor');

      expect(filterButton).to.exist;

      // filterButton?.click();

      const clickEvent = new Event('click');
      filterButton?.dispatchEvent(clickEvent);
      await new Promise(resolve => setTimeout(resolve, 100));

      const checkboxGroup = popover?.querySelector('sl-checkbox-group') as CheckboxGroup;
      await checkboxGroup.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 100));

      const filterOptions = checkboxGroup?.querySelectorAll('sl-checkbox');

      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('filterOptions', filterOptions);
      console.log(
        'popover in no mode---',
        popover,
        'columns no mode---',
        columns[0].renderRoot,
        'checkboxGroup no mode---',
        checkboxGroup.renderRoot,
        checkboxGroup.renderRoot.querySelector('slot')?.assignedNodes()
      );
      // console.log('checkboxgroup no mode---', checkboxGroup, filterOptions, Array.from(checkboxGroup?.querySelectorAll('sl-checkbox')), popover?.querySelectorAll('sl-checkbox'));

      // expect(filterOptions).to.exist; // TODO: and check content of the options (checkboxes)
      expect(checkboxGroup).to.have.trimmed.text('Endocrinologist');

      // TODO: expect options (sl-checkboxes) to exist
    });

    // TODO: check filter options

    // TODO: no value by default? when it's not filtered

    // TODO:  check filter icon when filtered and not filtered - maybe in filter.spec.ts
  });
});

// TODO: a list of options based on the column's values - I cannot get checkboxes from checkbox group
