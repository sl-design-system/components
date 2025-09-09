import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import { SelectDay } from './select-day.js';

try {
  customElements.define('sl-select-day', SelectDay);
} catch {
  /* already defined */
}

describe('sl-select-day', () => {
  let el: SelectDay;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-day .month=${new Date(2025, 5, 15)}></sl-select-day>`);
      await el.updateComplete;
    });

    it('should set displayMonth, nextMonth and previousMonth based on month', () => {
      expect(el.displayMonth?.getMonth()).to.equal(5);
      expect(el.nextMonth?.getMonth()).to.equal(6);
      expect(el.previousMonth?.getMonth()).to.equal(4);
    });

    it('should generate 7 weekday headers', () => {
      expect(el.weekDays).to.have.lengthOf(7);
    });

    it('should update weekday ordering when firstDayOfWeek changes', async () => {
      const firstBefore = el.weekDays[0].short;
      el.firstDayOfWeek = 0; // Sunday
      await el.updateComplete;
      const firstAfter = el.weekDays[0].short;
      expect(firstAfter).to.not.equal(firstBefore);
    });

    it('should show week number header when show-week-numbers set', async () => {
      el.showWeekNumbers = true;
      await el.updateComplete;
      const weekHeader = el.renderRoot.querySelector('.days-of-week .week-number');
      expect(weekHeader).to.exist;
    });
  });

  describe('min/max boundaries', () => {
    beforeEach(async () => {
      const month = new Date(2025, 5, 15); // June 2025
      const min = new Date(2025, 5, 1); // same month start
      const max = new Date(2025, 5, 30); // same month end
      el = await fixture(html`<sl-select-day .month=${month} .min=${min} .max=${max}></sl-select-day>`);
      await el.updateComplete;
    });

    it('should disable previous-month navigation when at min boundary', () => {
      const prevBtn = el.renderRoot.querySelector('sl-button.previous-month');
      expect(prevBtn).to.exist.and.match(':disabled');
    });

    it('should disable next-month navigation when at max boundary', () => {
      const nextBtn = el.renderRoot.querySelector('sl-button.next-month');
      expect(nextBtn).to.exist.and.match(':disabled');
    });
  });

  describe('toggle events', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-day .month=${new Date()}></sl-select-day>`);
      await el.updateComplete;
    });

    it('should emit sl-toggle "month" when clicking current month button', async () => {
      const onToggle = new Promise<CustomEvent>(resolve =>
        el.addEventListener('sl-toggle', e => resolve(e as CustomEvent))
      );
      const monthBtn = el.renderRoot.querySelector('sl-button.current-month');
      (monthBtn as HTMLButtonElement | null)?.click?.();
      const ev = await onToggle;
      expect(ev.detail).to.equal('month');
    });

    it('should emit sl-toggle "year" when clicking current year button', async () => {
      const onToggle = new Promise<CustomEvent>(resolve =>
        el.addEventListener('sl-toggle', e => resolve(e as CustomEvent))
      );
      const yearBtn = Array.from(el.renderRoot.querySelectorAll('sl-button.current-year')).find(
        btn => !btn.classList.contains('previous-month') && !btn.classList.contains('next-month')
      );
      (yearBtn as HTMLButtonElement | null)?.click?.();
      const ev = await onToggle;
      expect(ev.detail).to.equal('year');
    });
  });

  describe('selection & change propagation', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-day .month=${new Date(2025, 5, 15)}></sl-select-day>`);
      await el.updateComplete;
    });

    it('should re-set month when receiving sl-change from inner month view', async () => {
      const targetMonthView = el.renderRoot.querySelector('sl-month-view:nth-of-type(2)');
      const date = new Date(2025, 7, 10); // August 2025
      targetMonthView?.dispatchEvent(
        new CustomEvent('sl-change', { detail: date, bubbles: true, composed: true, cancelable: true })
      );
      await el.updateComplete;
      expect(el.month?.getMonth()).to.equal(7);
    });

    it('should emit sl-select when inner month view emits sl-select', async () => {
      const onSelect = new Promise<CustomEvent>(resolve =>
        el.addEventListener('sl-select', e => resolve(e as CustomEvent))
      );
      const targetMonthView = el.renderRoot.querySelector('sl-month-view:nth-of-type(2)');
      const date = new Date(2025, 5, 20);
      targetMonthView?.dispatchEvent(
        new CustomEvent('sl-select', { detail: date, bubbles: true, composed: true, cancelable: true })
      );
      const ev = await onSelect;
      expect(ev.detail).to.be.instanceOf(Date);
      expect((ev.detail as Date).getDate()).to.equal(20);
    });
  });
});
