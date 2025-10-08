import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { MonthView } from './month-view.js';

try {
  customElements.define('sl-month-view', MonthView);
} catch {
  /* already defined */
}

describe('sl-month-view', () => {
  let el: MonthView;

  describe('defaults', () => {
    const month = new Date();

    beforeEach(async () => {
      el = await fixture(html`<sl-month-view .month=${month}></sl-month-view>`);

      await el.updateComplete;
    });

    it('renders a header with weekday names', () => {
      const weekdays = Array.from(el.renderRoot.querySelectorAll('thead th[part~="week-day"]'));

      expect(weekdays.length).to.equal(7);
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

    it('applies day part to days buttons', async () => {
      // const today = new Date();
      el.month = new Date(el.month!.getFullYear(), el.month!.getMonth(), 1);
      // el.showToday = true;
      // el.selected = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      await el.updateComplete;

      const buttons = Array.from(el.renderRoot.querySelectorAll('button'));

      console.log('buttons.....', buttons, 'el....', el);

      expect(buttons).to.exist;
      expect(buttons.length).to.be.greaterThan(0);
      expect(buttons[0]?.matches('[part~="day"]')).to.be.true;
      // expect(button?.matches('[part~="selected"]')).to.be.true;
    });
  });

  describe('header', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-month-view></sl-month-view>`);

      await el.updateComplete;
    });

    it('renders a header with localized weekday short names', () => {
      // TODO: maybe different locale check?
      const weekdays = Array.from(el.renderRoot.querySelectorAll('thead th[part~="week-day"]'));

      expect(weekdays.length).to.equal(7);
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

    it('renders week numbers column when showWeekNumbers is true', async () => {
      el.showWeekNumbers = true;
      await el.updateComplete;

      const firstTh = el.renderRoot.querySelector('thead th[part~="week-number"]');

      expect(firstTh).to.exist;
      expect(firstTh).to.have.trimmed.text('wk.');
    });
  });

  describe('renderer & hide other months', () => {
    it('uses custom renderer when provided', async () => {
      const month = new Date();
      el = await fixture(html`<sl-month-view .month=${month}></sl-month-view>`);
      el.renderer = day => html`<div class="custom">${day.date.getDate()}</div>`;
      await el.updateComplete;

      // There should be at least one custom renderer div in the DOM
      const custom = el.renderRoot.querySelector('.custom');
      expect(custom).to.exist;
    });

    it('hides days from other months when hideDaysOtherMonths is true', async () => {
      // pick a month where the calendar will include prev/next month days (most months)
      const month = new Date(2025, 9, 1); // October 2025
      el = await fixture(html`<sl-month-view .month=${month} .hideDaysOtherMonths=${true}></sl-month-view>`);
      await el.updateComplete;

      // find any td that does not contain a button (these are hidden days)
      const tds = Array.from(el.renderRoot.querySelectorAll('tbody td'));
      const emptyTds = tds.filter(td => td.querySelector('button') === null && td.textContent?.trim() === '');
      // Expect at least one empty td when hiding other-month days
      expect(emptyTds.length).to.be.greaterThan(0);
    });
  });

  describe('parts', () => {
    beforeEach(async () => {
      const now = new Date();
      // use current month so we can exercise today/selected semantics
      el = await fixture(
        html`<sl-month-view .month=${new Date(now.getFullYear(), now.getMonth(), 1)}></sl-month-view>`
      );
      await el.updateComplete;
    });

    it('applies today part when appropriate', async () => {
      // const today = new Date();
      el.month = new Date(el.month!.getFullYear(), el.month!.getMonth(), 1);
      el.showToday = true;
      // el.selected = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      await el.updateComplete;

      const button = Array.from(el.renderRoot.querySelectorAll('button')).find(btn =>
        (btn.getAttribute('part') || '').includes('today')
      );
      expect(button).to.exist;

      expect(button?.matches('[part~="today"]')).to.be.true;
      // expect(button?.matches('[part~="selected"]')).to.be.true;
    });

    it('applies today and selected parts when appropriate', async () => {
      const today = new Date();
      el.month = new Date(el.month!.getFullYear(), el.month!.getMonth(), 1);
      el.showToday = true;
      el.selected = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      await el.updateComplete;

      const button = Array.from(el.renderRoot.querySelectorAll('button')).find(btn =>
        (btn.getAttribute('part') || '').includes('selected')
      );
      expect(button).to.exist;

      expect(button?.matches('[part~="today"]')).to.be.true;
      expect(button?.matches('[part~="selected"]')).to.be.true;
    });

    it('applies "unselectable" for disabled and outside min/max days and "negative" and indicator classes', async () => {
      const year = new Date().getFullYear();
      const month = 6; // July
      el = await fixture(html`<sl-month-view .month=${new Date(year, month, 1)}></sl-month-view>`);

      // pick a date in that month to mark as disabled/negative/indicator
      const target = new Date(year, month, 10);
      el.disabled = [target];
      el.negative = [new Date(year, month, 11)];
      el.indicator = [{ date: new Date(year, month, 12), color: 'blue' }];
      await el.updateComplete;

      // disabled -> unselectable
      const disabledBtn = Array.from(el.renderRoot.querySelectorAll('button')).find(
        b => b.textContent?.trim() === '10'
      );
      expect(disabledBtn).to.exist;
      expect(disabledBtn?.hasAttribute('disabled')).to.be.true;
      expect((disabledBtn?.getAttribute('part') || '').split(' ')).to.include('unselectable');

      // negative
      const negBtn = Array.from(el.renderRoot.querySelectorAll('button')).find(b => b.textContent?.trim() === '11');
      expect(negBtn).to.exist;
      expect((negBtn?.getAttribute('part') || '').split(' ')).to.include('negative');

      // indicator with color
      const indBtn = Array.from(el.renderRoot.querySelectorAll('button')).find(b => b.textContent?.trim() === '12');
      expect(indBtn).to.exist;
      const parts = (indBtn?.getAttribute('part') || '').split(' ');
      expect(parts).to.include('indicator'); // TODO: use matches ...
      expect(parts).to.include('indicator-blue');
    });
  });

  describe('click & keyboard interactions', () => {
    beforeEach(async () => {
      // choose a month with predictable days
      el = await fixture(html`<sl-month-view .month=${new Date(2025, 9, 1)}></sl-month-view>`);
      await el.updateComplete;
    });

    it('clicking an enabled day emits sl-select and updates selected', async () => {
      const onSelect = new Promise<CustomEvent>(resolve =>
        el.addEventListener('sl-select', (e: Event) => resolve(e as CustomEvent))
      );

      // find a clickable day (not disabled)
      const button = Array.from(el.renderRoot.querySelectorAll('button')).find(
        b => !b.hasAttribute('disabled')
      ) as HTMLButtonElement;
      expect(button).to.exist;

      button.click();
      const ev = await onSelect;
      expect(ev.detail).to.be.instanceOf(Date);
      // selected property should equal the emitted date
      await el.updateComplete;
      expect(el.selected).to.be.instanceOf(Date);
      expect((el.selected as Date).getDate()).to.equal((ev.detail as Date).getDate());
    });

    it('Enter or Space on a day emits sl-select', async () => {
      const onSelect = new Promise<CustomEvent>(resolve =>
        el.addEventListener('sl-select', (e: Event) => resolve(e as CustomEvent))
      );
      // pick a button
      const button = Array.from(el.renderRoot.querySelectorAll('button')).find(
        b => !b.hasAttribute('disabled')
      ) as HTMLButtonElement;
      button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      const ev = await onSelect;
      expect(ev.detail).to.be.instanceOf(Date);

      // Space key
      const onSelect2 = new Promise<CustomEvent>(resolve =>
        el.addEventListener('sl-select', (e: Event) => resolve(e as CustomEvent))
      );
      button.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      const ev2 = await onSelect2;
      expect(ev2.detail).to.be.instanceOf(Date);
    });

    it('ArrowLeft on the 1st of the month emits change with previous month last day', async () => {
      // find the button with date '1' that belongs to the current month
      const btnOne = Array.from(el.renderRoot.querySelectorAll('button')).find(
        b => b.textContent?.trim() === '1'
      ) as HTMLButtonElement;
      expect(btnOne).to.exist;

      const onChange = new Promise<CustomEvent>(resolve =>
        el.addEventListener('sl-change', (e: Event) => resolve(e as CustomEvent))
      );
      btnOne.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      const ev = await onChange;

      // emitted date should be the last day of previous month
      const emitted = ev.detail as Date;
      const prevLast = new Date(emitted.getFullYear(), emitted.getMonth() + 1, 0).getDate();
      expect(emitted.getDate()).to.equal(prevLast);
    });

    it('ArrowRight on the last day of the month emits change with next month first day', async () => {
      // find last day of month number
      const month = el.month!;
      const lastDayNum = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
      const lastBtn = Array.from(el.renderRoot.querySelectorAll('button')).find(
        b => b.textContent?.trim() === String(lastDayNum)
      ) as HTMLButtonElement;
      expect(lastBtn).to.exist;

      const onChange = new Promise<CustomEvent>(resolve =>
        el.addEventListener('sl-change', (e: Event) => resolve(e as CustomEvent))
      );
      lastBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      const ev = await onChange;

      const emitted = ev.detail as Date;
      expect(emitted.getDate()).to.equal(1);
      // month should be next month
      expect(emitted.getMonth()).to.equal(month.getMonth() + 1);
    });

    it('ArrowUp on a day near start of month emits change to previous month same weekday when it crosses month', async () => {
      // pick day 7 which when subtracting 7 will cross to previous month
      const btnSeven = Array.from(el.renderRoot.querySelectorAll('button')).find(
        b => b.textContent?.trim() === '7'
      ) as HTMLButtonElement;
      expect(btnSeven).to.exist;

      const onChange = new Promise<CustomEvent>(resolve =>
        el.addEventListener('sl-change', (e: Event) => resolve(e as CustomEvent))
      );
      btnSeven.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      const ev = await onChange;

      const emitted = ev.detail as Date;
      // emitted month should not equal current month
      expect(emitted.getMonth()).to.not.equal(el.month?.getMonth());
    });

    it('ArrowDown on a day near end of month emits change to next month same weekday when it crosses month', async () => {
      const month = el.month!;
      const lastDayNum = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
      // pick a day in last week (lastDay - 3) so adding 7 crosses month
      const targetNum = lastDayNum - 3;
      const targetBtn = Array.from(el.renderRoot.querySelectorAll('button')).find(
        b => b.textContent?.trim() === String(targetNum)
      ) as HTMLButtonElement;
      expect(targetBtn).to.exist;

      const onChange = new Promise<CustomEvent>(resolve =>
        el.addEventListener('sl-change', (e: Event) => resolve(e as CustomEvent))
      );
      targetBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      const ev = await onChange;

      const emitted = ev.detail as Date;
      expect(emitted.getMonth()).to.not.equal(month.getMonth());
    });
  });
});
