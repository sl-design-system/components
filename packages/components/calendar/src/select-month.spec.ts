import { Button } from '@sl-design-system/button';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { userEvent } from '@vitest/browser/context';
import { html } from 'lit';
import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import { SelectMonth } from './select-month.js';

// Define element if not already defined (no dedicated register file for select-month)
try {
  customElements.define('sl-select-month', SelectMonth);
} catch {
  /* already defined */
}

describe('sl-select-month', () => {
  let el: SelectMonth;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-month></sl-select-month>`);
    });

    it('should generate 12 months', () => {
      expect(el.months).to.have.lengthOf(12);
      const monthButtons = el.renderRoot.querySelectorAll('table.months button');
      expect(monthButtons).to.have.lengthOf(12);
    });

    it('should show a year toggle button (because navigation is possible)', () => {
      const toggleBtn = el.renderRoot.querySelector('sl-button.current-year');
      expect(toggleBtn).to.exist;
    });

    it('should have enabled previous and next year buttons', () => {
      const prev = el.renderRoot.querySelector('sl-button[aria-label^="Previous year"]');
      const next = el.renderRoot.querySelector('sl-button[aria-label^="Next year"]');
      expect(prev).to.exist.and.not.match(':disabled');
      expect(next).to.exist.and.not.match(':disabled');
    });
  });

  describe('min/max boundaries', () => {
    beforeEach(async () => {
      const currentYear = new Date().getFullYear();
      // Allow only months April (3) through September (8)
      const min = new Date(currentYear, 3, 1);
      const max = new Date(currentYear, 8, 1);
      el = await fixture(
        html`<sl-select-month .month=${new Date(currentYear, 5, 1)} .min=${min} .max=${max}></sl-select-month>`
      );
      await el.updateComplete;
    });

    it('should mark months outside range as unselectable buttons', () => {
      const unselectableParts = Array.from(el.renderRoot.querySelectorAll('[part~="unselectable"]'));

      // Months 0,1,2 and 9,10,11 -> 6 unselectables
      expect(unselectableParts).to.have.lengthOf(6);

      const allButtons = unselectableParts.every(node => node.tagName === 'BUTTON' && node.hasAttribute('disabled'));

      expect(allButtons).to.be.true;
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

    it('should have static year (span) when navigation is fully disabled by min and max', async () => {
      el = await fixture(html`
        <sl-select-month
          .month=${new Date(2025, 5, 1)}
          .min=${new Date(2025, 5, 1)}
          .max=${new Date(2025, 5, 30)}
        ></sl-select-month>
      `);
      await el.updateComplete;

      const yearButton = el.renderRoot.querySelector('sl-button.current-year'),
        yearSpan = el.renderRoot.querySelector('span.current-year');

      expect(yearButton).to.not.exist;
      expect(yearSpan).to.exist;
    });
  });

  describe('selection', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-month></sl-select-month>`);
    });

    it('should emit sl-select when a month button is clicked', async () => {
      const onSelect = spy();
      el.addEventListener('sl-select', (e: CustomEvent) => {
        onSelect(e.detail);
      });

      const firstButton = el.renderRoot.querySelector('table.months button') as HTMLButtonElement;

      expect(firstButton).to.exist;

      firstButton.click();

      await el.updateComplete;

      expect(onSelect).to.have.been.calledOnce;

      const emitted = onSelect.lastCall.args[0] as Date;

      expect(emitted).to.be.instanceOf(Date);
      expect(emitted.getMonth()).to.equal(parseInt(firstButton.textContent!.trim().slice(0, 2)) - 1 || 0); // keep the original month assertion
    });

    it('should update selected when clicking a month button', async () => {
      const clickable = Array.from(el.renderRoot.querySelectorAll('table.months button')).find(
        b => !(b as HTMLButtonElement).disabled
      )!;

      const onSelect = spy();

      el.addEventListener('sl-select', (e: CustomEvent) => {
        onSelect(e.detail);
      });

      (clickable as HTMLButtonElement).click();

      await el.updateComplete;

      expect(onSelect).to.have.been.calledOnce;

      const evDetail = onSelect.lastCall.args[0] as Date;

      expect(el.selected).to.be.instanceOf(Date);
      expect((el.selected as Date).getMonth()).to.equal(evDetail.getMonth());
    });

    it('should emit sl-select with current month when Escape is pressed', async () => {
      const currentMonth = el.month.getMonth();

      const onSelect = spy();

      el.addEventListener('sl-select', (e: CustomEvent) => {
        onSelect(e.detail);
      });

      const firstBtn = el.renderRoot.querySelector<HTMLButtonElement>('table.months button') as HTMLButtonElement;

      expect(firstBtn).to.exist;

      firstBtn.focus();

      await userEvent.keyboard('{Escape}');
      await el.updateComplete;

      expect(onSelect).to.have.been.calledOnce;

      const evDetail = onSelect.lastCall.args[0] as Date;

      expect(evDetail.getMonth()).to.equal(currentMonth);
    });
  });

  describe('navigation between years', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-month .month=${new Date(new Date().getFullYear(), 6, 1)}></sl-select-month>`);
    });

    it('should increment year when next is clicked', async () => {
      const startYear = el.month.getFullYear();
      const next = el.renderRoot.querySelector('sl-button[aria-label^="Next year"]') as Button;

      expect(next).to.exist;

      next.click();

      await el.updateComplete;

      expect(el.month.getFullYear()).to.equal(startYear + 1);
    });

    it('should decrement year when previous is clicked', async () => {
      const startYear = el.month.getFullYear(),
        prev = el.renderRoot.querySelector('sl-button[aria-label^="Previous year"]') as Button;

      expect(prev).to.exist;

      prev.click();

      await el.updateComplete;

      expect(el.month.getFullYear()).to.equal(startYear - 1);
    });
  });

  describe('toggle year select', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-month></sl-select-month>`);
    });

    it('should emit sl-toggle with detail "year" when clicking current year button', async () => {
      const onToggle = spy();

      el.addEventListener('sl-toggle', (e: CustomEvent) => {
        onToggle(e.detail);
      });

      const toggleBtn = el.renderRoot.querySelector('sl-button.current-year') as Button;

      expect(toggleBtn).to.exist;

      toggleBtn.click();

      await el.updateComplete;

      expect(onToggle).to.have.been.calledOnce;
      expect(onToggle.lastCall.args[0]).to.equal('year');
    });
  });

  describe('parts', () => {
    it('should add "today" and "selected" parts to the month button when month and selected equal the current month', async () => {
      const now = new Date();
      el = await fixture(
        html`<sl-select-month .month=${new Date(now.getFullYear(), now.getMonth(), 1)}></sl-select-month>`
      );
      await el.updateComplete;

      el.selected = new Date(now.getFullYear(), now.getMonth(), 1);
      await el.updateComplete;

      const button = Array.from(el.renderRoot.querySelectorAll('table.months button')).find(button =>
        (button.getAttribute('part') || '').includes('selected')
      );

      expect(button).to.exist;
      expect(button).to.match('[part~="today"]');
      expect(button).to.match('[part~="selected"]');
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
      const buttons = el.renderRoot.querySelectorAll('table.months button');
      const first = buttons[0] as HTMLButtonElement;

      first.focus();
      await userEvent.keyboard('{ArrowLeft}');

      await el.updateComplete;

      expect(el.month.getFullYear()).to.equal(month.getFullYear() - 1);
    });

    it('should increment year when ArrowRight is pressed on last button', async () => {
      const buttons = el.renderRoot.querySelectorAll('table.months button');
      const last = buttons[buttons.length - 1] as HTMLButtonElement;

      last.focus();
      await userEvent.keyboard('{ArrowRight}');

      await el.updateComplete;
      expect(el.month.getFullYear()).to.equal(month.getFullYear() + 1);
    });

    it('should decrement year when ArrowUp is pressed on a top row button', async () => {
      const buttons = el.renderRoot.querySelectorAll('table.months button');
      // pick index 1 (top row, middle)
      const target = buttons[1] as HTMLButtonElement;

      target.focus();
      await userEvent.keyboard('{ArrowUp}');

      await el.updateComplete;
      expect(el.month.getFullYear()).to.equal(month.getFullYear() - 1);
    });

    it('should increment year when ArrowDown is pressed on a last row button', async () => {
      const buttons = el.renderRoot.querySelectorAll('table.months button');
      // For 12 months and 3 columns, lastRowStart is index 9, choose index 10
      const target = buttons[10] as HTMLButtonElement;

      target.focus();
      await userEvent.keyboard('{ArrowDown}');

      await el.updateComplete;
      expect(el.month.getFullYear()).to.equal(month.getFullYear() + 1);
    });
  });
});
