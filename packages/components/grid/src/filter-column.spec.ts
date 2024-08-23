import { setupIgnoreWindowResizeObserverLoopErrors } from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { expect, fixture } from '@open-wc/testing';
// import { Checkbox } from '@sl-design-system/checkbox';
import { html } from 'lit';
import '../register.js';
import { type Grid } from './grid.js';

setupIgnoreWindowResizeObserverLoopErrors(beforeEach, afterEach);

const ITEMS = [
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
  },
  {
    firstName: 'Jimmy',
    lastName: 'Adams',
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
          <sl-grid-filter-column mode="text" path="status"></sl-grid-filter-column>
          <sl-grid-filter-column path="membership"></sl-grid-filter-column>
        </sl-grid>
      `);
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
      const filterColumn = el.querySelector('sl-grid-filter-column');

      expect(filterColumn).to.exist;
      expect(filterColumn).not.to.have.attribute('mode');
    });

    it('should have no active filter by default', () => {
      const active = Array.from(el.renderRoot.querySelectorAll('sl-grid-filter')).map(filter =>
        filter.hasAttribute('active')
      );

      expect(active).to.deep.equal([false, false, false]);
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

    it('should have proper filter options when there is no mode', async () => {
      const filter = el.renderRoot.querySelector('sl-grid-filter'),
        popover = filter?.renderRoot.querySelector('sl-popover'),
        button = filter?.renderRoot.querySelector('sl-button');

      expect(button).to.exist;
      expect(button).to.have.attribute('id');
      expect(button!.id).to.equal(popover?.getAttribute('anchor'));

      // Open the popover
      button?.click();
      await new Promise(resolve => setTimeout(resolve, 100));

      const checkboxGroup = popover?.querySelector('sl-checkbox-group');

      expect(checkboxGroup).to.exist;
      expect(checkboxGroup).to.have.attribute('aria-labelledby');
      expect(checkboxGroup?.getAttribute('aria-labelledby')).to.equal(popover?.querySelector('h1')?.id);

      const options = Array.from(checkboxGroup!.querySelectorAll('sl-checkbox')),
        labels = options.map(o => o.querySelector('[slot="label"]')?.textContent?.trim());

      expect(options).to.have.length(3);
      expect(options.map(o => o.checked)).to.deep.equal([false, false, false]);
      expect(labels).to.deep.equal(['Anesthesiologist', 'Cardiologist', 'Endocrinologist']);
    });

    // TODO: check filter options

    // TODO: no value by default? when it's not filtered

    // TODO:  check filter icon when filtered and not filtered - maybe in filter.spec.ts
  });

  describe('active filter', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid .items=${ITEMS}>
          <sl-grid-filter-column path="profession" value=${['Endocrinologist', 'Cardiologist']}></sl-grid-filter-column>
          <sl-grid-filter-column path="status" value="available"></sl-grid-filter-column>
          <sl-grid-filter-column path="membership"></sl-grid-filter-column>
        </sl-grid>
      `);
      await el.updateComplete;

      // Give grid time to render the table structure
      await new Promise(resolve => setTimeout(resolve, 200));
      await el.updateComplete;
    });

    it('should have active filter', () => {
      const active = Array.from(el.renderRoot.querySelectorAll('sl-grid-filter')).map(filter =>
        filter.hasAttribute('active')
      );

      expect(active).to.deep.equal([true, true, false]);
    });

    // TODO: check shown items
  });

  describe('select mode', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid .items=${ITEMS}>
          <sl-grid-filter-column path="profession" value="Endocrinologist"></sl-grid-filter-column>
          <sl-grid-filter-column path="status"></sl-grid-filter-column>
          <sl-grid-filter-column path="membership"></sl-grid-filter-column>
        </sl-grid>
      `);
      await el.updateComplete;

      // Give grid time to render the table structure
      await new Promise(resolve => setTimeout(resolve, 200));
      await el.updateComplete;
    });

    // it('should render column and filter column headers', () => {
    //   const columns = Array.from(el.renderRoot.querySelectorAll('th'));
    //   const filterColumns = Array.from(el.renderRoot?.querySelectorAll('sl-grid-filter')).map(col =>
    //     col.textContent?.trim()
    //   );
    //
    //   expect(columns).to.exist;
    //   expect(filterColumns).to.exist;
    //
    //   expect(columns.map(col => col.getAttribute('part')?.trim())).to.deep.equal([
    //     'header filter profession',
    //     'header filter status',
    //     'header filter membership'
    //   ]);
    //   expect(filterColumns).to.deep.equal(['Profession', 'Status', 'Membership']);
    // });
  });

  describe('text mode', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid .items=${ITEMS}>
          <sl-grid-filter-column path="profession" value="Endocrinologist"></sl-grid-filter-column>
          <sl-grid-filter-column mode="text" path="status"></sl-grid-filter-column>
          <sl-grid-filter-column path="membership"></sl-grid-filter-column>
        </sl-grid>
      `);
      await el.updateComplete;

      // Give grid time to render the table structure
      await new Promise(resolve => setTimeout(resolve, 200));
      await el.updateComplete;
    });

    // it('should render column and filter column headers', () => {
    //   const columns = Array.from(el.renderRoot.querySelectorAll('th'));
    //   const filterColumns = Array.from(el.renderRoot?.querySelectorAll('sl-grid-filter')).map(col =>
    //     col.textContent?.trim()
    //   );
    //
    //   expect(columns).to.exist;
    //   expect(filterColumns).to.exist;
    //
    //   expect(columns.map(col => col.getAttribute('part')?.trim())).to.deep.equal([
    //     'header filter profession',
    //     'header filter status',
    //     'header filter membership'
    //   ]);
    //   expect(filterColumns).to.deep.equal(['Profession', 'Status', 'Membership']);
    // });
  });
});

// TODO: a list of options based on the column's values - I cannot get checkboxes from checkbox group

/*describe('defaults)

describe('active filter')

describe('select mode')

describe('text mode')*/
