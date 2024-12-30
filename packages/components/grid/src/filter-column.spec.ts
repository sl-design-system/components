import { setupIgnoreWindowResizeObserverLoopErrors } from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { expect, fixture } from '@open-wc/testing';
import { type TextField } from '@sl-design-system/text-field';
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

    it('should have a button with the right icon when it is not filtered', () => {
      const filter = el.renderRoot.querySelector('sl-grid-filter'),
        button = filter?.renderRoot.querySelector('sl-button'),
        icon = button?.querySelector('sl-icon');

      expect(icon).to.exist;
      expect(icon!.getAttribute('name')).to.equal('far-filter');
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

    it('should have checked option in the select mode when it is filtered', async () => {
      const filter = el.renderRoot.querySelector('sl-grid-filter'),
        popover = filter?.renderRoot.querySelector('sl-popover'),
        button = filter?.renderRoot.querySelector('sl-button');

      expect(button).to.exist;

      // Open the popover
      button?.click();
      await new Promise(resolve => setTimeout(resolve, 100));

      const checkboxGroup = popover?.querySelector('sl-checkbox-group');

      expect(checkboxGroup).to.exist;

      const optionsChecked = Array.from(checkboxGroup!.querySelectorAll('sl-checkbox[checked]')),
        labels = optionsChecked.map(o => o.querySelector('[slot="label"]')?.textContent?.trim());

      expect(labels).to.deep.equal(['Cardiologist', 'Endocrinologist']);
    });

    it('should have a button with the right icon when it is filtered', () => {
      const filter = el.renderRoot.querySelector('sl-grid-filter'),
        button = filter?.renderRoot.querySelector('sl-button'),
        icon = button?.querySelector('sl-icon');

      expect(icon).to.exist;
      expect(icon!.getAttribute('name')).to.equal('fas-filter');
    });
  });

  describe('select mode', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid .items=${ITEMS}>
          <sl-grid-filter-column path="profession"></sl-grid-filter-column>
          <sl-grid-filter-column path="status"></sl-grid-filter-column>
          <sl-grid-filter-column path="membership"></sl-grid-filter-column>
        </sl-grid>
      `);
      await el.updateComplete;

      // Give grid time to render the table structure
      await new Promise(resolve => setTimeout(resolve, 200));
      await el.updateComplete;
    });

    it('should have proper options', async () => {
      const filters = el.renderRoot.querySelectorAll('sl-grid-filter'),
        popoverProfession = filters[0]?.renderRoot.querySelector('sl-popover'),
        buttonProfession = filters[0]?.renderRoot.querySelector('sl-button'),
        popoverStatus = filters[1]?.renderRoot.querySelector('sl-popover'),
        buttonStatus = filters[1]?.renderRoot.querySelector('sl-button'),
        popoverMembership = filters[2]?.renderRoot.querySelector('sl-popover'),
        buttonMembership = filters[2]?.renderRoot.querySelector('sl-button');

      expect(buttonProfession).to.exist;

      // Open the popover
      buttonProfession?.click();
      await new Promise(resolve => setTimeout(resolve, 100));

      const checkboxGroupProfession = popoverProfession?.querySelector('sl-checkbox-group');

      expect(checkboxGroupProfession).to.exist;

      const optionsProfession = Array.from(checkboxGroupProfession!.querySelectorAll('sl-checkbox')),
        labelsProfession = optionsProfession.map(o => o.querySelector('[slot="label"]')?.textContent?.trim());

      expect(labelsProfession).to.deep.equal(['Anesthesiologist', 'Cardiologist', 'Endocrinologist']);

      expect(buttonStatus).to.exist;

      // Open the popover
      buttonStatus?.click();
      await new Promise(resolve => setTimeout(resolve, 100));

      const checkboxGroupStatus = popoverStatus?.querySelector('sl-checkbox-group');

      expect(checkboxGroupStatus).to.exist;

      const optionsStatus = Array.from(checkboxGroupStatus!.querySelectorAll('sl-checkbox')),
        labelsStatus = optionsStatus.map(o => o.querySelector('[slot="label"]')?.textContent?.trim());

      expect(labelsStatus).to.deep.equal(['Available', 'Busy']);

      expect(buttonMembership).to.exist;

      // Open the popover
      buttonMembership?.click();
      await new Promise(resolve => setTimeout(resolve, 100));

      const checkboxGroupMembership = popoverMembership?.querySelector('sl-checkbox-group');

      expect(checkboxGroupProfession).to.exist;

      const optionsMembership = Array.from(checkboxGroupMembership!.querySelectorAll('sl-checkbox')),
        labelsMembership = optionsMembership.map(o => o.querySelector('[slot="label"]')?.textContent?.trim());

      expect(labelsMembership).to.deep.equal(['Premium', 'Regular']);
    });
  });

  describe('text mode', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid .items=${ITEMS}>
          <sl-grid-filter-column mode="text" path="profession" value="Endo"></sl-grid-filter-column>
          <sl-grid-filter-column mode="text" path="status"></sl-grid-filter-column>
          <sl-grid-filter-column mode="text" path="membership"></sl-grid-filter-column>
        </sl-grid>
      `);
      await el.updateComplete;

      // Give grid time to render the table structure
      await new Promise(resolve => setTimeout(resolve, 200));
      await el.updateComplete;
    });

    it('should have text field', () => {
      const textFields = Array.from(el.renderRoot.querySelectorAll('sl-grid-filter')).map(f =>
        f.renderRoot.querySelector('sl-popover sl-text-field')
      ) as TextField[];

      expect(textFields).to.exist;
      expect(textFields).to.have.length(3);
    });

    it('should have proper value in the text field', () => {
      const textFields = Array.from(el.renderRoot.querySelectorAll('sl-grid-filter')).map(f =>
        f.renderRoot.querySelector('sl-popover sl-text-field')
      ) as TextField[];

      expect(textFields).to.exist;
      expect(textFields.map(t => t.value)).to.deep.equal(['Endo', '', '']);
    });

    it('should partially match the value in the text field', () => {
      const rows = Array.from(el.renderRoot.querySelectorAll('tbody td[part~="profession"]'));

      expect(rows).to.have.length(1);
      expect(rows.map(r => r.textContent)).to.deep.equal(['Endocrinologist']);
    });
  });
});
