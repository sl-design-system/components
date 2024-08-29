import { setupIgnoreWindowResizeObserverLoopErrors } from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { GridFilterColumn } from './filter-column.js';
import { GridFilter } from './filter.js';

setupIgnoreWindowResizeObserverLoopErrors(beforeEach, afterEach);

describe('sl-grid-filter', () => {
  let el: GridFilter;

  const column = new GridFilterColumn();

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

      el = await fixture(html`
        <sl-grid-filter .column=${column} .options=${options} mode="select" path="membership">
          Membership
        </sl-grid-filter>
      `);
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

      el = await fixture(html`
        <sl-grid-filter .column=${column} .options=${options} mode="select" path="membership">
          Membership
        </sl-grid-filter>
      `);
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
  });
});
