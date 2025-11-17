import { Button } from '@sl-design-system/button';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { userEvent } from '@vitest/browser/context';
import { html } from 'lit';
import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import { SelectMonth } from './select-month.js';

try {
  customElements.define('sl-select-month', SelectMonth);
} catch {
  /* empty */
}

// Make sure the tests don't break when a new year starts
const currentYear = new Date().getFullYear();

describe('sl-select-month', () => {
  let el: SelectMonth;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-month></sl-select-month>`);
    });

    it('should render 12 months', () => {
      const months = el.renderRoot.querySelectorAll('table button');

      expect(months).to.have.lengthOf(12);
      expect(el.months).to.have.lengthOf(12);
    });

    it('should show a year toggle button', () => {
      const toggleBtn = el.renderRoot.querySelector('sl-button.current-year');

      expect(toggleBtn).to.exist;
    });

    it('should not show the current month', () => {
      expect(el.showCurrent).not.to.be.true;
    });

    it('should highlight the current month when show-current is set', async () => {
      el.showCurrent = true;
      await el.updateComplete;

      const currentMonthButton = el.renderRoot.querySelector<HTMLButtonElement>('button.current');

      expect(currentMonthButton).to.exist;
      expect(currentMonthButton).to.have.trimmed.text(new Date().toLocaleString('default', { month: 'long' }));
    });

    it('should not have a selected month', () => {
      const selectedMonthButton = el.renderRoot.querySelector<HTMLButtonElement>('button.selected');

      expect(selectedMonthButton).to.not.exist;
      expect(el.selected).to.be.undefined;
    });

    it('should show the selected month when set', async () => {
      el.selected = new Date(currentYear, 5, 1); // June
      await el.updateComplete;

      const selectedMonthButton = el.renderRoot.querySelector<HTMLButtonElement>('button.selected');

      expect(selectedMonthButton).to.exist;
      expect(selectedMonthButton).to.have.trimmed.text('June');
    });

    it('should have enabled previous and next year buttons', () => {
      const prev = el.renderRoot.querySelector('sl-button[aria-label^="Previous year"]'),
        next = el.renderRoot.querySelector('sl-button[aria-label^="Next year"]');

      expect(prev).to.exist.and.not.match(':disabled');
      expect(next).to.exist.and.not.match(':disabled');
    });

    it('should emit sl-select with selected month when clicked', () => {
      const onSelect = spy();

      el.addEventListener('sl-select', (e: CustomEvent) => {
        onSelect(e.detail);
      });
      el.renderRoot.querySelector('button')?.click();

      expect(onSelect).to.have.been.calledOnce;
      expect(onSelect.lastCall.args[0]).to.equalDate(new Date(currentYear, 0, 1));
    });

    it('should emit sl-select with selected month on enter', async () => {
      const onSelect = spy();

      el.addEventListener('sl-select', (e: CustomEvent) => {
        onSelect(e.detail);
      });

      el.renderRoot.querySelector('button')?.focus();
      await userEvent.keyboard('{Enter}');

      expect(onSelect).to.have.been.calledOnce;
      expect(onSelect.lastCall.args[0]).to.equalDate(new Date(currentYear, 0, 1));
    });

    it('should emit sl-select with selected month on space', async () => {
      const onSelect = spy();

      el.addEventListener('sl-select', (e: CustomEvent) => {
        onSelect(e.detail);
      });

      el.renderRoot.querySelector('button')?.focus();
      await userEvent.keyboard(' ');

      expect(onSelect).to.have.been.calledOnce;
      expect(onSelect.lastCall.args[0]).to.equalDate(new Date(currentYear, 0, 1));
    });
  });

  describe('navigation', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-month></sl-select-month>`);
    });

    it('should increment year when next is clicked', async () => {
      el.renderRoot.querySelector<Button>('sl-button[aria-label^="Next year"]')?.click();
      await el.updateComplete;

      expect(el.month.getFullYear()).to.equal(currentYear + 1);
    });

    it('should decrement year when previous is clicked', async () => {
      el.renderRoot.querySelector<Button>('sl-button[aria-label^="Previous year"]')?.click();
      await el.updateComplete;

      expect(el.month.getFullYear()).to.equal(currentYear - 1);
    });
  });

  describe('min/max', () => {
    beforeEach(async () => {
      // Allow only months April (3) through September (8)
      el = await fixture(html`
        <sl-select-month .min=${new Date(currentYear, 3, 1)} .max=${new Date(currentYear, 8, 1)}></sl-select-month>
      `);
    });

    it('should mark months outside range as disabled buttons', () => {
      const disabledButtons = Array.from(el.renderRoot.querySelectorAll('table button[disabled]'));

      // Months 0,1,2 and 9,10,11 -> 6 disabled
      expect(disabledButtons).to.have.lengthOf(6);
    });

    it('should disable navigating to a previous year (since min is current year)', () => {
      const prev = el.renderRoot.querySelector('sl-button[aria-label^="Previous year"]');

      expect(prev).to.have.attribute('disabled');
      expect(prev).to.match(':disabled');
    });

    it('should disable navigating to a next year (since max is current year)', () => {
      const next = el.renderRoot.querySelector('sl-button[aria-label^="Next year"]');

      expect(next).to.have.attribute('disabled');
      expect(next).to.match(':disabled');
    });

    it('should have static year (span) when navigation is fully disabled by min and max', () => {
      const yearButton = el.renderRoot.querySelector('sl-button.current-year'),
        yearSpan = el.renderRoot.querySelector('span.current-year');

      expect(yearButton).to.not.exist;
      expect(yearSpan).to.exist;
    });
  });

  describe('keyboard navigation', () => {
    let month: Date;

    beforeEach(async () => {
      month = new Date(2025, 6, 1);

      el = await fixture(html`<sl-select-month .month=${month}></sl-select-month>`);

      await el.updateComplete;
    });

    it('should decrement year when ArrowLeft is pressed on first button', async () => {
      const buttons = el.renderRoot.querySelectorAll('table button');
      const first = buttons[0] as HTMLButtonElement;

      first.focus();
      await userEvent.keyboard('{ArrowLeft}');

      await el.updateComplete;

      expect(el.month.getFullYear()).to.equal(month.getFullYear() - 1);
    });

    it('should increment year when ArrowRight is pressed on last button', async () => {
      const buttons = el.renderRoot.querySelectorAll('table button');
      const last = buttons[buttons.length - 1] as HTMLButtonElement;

      last.focus();
      await userEvent.keyboard('{ArrowRight}');

      await el.updateComplete;
      expect(el.month.getFullYear()).to.equal(month.getFullYear() + 1);
    });

    it('should decrement year when ArrowUp is pressed on a top row button', async () => {
      const buttons = el.renderRoot.querySelectorAll('table button');
      // pick index 1 (top row, middle)
      const target = buttons[1] as HTMLButtonElement;

      target.focus();
      await userEvent.keyboard('{ArrowUp}');

      await el.updateComplete;
      expect(el.month.getFullYear()).to.equal(month.getFullYear() - 1);
    });

    it('should increment year when ArrowDown is pressed on a last row button', async () => {
      const buttons = el.renderRoot.querySelectorAll('table button');
      // For 12 months and 3 columns, lastRowStart is index 9, choose index 10
      const target = buttons[10] as HTMLButtonElement;

      target.focus();
      await userEvent.keyboard('{ArrowDown}');

      await el.updateComplete;
      expect(el.month.getFullYear()).to.equal(month.getFullYear() + 1);
    });
  });
});
