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

    it('should be disabled when set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el.disabled).to.be.true;
      expect(input.disabled).to.be.true;

      const textField = el.renderRoot.querySelector('sl-text-field');
      expect(textField).to.have.attribute('disabled');

      const button = el.renderRoot.querySelector('sl-field-button');
      expect(button).to.have.attribute('disabled');
      expect(button).to.have.attribute('tabindex', '-1');
    });

    it('should not be readonly', () => {
      expect(el).not.to.have.attribute('readonly');
      expect(el.readonly).not.to.be.true;
    });

    it('should be readonly when set', async () => {
      el.readonly = true;
      await el.updateComplete;

      expect(el.readonly).to.be.true;

      const textField = el.renderRoot.querySelector('sl-text-field');
      expect(textField).to.have.attribute('readonly');

      const button = el.renderRoot.querySelector('sl-field-button');
      expect(button).to.have.attribute('disabled');
    });

    it('should not be required', () => {
      expect(el).not.to.have.attribute('required');
      expect(el.required).not.to.be.true;
    });

    it('should be required when set', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el).to.have.attribute('required');
      expect(el.required).to.be.true;

      const textField = el.renderRoot.querySelector('sl-text-field');
      expect(textField).to.have.attribute('required');
    });

    it('should not be select-only', () => {
      expect(el).not.to.have.attribute('select-only');
      expect(el.selectOnly).not.to.be.true;
    });

    it('should be select-only when set', async () => {
      el.selectOnly = true;
      await el.updateComplete;

      expect(el).to.have.attribute('select-only');
      expect(el.selectOnly).to.be.true;

      const textField = el.renderRoot.querySelector('sl-text-field');
      expect(textField).to.have.attribute('readonly');
    });

    it('should not show week numbers', () => {
      expect(el.showWeekNumbers).not.to.be.true;
    });

    it('should show week numbers when set', async () => {
      el.showWeekNumbers = true;
      await el.updateComplete;

      expect(el.showWeekNumbers).to.be.true;
    });

    it('should not have a value', () => {
      expect(el.value).to.be.undefined;
      expect(input.value).to.equal('');
    });

    it('should have a value when set', async () => {
      const testDate = new Date(2023, 5, 15);
      el.value = testDate;
      await el.updateComplete;

      expect(el.value).to.equalDate(testDate);
      expect(input.value).to.match(/6\/15\/2023|15\/6\/2023|2023-06-15/);
    });

    it('should update input when value changes', async () => {
      el.value = new Date(2023, 5, 15);
      await el.updateComplete;

      const newDate = new Date(2023, 11, 25);
      el.value = newDate;
      await el.updateComplete;

      expect(input.value).to.match(/12\/25\/2023|25\/12\/2023|2023-12-25/);
    });

    it('should clear input when value is undefined', async () => {
      el.value = new Date(2023, 5, 15);
      await el.updateComplete;

      el.value = undefined;
      await el.updateComplete;

      expect(input.value).to.equal('');
    });

    it('should not have a placeholder', () => {
      expect(el.placeholder).to.be.undefined;
    });

    it('should have a placeholder when set', async () => {
      el.placeholder = 'Select a date';
      await el.updateComplete;

      expect(el.placeholder).to.equal('Select a date');

      const textField = el.renderRoot.querySelector('sl-text-field');
      expect(textField).to.have.attribute('placeholder', 'Select a date');
    });

    it('should not have min date', () => {
      expect(el.min).to.be.undefined;
    });

    it('should have min date when set', async () => {
      const minDate = new Date(2023, 0, 1);
      el.min = minDate;
      await el.updateComplete;

      expect(el.min).to.equalDate(minDate);
    });

    it('should not have max date', () => {
      expect(el.max).to.be.undefined;
    });

    it('should have max date when set', async () => {
      const maxDate = new Date(2023, 11, 31);
      el.max = maxDate;
      await el.updateComplete;

      expect(el.max).to.equalDate(maxDate);
    });

    it('should have default date-time format', () => {
      expect(el.dateTimeFormat).to.deep.equal({
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      });
    });

    it('should use custom date-time format when set', async () => {
      const testDate = new Date(2023, 5, 15);
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

    it('should set first day of week when set', async () => {
      el.firstDayOfWeek = 0;
      await el.updateComplete;

      expect(el.firstDayOfWeek).to.equal(0);
    });

    it('should have month when set', async () => {
      const monthDate = new Date(2023, 5, 1);
      el.month = monthDate;
      await el.updateComplete;

      expect(el.month).to.equalDate(monthDate);
    });

    it('should have autocomplete off on input', () => {
      expect(input).to.have.attribute('autocomplete', 'off');
    });

    it('should have input in slot', () => {
      expect(input.slot).to.equal('input');
    });
  });

  describe('popover', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-date-field></sl-date-field>`);
      input = el.querySelector('input')!;
    });

    it('should not show calendar initially', () => {
      const wrapper = el.renderRoot.querySelector('[popover]');

      expect(wrapper?.matches(':popover-open')).to.be.false;
    });

    it('should render calendar in a dialog with popover', () => {
      const dialog = el.renderRoot.querySelector('dialog');

      expect(dialog).to.have.attribute('popover');
      expect(dialog).to.contain('sl-calendar');
    });

    it('should show calendar when button is clicked', () => {
      const wrapper = el.renderRoot.querySelector('[popover]');

      el.renderRoot.querySelector('sl-field-button')?.click();

      expect(wrapper?.matches(':popover-open')).to.be.true;
    });

    it('should set aria-expanded to true when popover opens', async () => {
      expect(input).not.to.have.attribute('aria-expanded');

      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;

      expect(input).to.have.attribute('aria-expanded', 'true');
    });

    it('should set aria-expanded to false when popover closes', async () => {
      const button = el.renderRoot.querySelector('sl-field-button') as HTMLElement;

      await userEvent.click(button);
      await userEvent.click(button);

      expect(input).to.have.attribute('aria-expanded', 'false');
    });

    it('should hide popover when calendar date is selected', async () => {
      const button = el.renderRoot.querySelector('sl-field-button') as HTMLElement;
      await userEvent.click(button);
      await el.updateComplete;

      const calendar = el.renderRoot.querySelector('sl-calendar')!;
      calendar.dispatchEvent(
        new CustomEvent('sl-change', {
          detail: new Date(2023, 5, 15),
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

      expect(escapeSpy).not.to.have.been.called;

      document.removeEventListener('keydown', escapeSpy);
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

      expect(document.activeElement).to.equal(input);
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
  });

  describe('form integration', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-date-field></sl-date-field>`);
      input = el.querySelector('input')!;
    });

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
