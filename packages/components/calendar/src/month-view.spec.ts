import '@sl-design-system/tooltip/register.js';
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

  describe('Defaults', () => {
    const month = new Date();

    beforeEach(async () => {
      el = await fixture(html`<sl-month-view .month=${month}></sl-month-view>`);
      await el.updateComplete;
    });

    it('should render a header with weekday names', () => {
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

    it('should apply day part to day buttons', async () => {
      el.month = new Date(el.month!.getFullYear(), el.month!.getMonth(), 1);

      await el.updateComplete;
      const buttons = Array.from(el.renderRoot.querySelectorAll('button'));

      expect(buttons).to.exist;
      expect(buttons.length).to.be.greaterThan(0);
      buttons.forEach(button => expect(button).to.match('[part~="day"]'));
    });
  });

  describe('Header / Localization', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-month-view></sl-month-view>`);
      await el.updateComplete;
    });

    it('should render localized weekday short names', async () => {
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

    it('should render week numbers column when showWeekNumbers is set', async () => {
      el.showWeekNumbers = true;
      await el.updateComplete;
      const firstTh = el.renderRoot.querySelector('thead th[part~="week-number"]');

      expect(firstTh).to.exist;
      expect(firstTh).to.have.trimmed.text('wk.');
    });

    it('should render localized week numbers header', async () => {
      el.showWeekNumbers = true;
      el.locale = 'it-IT';

      await el.updateComplete;
      const firstTh = el.renderRoot.querySelector('thead th[part~="week-number"]');

      expect(firstTh).to.exist;
      expect(firstTh).to.have.trimmed.text('sett.');
    });

    it('should reorder weekdays when firstDayOfWeek changes', async () => {
      el.firstDayOfWeek = 0; // Sunday
      await el.updateComplete;
      const weekdays = Array.from(el.renderRoot.querySelectorAll('thead th[part~="week-day"]'));

      expect(weekdays[0].textContent?.trim()).to.equal('Sun');
    });
  });

  describe('Custom renderer', () => {
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

  describe('Hiding other months', () => {
    beforeEach(async () => {
      const month = new Date(2025, 9, 1);
      el = await fixture(html`<sl-month-view .month=${month} .hideDaysOtherMonths=${true}></sl-month-view>`);
      await el.updateComplete;
    });

    it('should hide days from other months when hideDaysOtherMonths is set', () => {
      const tds = Array.from(el.renderRoot.querySelectorAll('tbody td'));
      const emptyTds = tds.filter(td => td.querySelector('button') === null && td.textContent?.trim() === '');

      expect(emptyTds.length).to.be.greaterThan(0);
    });
  });

  describe('Parts', () => {
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
      expect(button).to.match('[part~="today"]');
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
      expect(button).to.match('[part~="today"]');
      expect(button).to.match('[part~="selected"]');
    });

    it('should apply "unselectable" for disabled days', async () => {
      el.disabled = [new Date(new Date().getFullYear(), new Date().getMonth(), 10)];

      await el.updateComplete;
      const disabledDay = Array.from(el.renderRoot.querySelectorAll('button')).find(
        day => day.textContent?.trim() === '10'
      );

      expect(disabledDay).to.exist;
      expect(disabledDay?.hasAttribute('disabled')).to.be.true;
      expect(disabledDay).to.match('[part~="unselectable"]');
    });

    it('should apply "unselectable" for outside min/max days', async () => {
      el.min = new Date(new Date().getFullYear(), new Date().getMonth(), 15);
      el.max = new Date(new Date().getFullYear(), new Date().getMonth(), 20);

      await el.updateComplete;
      const disabledBtnPrevious = Array.from(el.renderRoot.querySelectorAll('button')).find(
        b => b.textContent?.trim() === '14'
      );
      const disabledBtnNext = Array.from(el.renderRoot.querySelectorAll('button')).find(
        b => b.textContent?.trim() === '21'
      );

      expect(disabledBtnPrevious).to.exist;
      expect(disabledBtnNext).to.exist;
      expect(disabledBtnPrevious?.hasAttribute('disabled')).to.be.true;
      expect(disabledBtnNext?.hasAttribute('disabled')).to.be.true;
      expect(disabledBtnPrevious).to.match('[part~="unselectable"]');
      expect(disabledBtnNext).to.match('[part~="unselectable"]');
    });

    it('should apply "negative" part when negative dates provided', async () => {
      el.negative = [new Date(new Date().getFullYear(), new Date().getMonth(), 11)];

      await el.updateComplete;
      const negativeBtn = Array.from(el.renderRoot.querySelectorAll('button')).find(
        button => button.textContent?.trim() === '11'
      );

      expect(negativeBtn).to.exist;
      expect(negativeBtn).to.match('[part~="negative"]');
    });
  });

  describe('Indicators', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-month-view .month=${new Date()}></sl-month-view>`);
      await el.updateComplete;
    });

    it('should apply indicator part', async () => {
      el.indicator = [{ date: new Date(new Date().getFullYear(), new Date().getMonth(), 12) }];

      await el.updateComplete;
      const indBtn = Array.from(el.renderRoot.querySelectorAll('button')).find(
        button => button.textContent?.trim() === '12'
      );

      expect(indBtn).to.exist;
      expect(indBtn).to.match('[part~="indicator"]');
    });

    it('should apply colored indicator part (red)', async () => {
      el.indicator = [{ date: new Date(new Date().getFullYear(), new Date().getMonth(), 12), color: 'red' }];

      await el.updateComplete;
      const indBtn = Array.from(el.renderRoot.querySelectorAll('button')).find(
        button => button.textContent?.trim() === '12'
      );

      expect(indBtn).to.exist;
      expect(indBtn).to.match('[part~="indicator"]');
      expect(indBtn).to.match('[part~="indicator-red"]');
    });

    it('should render tooltip for indicator with label', async () => {
      el.indicator = [{ date: new Date(new Date().getFullYear(), new Date().getMonth(), 13), label: 'Special day' }];

      await el.updateComplete;

      const button = el.renderRoot.querySelector('button[part~="indicator"]') as HTMLButtonElement;

      expect(button).to.exist;

      button.focus();

      const tooltip = el.renderRoot.querySelector('sl-tooltip');

      expect(tooltip).to.exist;
      expect(tooltip?.textContent?.trim()).to.equal('Special day');
    });

    it('should render generic tooltip when no color or label provided', async () => {
      const date = new Date(new Date().getFullYear(), new Date().getMonth(), 15);
      el.indicator = [{ date }];

      await el.updateComplete;

      const button = el.renderRoot.querySelector('button[part~="indicator"]') as HTMLButtonElement;

      expect(button).to.exist;

      button.focus();

      const tooltip = el.renderRoot.querySelector('sl-tooltip');

      expect(tooltip).to.exist;
      expect(tooltip?.textContent?.trim()).to.equal('Indicator');
    });
  });

  describe('Aria attributes', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-month-view .showToday=${true} .month=${new Date()}></sl-month-view>`);
      await el.updateComplete;
    });

    it('should set aria-current="date" on today when showToday is set', () => {
      const todayBtn = Array.from(el.renderRoot.querySelectorAll('button')).find(btn => btn.matches('[part~="today"]'));

      expect(todayBtn).to.exist;
      expect(todayBtn?.getAttribute('aria-current')).to.equal('date');
    });

    it('should set aria-pressed="true" on selected day', async () => {
      const today = new Date();
      el.selected = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      await el.updateComplete;
      const selectedBtn = Array.from(el.renderRoot.querySelectorAll('button')).find(btn =>
        btn.matches('[part~="selected"]')
      );

      expect(selectedBtn).to.exist;
      expect(selectedBtn?.getAttribute('aria-pressed')).to.equal('true');
    });
  });

  describe('Click', () => {
    beforeEach(async () => {
      el = await fixture(
        html`<sl-month-view .month=${new Date(2025, 9, 1)} .disabled=${[new Date(2025, 9, 10)]}></sl-month-view>`
      );
      await el.updateComplete;
    });

    it('should emit sl-select and update selected when clicking an enabled day', async () => {
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

    it('should not emit sl-select when clicking a disabled day', async () => {
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

    it('should not emit sl-select when readonly is set', async () => {
      el.readonly = true;

      await el.updateComplete;

      const onSelect = spy();
      el.addEventListener('sl-select', onSelect);

      const button = el.renderRoot.querySelector('button');

      expect(button).to.exist;

      (button as HTMLButtonElement).click();

      await el.updateComplete;

      expect(onSelect).not.to.have.been.called;
    });
  });

  describe('Keyboard navigation (selection)', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-month-view .month=${new Date(2025, 9, 1)}></sl-month-view>`);
      await el.updateComplete;
    });

    it('should emit sl-select on Enter', async () => {
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
      expect(event.detail.getDate()).to.equal((el.selected as Date).getDate());
    });

    it('should emit sl-select on Space', async () => {
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
      expect(event.detail.getDate()).to.equal((el.selected as Date).getDate());
    });

    it('should emit change with previous month last day on ArrowLeft at 1st of month', async () => {
      const btnOne = Array.from(el.renderRoot.querySelectorAll('button')).find(
        b => b.textContent?.trim() === '1'
      ) as HTMLButtonElement;

      expect(btnOne).to.exist;

      const onChange = spy();
      el.addEventListener('sl-change', (e: CustomEvent) => {
        onChange(e.detail);
      });

      btnOne.focus();
      await userEvent.keyboard('{ArrowLeft}');
      await el.updateComplete;

      expect(onChange).to.have.been.calledOnce;
      const emitted = onChange.lastCall.args[0] as Date;
      const prevLast = new Date(emitted.getFullYear(), emitted.getMonth() + 1, 0).getDate();

      expect(emitted.getDate()).to.equal(prevLast);
    });

    it('should emit change with next month first day on ArrowRight at last day', async () => {
      const month = el.month!,
        lastDayNum = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate(),
        lastButton = Array.from(el.renderRoot.querySelectorAll('button')).find(
          b => b.textContent?.trim() === String(lastDayNum)
        ) as HTMLButtonElement;

      expect(lastButton).to.exist;

      const onChange = spy();
      el.addEventListener('sl-change', (e: CustomEvent) => {
        onChange(e.detail);
      });
      lastButton.focus();
      await userEvent.keyboard('{ArrowRight}');

      await el.updateComplete;
      const emitted = onChange.lastCall.args[0] as Date;

      expect(onChange).to.have.been.calledOnce;
      expect(emitted.getDate()).to.equal(1);
      expect(emitted.getMonth()).to.equal(month.getMonth() + 1);
    });

    it('should emit change on ArrowUp weekly step crossing month', async () => {
      const btnSeven = Array.from(el.renderRoot.querySelectorAll('button')).find(
        b => b.textContent?.trim() === '7'
      ) as HTMLButtonElement;

      expect(btnSeven).to.exist;

      const onChange = spy();
      el.addEventListener('sl-change', (e: CustomEvent) => {
        onChange(e.detail);
      });
      btnSeven.focus();
      await userEvent.keyboard('{ArrowUp}');

      await el.updateComplete;

      expect(onChange).to.have.been.calledOnce;
      const emitted = onChange.lastCall.args[0] as Date;

      expect(emitted.getMonth()).to.not.equal(el.month?.getMonth());
    });

    it('should emit change on ArrowDown weekly step crossing month', async () => {
      const month = el.month!,
        lastDayNum = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate(),
        targetNum = lastDayNum - 3,
        targetBtn = Array.from(el.renderRoot.querySelectorAll('button')).find(
          button => button.textContent?.trim() === String(targetNum)
        ) as HTMLButtonElement;

      expect(targetBtn).to.exist;

      const onChange = spy();
      el.addEventListener('sl-change', (e: CustomEvent) => {
        onChange(e.detail);
      });
      targetBtn.focus();
      await userEvent.keyboard('{ArrowDown}');

      await el.updateComplete;
      expect(onChange).to.have.been.calledOnce;
      const emitted = onChange.lastCall.args[0] as Date;

      expect(emitted.getMonth()).to.not.equal(month.getMonth());
    });

    it('should not emit change when ArrowUp weekly step stays within month', async () => {
      const buttonFifteen = Array.from(el.renderRoot.querySelectorAll('button')).find(
        button => button.textContent?.trim() === '15'
      ) as HTMLButtonElement;

      expect(buttonFifteen).to.exist;

      const onChangeSpy = spy();

      el.addEventListener('sl-change', onChangeSpy);
      buttonFifteen.focus();
      await userEvent.keyboard('{ArrowUp}');

      await el.updateComplete;

      expect(onChangeSpy).not.to.have.been.called;
    });

    it('should not emit change when ArrowDown weekly step stays within month', async () => {
      const buttonTen = Array.from(el.renderRoot.querySelectorAll('button')).find(
        button => button.textContent?.trim() === '10'
      ) as HTMLButtonElement;

      expect(buttonTen).to.exist;

      const onChangeSpy = spy();

      el.addEventListener('sl-change', onChangeSpy);
      buttonTen.focus();
      await userEvent.keyboard('{ArrowDown}');

      await el.updateComplete;

      expect(onChangeSpy).not.to.have.been.called;
    });
  });

  describe('Focus day', () => {
    beforeEach(async () => {
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      el = await fixture(html`<sl-month-view .month=${monthStart}></sl-month-view>`);

      await el.updateComplete;
    });

    it('should focus a specific day using focusDay()', () => {
      const target = new Date(el.month!.getFullYear(), el.month!.getMonth(), 5);

      el.focusDay(target);

      const button = Array.from(el.renderRoot.querySelectorAll('button')).find(b => b.textContent?.trim() === '5');

      expect(button).to.exist;
      expect(el.shadowRoot?.activeElement).to.equal(button);
    });
  });

  describe('Attribute Converter', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-month-view .month=${new Date()}></sl-month-view>`);
      await el.updateComplete;
    });

    it('should parse indicator attribute JSON into Date instances', async () => {
      const date = new Date();

      el.setAttribute('indicator', JSON.stringify([{ date: date.toISOString(), color: 'grey', label: 'Attr label' }]));

      await el.updateComplete;

      expect(el.indicator).to.exist;
      expect(el.indicator![0].date).to.be.instanceOf(Date);
      expect(el.indicator![0].label).to.equal('Attr label');
      expect(el.indicator![0].color).to.equal('grey');
    });
  });

  describe('Enabled same weekday recursion', () => {
    beforeEach(async () => {
      // Start late in month so ArrowDown crosses to next month (e.g., 26 -> +7 days)
      const base = new Date(2025, 9, 26); // Oct 26 2025
      el = await fixture(html`<sl-month-view .month=${base}></sl-month-view>`);

      await el.updateComplete;
    });

    it('should emit change on ArrowDown crossing month from late-month day', async () => {
      const buttonTwentySix = Array.from(el.renderRoot.querySelectorAll('button')).find(
        button => button.textContent?.trim() === '26'
      ) as HTMLButtonElement;

      expect(buttonTwentySix).to.exist;

      const onChange = spy();
      el.addEventListener('sl-change', (e: CustomEvent) => {
        onChange(e.detail);
      });
      buttonTwentySix.focus();
      await userEvent.keyboard('{ArrowDown}');

      await el.updateComplete;

      expect(onChange).to.have.been.calledOnce;
      const emitted = onChange.lastCall.args[0] as Date;

      expect(emitted.getMonth()).to.equal(el.month!.getMonth() + 1); // moved to next month
    });
  });

  describe('Readonly / Inert behavior', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-month-view .month=${new Date()} .readonly=${true} .inert=${true}></sl-month-view>`);
      await el.updateComplete;
    });

    it('should render days but prevent selection when readonly', async () => {
      const onSelect = spy();

      el.addEventListener('sl-select', onSelect);

      const button = el.renderRoot.querySelector('button');

      expect(button).to.exist;
      button?.click();

      await el.updateComplete;

      expect(onSelect).not.to.have.been.called;
    });

    it('should render buttons disabled when inert', () => {
      const allButtons = Array.from(el.renderRoot.querySelectorAll('button'));

      expect(allButtons.length).to.be.greaterThan(0);
      allButtons.forEach(b => expect(b.disabled).to.be.true);
    });
  });

  describe('Combined states', () => {
    beforeEach(async () => {
      const base = new Date();
      el = await fixture(
        html`<sl-month-view .month=${new Date(base.getFullYear(), base.getMonth(), 1)}></sl-month-view>`
      );
      await el.updateComplete;
    });

    it('should apply both indicator color and negative part when date matches both', async () => {
      const day = 18;
      const date = new Date(el.month!.getFullYear(), el.month!.getMonth(), day);

      el.indicator = [{ date, color: 'yellow' }];
      el.negative = [date];

      await el.updateComplete;

      const button = Array.from(el.renderRoot.querySelectorAll('button')).find(
        btn => btn.textContent?.trim() === String(day)
      );

      expect(button).to.exist;
      expect(button).to.match('[part~="indicator"]');
      expect(button).to.match('[part~="indicator-yellow"]');
      expect(button).to.match('[part~="negative"]');
    });
  });
});
