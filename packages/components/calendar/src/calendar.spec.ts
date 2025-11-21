import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../register.js';
import { Calendar } from './calendar.js';
import { type MonthView } from './month-view.js';
import { type SelectDay } from './select-day.js';
import { type SelectMonth } from './select-month.js';
import { type SelectYear } from './select-year.js';

describe('sl-calendar', () => {
  let el: Calendar;

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
      el = await fixture(html`<sl-calendar></sl-calendar>`);
    });

    it('should use day mode', () => {
      expect(el.mode).to.equal('day');
    });

    it('should render sl-select-day component', () => {
      const selectDay = el.renderRoot.querySelector('sl-select-day');

      expect(selectDay).to.exist;
      expect(selectDay).not.to.have.attribute('aria-hidden');
      expect(selectDay).not.to.have.attribute('inert');
    });

    it('should not render month or year selectors', () => {
      const selectMonth = el.renderRoot.querySelector('sl-select-month'),
        selectYear = el.renderRoot.querySelector('sl-select-year');

      expect(selectMonth).not.to.exist;
      expect(selectYear).not.to.exist;
    });

    it('should not be readonly', () => {
      const selectDay = el.renderRoot.querySelector<SelectDay>('sl-select-day');

      expect(el.readonly).not.to.be.true;
      expect(selectDay?.readonly).not.to.be.true;
    });

    it('should be readonly when set', async () => {
      el.readonly = true;
      await el.updateComplete;

      const selectDay = el.renderRoot.querySelector<SelectDay>('sl-select-day');
      expect(selectDay?.readonly).to.be.true;
    });

    it('should not have a selected date', () => {
      const selectDay = el.renderRoot.querySelector<SelectDay>('sl-select-day');

      expect(el.selected).to.be.undefined;
      expect(selectDay?.selected).to.be.undefined;
    });

    it('should show the selected date when set', async () => {
      const selectedDate = new Date(2023, 5, 15);

      el.selected = selectedDate;
      await el.updateComplete;

      const selectDay = el.renderRoot.querySelector<SelectDay>('sl-select-day');
      expect(selectDay?.selected).to.equalDate(selectedDate);
    });

    it('should set month to selected date when only selected is provided', async () => {
      const selectedDate = new Date(2023, 5, 15);

      el.selected = selectedDate;
      await el.updateComplete;

      expect(el.month).to.equalDate(selectedDate);
    });

    it('should default month to current date when no selected date', () => {
      expect(el.month).to.exist;
      expect(el.month?.getMonth()).to.equal(new Date().getMonth());
      expect(el.month?.getFullYear()).to.equal(new Date().getFullYear());
    });

    it('should not have disabled dates', () => {
      expect(el.disabledDates).to.be.undefined;
    });

    it('should pass disabled dates to select-day', async () => {
      const disabledDates = [new Date(2023, 5, 10), new Date(2023, 5, 20)];

      el.disabledDates = disabledDates;
      await el.updateComplete;

      const selectDay = el.renderRoot.querySelector<SelectDay>('sl-select-day');
      expect(selectDay?.disabledDates).to.have.lengthOf(2);
      expect(selectDay?.disabledDates).to.deep.equal(disabledDates);
    });

    it('should not have indicator dates', () => {
      expect(el.indicatorDates).to.be.undefined;
    });

    it('should pass indicator dates to select-day', async () => {
      const indicatorDates = [
        { date: new Date(2023, 5, 10) },
        { date: new Date(2023, 5, 20), color: 'red' as const, label: 'Holiday' }
      ];

      el.indicatorDates = indicatorDates;
      await el.updateComplete;

      const selectDay = el.renderRoot.querySelector<SelectDay>('sl-select-day');
      expect(selectDay?.indicatorDates).to.have.lengthOf(2);
      expect(selectDay?.indicatorDates).to.deep.equal(indicatorDates);
    });

    it('should not show today', () => {
      expect(el.showToday).not.to.be.true;
    });

    it('should pass show-today to select-day', async () => {
      el.showToday = true;
      await el.updateComplete;

      const selectDay = el.renderRoot.querySelector<SelectDay>('sl-select-day');
      expect(selectDay?.showToday).to.be.true;
    });

    it('should not show week numbers', () => {
      expect(el.showWeekNumbers).not.to.be.true;
    });

    it('should pass show-week-numbers to select-day', async () => {
      el.showWeekNumbers = true;
      await el.updateComplete;

      const selectDay = el.renderRoot.querySelector<SelectDay>('sl-select-day');
      expect(selectDay?.showWeekNumbers).to.be.true;
    });

    it('should pass firstDayOfWeek to select-day', async () => {
      el.firstDayOfWeek = 0;
      await el.updateComplete;

      const selectDay = el.renderRoot.querySelector<SelectDay>('sl-select-day');
      expect(selectDay).to.have.attribute('first-day-of-week', '0');
    });

    it('should pass locale to select-day', async () => {
      el.locale = 'nl';
      await el.updateComplete;

      const selectDay = el.renderRoot.querySelector<SelectDay>('sl-select-day');
      expect(selectDay).to.have.attribute('locale', 'nl');
    });

    it('should pass min date to select-day', async () => {
      const minDate = new Date(2023, 0, 1);

      el.min = minDate;
      await el.updateComplete;

      const selectDay = el.renderRoot.querySelector<SelectDay>('sl-select-day');
      expect(selectDay).to.have.attribute('min', minDate.toISOString());
    });

    it('should pass max date to select-day', async () => {
      const maxDate = new Date(2023, 11, 31);

      el.max = maxDate;
      await el.updateComplete;

      const selectDay = el.renderRoot.querySelector<SelectDay>('sl-select-day');
      expect(selectDay).to.have.attribute('max', maxDate.toISOString());
    });
  });

  describe('date selection', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-calendar></sl-calendar>`);
    });

    it('should select a date when a day is clicked', () => {
      el.renderRoot
        .querySelector<SelectDay>('sl-select-day')
        ?.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])')
        ?.renderRoot.querySelector<HTMLElement>('button[part="day"]')
        ?.click();

      expect(el.selected).to.equalDate(new Date(2023, 2, 1));
    });

    it('should emit sl-change event when a date is selected', () => {
      let callCount = 0,
        selectedDate: Date | undefined;

      el.addEventListener('sl-change', (event: SlChangeEvent<Date>) => {
        callCount++;
        selectedDate = event.detail;
      });

      el.renderRoot
        .querySelector<SelectDay>('sl-select-day')
        ?.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])')
        ?.renderRoot.querySelector<HTMLElement>('button[part="day"]')
        ?.click();

      expect(callCount).to.equal(1);
      expect(selectedDate).to.equalDate(new Date(2023, 2, 1));
    });
  });

  describe('mode switching', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-calendar></sl-calendar>`);
    });

    it('should switch to month mode when month toggle is clicked', async () => {
      el.renderRoot
        .querySelector<SelectDay>('sl-select-day')
        ?.renderRoot.querySelector<HTMLElement>('.current-month')
        ?.click();
      await el.updateComplete;

      expect(el.mode).to.equal('month');
      expect(el.renderRoot.querySelector('sl-select-month')).to.exist;
    });

    it('should switch to year mode when year toggle is clicked', async () => {
      el.renderRoot
        .querySelector<SelectDay>('sl-select-day')
        ?.renderRoot.querySelector<HTMLElement>('.current-year')
        ?.click();
      await el.updateComplete;

      expect(el.mode).to.equal('year');
      expect(el.renderRoot.querySelector('sl-select-year')).to.exist;
    });

    it('should hide select-day when in month mode', async () => {
      const selectDay = el.renderRoot.querySelector<SelectDay>('sl-select-day');

      selectDay?.renderRoot.querySelector<HTMLElement>('.current-month')?.click();
      await el.updateComplete;

      expect(selectDay).to.have.attribute('aria-hidden', 'true');
      expect(selectDay).to.have.attribute('inert');
    });

    it('should hide select-day when in year mode', async () => {
      const selectDay = el.renderRoot.querySelector<SelectDay>('sl-select-day');

      selectDay?.renderRoot.querySelector<HTMLElement>('.current-year')?.click();
      await el.updateComplete;

      expect(selectDay).to.have.attribute('aria-hidden', 'true');
      expect(selectDay).to.have.attribute('inert');
    });

    it('should return to day mode when a month is selected', async () => {
      // Switch to month mode
      el.renderRoot
        .querySelector<SelectDay>('sl-select-day')
        ?.renderRoot.querySelector<HTMLElement>('.current-month')
        ?.click();
      await el.updateComplete;

      // Select a month
      el.renderRoot
        .querySelector<SelectMonth>('sl-select-month')
        ?.renderRoot.querySelector<HTMLElement>('button')
        ?.click();
      await el.updateComplete;

      expect(el.mode).to.equal('day');
    });

    it('should update month when a month is selected', async () => {
      el.month = new Date(2023, 0, 15);
      await el.updateComplete;

      // Switch to month mode
      el.renderRoot
        .querySelector<SelectDay>('sl-select-day')
        ?.renderRoot.querySelector<HTMLElement>('.current-month')
        ?.click();
      await el.updateComplete;

      // Select June (6th button = index 5)
      const monthButtons = Array.from(
        el.renderRoot.querySelector<SelectMonth>('sl-select-month')?.renderRoot.querySelectorAll('button') ?? []
      );
      monthButtons.at(5)?.click();
      await el.updateComplete;

      expect(el.month?.getMonth()).to.equal(5);
      expect(el.month?.getDate()).to.equal(15); // Should preserve day
    });

    it('should return to day mode when a year is selected', async () => {
      // Switch to year mode
      el.renderRoot
        .querySelector<SelectDay>('sl-select-day')
        ?.renderRoot.querySelector<HTMLElement>('.current-year')
        ?.click();
      await el.updateComplete;

      // Select a year
      el.renderRoot
        .querySelector<SelectYear>('sl-select-year')
        ?.renderRoot.querySelector<HTMLElement>('button')
        ?.click();
      await el.updateComplete;

      expect(el.mode).to.equal('day');
    });

    it('should update month year when a year is selected', async () => {
      el.month = new Date(2023, 5, 15);
      await el.updateComplete;

      // Switch to year mode
      el.renderRoot
        .querySelector<SelectDay>('sl-select-day')
        ?.renderRoot.querySelector<HTMLElement>('.current-year')
        ?.click();
      await el.updateComplete;

      // Select 2025 (year range is 2018-2029, so 2025 is at index 7)
      const selectYear = el.renderRoot.querySelector<SelectYear>('sl-select-year'),
        yearButtons = selectYear?.renderRoot.querySelectorAll<HTMLElement>('button');
      yearButtons?.[7]?.click();
      await el.updateComplete;

      expect(el.month?.getFullYear()).to.equal(2025);
      expect(el.month?.getMonth()).to.equal(5); // Should preserve month
      expect(el.month?.getDate()).to.equal(15); // Should preserve day
    });

    it('should restore previous mode when returning from year selector', async () => {
      // Start in day mode, go to month mode
      el.renderRoot
        .querySelector<SelectDay>('sl-select-day')
        ?.renderRoot.querySelector<HTMLElement>('.current-month')
        ?.click();
      await el.updateComplete;

      // From month mode, go to year mode
      el.renderRoot
        .querySelector<SelectMonth>('sl-select-month')
        ?.renderRoot.querySelector<HTMLElement>('.current-year')
        ?.click();
      await el.updateComplete;

      expect(el.mode).to.equal('year');

      // Select a year - should return to month mode
      el.renderRoot
        .querySelector<SelectYear>('sl-select-year')
        ?.renderRoot.querySelector<HTMLElement>('button')
        ?.click();
      await el.updateComplete;

      expect(el.mode).to.equal('month');
    });

    it('should focus select-day after returning from month selector', async () => {
      // Switch to month mode
      el.renderRoot
        .querySelector<SelectDay>('sl-select-day')
        ?.renderRoot.querySelector<HTMLElement>('.current-month')
        ?.click();
      await el.updateComplete;

      // Select a month
      el.renderRoot
        .querySelector<SelectMonth>('sl-select-month')
        ?.renderRoot.querySelector<HTMLElement>('button')
        ?.click();
      await el.updateComplete;

      // Wait for requestAnimationFrame
      await new Promise(resolve => requestAnimationFrame(resolve));

      expect(el.shadowRoot?.activeElement).to.match('sl-select-day');
    });

    it('should focus select-day after returning from year selector', async () => {
      // Switch to year mode
      el.renderRoot
        .querySelector<SelectDay>('sl-select-day')
        ?.renderRoot.querySelector<HTMLElement>('.current-year')
        ?.click();
      await el.updateComplete;

      // Select a year
      el.renderRoot
        .querySelector<SelectYear>('sl-select-year')
        ?.renderRoot.querySelector<HTMLElement>('button')
        ?.click();
      await el.updateComplete;

      // Wait for requestAnimationFrame
      await new Promise(resolve => requestAnimationFrame(resolve));

      expect(el.shadowRoot?.activeElement).to.match('sl-select-day');
    });

    it('should focus select-month when switching to month mode', async () => {
      // Switch to month mode
      el.renderRoot
        .querySelector<SelectDay>('sl-select-day')
        ?.renderRoot.querySelector<HTMLElement>('.current-month')
        ?.click();
      await el.updateComplete;

      // Wait for requestAnimationFrame
      await new Promise(resolve => requestAnimationFrame(resolve));

      expect(el.shadowRoot?.activeElement).to.match('sl-select-month');
    });

    it('should focus select-year when switching to year mode', async () => {
      // Switch to year mode
      el.renderRoot
        .querySelector<SelectDay>('sl-select-day')
        ?.renderRoot.querySelector<HTMLElement>('.current-year')
        ?.click();
      await el.updateComplete;

      // Wait for requestAnimationFrame
      await new Promise(resolve => requestAnimationFrame(resolve));

      expect(el.shadowRoot?.activeElement).to.match('sl-select-year');
    });
  });

  describe('month selector properties', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-calendar></sl-calendar>`);

      // Switch to month mode
      el.renderRoot
        .querySelector<SelectDay>('sl-select-day')
        ?.renderRoot.querySelector<HTMLElement>('.current-month')
        ?.click();
      await el.updateComplete;
    });

    it('should pass show-today to select-month', async () => {
      el.showToday = true;
      await el.updateComplete;

      const selectMonth = el.renderRoot.querySelector<SelectMonth>('sl-select-month');
      expect(selectMonth).to.have.attribute('show-today');
    });

    it('should pass selected date to select-month', async () => {
      const testDate = new Date(2023, 5, 15);

      el.selected = testDate;
      await el.updateComplete;

      const selectMonth = el.renderRoot.querySelector<SelectMonth>('sl-select-month');
      expect(selectMonth?.selected).to.equalDate(testDate);
    });

    it('should pass month to select-month', async () => {
      const testMonth = new Date(2023, 5, 15);

      el.month = testMonth;
      await el.updateComplete;

      const selectMonth = el.renderRoot.querySelector<SelectMonth>('sl-select-month');
      expect(selectMonth?.month).to.equalDate(testMonth);
    });

    it('should pass locale to select-month', async () => {
      el.locale = 'nl';
      await el.updateComplete;

      const selectMonth = el.renderRoot.querySelector<SelectMonth>('sl-select-month');
      expect(selectMonth).to.have.attribute('locale', 'nl');
    });

    it('should pass min to select-month', async () => {
      const minDate = new Date(2023, 0, 1);

      el.min = minDate;
      await el.updateComplete;

      const selectMonth = el.renderRoot.querySelector<SelectMonth>('sl-select-month');
      expect(selectMonth).to.have.attribute('min', minDate.toISOString());
    });

    it('should pass max to select-month', async () => {
      const maxDate = new Date(2023, 11, 31);

      el.max = maxDate;
      await el.updateComplete;

      const selectMonth = el.renderRoot.querySelector<SelectMonth>('sl-select-month');
      expect(selectMonth).to.have.attribute('max', maxDate.toISOString());
    });
  });

  describe('year selector properties', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-calendar></sl-calendar>`);

      // Switch to year mode
      el.renderRoot
        .querySelector<SelectDay>('sl-select-day')
        ?.renderRoot.querySelector<HTMLElement>('.current-year')
        ?.click();
      await el.updateComplete;
    });

    it('should pass show-today to select-year', async () => {
      el.showToday = true;
      await el.updateComplete;

      const selectYear = el.renderRoot.querySelector<SelectYear>('sl-select-year');
      expect(selectYear).to.have.attribute('show-today');
    });

    it('should pass selected date to select-year', async () => {
      const testDate = new Date(2023, 5, 15);

      el.selected = testDate;
      await el.updateComplete;

      const selectYear = el.renderRoot.querySelector<SelectYear>('sl-select-year');
      expect(selectYear?.selected).to.equalDate(testDate);
    });

    it('should pass month as year to select-year', async () => {
      const testMonth = new Date(2023, 5, 15);

      el.month = testMonth;
      await el.updateComplete;

      const selectYear = el.renderRoot.querySelector<SelectYear>('sl-select-year');
      expect(selectYear?.year).to.equalDate(testMonth);
    });

    it('should pass min to select-year', async () => {
      const minDate = new Date(2023, 0, 1);

      el.min = minDate;
      await el.updateComplete;

      const selectYear = el.renderRoot.querySelector<SelectYear>('sl-select-year');
      expect(selectYear).to.have.attribute('min', minDate.toISOString());
    });

    it('should pass max to select-year', async () => {
      const maxDate = new Date(2025, 11, 31);

      el.max = maxDate;
      await el.updateComplete;

      const selectYear = el.renderRoot.querySelector<SelectYear>('sl-select-year');
      expect(selectYear).to.have.attribute('max', maxDate.toISOString());
    });
  });
});
