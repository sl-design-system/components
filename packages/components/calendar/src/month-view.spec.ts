import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import '@sl-design-system/tooltip/register.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { type TemplateResult, html } from 'lit';
import { spy } from 'sinon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
import { MonthView } from './month-view.js';
import { type Day } from './utils.js';

describe('sl-month-view', () => {
  let el: MonthView;

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
      el = await fixture(html`<sl-month-view></sl-month-view>`);
    });

    it('should use the english locale', () => {
      expect(el.locale).to.equal('en');
    });

    it('should use the current month', () => {
      const now = new Date();

      expect(el.month.getFullYear()).to.equal(now.getFullYear());
      expect(el.month.getMonth()).to.equal(now.getMonth());
    });

    it('should not have a min date', () => {
      expect(el.min).to.be.undefined;
    });

    it('should not have a max date', () => {
      expect(el.max).to.be.undefined;
    });

    it('should not be readonly', () => {
      expect(el.readonly).not.to.be.true;
      expect(el).not.to.have.attribute('readonly');
    });

    it('should be readonly when set', async () => {
      el.readonly = true;
      await el.updateComplete;

      expect(el).to.have.attribute('readonly');
    });

    it('should not show today', () => {
      expect(el.showToday).not.to.be.true;
    });

    it('should set a header part on the thead element', () => {
      const thead = el.renderRoot.querySelector('thead');

      expect(thead).to.have.attribute('part', 'header');
    });

    it('should render the weekday short names', () => {
      const weekdays = Array.from(el.renderRoot.querySelectorAll('thead th[part~="week-day"]'));

      expect(weekdays).to.have.length(7);
      expect(weekdays.map(th => th.textContent?.trim())).to.deep.equal([
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
        'Sun'
      ]);
    });

    it('should render localized weekday short names', async () => {
      el.locale = 'it';
      await el.updateComplete;

      const weekdays = Array.from(el.renderRoot.querySelectorAll('thead th[part~="week-day"]'));

      expect(weekdays).to.have.length(7);
      expect(weekdays.map(th => th.textContent?.trim())).to.deep.equal([
        'lun',
        'mar',
        'mer',
        'gio',
        'ven',
        'sab',
        'dom'
      ]);
    });

    it('should not show the week numbers', () => {
      const weekNumbers = el.renderRoot.querySelectorAll('[part~="week-number"]');

      expect(el.showWeekNumbers).not.to.be.true;
      expect(weekNumbers).to.have.length(0);
    });

    it('should show the week numbers when set', async () => {
      el.showWeekNumbers = true;
      await el.updateComplete;

      expect(el.showWeekNumbers).to.be.true;

      const weekNumbers = el.renderRoot.querySelectorAll('[part~="week-number"]');
      expect(weekNumbers.length).to.be.greaterThan(0);
    });

    it('should render week number column header when showWeekNumbers is set', async () => {
      el.showWeekNumbers = true;
      await el.updateComplete;

      const weekNumberHeader = el.renderRoot.querySelector('th[part~="week-number"]');

      expect(weekNumberHeader).to.have.trimmed.text('wk.');
    });

    it('should render localized week number header', async () => {
      el.locale = 'it';
      el.showWeekNumbers = true;
      await el.updateComplete;

      const weekNumberHeader = el.renderRoot.querySelector('th[part~="week-number"]');

      expect(weekNumberHeader).to.have.trimmed.text('sett.');
    });

    it('should have Monday as the first day of the week', () => {
      expect(el.firstDayOfWeek).to.equal(1);
    });

    it('should reorder weekdays when firstDayOfWeek changes', async () => {
      el.firstDayOfWeek = 0; // Sunday
      await el.updateComplete;

      const weekdays = Array.from(el.renderRoot.querySelectorAll('th[part~="week-day"]'));
      expect(weekdays.map(th => th.textContent?.trim())).to.deep.equal([
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
      ]);
    });

    it('should render the days of the month', () => {
      const dayButtons = Array.from(el.renderRoot.querySelectorAll('button[part~="day"]')),
        dayNumbers = dayButtons.map(button => Number(button.textContent?.trim()));

      expect(dayNumbers).to.deep.equal([
        27, 28, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
        29, 30, 31, 1, 2
      ]);
    });

    it('should not hide the days from the other months', () => {
      expect(el.hideDaysOtherMonths).not.to.be.true;

      const daysFromOtherMonths = Array.from(
        el.renderRoot.querySelectorAll(':where([part~="next-month"], [part~="previous-month"])')
      );

      expect(daysFromOtherMonths.length).to.be.greaterThan(0);
    });

    it('should hide days from other months when hideDaysOtherMonths is set', async () => {
      el.hideDaysOtherMonths = true;
      await el.updateComplete;

      const daysFromOtherMonths = Array.from(
        el.renderRoot.querySelectorAll(':where([part~="next-month"], [part~="previous-month"])')
      );

      expect(daysFromOtherMonths).to.have.length(0);
    });
  });

  describe('custom renderer', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-month-view show-today></sl-month-view>`);
    });

    it('should not have a custom renderer by default', () => {
      expect(el.renderer).to.be.undefined;
    });

    it('should call the renderer callback for every day', async () => {
      const renderer = spy(() => undefined);

      el.renderer = renderer;
      await el.updateComplete;

      expect(renderer.callCount).to.equal(7 * 5);
    });

    it('should render custom content from the renderer', async () => {
      el.renderer = (day: Day, monthView: MonthView): TemplateResult | undefined => {
        if (day.today) {
          return html`<button .part=${monthView.getDayParts(day).join(' ')}><span>TODAY</span></button>`;
        }

        return undefined;
      };
      await el.updateComplete;

      const dayButtons = Array.from(el.renderRoot.querySelectorAll('button[part~="day"]')),
        dayLabels = dayButtons.map(button => button.textContent?.trim());

      expect(dayLabels).to.deep.equal([
        '27',
        '28',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        'TODAY',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
        '24',
        '25',
        '26',
        '27',
        '28',
        '29',
        '30',
        '31',
        '1',
        '2'
      ]);
    });

    it('should fallback to default rendering when undefined is returned', async () => {
      el.renderer = () => undefined;
      await el.updateComplete;

      const dayButtons = Array.from(el.renderRoot.querySelectorAll('button[part~="day"]')),
        dayNumbers = dayButtons.map(button => Number(button.textContent?.trim()));

      expect(dayNumbers).to.deep.equal([
        27, 28, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
        29, 30, 31, 1, 2
      ]);
    });
  });

  describe('parts', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-month-view show-today show-week-numbers></sl-month-view>`);
    });

    it('should apply "week-number" to the column header', () => {
      const weekNumber = el.renderRoot.querySelector('th[part~="week-number"]');

      expect(weekNumber).to.exist;
    });

    it('should apply "week-number" to week number cells', () => {
      const weekNumbers = Array.from(el.renderRoot.querySelectorAll('td[part~="week-number"]'));

      expect(weekNumbers).to.have.length(5);
    });

    it('should apply "week-day" to the days of the week headers', () => {
      const weekDays = Array.from(el.renderRoot.querySelectorAll('th[part~="week-day"]'));

      expect(weekDays).to.have.length(7);
    });

    it('should apply "day" to the day buttons', () => {
      const days = Array.from(el.renderRoot.querySelectorAll('button[part~="day"]'));

      expect(days).to.be.length(7 * 5);
    });

    it('should apply "previous-month" to days from previous month', () => {
      const prevMonthDays = Array.from(el.renderRoot.querySelectorAll('button[part~="previous-month"]'));

      expect(prevMonthDays).to.have.length(2);
    });

    it('should apply "next-month" to days from next month', () => {
      const nextMonthDays = Array.from(el.renderRoot.querySelectorAll('button[part~="next-month"]'));

      expect(nextMonthDays).to.have.length(2);
    });

    it('should apply "today" part when showToday is set', () => {
      const today = el.renderRoot.querySelector('button[part~="today"]');

      expect(today).to.exist;
      expect(today?.textContent?.trim()).to.equal('14');
    });

    it('should apply "selected" to the selected day', async () => {
      el.selected = new Date(el.month.getFullYear(), el.month.getMonth(), 15);
      await el.updateComplete;

      const selected = el.renderRoot.querySelector('button[part~="selected"]');

      expect(selected).to.exist;
      expect(selected?.textContent?.trim()).to.equal('15');
    });

    it('should apply "indicator" part when indicator dates provided', async () => {
      el.indicatorDates = [{ date: new Date(el.month.getFullYear(), el.month.getMonth(), 20) }];
      await el.updateComplete;

      const indicator = el.renderRoot.querySelector('button[part~="indicator"]');

      expect(indicator).to.exist;
      expect(indicator?.textContent?.trim()).to.equal('20');
    });

    it('should apply "indicator-<color>" part when indicator with color is provided', async () => {
      el.indicatorDates = [{ date: new Date(el.month.getFullYear(), el.month.getMonth(), 20), color: 'red' }];
      await el.updateComplete;

      const indicator = el.renderRoot.querySelector('button[part~="indicator-red"]');

      expect(indicator).to.exist;
      expect(indicator?.textContent?.trim()).to.equal('20');
    });

    it('should apply "disabled" part when disabled dates provided', async () => {
      el.disabledDates = [new Date(el.month.getFullYear(), el.month.getMonth(), 25)];
      await el.updateComplete;

      const disabled = el.renderRoot.querySelector('button[part~="disabled"]');

      expect(disabled).to.exist;
      expect(disabled?.textContent?.trim()).to.equal('25');
    });

    it('should apply "out-of-range" part when min and max are set', async () => {
      el.min = new Date(el.month.getFullYear(), el.month.getMonth(), 10);
      el.max = new Date(el.month.getFullYear(), el.month.getMonth(), 20);
      await el.updateComplete;

      const outOfRange = Array.from(el.renderRoot.querySelectorAll('button[part~="out-of-range"]')),
        outOfRangeDays = outOfRange.map(button => Number(button.textContent?.trim()));

      expect(outOfRangeDays).to.deep.equal([
        27, 28, 1, 2, 3, 4, 5, 6, 7, 8, 9, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2
      ]);
    });
  });

  describe('disabled dates', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-month-view></sl-month-view>`);
    });

    it('should not disable dates by default', () => {
      const buttons = Array.from(el.renderRoot.querySelectorAll('button[disabled]'));

      expect(buttons).to.have.length(0);
    });

    it('should disable specified dates', async () => {
      el.disabledDates = [new Date(el.month.getFullYear(), el.month.getMonth(), 10)];
      await el.updateComplete;

      const button = el.renderRoot.querySelector('button[disabled]');

      expect(button).to.exist;
      expect(button?.textContent?.trim()).to.equal('10');
    });
  });

  describe('indicator dates', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-month-view></sl-month-view>`);
    });

    it('should not have indicator dates by default', () => {
      const buttons = Array.from(el.renderRoot.querySelectorAll('button[part~="indicator"]'));

      expect(buttons).to.have.length(0);
    });

    it('should render a tooltip for the indicator with label', async () => {
      el.indicatorDates = [{ date: new Date(el.month.getFullYear(), el.month.getMonth(), 13), label: 'Special day' }];
      await el.updateComplete;

      const button = el.renderRoot.querySelector<HTMLElement>('button[part~="indicator"]'),
        tooltip = button?.nextElementSibling;

      expect(button).to.exist;
      expect(button).to.have.attribute('aria-describedby', tooltip?.id);

      expect(tooltip).to.match('sl-tooltip');
      expect(tooltip).to.have.attribute('id');
      expect(tooltip?.textContent?.trim()).to.equal('Special day');
    });

    it('should render no tooltip when no color or label provided', async () => {
      el.indicatorDates = [{ date: new Date(el.month.getFullYear(), el.month.getMonth(), 15) }];
      await el.updateComplete;

      const button = el.renderRoot.querySelector<HTMLElement>('button[part~="indicator"]');

      expect(button).to.exist;
      expect(button?.nextElementSibling).to.be.null;
    });
  });

  describe('min/max', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-month-view></sl-month-view>`);
    });

    it('should not set min/max by default', () => {
      expect(el.min).to.be.undefined;
      expect(el.max).to.be.undefined;
    });

    it('should not have any out of range dates by default', () => {
      const buttons = Array.from(el.renderRoot.querySelectorAll('button[part~="out-of-range"]'));

      expect(buttons).to.have.length(0);
    });

    it('should disable dates before min', async () => {
      el.min = new Date(el.month.getFullYear(), el.month.getMonth(), 10);
      await el.updateComplete;

      const buttons = Array.from(el.renderRoot.querySelectorAll<HTMLButtonElement>('button[part~="out-of-range"]')),
        days = buttons.map(button => Number(button.textContent?.trim()));

      expect(buttons.every(b => b.disabled)).to.be.true;
      expect(days).to.deep.equal([27, 28, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('should disable dates after max', async () => {
      el.max = new Date(el.month.getFullYear(), el.month.getMonth(), 20);
      await el.updateComplete;

      const buttons = Array.from(el.renderRoot.querySelectorAll<HTMLButtonElement>('button[part~="out-of-range"]')),
        days = buttons.map(button => Number(button.textContent?.trim()));

      expect(buttons.every(b => b.disabled)).to.be.true;
      expect(days).to.deep.equal([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2]);
    });
  });

  describe('accessibility', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-month-view show-today show-week-numbers></sl-month-view>`);
    });

    it('should have an aria-label on the table', () => {
      const table = el.renderRoot.querySelector('table');

      expect(table).to.have.attribute('aria-label', 'Days of March 2023');
    });

    it('should have an aria-label for the week number column header', () => {
      const weekNumberHeader = el.renderRoot.querySelector('th[part~="week-number"]');

      expect(weekNumberHeader).to.have.attribute('aria-label', 'Week');
    });

    it('should have an aria-label for the week number cells', () => {
      const weekNumberCells = Array.from(el.renderRoot.querySelectorAll('td[part~="week-number"]')),
        labels = weekNumberCells.map(td => td.getAttribute('aria-label'));

      expect(labels).to.deep.equal(['Week 9', 'Week 10', 'Week 11', 'Week 12', 'Week 13']);
    });

    it('should have an aria-label for the days of the week headers', () => {
      const weekDayHeaders = Array.from(el.renderRoot.querySelectorAll('th[part~="week-day"]')),
        labels = weekDayHeaders.map(th => th.getAttribute('aria-label'));

      expect(labels).to.deep.equal(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
    });

    it('should set aria-current="date" on today', () => {
      const today = el.renderRoot.querySelector('button[part~="today"]');

      expect(today).to.have.attribute('aria-current', 'date');
    });

    it('should set aria-pressed="true" on selected day', async () => {
      el.selected = new Date(el.month.getFullYear(), el.month.getMonth(), el.month.getDate());
      await el.updateComplete;

      const selected = el.renderRoot.querySelector('button[part~="selected"]');

      expect(selected).to.exist;
      expect(selected).to.have.attribute('aria-pressed', 'true');
    });
  });

  describe('selection', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-month-view></sl-month-view>`);
    });

    describe('current month', () => {
      it('should select a day when clicked', () => {
        let date: Date | null = null;

        el.addEventListener('sl-select', (event: SlChangeEvent<Date>) => (date = event.detail));
        el.renderRoot
          .querySelector<HTMLElement>('button[part~="day"]:not([part~="previous-month"]):not([part~="next-month"])')
          ?.click();

        expect(date).to.equalDate(new Date(2023, 2, 1));
        expect(el.selected).to.equalDate(new Date(2023, 2, 1));
      });

      it('should not emit an sl-select event when clicking an already selected day', async () => {
        const onSelect = spy();

        el.selected = new Date(2023, 2, 1);
        await el.updateComplete;

        el.addEventListener('sl-select', onSelect);
        el.renderRoot
          .querySelector<HTMLElement>('button[part~="day"]:not([part~="previous-month"]):not([part~="next-month"])')
          ?.click();
        await el.updateComplete;

        expect(onSelect).to.not.have.been.called;
      });

      it('should select a day when focused and Enter is pressed', async () => {
        let date: Date | null = null;

        el.addEventListener('sl-select', (event: SlChangeEvent<Date>) => (date = event.detail));
        el.focus();

        await userEvent.keyboard('{Enter}');

        expect(date).to.equalDate(new Date(2023, 2, 1));
        expect(el.selected).to.equalDate(new Date(2023, 2, 1));
      });

      it('should select a day when focused and Space is pressed', async () => {
        let date: Date | null = null;

        el.addEventListener('sl-select', (event: SlChangeEvent<Date>) => (date = event.detail));
        el.focus();

        await userEvent.keyboard('{Space}');

        expect(date).to.equalDate(new Date(2023, 2, 1));
        expect(el.selected).to.equalDate(new Date(2023, 2, 1));
      });

      it('should toggle the selection when a different day is selected', async () => {
        el.selected = new Date(2023, 2, 5);
        await el.updateComplete;

        el.renderRoot
          .querySelector<HTMLElement>('button[part~="day"]:not([part~="previous-month"]):not([part~="next-month"])')
          ?.click();
        await el.updateComplete;

        expect(el.selected).to.equalDate(new Date(2023, 2, 1));
      });
    });

    describe('not the current month', () => {
      it('should select a day when clicked', async () => {
        let date: Date | null = null;

        el.addEventListener('sl-select', (event: SlChangeEvent<Date>) => (date = event.detail));
        el.renderRoot.querySelector<HTMLElement>('button[part~="next-month"]')?.click();
        await el.updateComplete;

        expect(date).to.equalDate(new Date(2023, 3, 1));
        expect(el.selected).to.equalDate(new Date(2023, 3, 1));
      });

      it('should emit an sl-change event when the month changes due to selection', () => {
        let date: Date | null = null;

        el.addEventListener('sl-change', (event: SlChangeEvent<Date>) => (date = event.detail));
        el.renderRoot.querySelector<HTMLElement>('button[part~="next-month"]')?.click();

        expect(date).to.equalDate(new Date(2023, 3, 1));
      });
    });
  });

  describe('focus', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-month-view></sl-month-view>`);
    });

    it('should focus the first day of the month on initial focus', () => {
      el.focus();

      expect(el.shadowRoot?.activeElement).to.exist;
      expect(el.shadowRoot?.activeElement).to.have.attribute('autofocus');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('1');
      expect(el.shadowRoot?.activeElement).to.match('button[part~="day"]');
    });

    it('should focus the first enabled day of the month on initial focus', async () => {
      el.disabledDates = [
        new Date(el.month.getFullYear(), el.month.getMonth(), 1),
        new Date(el.month.getFullYear(), el.month.getMonth(), 2),
        new Date(el.month.getFullYear(), el.month.getMonth(), 3)
      ];
      await el.updateComplete;

      el.focus();

      expect(el.shadowRoot?.activeElement).to.exist;
      expect(el.shadowRoot?.activeElement).to.have.attribute('autofocus');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('4');
      expect(el.shadowRoot?.activeElement).to.match('button[part~="day"]');
    });

    it('should focus the first day that is not out of range on initial focus', async () => {
      el.min = new Date(el.month.getFullYear(), el.month.getMonth(), 5);
      await el.updateComplete;

      el.focus();

      expect(el.shadowRoot?.activeElement).to.exist;
      expect(el.shadowRoot?.activeElement).to.have.attribute('autofocus');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('5');
      expect(el.shadowRoot?.activeElement).to.match('button[part~="day"]');
    });

    it('should focus today on initial focus when showToday is set', async () => {
      el.showToday = true;
      await el.updateComplete;

      el.focus();

      expect(el.shadowRoot?.activeElement).to.exist;
      expect(el.shadowRoot?.activeElement).to.have.attribute('autofocus');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('14');
      expect(el.shadowRoot?.activeElement).to.match('button[part~="today"]');
    });

    it('should focus the selected day on initial focus if set', async () => {
      el.selected = new Date(el.month.getFullYear(), el.month.getMonth(), 20);
      await el.updateComplete;

      el.focus();

      expect(el.shadowRoot?.activeElement).to.exist;
      expect(el.shadowRoot?.activeElement).to.have.attribute('autofocus');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('20');
      expect(el.shadowRoot?.activeElement).to.match('button[part~="selected"]');
    });

    it('should focus the first day of the month when called without arguments', () => {
      el.focus();

      expect(el.shadowRoot?.activeElement).to.exist;
      expect(el.shadowRoot?.activeElement).to.match('button[part~="day"]');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('1');
    });

    it('should accept focus options', () => {
      el.focus({ preventScroll: true });

      expect(el.shadowRoot?.activeElement).to.exist;
      expect(el.shadowRoot?.activeElement).to.match('button[part~="day"]');
    });

    it('should focus a specific date when a Date is passed', () => {
      const targetDate = new Date(2023, 2, 15);

      el.focus(targetDate);

      expect(el.shadowRoot?.activeElement).to.exist;
      expect(el.shadowRoot?.activeElement).to.match('button[part~="day"]');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('15');
    });

    it('should focus the selected date when it exists', async () => {
      el.selected = new Date(2023, 2, 20);
      await el.updateComplete;

      const targetDate = new Date(2023, 2, 20);

      el.focus(targetDate);

      expect(el.shadowRoot?.activeElement).to.exist;
      expect(el.shadowRoot?.activeElement).to.match('button[part~="selected"]');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('20');
    });
  });

  describe('keyboard navigation', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-month-view></sl-month-view>`);
    });

    it('should focus the next day on arrow right', async () => {
      el.focus();

      await userEvent.keyboard('{ArrowRight}');

      expect(el.shadowRoot?.activeElement).to.exist;
      expect(el.shadowRoot?.activeElement).to.match('button[part~="day"]');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('2');
    });

    it('should focus the previous day on arrow left', async () => {
      el.showToday = true;
      await el.updateComplete;

      el.focus();

      await userEvent.keyboard('{ArrowLeft}');

      expect(el.shadowRoot?.activeElement).to.exist;
      expect(el.shadowRoot?.activeElement).to.match('button[part~="day"]');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('13');
    });

    it('should not change focus when pressing arrow left on the first enabled day of the month', async () => {
      el.min = new Date(el.month.getFullYear(), el.month.getMonth(), 10);
      await el.updateComplete;

      el.focus();

      await userEvent.keyboard('{ArrowLeft}');

      expect(el.shadowRoot?.activeElement).to.exist;
      expect(el.shadowRoot?.activeElement).to.match('button[part~="day"]');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('10');
    });

    it('should not change focus when pressing arrow right on the last enabled day of the month', async () => {
      el.selected = new Date(2023, 2, 20);
      el.max = new Date(el.month.getFullYear(), el.month.getMonth(), 20);
      await el.updateComplete;

      el.focus();

      await userEvent.keyboard('{ArrowRight}');

      expect(el.shadowRoot?.activeElement).to.exist;
      expect(el.shadowRoot?.activeElement).to.match('button[part~="day"]');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('20');
    });

    it('should focus the day below on arrow down', async () => {
      el.focus();

      await userEvent.keyboard('{ArrowDown}');

      expect(el.shadowRoot?.activeElement).to.exist;
      expect(el.shadowRoot?.activeElement).to.match('button[part~="day"]');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('8');
    });

    it('should not change focus when pressing arrow down where there is no enabled day of the month below it', async () => {
      el.selected = new Date(2023, 2, 24);
      el.max = new Date(el.month.getFullYear(), el.month.getMonth(), 30);
      await el.updateComplete;

      el.focus();

      await userEvent.keyboard('{ArrowDown}');

      expect(el.shadowRoot?.activeElement).to.exist;
      expect(el.shadowRoot?.activeElement).to.match('button[part~="day"]');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('24');
    });

    it('should focus the day above on arrow up', async () => {
      el.showToday = true;
      await el.updateComplete;

      el.focus();

      await userEvent.keyboard('{ArrowUp}');

      expect(el.shadowRoot?.activeElement).to.exist;
      expect(el.shadowRoot?.activeElement).to.match('button[part~="day"]');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('7');
    });

    it('should not change focus when pressing arrow up where there is no enabled day of the month above it', async () => {
      el.min = new Date(el.month.getFullYear(), el.month.getMonth(), 2);
      el.selected = new Date(2023, 2, 8);
      await el.updateComplete;

      el.focus();

      await userEvent.keyboard('{ArrowUp}');

      expect(el.shadowRoot?.activeElement).to.exist;
      expect(el.shadowRoot?.activeElement).to.match('button[part~="day"]');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('8');
    });

    it('should emit an sl-change event after pressing arrow left on the first day of the current month', async () => {
      let date: Date | null = null;

      el.addEventListener('sl-change', (event: SlChangeEvent<Date>) => (date = event.detail));
      el.focus();

      await userEvent.keyboard('{ArrowLeft}');

      expect(date).to.equalDate(new Date(2023, 1, 28));
    });

    it('should emit an sl-change event after pressing arrow right on the last day of the current month', async () => {
      let date: Date | null = null;

      el.selected = new Date(2023, 2, 31);
      await el.updateComplete;

      el.addEventListener('sl-change', (event: SlChangeEvent<Date>) => (date = event.detail));
      el.focus();

      await userEvent.keyboard('{ArrowRight}');

      expect(date).to.equalDate(new Date(2023, 3, 1));
    });

    it('should emit an sl-change event after pressing arrow up on a day in the first week of the current month', async () => {
      let date: Date | null = null;

      el.addEventListener('sl-change', (event: SlChangeEvent<Date>) => (date = event.detail));
      el.focus();

      await userEvent.keyboard('{ArrowUp}');

      expect(date).to.equalDate(new Date(2023, 1, 22));
    });

    it('should emit an sl-change event after pressing arrow down on a day in the last week of the current month', async () => {
      let date: Date | null = null;

      el.selected = new Date(2023, 2, 30);
      await el.updateComplete;

      el.addEventListener('sl-change', (event: SlChangeEvent<Date>) => (date = event.detail));
      el.focus();

      await userEvent.keyboard('{ArrowDown}');

      expect(date).to.equalDate(new Date(2023, 3, 6));
    });

    it('should not emit an sl-change event when navigating within the current month', async () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      el.focus();

      await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowDown}{ArrowLeft}{ArrowUp}');

      expect(onChange).to.not.have.been.called;
    });
  });
});
