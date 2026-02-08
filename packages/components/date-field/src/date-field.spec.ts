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
    // March 2026
    // --------------------
    // Su Mo Tu We Th Fr Sa
    //  1  2  3  4  5  6  7
    //  8  9 10 11 12 13 14
    // 15 16 17 18 19 20 21
    // 22 23 24 25 26 27 28
    // 29 30 31  1  2  3  4
    vi.setSystemTime(new Date(2026, 2, 14));
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

    it('should not have a calendar by default', () => {
      expect(el.renderRoot.querySelector('sl-calendar')).not.to.exist;
    });

    it('should not be disabled', () => {
      const button = el.renderRoot.querySelector('sl-field-button'),
        textField = el.renderRoot.querySelector('sl-text-field');

      expect(el).not.to.have.attribute('disabled');
      expect(el.disabled).not.to.be.true;
      expect(input.disabled).to.be.false;
      expect(button).not.to.have.attribute('disabled');
      expect(textField).not.to.have.attribute('disabled');
    });

    it('should be disabled when set', async () => {
      const button = el.renderRoot.querySelector('sl-field-button'),
        textField = el.renderRoot.querySelector('sl-text-field');

      el.disabled = true;
      await el.updateComplete;

      expect(el.disabled).to.be.true;
      expect(input.disabled).to.be.true;
      expect(button).to.have.attribute('disabled');
      expect(textField).to.have.attribute('disabled');
    });

    it('should not be readonly', () => {
      expect(el).not.to.have.attribute('readonly');
      expect(el.readonly).not.to.be.true;
      expect(input.readOnly).to.be.false;
    });

    it('should be readonly when set', async () => {
      const button = el.renderRoot.querySelector('sl-field-button'),
        textField = el.renderRoot.querySelector('sl-text-field');

      el.readonly = true;
      await el.updateComplete;

      expect(el.readonly).to.be.true;
      expect(input.readOnly).to.be.true;
      expect(button).to.have.attribute('disabled');
      expect(textField).to.have.attribute('readonly');
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
      const button = el.renderRoot.querySelector('sl-field-button'),
        textField = el.renderRoot.querySelector('sl-text-field');

      el.selectOnly = true;
      await el.updateComplete;

      expect(el).to.have.attribute('select-only');
      expect(el.selectOnly).to.be.true;
      expect(button).not.to.have.attribute('disabled');
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
      expect(dialog).not.to.contain('sl-calendar');
    });

    it('should render the calendar when the popover is opened', async () => {
      const wrapper = el.renderRoot.querySelector('[popover]');

      el.renderRoot.querySelector('sl-field-button')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(wrapper?.matches(':popover-open')).to.be.true;
      expect(el.renderRoot.querySelector('sl-calendar')).to.exist;
    });

    it('should show calendar when button is clicked', () => {
      const wrapper = el.renderRoot.querySelector('[popover]');

      el.renderRoot.querySelector('sl-field-button')?.click();

      expect(wrapper?.matches(':popover-open')).to.be.true;
    });

    it('should set aria-expanded to true when popover opens', async () => {
      expect(input).to.have.attribute('aria-expanded', 'false');

      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;

      expect(input).to.have.attribute('aria-expanded', 'true');
    });

    it('should set aria-expanded to false when popover closes', () => {
      const button = el.renderRoot.querySelector('sl-field-button');

      expect(input).to.have.attribute('aria-expanded', 'false');

      button?.click();
      expect(input).to.have.attribute('aria-expanded', 'true');

      button?.click();
      expect(input).to.have.attribute('aria-expanded', 'false');
    });

    it('should hide popover when calendar date is selected', async () => {
      el.renderRoot.querySelector('sl-field-button')?.click();
      await new Promise(resolve => setTimeout(resolve));

      // Simulate the user selecting a date
      const calendar = el.renderRoot.querySelector('sl-calendar')!;
      calendar.dispatchEvent(
        new CustomEvent('sl-change', {
          detail: new Date(2023, 5, 15),
          bubbles: true,
          composed: true
        })
      );
      await el.updateComplete;

      expect(el.renderRoot.querySelector('dialog')?.matches(':popover-open')).to.be.false;
    });

    it('should stop Escape key propagation', async () => {
      const onKeydown = spy();

      document.addEventListener('keydown', onKeydown);

      el.renderRoot.querySelector('sl-field-button')?.click();
      await new Promise(resolve => setTimeout(resolve));
      await userEvent.type(el.renderRoot.querySelector('dialog')!, '{Escape}');

      expect(onKeydown).not.to.have.been.called;

      document.removeEventListener('keydown', onKeydown);
    });

    it('should pass selected date to calendar', async () => {
      const testDate = new Date(2023, 5, 15);
      el.value = testDate;
      await el.updateComplete;

      el.renderRoot.querySelector('sl-field-button')?.click();
      await new Promise(resolve => setTimeout(resolve));

      const calendar = el.renderRoot.querySelector('sl-calendar');
      expect(calendar).to.exist;
      expect(calendar?.selected).to.equalDate(testDate);
    });

    it('should pass show-week-numbers to calendar', async () => {
      el.showWeekNumbers = true;
      await el.updateComplete;

      el.renderRoot.querySelector('sl-field-button')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(el.renderRoot.querySelector('sl-calendar')).to.have.attribute('show-week-numbers');
    });

    it('should pass first-day-of-week to calendar', async () => {
      el.firstDayOfWeek = 0;
      await el.updateComplete;

      el.renderRoot.querySelector('sl-field-button')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(el.renderRoot.querySelector('sl-calendar')).to.have.attribute('first-day-of-week', '0');
    });

    it('should pass min to calendar', async () => {
      const minDate = new Date(2023, 0, 1);
      el.min = minDate;
      await el.updateComplete;

      el.renderRoot.querySelector('sl-field-button')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(el.renderRoot.querySelector('sl-calendar')).to.have.attribute('min', minDate.toISOString());
    });

    it('should pass max to calendar', async () => {
      const maxDate = new Date(2023, 11, 31);
      el.max = maxDate;
      await el.updateComplete;

      el.renderRoot.querySelector('sl-field-button')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(el.renderRoot.querySelector('sl-calendar')).to.have.attribute('max', maxDate.toISOString());
    });

    it('should pass month to calendar', async () => {
      const monthDate = new Date(2023, 5, 1);
      el.month = monthDate;
      await el.updateComplete;

      el.renderRoot.querySelector('sl-field-button')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(el.renderRoot.querySelector('sl-calendar')).to.have.attribute('month', monthDate.toISOString());
    });

    it('should have show-today on calendar', async () => {
      el.renderRoot.querySelector('sl-field-button')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(el.renderRoot.querySelector('sl-calendar')).to.have.attribute('show-today');
    });

    it("should focus today's date when popover opens", async () => {
      el.renderRoot.querySelector('sl-field-button')?.click();
      await new Promise(resolve => setTimeout(resolve, 50));

      const calendar = el.renderRoot.querySelector('sl-calendar'),
        selectDay = calendar?.shadowRoot?.querySelector('sl-select-day'),
        monthView = selectDay?.shadowRoot?.querySelector('sl-month-view[autofocus]');

      expect(monthView?.shadowRoot?.activeElement).to.exist;
      expect(monthView?.shadowRoot?.activeElement).to.have.attribute('aria-current', 'date');
    });

    it('should emit sl-change when calendar date is selected', async () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      el.renderRoot.querySelector('sl-field-button')?.click();
      await new Promise(resolve => setTimeout(resolve));

      // Simulate the user selecting a date
      const testDate = new Date(2023, 5, 15);
      const calendar = el.renderRoot.querySelector('sl-calendar')!;
      calendar.dispatchEvent(
        new CustomEvent('sl-change', {
          detail: testDate,
          bubbles: true,
          composed: true
        })
      );

      expect(onChange).to.have.been.calledOnce;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(onChange.firstCall.args[0].detail).to.equalDate(testDate);
    });

    it('should update value when calendar date is selected', async () => {
      el.renderRoot.querySelector('sl-field-button')?.click();
      await new Promise(resolve => setTimeout(resolve));

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
      el.renderRoot.querySelector('sl-field-button')?.click();
      await new Promise(resolve => setTimeout(resolve));

      // Simulate the user selecting a date
      const calendar = el.renderRoot.querySelector('sl-calendar')!;
      calendar.dispatchEvent(
        new CustomEvent('sl-change', {
          detail: new Date(2023, 5, 15, 12, 30, 45),
          bubbles: true,
          composed: true
        })
      );

      expect(el.value?.getHours()).to.equal(0);
      expect(el.value?.getMinutes()).to.equal(0);
      expect(el.value?.getSeconds()).to.equal(0);
    });

    it('should focus input after calendar date selection', async () => {
      el.renderRoot.querySelector('sl-field-button')?.click();
      await new Promise(resolve => setTimeout(resolve));

      // Simulate the user selecting a date
      const calendar = el.renderRoot.querySelector('sl-calendar')!;
      calendar.dispatchEvent(
        new CustomEvent('sl-change', {
          detail: new Date(2023, 5, 15),
          bubbles: true,
          composed: true
        })
      );
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(document.activeElement).to.equal(input);
    });

    it('should emit sl-focus when text field gains focus', () => {
      const onFocus = spy();
      el.addEventListener('sl-focus', onFocus);

      input.focus();

      expect(onFocus).to.have.been.calledOnce;
    });

    it('should emit sl-blur when text field loses focus', () => {
      const onBlur = spy();
      el.addEventListener('sl-blur', onBlur);

      input.focus();
      input.blur();

      expect(onBlur).to.have.been.calledOnce;
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

    it('should have aria-controls on the calendar button', () => {
      const button = el.renderRoot.querySelector('sl-field-button'),
        dialog = el.renderRoot.querySelector('dialog');

      expect(button).to.have.attribute('aria-controls', dialog?.id);
    });

    it('should have aria-label on calendar button', () => {
      const button = el.renderRoot.querySelector('sl-field-button');

      expect(button).to.have.attribute('aria-label');
    });

    it('should have tabindex 0 on calendar button', () => {
      const button = el.renderRoot.querySelector('sl-field-button');

      expect(button).to.have.attribute('tabindex', '0');
    });
  });

  describe('keyboard entry', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-date-field></sl-date-field>`);
      input = el.querySelector('input')!;
      input.focus();
    });

    it('should show date template on focus', () => {
      expect(input.value).to.equal('MM/DD/YYYY');
    });

    it('should select first part on focus', () => {
      expect(input.selectionStart).to.equal(0);
      expect(input.selectionEnd).to.equal(2);
    });

    it('should enter single digit in month part', async () => {
      await userEvent.keyboard('5');

      expect(input.value).to.equal('05/DD/YYYY');
    });

    it('should keep focus on month part after entering one digit', async () => {
      await userEvent.keyboard('5');

      expect(input.selectionStart).to.equal(0);
      expect(input.selectionEnd).to.equal(2);
    });

    it('should combine two digits in month part', async () => {
      await userEvent.keyboard('1');
      await userEvent.keyboard('2');

      expect(input.value).to.equal('12/DD/YYYY');
    });

    it('should advance to day part after entering two digits in month', async () => {
      await userEvent.keyboard('1');
      await userEvent.keyboard('2');

      expect(input.selectionStart).to.equal(3);
      expect(input.selectionEnd).to.equal(5);
    });

    it('should enter digits in day part', async () => {
      await userEvent.keyboard('0');
      await userEvent.keyboard('6');
      await userEvent.keyboard('1');
      await userEvent.keyboard('2');

      expect(input.value).to.equal('06/12/YYYY');
    });

    it('should advance to year part after entering two digits in day', async () => {
      await userEvent.keyboard('0');
      await userEvent.keyboard('6');
      await userEvent.keyboard('1');
      await userEvent.keyboard('2');

      expect(input.selectionStart).to.equal(6);
      expect(input.selectionEnd).to.equal(10);
    });

    it('should enter four digits in year part', async () => {
      await userEvent.keyboard('0');
      await userEvent.keyboard('6');
      await userEvent.keyboard('1');
      await userEvent.keyboard('2');
      await userEvent.keyboard('2');
      await userEvent.keyboard('0');
      await userEvent.keyboard('2');
      await userEvent.keyboard('3');

      expect(input.value).to.equal('06/12/2023');
    });

    it('should stay on year part after entering four digits', async () => {
      await userEvent.keyboard('0');
      await userEvent.keyboard('6');
      await userEvent.keyboard('1');
      await userEvent.keyboard('2');
      await userEvent.keyboard('2');
      await userEvent.keyboard('0');
      await userEvent.keyboard('2');
      await userEvent.keyboard('3');

      expect(input.selectionStart).to.equal(6);
      expect(input.selectionEnd).to.equal(10);
    });

    it('should set value after entering complete valid date', async () => {
      await userEvent.keyboard('0');
      await userEvent.keyboard('6');
      await userEvent.keyboard('1');
      await userEvent.keyboard('2');
      await userEvent.keyboard('2');
      await userEvent.keyboard('0');
      await userEvent.keyboard('2');
      await userEvent.keyboard('3');

      expect(el.value).to.equalDate(new Date(2023, 5, 12));
    });

    it('should not set value for incomplete date', async () => {
      await userEvent.keyboard('1');
      await userEvent.keyboard('2');

      expect(el.value).to.be.undefined;
    });

    it('should not set value for invalid date', async () => {
      await userEvent.keyboard('0');
      await userEvent.keyboard('2');
      await userEvent.keyboard('3');
      await userEvent.keyboard('1');
      await userEvent.keyboard('2');
      await userEvent.keyboard('0');
      await userEvent.keyboard('2');
      await userEvent.keyboard('3');

      expect(el.value).to.be.undefined;
    });

    it('should allow entering date starting from day part', async () => {
      await userEvent.keyboard('{ArrowRight}');
      await userEvent.keyboard('1');
      await userEvent.keyboard('5');

      expect(input.value).to.equal('MM/15/YYYY');
    });

    it('should allow entering date starting from year part', async () => {
      await userEvent.keyboard('{ArrowRight}');
      await userEvent.keyboard('{ArrowRight}');
      await userEvent.keyboard('2');
      await userEvent.keyboard('0');
      await userEvent.keyboard('2');
      await userEvent.keyboard('3');

      expect(input.value).to.equal('MM/DD/2023');
    });

    it('should emit sl-change when complete valid date is entered', async () => {
      const onChange = spy();
      el.addEventListener('sl-change', onChange);

      await userEvent.keyboard('0');
      await userEvent.keyboard('6');
      await userEvent.keyboard('1');
      await userEvent.keyboard('2');
      await userEvent.keyboard('2');
      await userEvent.keyboard('0');
      await userEvent.keyboard('2');
      await userEvent.keyboard('3');

      expect(onChange).to.have.been.called;
    });

    it('should move to next part when separator character is typed', async () => {
      await userEvent.keyboard('0');
      await userEvent.keyboard('6');
      await userEvent.keyboard('/');

      // Should be on year part after typing separator (moved from day to year)
      expect(input.selectionStart).to.equal(6);
      expect(input.selectionEnd).to.equal(10);
    });

    it('should not add separator character to input', async () => {
      await userEvent.keyboard('0');
      await userEvent.keyboard('6');
      await userEvent.keyboard('/');

      expect(input.value).to.equal('06/DD/YYYY');
    });

    it('should allow completing date entry with separators', async () => {
      await userEvent.keyboard('6');
      await userEvent.keyboard('/');
      await userEvent.keyboard('1');
      await userEvent.keyboard('2');
      await userEvent.keyboard('/');
      await userEvent.keyboard('2');
      await userEvent.keyboard('0');
      await userEvent.keyboard('2');
      await userEvent.keyboard('3');

      expect(el.value).to.exist;
      expect(el.value).to.equalDate(new Date(2023, 5, 12));
    });
  });
});
