import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { spy } from 'sinon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
import { DateField } from './date-field.js';

describe('sl-date-field', () => {
  let el: DateField, input: HTMLInputElement;

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

  afterEach(() => {
    // Clean up any open popovers
    document.querySelectorAll('[popover]').forEach(popover => {
      if (popover.matches(':popover-open')) {
        (popover as HTMLElement).hidePopover();
      }
    });
  });

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-date-field></sl-date-field>`);
      input = el.querySelector('input')!;
    });

    it('should render a text field', () => {
      const textField = el.renderRoot.querySelector('sl-text-field');

      expect(textField).to.exist;
    });

    it('should render a calendar button', () => {
      const button = el.renderRoot.querySelector('sl-field-button');

      expect(button).to.exist;
    });

    it('should have a calendar icon', () => {
      const icon = el.renderRoot.querySelector('sl-icon[name="calendar"]');

      expect(icon).to.exist;
    });

    it('should not be disabled', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el.disabled).not.to.be.true;
      expect(input.disabled).to.be.false;
    });

    it('should not be readonly', () => {
      expect(el).not.to.have.attribute('readonly');
      expect(el.readonly).not.to.be.true;
    });

    it('should not be required', () => {
      expect(el).not.to.have.attribute('required');
      expect(el.required).not.to.be.true;
    });

    it('should not be select-only', () => {
      expect(el).not.to.have.attribute('select-only');
      expect(el.selectOnly).not.to.be.true;
    });

    it('should not show week numbers', () => {
      expect(el.showWeekNumbers).not.to.be.true;
    });

    it('should not have a value', () => {
      expect(el.value).to.be.undefined;
      expect(input.value).to.equal('');
    });

    it('should not have a placeholder', () => {
      expect(el.placeholder).to.be.undefined;
    });

    it('should not have min date', () => {
      expect(el.min).to.be.undefined;
    });

    it('should not have max date', () => {
      expect(el.max).to.be.undefined;
    });

    it('should have default date-time format', () => {
      expect(el.dateTimeFormat).to.deep.equal({
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      });
    });

    it('should have autocomplete off on input', () => {
      expect(input).to.have.attribute('autocomplete', 'off');
    });

    it('should have input in slot', () => {
      expect(input.slot).to.equal('input');
    });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-date-field disabled></sl-date-field>`);
      input = el.querySelector('input')!;
    });

    it('should be disabled', () => {
      expect(el).to.have.attribute('disabled');
      expect(el.disabled).to.be.true;
      expect(input.disabled).to.be.true;
    });

    it('should have disabled text field', () => {
      const textField = el.renderRoot.querySelector('sl-text-field');

      expect(textField).to.have.attribute('disabled');
    });

    it('should have disabled calendar button', () => {
      const button = el.renderRoot.querySelector('sl-field-button');

      expect(button).to.have.attribute('disabled');
    });

    it('should have tabindex -1 on button', () => {
      const button = el.renderRoot.querySelector('sl-field-button');

      expect(button).to.have.attribute('tabindex', '-1');
    });
  });

  describe('readonly', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-date-field readonly></sl-date-field>`);
      input = el.querySelector('input')!;
    });

    it('should be readonly', () => {
      expect(el).to.have.attribute('readonly');
      expect(el.readonly).to.be.true;
    });

    it('should have readonly text field', () => {
      const textField = el.renderRoot.querySelector('sl-text-field');

      expect(textField).to.have.attribute('readonly');
    });

    it('should have disabled calendar button', () => {
      const button = el.renderRoot.querySelector('sl-field-button');

      expect(button).to.have.attribute('disabled');
    });
  });

  describe('required', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-date-field required></sl-date-field>`);
    });

    it('should be required', () => {
      expect(el).to.have.attribute('required');
      expect(el.required).to.be.true;
    });

    it('should have required text field', () => {
      const textField = el.renderRoot.querySelector('sl-text-field');

      expect(textField).to.have.attribute('required');
    });
  });

  describe('select-only', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-date-field select-only></sl-date-field>`);
    });

    it('should be select-only', () => {
      expect(el).to.have.attribute('select-only');
      expect(el.selectOnly).to.be.true;
    });

    it('should have readonly text field', () => {
      const textField = el.renderRoot.querySelector('sl-text-field');

      expect(textField).to.have.attribute('readonly');
    });
  });

  describe('placeholder', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-date-field placeholder="Select a date"></sl-date-field>`);
    });

    it('should have placeholder', () => {
      expect(el.placeholder).to.equal('Select a date');
    });

    it('should pass placeholder to text field', () => {
      const textField = el.renderRoot.querySelector('sl-text-field');

      expect(textField).to.have.attribute('placeholder', 'Select a date');
    });
  });

  describe('value', () => {
    let testDate: Date;

    beforeEach(async () => {
      testDate = new Date(2023, 5, 15);
      el = await fixture(html`<sl-date-field .value=${testDate}></sl-date-field>`);
      input = el.querySelector('input')!;
    });

    it('should have value', () => {
      expect(el.value).to.equalDate(testDate);
    });

    it('should format value in input', () => {
      expect(input.value).to.match(/6\/15\/2023|15\/6\/2023|2023-06-15/);
    });

    it('should update input when value changes', async () => {
      const newDate = new Date(2023, 11, 25);
      el.value = newDate;
      await el.updateComplete;

      expect(input.value).to.match(/12\/25\/2023|25\/12\/2023|2023-12-25/);
    });

    it('should clear input when value is undefined', async () => {
      el.value = undefined;
      await el.updateComplete;

      expect(input.value).to.equal('');
    });
  });

  describe('date-time-format', () => {
    let testDate: Date;

    beforeEach(() => {
      testDate = new Date(2023, 5, 15);
    });

    it('should use custom format', async () => {
      el = await fixture(html`
        <sl-date-field
          .value=${testDate}
          .dateTimeFormat=${{ year: 'numeric', month: 'long', day: 'numeric' }}
        ></sl-date-field>
      `);
      input = el.querySelector('input')!;

      expect(input.value).to.contain('June');
      expect(input.value).to.contain('2023');
    });

    it('should have dateTimeFormat property', async () => {
      el = await fixture(html`<sl-date-field></sl-date-field>`);

      expect(el.dateTimeFormat).to.deep.equal({
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      });
    });
  });

  describe('min and max', () => {
    let minDate: Date, maxDate: Date;

    beforeEach(async () => {
      minDate = new Date(2023, 0, 1);
      maxDate = new Date(2023, 11, 31);
      el = await fixture(html`<sl-date-field .min=${minDate} .max=${maxDate}></sl-date-field>`);
    });

    it('should have min date', () => {
      expect(el.min).to.equalDate(minDate);
    });

    it('should have max date', () => {
      expect(el.max).to.equalDate(maxDate);
    });
  });

  describe('show-week-numbers', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-date-field show-week-numbers></sl-date-field>`);
    });

    it('should show week numbers', () => {
      expect(el.showWeekNumbers).to.be.true;
    });
  });

  describe('first-day-of-week', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-date-field first-day-of-week="0"></sl-date-field>`);
    });

    it('should set first day of week', () => {
      expect(el.firstDayOfWeek).to.equal(0);
    });
  });

  describe('month', () => {
    let monthDate: Date;

    beforeEach(async () => {
      monthDate = new Date(2023, 5, 1);
      el = await fixture(html`<sl-date-field .month=${monthDate}></sl-date-field>`);
    });

    it('should have month', () => {
      expect(el.month).to.equalDate(monthDate);
    });
  });

  describe('calendar popover', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-date-field></sl-date-field>`);
    });

    it('should not show calendar initially', () => {
      const wrapper = el.renderRoot.querySelector('[popover]');

      expect(wrapper?.matches(':popover-open')).to.be.false;
    });

    it('should show calendar when button is clicked', () => {
      const wrapper = el.renderRoot.querySelector('[popover]');

      el.renderRoot.querySelector('sl-field-button')?.click();

      expect(wrapper?.matches(':popover-open')).to.be.true;
    });

    it('should render calendar when popover is open', async () => {
      el.renderRoot.querySelector('sl-field-button')?.click();

      await new Promise(resolve => setTimeout(resolve));

      expect(el.renderRoot.querySelector('sl-calendar')).to.exist;
    });

    it('should not render calendar when popover is closed', () => {
      expect(el.renderRoot.querySelector('sl-calendar')).not.to.exist;
    });

    it('should set aria-expanded to true when popover opens', async () => {
      const input = el.querySelector('input');

      expect(input).not.to.have.attribute('aria-expanded');

      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;

      expect(input).to.have.attribute('aria-expanded', 'true');
    });

    it('should set aria-expanded to false when popover closes', async () => {
      const button = el.renderRoot.querySelector('sl-field-button') as HTMLElement;
      input = el.querySelector('input')!;

      await userEvent.click(button);
      await userEvent.click(button);

      expect(input).to.have.attribute('aria-expanded', 'false');
    });

    it('should pass selected date to calendar', async () => {
      const testDate = new Date(2023, 5, 15);
      el.value = testDate;
      await el.updateComplete;

      const button = el.renderRoot.querySelector('sl-field-button') as HTMLElement;
      await userEvent.click(button);
      await el.updateComplete;

      const calendar = el.renderRoot.querySelector('sl-calendar');
      expect(calendar).to.exist;
      expect(calendar?.selected).to.equalDate(testDate);
    });

    it('should pass show-week-numbers to calendar', async () => {
      el.showWeekNumbers = true;
      await el.updateComplete;

      const button = el.renderRoot.querySelector('sl-field-button') as HTMLElement;
      await userEvent.click(button);
      await el.updateComplete;

      const calendar = el.renderRoot.querySelector('sl-calendar');
      expect(calendar).to.have.attribute('show-week-numbers');
    });

    it('should pass first-day-of-week to calendar', async () => {
      el.firstDayOfWeek = 0;
      await el.updateComplete;

      const button = el.renderRoot.querySelector('sl-field-button') as HTMLElement;
      await userEvent.click(button);
      await el.updateComplete;

      const calendar = el.renderRoot.querySelector('sl-calendar');
      expect(calendar).to.have.attribute('first-day-of-week', '0');
    });

    it('should pass min to calendar', async () => {
      const minDate = new Date(2023, 0, 1);
      el.min = minDate;
      await el.updateComplete;

      const button = el.renderRoot.querySelector('sl-field-button') as HTMLElement;
      await userEvent.click(button);
      await el.updateComplete;

      const calendar = el.renderRoot.querySelector('sl-calendar');
      expect(calendar).to.have.attribute('min', minDate.toISOString());
    });

    it('should pass max to calendar', async () => {
      const maxDate = new Date(2023, 11, 31);
      el.max = maxDate;
      await el.updateComplete;

      const button = el.renderRoot.querySelector('sl-field-button') as HTMLElement;
      await userEvent.click(button);
      await el.updateComplete;

      const calendar = el.renderRoot.querySelector('sl-calendar');
      expect(calendar).to.have.attribute('max', maxDate.toISOString());
    });

    it('should pass month to calendar', async () => {
      const monthDate = new Date(2023, 5, 1);
      el.month = monthDate;
      await el.updateComplete;

      const button = el.renderRoot.querySelector('sl-field-button') as HTMLElement;
      await userEvent.click(button);
      await el.updateComplete;

      const calendar = el.renderRoot.querySelector('sl-calendar');
      expect(calendar).to.have.attribute('month', monthDate.toISOString());
    });

    it('should have show-today on calendar', async () => {
      const button = el.renderRoot.querySelector('sl-field-button') as HTMLElement;
      await userEvent.click(button);
      await el.updateComplete;

      const calendar = el.renderRoot.querySelector('sl-calendar');
      expect(calendar).to.have.attribute('show-today');
    });

    it('should hide popover when calendar date is selected', async () => {
      const button = el.renderRoot.querySelector('sl-field-button') as HTMLElement;
      await userEvent.click(button);
      await el.updateComplete;

      const calendar = el.renderRoot.querySelector('sl-calendar')!;
      const testDate = new Date(2023, 5, 15);

      // Simulate calendar selection which triggers sl-change event
      calendar.dispatchEvent(
        new CustomEvent('sl-change', {
          detail: testDate,
          bubbles: true,
          composed: true
        })
      );
      await el.updateComplete;

      const wrapper = el.renderRoot.querySelector('[popover]');
      expect(wrapper?.matches(':popover-open')).to.be.false;
    });

    it('should stop Escape key propagation', async () => {
      const escapeSpy = spy();
      document.addEventListener('keydown', escapeSpy);

      const button = el.renderRoot.querySelector('sl-field-button') as HTMLElement;
      await userEvent.click(button);
      await el.updateComplete;

      const wrapper = el.renderRoot.querySelector('[popover]') as HTMLElement;
      wrapper.focus();

      wrapper.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Escape',
          bubbles: true,
          composed: true
        })
      );

      // Event should not bubble to document
      expect(escapeSpy).not.to.have.been.called;

      document.removeEventListener('keydown', escapeSpy);
    });
  });

  describe('events', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-date-field></sl-date-field>`);
      input = el.querySelector('input')!;
    });

    it('should emit sl-change when calendar date is selected', async () => {
      const changeSpy = spy();
      el.addEventListener('sl-change', changeSpy);

      const button = el.renderRoot.querySelector('sl-field-button') as HTMLElement;
      await userEvent.click(button);
      await el.updateComplete;

      const testDate = new Date(2023, 5, 15);
      const calendar = el.renderRoot.querySelector('sl-calendar')!;
      calendar.dispatchEvent(
        new CustomEvent('sl-change', {
          detail: testDate,
          bubbles: true,
          composed: true
        })
      );

      expect(changeSpy).to.have.been.calledOnce;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(changeSpy.firstCall.args[0].detail).to.equalDate(testDate);
    });

    it('should update value when calendar date is selected', async () => {
      const button = el.renderRoot.querySelector('sl-field-button') as HTMLElement;
      await userEvent.click(button);
      await el.updateComplete;

      const testDate = new Date(2023, 5, 15);
      const calendar = el.renderRoot.querySelector('sl-calendar')!;
      calendar.dispatchEvent(
        new CustomEvent('sl-change', {
          detail: testDate,
          bubbles: true,
          composed: true
        })
      );

      expect(el.value).to.equalDate(testDate);
    });

    it('should set time to 00:00:00 when date is selected', async () => {
      const button = el.renderRoot.querySelector('sl-field-button') as HTMLElement;
      await userEvent.click(button);
      await el.updateComplete;

      const testDate = new Date(2023, 5, 15, 12, 30, 45);
      const calendar = el.renderRoot.querySelector('sl-calendar')!;
      calendar.dispatchEvent(
        new CustomEvent('sl-change', {
          detail: testDate,
          bubbles: true,
          composed: true
        })
      );

      expect(el.value?.getHours()).to.equal(0);
      expect(el.value?.getMinutes()).to.equal(0);
      expect(el.value?.getSeconds()).to.equal(0);
    });

    it('should emit sl-focus when text field gains focus', async () => {
      const focusSpy = spy();
      el.addEventListener('sl-focus', focusSpy);

      await userEvent.click(input);

      expect(focusSpy).to.have.been.calledOnce;
    });

    it('should emit sl-blur when text field loses focus', async () => {
      const blurSpy = spy();
      el.addEventListener('sl-blur', blurSpy);

      await userEvent.click(input);
      input.blur();

      expect(blurSpy).to.have.been.calledOnce;
    });

    it('should focus input after calendar date selection', async () => {
      const button = el.renderRoot.querySelector('sl-field-button') as HTMLElement;
      await userEvent.click(button);
      await el.updateComplete;

      const testDate = new Date(2023, 5, 15);
      const calendar = el.renderRoot.querySelector('sl-calendar')!;
      calendar.dispatchEvent(
        new CustomEvent('sl-change', {
          detail: testDate,
          bubbles: true,
          composed: true
        })
      );
      await new Promise(resolve => setTimeout(resolve, 100));

      // After selection, focus should return to the input
      expect(document.activeElement).to.equal(input);
    });
  });

  describe('form integration', () => {
    it('should have form control element', () => {
      expect(el.input).to.exist;
      expect(el.input.tagName).to.equal('INPUT');
    });

    it('should update validity when value changes', async () => {
      el = await fixture(html`<sl-date-field required></sl-date-field>`);

      expect(el.input.validity.valid).to.be.false;

      el.value = new Date(2023, 5, 15);
      await el.updateComplete;

      expect(el.input.validity.valid).to.be.true;
    });
  });

  describe('accessibility', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-date-field></sl-date-field>`);
      input = el.querySelector('input')!;
    });

    it('should have aria-label on calendar button', () => {
      const button = el.renderRoot.querySelector('sl-field-button');

      expect(button).to.have.attribute('aria-label');
    });

    it('should have tabindex 0 on calendar button', () => {
      const button = el.renderRoot.querySelector('sl-field-button');

      expect(button).to.have.attribute('tabindex', '0');
    });

    it('should attempt to focus calendar when popover opens', async () => {
      const button = el.renderRoot.querySelector('sl-field-button') as HTMLElement;
      await userEvent.click(button);
      await el.updateComplete;

      // The calendar should exist and be rendered
      const calendar = el.renderRoot.querySelector('sl-calendar');

      expect(calendar).to.exist;
    });
  });
});
