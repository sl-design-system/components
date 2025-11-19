import { announce } from '@sl-design-system/announcer';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { type LitElement, html } from 'lit';
import sinon, { spy } from 'sinon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type MonthView } from './month-view.js';
import { SelectDay } from './select-day.js';

vi.mock('@sl-design-system/announcer', { spy: true });

try {
  customElements.define('sl-select-day', SelectDay);
} catch {
  /* already defined */
}

describe('sl-select-day', () => {
  let el: SelectDay;

  beforeEach(() => {
    // March 2023
    // --------------------
    // Mo Tu We Th Fr Sa Su
    // 27 28  1  2  3  4  5
    //  6  7  8  9 10 11 12
    // 13 14 15 16 17 18 19
    // 20 21 22 23 24 25 26
    // 27 28 29 30 31  1  2
    vi.setSystemTime(new Date(2023, 2, 14));
  });

  afterEach(() => vi.useRealTimers());

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-day></sl-select-day>`);
    });

    it('should set displayMonth, nextMonth and previousMonth based on month', () => {
      expect(el.displayMonth).to.equalDate(new Date(2023, 2, 1));
      expect(el.nextMonth).to.equalDate(new Date(2023, 3, 1));
      expect(el.previousMonth).to.equalDate(new Date(2023, 1, 1));
    });

    it('should not be readonly', () => {
      const monthView = el.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])');

      expect(el.readonly).not.to.be.true;
      expect(monthView?.readonly).not.to.be.true;
    });

    it('should be readonly when set', async () => {
      el.readonly = true;
      await el.updateComplete;

      const monthView = el.renderRoot.querySelector('sl-month-view:not([inert])');
      expect(monthView).to.have.property('readonly', true);
    });

    it('should not have a selected date', () => {
      const monthView = el.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])');

      expect(el.selected).to.be.undefined;
      expect(monthView?.selected).to.be.undefined;
    });

    it('should show the selected date when set', async () => {
      const selectedDate = new Date(2023, 2, 10);

      el.selected = selectedDate;
      await el.updateComplete;

      const monthView = el.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])');
      expect(monthView?.selected).to.equalDate(selectedDate);
    });

    it('should not have any disabled dates', () => {
      const monthView = el.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])');

      expect(el.disabledDates).to.be.undefined;
      expect(monthView?.disabledDates).to.be.undefined;
    });

    it('should show disabled dates when set', async () => {
      const disabledDates = [new Date(2023, 2, 5), new Date(2023, 2, 15), new Date(2023, 2, 25)];

      el.disabledDates = disabledDates;
      await el.updateComplete;

      const monthView = el.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])');
      expect(monthView?.disabledDates).to.have.lengthOf(3);
      expect(monthView?.disabledDates?.at(0)).to.equalDate(disabledDates[0]);
      expect(monthView?.disabledDates?.at(1)).to.equalDate(disabledDates[1]);
      expect(monthView?.disabledDates?.at(2)).to.equalDate(disabledDates[2]);
    });

    it('should not have any indicator dates', () => {
      const monthView = el.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])');

      expect(el.indicatorDates).to.be.undefined;
      expect(monthView?.indicatorDates).to.be.undefined;
    });

    it('should show indicator dates when set', async () => {
      const indicatorDates = [
        { date: new Date(2023, 2, 8) },
        { date: new Date(2023, 2, 18) },
        { date: new Date(2023, 2, 28) }
      ];

      el.indicatorDates = indicatorDates;
      await el.updateComplete;

      const monthView = el.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])');
      expect(monthView?.indicatorDates).to.have.lengthOf(3);
      expect(monthView?.indicatorDates?.at(0)?.date).to.equalDate(indicatorDates[0].date);
      expect(monthView?.indicatorDates?.at(1)?.date).to.equalDate(indicatorDates[1].date);
      expect(monthView?.indicatorDates?.at(2)?.date).to.equalDate(indicatorDates[2].date);
    });

    it('should not show today indicator', () => {
      const monthView = el.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])');

      expect(el.showToday).not.to.be.true;
      expect(monthView?.showToday).not.to.be.true;
    });

    it('should show today indicator when show-today is set', async () => {
      el.showToday = true;
      await el.updateComplete;

      const monthView = el.renderRoot.querySelector('sl-month-view:not([inert])');
      expect(monthView).to.have.property('showToday', true);
    });

    it('should navigate to the previous month after clicking the previous month button', async () => {});

    it('should announce the previous month after clicking the previous month button', async () => {
      el.renderRoot.querySelector<HTMLElement>('sl-button.previous-month')?.click();

      // Wait for the announcement to be made from a setTimeout
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(announce).toHaveBeenCalledWith('February 2023', 'polite');
    });

    it('should navigate to the next month after clicking the next month button', async () => {});

    it('should announce the next month after clicking the next month button', async () => {
      el.renderRoot.querySelector<HTMLElement>('sl-button.next-month')?.click();

      // Wait for the announcement to be made from a setTimeout
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(announce).toHaveBeenCalledWith('April 2023', 'polite');
    });

    it('should emit an sl-select event when a date is selected', async () => {
      const onSelect = spy();

      el.addEventListener('sl-select', onSelect);
      el.renderRoot
        .querySelector<MonthView>('sl-month-view:not([inert])')
        ?.renderRoot.querySelector<HTMLElement>('button[part="day"]')
        ?.click();
      await el.updateComplete;

      expect(onSelect).to.have.been.calledOnce;
    });

    it('should emit an sl-toggle "month" event when clicking current month button', async () => {
      const onToggle = spy();

      el.addEventListener('sl-toggle', onToggle);
      el.renderRoot.querySelector<HTMLElement>('sl-button.current-month')?.click();
      await el.updateComplete;

      expect(onToggle).to.have.been.calledOnce;
      expect(onToggle.lastCall.args[0]).to.have.property('detail', 'month');
    });

    it('should emit an sl-toggle "year" event when clicking current year button', async () => {
      const onToggle = spy();

      el.addEventListener('sl-toggle', onToggle);
      el.renderRoot.querySelector<HTMLElement>('sl-button.current-year')?.click();
      await el.updateComplete;

      expect(onToggle).to.have.been.calledOnce;
      expect(onToggle.lastCall.args[0]).to.have.property('detail', 'year');
    });

    describe('days of the week', () => {
      it('should render the days of the week', () => {
        const daysOfWeek = Array.from(el.renderRoot.querySelectorAll<HTMLElement>('.days-of-week .day-of-week')).map(
          day => day.textContent?.trim()
        );

        expect(daysOfWeek).to.deep.equal(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
      });

      it('should have role list with listitems for days of the week', () => {
        const daysOfWeek = el.renderRoot.querySelector<HTMLElement>('.days-of-week'),
          dayElements = Array.from(daysOfWeek?.querySelectorAll<HTMLElement>('.day-of-week') ?? []);

        expect(daysOfWeek).to.have.attribute('role', 'list');
        expect(dayElements.every(d => d.getAttribute('role') === 'listitem')).to.be.true;
      });

      it('should not render the days of the week in the month-view', () => {
        const monthView = el.renderRoot.querySelector<LitElement>('sl-month-view:not([inert])'),
          header = monthView?.renderRoot.querySelector('[part="header"]');

        expect(header).to.exist;
        expect(header).to.have.style('display', 'none');
      });

      it('should start on Sunday when the first day of the week is 0', async () => {
        el.firstDayOfWeek = 0;
        await el.updateComplete;

        const daysOfWeek = Array.from(el.renderRoot.querySelectorAll<HTMLElement>('.days-of-week .day-of-week')).map(
          day => day.textContent?.trim()
        );

        expect(daysOfWeek).to.deep.equal(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
      });
    });

    describe('week numbers', () => {
      it('should not show the week numbers', () => {
        expect(el.showWeekNumbers).not.to.be.true;
      });

      it('should show week number header when show-week-numbers set', async () => {
        el.showWeekNumbers = true;
        await el.updateComplete;

        const weekHeader = el.renderRoot.querySelector('.days-of-week .week-number');
        expect(weekHeader).to.have.trimmed.text('wk.');
      });

      it('should localize the week number header', async () => {
        el.showWeekNumbers = true;
        el.locale = 'fi';
        await el.updateComplete;

        const weekHeader = el.renderRoot.querySelector('.days-of-week .week-number');
        expect(weekHeader).to.have.trimmed.text('vk');
      });

      it('should show week numbers when show-week-numbers set', async () => {
        el.showWeekNumbers = true;
        await el.updateComplete;

        const monthView = el.renderRoot.querySelector('sl-month-view:not([inert])');
        expect(monthView).to.have.property('showWeekNumbers', true);
      });
    });
  });

  describe('min/max', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-day></sl-select-day>`);
    });

    it('should disable previous-month button when at min boundary', async () => {
      el.min = new Date(2023, 2, 1);
      await el.updateComplete;

      const prevButton = el.renderRoot.querySelector('sl-button.previous-month');

      expect(prevButton).to.match(':disabled');
    });

    it('should disable next-month button when at max boundary', async () => {
      el.max = new Date(2023, 2, 31);
      await el.updateComplete;

      const nextButton = el.renderRoot.querySelector('sl-button.next-month');

      expect(nextButton).to.match(':disabled');
    });

    it('should render only two month views when at min boundary', async () => {
      el.min = new Date(2023, 2, 1);
      await el.updateComplete;

      const monthViews = el.renderRoot.querySelectorAll('sl-month-view');

      expect(monthViews).to.have.lengthOf(2);
    });

    it('should render only two month views when at max boundary', async () => {
      el.max = new Date(2023, 2, 31);
      await el.updateComplete;

      const monthViews = el.renderRoot.querySelectorAll('sl-month-view');

      expect(monthViews).to.have.lengthOf(2);
    });

    it('should render only one month view when at both boundaries', async () => {
      el.min = new Date(2023, 2, 1);
      el.max = new Date(2023, 2, 31);
      await el.updateComplete;

      const monthViews = el.renderRoot.querySelectorAll('sl-month-view');

      expect(monthViews).to.have.lengthOf(1);
    });
  });

  describe('scrolling', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-day></sl-select-day>`);
    });

    it('should render three month views (previous, current, next) by default', () => {
      const monthViews = el.renderRoot.querySelectorAll('sl-month-view');

      expect(monthViews).to.have.lengthOf(3);
    });

    it('should set previous and next month views as inert', () => {
      const monthViews = Array.from(el.renderRoot.querySelectorAll('sl-month-view'));

      expect(monthViews[0]).to.have.attribute('inert');
      expect(monthViews[1]).not.to.have.attribute('inert');
      expect(monthViews[2]).to.have.attribute('inert');
    });

    it('should set previous and next month views as aria-hidden', () => {
      const monthViews = Array.from(el.renderRoot.querySelectorAll('sl-month-view'));

      expect(monthViews[0]).to.have.attribute('aria-hidden', 'true');
      expect(monthViews[1]).not.to.have.attribute('aria-hidden');
      expect(monthViews[2]).to.have.attribute('aria-hidden', 'true');
    });

    it('should scroll to center month on initialization', async () => {
      const scroller = el.renderRoot.querySelector<HTMLElement>('.scroller');

      // Wait for resize observer to trigger
      await new Promise(resolve => requestAnimationFrame(resolve));
      await new Promise(resolve => requestAnimationFrame(resolve));

      // The scroll position should be at the center (width * 1)
      expect(scroller?.scrollLeft).to.be.greaterThan(0);
    });

    it('should update displayMonth when scrolling to >= 50% visibility', async () => {
      const initialDisplayMonth = el.displayMonth;

      // Simulate clicking next button to scroll
      el.renderRoot.querySelector<HTMLElement>('sl-button.next-month')?.click();

      // Wait for intersection observer
      await new Promise(resolve => setTimeout(resolve, 100));

      // displayMonth should update to reflect visible month
      expect(el.displayMonth).not.to.equalDate(initialDisplayMonth!);
    });

    it('should use smooth scrolling when clicking navigation buttons', async () => {
      const scrollToSpy = spy(el.scroller!, 'scrollTo');

      el.renderRoot.querySelector<HTMLElement>('sl-button.next-month')?.click();
      await el.updateComplete;

      expect(scrollToSpy).to.have.been.calledWith(
        sinon.match({
          behavior: 'smooth'
        })
      );
    });

    it('should update month views when month changes', async () => {
      el.month = new Date(2023, 5, 15); // June 2023;
      await el.updateComplete;

      const monthViews = Array.from(el.renderRoot.querySelectorAll('sl-month-view'));

      // Check that the internal state is correct
      expect(el.displayMonth).to.equalDate(new Date(2023, 5, 1)); // June
      expect(el.previousMonth).to.equalDate(new Date(2023, 4, 1)); // May
      expect(el.nextMonth).to.equalDate(new Date(2023, 6, 1)); // July

      // Verify month views have correct months (they receive the actual date, not normalized to day 1)
      expect(monthViews[0].month).to.equalDate(new Date(2023, 4, 1));
      expect(monthViews[1].month).to.equalDate(new Date(2023, 5, 15));
      expect(monthViews[2].month).to.equalDate(new Date(2023, 6, 1));
    });

    it('should scroll to position 0 when at min boundary', async () => {
      el.min = new Date(2023, 2, 1);
      await el.updateComplete;

      const scroller = el.renderRoot.querySelector<HTMLElement>('.scroller');

      // Wait for resize observer to trigger scroll
      await new Promise(resolve => requestAnimationFrame(resolve));

      // Current month should be at position 0 (no previous month rendered)
      expect(scroller?.scrollLeft).to.equal(0);
    });

    it('should scroll to position 1 width when at max boundary', async () => {
      el.max = new Date(2023, 2, 31);
      await el.updateComplete;

      const scroller = el.renderRoot.querySelector<HTMLElement>('.scroller'),
        { width } = scroller!.getBoundingClientRect();

      // Wait for resize observer to trigger scroll
      await new Promise(resolve => requestAnimationFrame(resolve));

      expect(scroller?.scrollLeft).to.equal(width);
    });

    it('should keep current month view active (not inert) when only one view', async () => {
      el.min = new Date(2023, 2, 1);
      el.max = new Date(2023, 2, 31);
      await el.updateComplete;

      const monthView = el.renderRoot.querySelector('sl-month-view');

      expect(monthView).not.to.have.attribute('inert');
      expect(monthView).not.to.have.attribute('aria-hidden');
    });

    it('should update intersection observer after scrollend', async () => {
      // Simulate scrolling to next month
      el.renderRoot.querySelector<HTMLElement>('sl-button.next-month')?.click();

      // Wait for smooth scroll
      await new Promise(resolve => setTimeout(resolve, 100));

      // Manually update displayMonth (simulating intersection observer)
      el.displayMonth = new Date(2023, 3, 1);

      // Trigger scrollend event
      const scroller = el.renderRoot.querySelector<HTMLElement>('.scroller');
      scroller?.dispatchEvent(new Event('scrollend'));

      await el.updateComplete;

      // Month should be updated
      expect(el.month).to.equalDate(new Date(2023, 3, 1));
    });

    it('should re-observe new month views after scrollend', async () => {
      const initialMonthViews = el.renderRoot.querySelectorAll('sl-month-view');
      expect(initialMonthViews).to.have.lengthOf(3);

      // Simulate scrolling and displayMonth change
      el.displayMonth = new Date(2023, 3, 1);
      const scroller = el.renderRoot.querySelector<HTMLElement>('.scroller');
      scroller?.dispatchEvent(new Event('scrollend'));

      await el.updateComplete;

      // New month views should be rendered
      const newMonthViews = el.renderRoot.querySelectorAll('sl-month-view');
      expect(newMonthViews).to.have.lengthOf(3);

      // Verify they represent different months
      expect(el.previousMonth).to.equalDate(new Date(2023, 2, 1));
      expect(el.displayMonth).to.equalDate(new Date(2023, 3, 1));
      expect(el.nextMonth).to.equalDate(new Date(2023, 4, 1));
    });
  });
});
