import { setupIgnoreWindowResizeObserverLoopErrors } from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { GridFilterColumn } from './filter-column.js';
import { GridFilter } from './filter.js';

setupIgnoreWindowResizeObserverLoopErrors(beforeEach, afterEach);

describe('sl-grid-filter', () => {
  let wrapper: HTMLElement;
  let el: GridFilter;

  // const items = [{ membership: 'Premium' }, { membership: 'VIP' }, { membership: 'Regular' }];

  const column = new GridFilterColumn();
  // column.path = 'membership';
  // column.value = 'Premium';
  // await column.updateComplete;

  // const dataSource = new ArrayDataSource(items) as DataSource;
  // dataSource.addFilter('', 'membership', ['Premium']);

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
      try {
        customElements.define('sl-grid-filter', GridFilter);
      } catch {
        //
      }

      column.path = 'membership';
      column.value = 'Premium';
      await new Promise(resolve => setTimeout(resolve, 200));
      // await column.updateComplete;

      // dataSource.addFilter('', 'membership', ['Premium']);
      // await new Promise(resolve => setTimeout(resolve, 200));

      // TODO: how to connect grid-filter with dataSource?
      wrapper = await fixture(html`
        <th part="header filter membership">
          <sl-grid-filter .column=${column} .options=${options} mode="select" path="membership">
            Membership
          </sl-grid-filter>
        </th>
      `); // .filter=${dataSource.filters}
      el = wrapper.querySelector<GridFilter>('sl-grid-filter')!;
      await new Promise(resolve => setTimeout(resolve, 200));
      await el.updateComplete;

      // Give grid time to render the table structure
      await new Promise(resolve => setTimeout(resolve, 200));
      await el.updateComplete;
    });

    it('should render correct icon', () => {
      const button = el.renderRoot?.querySelector('sl-button'),
        icon = button?.querySelector('sl-icon');

      expect(button).to.exist;
      expect(icon).to.exist;
      expect(icon!.getAttribute('name')).to.equal('far-filter');
    });

    it('should have no active filter by default', () => {
      const active = el.hasAttribute('active');

      expect(active).to.equal(false);
    });
  });

  describe('active filter', () => {
    beforeEach(async () => {
      try {
        customElements.define('sl-grid-filter', GridFilter);
      } catch {
        //
      }

      column.path = 'membership';
      column.value = 'Premium';
      await new Promise(resolve => setTimeout(resolve, 200));

      // dataSource.addFilter('', 'membership', ['Premium']);
      // await new Promise(resolve => setTimeout(resolve, 200));

      // TODO: how to connect grid-filter with dataSource?
      wrapper = await fixture(html`
        <th part="header filter membership">
          <sl-grid-filter .column=${column} .options=${options} mode="select" path="membership">
            Membership
          </sl-grid-filter>
        </th>
      `);
      el = wrapper.querySelector<GridFilter>('sl-grid-filter')!;
      await new Promise(resolve => setTimeout(resolve, 200));
      await el.updateComplete;

      // Give grid time to render the table structure
      await new Promise(resolve => setTimeout(resolve, 200));
      await el.updateComplete;
    });

    it('should have active attribute when filtered', async () => {
      const button = el.renderRoot?.querySelector('sl-button'),
        popover = el?.renderRoot.querySelector('sl-popover');

      // Open the popover
      button?.click();
      await new Promise(resolve => setTimeout(resolve, 100));

      const checkboxGroup = popover?.querySelector('sl-checkbox-group');

      expect(checkboxGroup).to.exist;

      const options = Array.from(checkboxGroup!.querySelectorAll('sl-checkbox'));

      expect(options).to.exist;

      options[0].click();
      el.value = 'Premium';
      await new Promise(resolve => setTimeout(resolve, 200));
      await el.updateComplete;

      expect(el.hasAttribute('active')).to.equal(true);
    });

    it('should have a proper icon when filtered', async () => {
      const button = el.renderRoot?.querySelector('sl-button'),
        popover = el?.renderRoot.querySelector('sl-popover'),
        icon = button?.querySelector('sl-icon');

      // Open the popover
      button?.click();
      await new Promise(resolve => setTimeout(resolve, 100));

      const checkboxGroup = popover?.querySelector('sl-checkbox-group');

      expect(checkboxGroup).to.exist;

      const options = Array.from(checkboxGroup!.querySelectorAll('sl-checkbox'));

      expect(options).to.exist;

      options[0].click();
      el.value = 'Premium';
      await new Promise(resolve => setTimeout(resolve, 200));
      await el.updateComplete;

      expect(icon).to.exist;
      expect(icon!.getAttribute('name')).to.equal('fas-filter');
    });

    it('should have no active filter by default', () => {
      const active = el.hasAttribute('active');

      expect(active).to.equal(false);
    });
  });
});

// TODO: remove th!!!
