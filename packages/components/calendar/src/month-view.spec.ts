import { fixture } from '@sl-design-system/vitest-browser-lit';
import { userEvent } from '@vitest/browser/context';
import { html } from 'lit';
import { spy } from 'sinon';
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
      el.month = new Date(el.month!.getFullYear(), el.month!.getMonth(), 1);
      await el.updateComplete;

      const buttons = Array.from(el.renderRoot.querySelectorAll('button'));

      expect(buttons).to.exist;
      expect(buttons.length).to.be.greaterThan(0);
      buttons.forEach(button => expect(button.matches('[part~="day"]')).to.be.true);
    });
  });

  describe('header', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-month-view></sl-month-view>`);

      await el.updateComplete;
    });

    it('renders a header with localized weekday short names', async () => {
      el.locale = 'it-IT';
      await el.updateComplete;

      const weekdays = Array.from(el.renderRoot.querySelectorAll('thead th[part~="week-day"]'));

      expect(weekdays.length).to.equal(7);
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

    it('renders week numbers column when showWeekNumbers is true', async () => {
      el.showWeekNumbers = true;
      await el.updateComplete;

      const firstTh = el.renderRoot.querySelector('thead th[part~="week-number"]');

      expect(firstTh).to.exist;
      expect(firstTh).to.have.trimmed.text('wk.');
    });

    it('renders week numbers column with localized header when showWeekNumbers is true', async () => {
      el.showWeekNumbers = true;
      el.locale = 'it-IT';
      await el.updateComplete;

      const firstTh = el.renderRoot.querySelector('thead th[part~="week-number"]');

      expect(firstTh).to.exist;
      expect(firstTh).to.have.trimmed.text('sett.');
    });
  });

  describe('custom renderer', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-month-view .month=${new Date()}></sl-month-view>`);

      await el.updateComplete;
    });

    it('should use custom renderer when provided', async () => {
      el.renderer = day => html`<div class="custom">${day.date.getDate()}</div>`;
      await el.updateComplete;

      const custom = el.renderRoot.querySelector('.custom');

      expect(custom).to.exist;
    });
  });

  describe('other months hidden', () => {
    beforeEach(async () => {
      const month = new Date(2025, 9, 1);
      el = await fixture(html`<sl-month-view .month=${month} .hideDaysOtherMonths=${true}></sl-month-view>`);

      await el.updateComplete;
    });

    it('should hide days from other months when hideDaysOtherMonths is true', () => {
      const tds = Array.from(el.renderRoot.querySelectorAll('tbody td'));
      const emptyTds = tds.filter(td => td.querySelector('button') === null && td.textContent?.trim() === '');

      expect(emptyTds.length).to.be.greaterThan(0);
    });
  });

  describe('parts', () => {
    beforeEach(async () => {
      const now = new Date();

      el = await fixture(
        html`<sl-month-view .month=${new Date(now.getFullYear(), now.getMonth(), 1)}></sl-month-view>`
      );
      await el.updateComplete;
    });

    it('should apply today part when showToday is set', async () => {
      el.month = new Date(el.month!.getFullYear(), el.month!.getMonth(), 1);
      el.showToday = true;
      await el.updateComplete;

      const button = Array.from(el.renderRoot.querySelectorAll('button')).find(btn =>
        (btn.getAttribute('part') || '').includes('today')
      );

      expect(button).to.exist;
      expect(button?.matches('[part~="today"]')).to.be.true;
    });

    it('should apply today and selected parts when appropriate', async () => {
      el.month = new Date(el.month!.getFullYear(), el.month!.getMonth(), 1);
      el.showToday = true;
      el.selected = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
      await el.updateComplete;

      const button = Array.from(el.renderRoot.querySelectorAll('button')).find(btn =>
        (btn.getAttribute('part') || '').includes('selected')
      );

      expect(button).to.exist;
      expect(button?.matches('[part~="today"]')).to.be.true;
      expect(button?.matches('[part~="selected"]')).to.be.true;
    });

    it('should apply "unselectable" for disabled days', async () => {
      el.disabled = [new Date(new Date().getFullYear(), new Date().getMonth(), 10)];
      await el.updateComplete;

      const disabledDay = Array.from(el.renderRoot.querySelectorAll('button')).find(
        day => day.textContent?.trim() === '10'
      );

      expect(disabledDay).to.exist;
      expect(disabledDay?.hasAttribute('disabled')).to.be.true;
      expect(disabledDay?.matches('[part~="unselectable"]')).to.be.true;
    });

    it('should apply "unselectable" for outside min/max days', async () => {
      el.min = new Date(new Date().getFullYear(), new Date().getMonth(), 15);
      el.max = new Date(new Date().getFullYear(), new Date().getMonth(), 20);
      await el.updateComplete;

      const disabledBtnPrevious = Array.from(el.renderRoot.querySelectorAll('button')).find(
          b => b.textContent?.trim() === '14'
        ),
        disabledBtnNext = Array.from(el.renderRoot.querySelectorAll('button')).find(
          b => b.textContent?.trim() === '21'
        );

      expect(disabledBtnPrevious).to.exist;
      expect(disabledBtnNext).to.exist;
      expect(disabledBtnPrevious?.hasAttribute('disabled')).to.be.true;
      expect(disabledBtnNext?.hasAttribute('disabled')).to.be.true;
      expect(disabledBtnPrevious?.matches('[part~="unselectable"]')).to.be.true;
      expect(disabledBtnNext?.matches('[part~="unselectable"]')).to.be.true;
    });

    it('should apply "negative" part', async () => {
      el.negative = [new Date(new Date().getFullYear(), new Date().getMonth(), 11)];
      await el.updateComplete;

      const negativeBtn = Array.from(el.renderRoot.querySelectorAll('button')).find(
        button => button.textContent?.trim() === '11'
      );

      expect(negativeBtn).to.exist;
      expect(negativeBtn?.matches('[part~="negative"]')).to.be.true;
    });

    it('should apply indicator part', async () => {
      el.indicator = [{ date: new Date(new Date().getFullYear(), new Date().getMonth(), 12) }];
      await el.updateComplete;

      const indBtn = Array.from(el.renderRoot.querySelectorAll('button')).find(
        button => button.textContent?.trim() === '12'
      );

      expect(indBtn).to.exist;
      expect(indBtn?.matches('[part~="indicator"]')).to.be.true;
    });

    it('should apply red indicator when set', async () => {
      el.indicator = [{ date: new Date(new Date().getFullYear(), new Date().getMonth(), 12), color: 'red' }];
      await el.updateComplete;

      const indBtn = Array.from(el.renderRoot.querySelectorAll('button')).find(
        button => button.textContent?.trim() === '12'
      );

      expect(indBtn).to.exist;
      expect(indBtn?.matches('[part~="indicator"]')).to.be.true;
      expect(indBtn?.matches('[part~="indicator-red"]')).to.be.true;
    });
  });

  describe('click event', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-month-view .month=${new Date(2025, 9, 1)} .disabled=${[new Date(2025, 9, 10)]}></sl-month-view>
      `);
      await el.updateComplete;
    });

    it('should emit sl-select and update selected when clicking on an enabled day', async () => {
      const onSelect = spy();

      el.addEventListener('sl-select', onSelect);

      const button = Array.from(el.renderRoot.querySelectorAll('button')).find(
        b => !b.hasAttribute('disabled')
      ) as HTMLButtonElement;
      expect(button).to.exist;

      button.click();
      await el.updateComplete;

      expect(onSelect).to.have.been.calledOnce;

      const event = onSelect.lastCall.firstArg as CustomEvent<Date>;
      expect(el.selected).to.be.instanceOf(Date);
      expect((el.selected as Date).getDate()).to.equal(event.detail.getDate());
    });

    it('should not emit sl-select and update selected day when clicking on a disabled day', async () => {
      const onSelect = spy();

      el.addEventListener('sl-select', onSelect);

      const button = Array.from(el.renderRoot.querySelectorAll('button')).find(b =>
        b.hasAttribute('disabled')
      ) as HTMLButtonElement;

      expect(button).to.exist;

      button.click();
      await el.updateComplete;

      expect(onSelect).not.to.have.been.calledOnce;
    });
  });

  describe('keyboard navigation', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-month-view .month=${new Date(2025, 9, 1)}></sl-month-view>`);
      await el.updateComplete;
    });

    it('Enter on a day emits sl-select', async () => {
      const onSelect = spy();

      el.addEventListener('sl-select', onSelect);

      const button = Array.from(el.renderRoot.querySelectorAll('button')).find(
        b => !b.hasAttribute('disabled')
      ) as HTMLButtonElement;

      button.focus();
      await userEvent.keyboard('{Enter}');
      await el.updateComplete;

      expect(onSelect).to.have.been.calledOnce;

      const event = onSelect.lastCall.firstArg as CustomEvent<Date>;

      expect(el.selected).to.be.instanceOf(Date);
      expect(event.detail.getDate()).to.equal(29);
    });

    it('Space on a day emits sl-select', async () => {
      const onSelect = spy();

      el.addEventListener('sl-select', onSelect);

      const button = Array.from(el.renderRoot.querySelectorAll('button')).find(
        b => !b.hasAttribute('disabled')
      ) as HTMLButtonElement;

      button.focus();
      await userEvent.keyboard('{Space}');
      await el.updateComplete;

      expect(onSelect).to.have.been.calledOnce;

      const event = onSelect.lastCall.firstArg as CustomEvent<Date>;

      expect(el.selected).to.be.instanceOf(Date);
      expect(event.detail.getDate()).to.equal(29);
    });

    // TODO: change those tests below and improve descriptions everywhere, should begin with 'should...'
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
