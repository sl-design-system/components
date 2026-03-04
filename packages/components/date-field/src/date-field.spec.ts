import { type Calendar, type MonthView } from '@sl-design-system/calendar';
import '@sl-design-system/calendar/register.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { spy } from 'sinon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
import { DateField } from './date-field.js';

describe('sl-date-field', () => {
  let el: DateField;

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
    });

    it('should render spinbutton spans for each date part', () => {
      const spans = el.renderRoot.querySelectorAll('span[role="spinbutton"]');

      expect(spans).to.have.length(3);
    });

    it('should render separator spans between parts', () => {
      expect(el.renderRoot.querySelectorAll('.separator')).to.have.length(2);
    });

    it('should render parts in locale order', () => {
      // Default locale (en-US): month / day / year
      const spans = el.renderRoot.querySelectorAll('span[role="spinbutton"]');

      expect(spans[0]).to.have.attribute('aria-label', 'Month');
      expect(spans[1]).to.have.attribute('aria-label', 'Day');
      expect(spans[2]).to.have.attribute('aria-label', 'Year');
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
      expect(el).not.to.have.attribute('disabled');
      expect(el.disabled).not.to.be.true;
      expect(el.renderRoot.querySelector('sl-field-button')).not.to.have.attribute('disabled');

      el.renderRoot
        .querySelectorAll('span[role="spinbutton"]')
        .forEach(span => expect(span).to.have.attribute('aria-disabled', 'false'));
    });

    it('should be disabled when set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el.disabled).to.be.true;
      expect(el.renderRoot.querySelector('sl-field-button')).to.have.attribute('disabled');

      el.renderRoot
        .querySelectorAll('span[role="spinbutton"]')
        .forEach(span => expect(span).to.have.attribute('aria-disabled', 'true'));
    });

    it('should not be readonly', () => {
      expect(el).not.to.have.attribute('readonly');
      expect(el.readonly).not.to.be.true;

      el.renderRoot
        .querySelectorAll('span[role="spinbutton"]')
        .forEach(span => expect(span).to.have.attribute('aria-readonly', 'false'));
    });

    it('should be readonly when set', async () => {
      el.readonly = true;
      await el.updateComplete;

      const spans = el.renderRoot.querySelectorAll('span[role="spinbutton"]'),
        button = el.renderRoot.querySelector('sl-field-button');

      expect(el.readonly).to.be.true;
      spans.forEach(span => expect(span).to.have.attribute('aria-readonly', 'true'));
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
    });

    it('should not be select-only', () => {
      expect(el).not.to.have.attribute('select-only');
      expect(el.selectOnly).not.to.be.true;
    });

    it('should be select-only when set', async () => {
      el.selectOnly = true;
      await el.updateComplete;

      const spans = el.renderRoot.querySelectorAll('span[role="spinbutton"]');

      expect(el).to.have.attribute('select-only');
      expect(el.selectOnly).to.be.true;
      spans.forEach(span => expect(span).to.have.attribute('aria-readonly', 'true'));
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
      const inputs = el.renderRoot.querySelectorAll('span[role="spinbutton"]');

      expect(el.value).to.be.undefined;
      // en-US: MM/DD/YYYY placeholder text
      expect(inputs[0]).to.have.trimmed.text('MM');
      expect(inputs[1]).to.have.trimmed.text('DD');
      expect(inputs[2]).to.have.trimmed.text('YYYY');
    });

    it('should have a value when set', async () => {
      const testDate = new Date(2023, 5, 15);
      el.value = testDate;
      await el.updateComplete;

      const inputs = el.renderRoot.querySelectorAll('span[role="spinbutton"]');

      expect(el.value).to.equalDate(testDate);
      // en-US: month / day / year
      expect(inputs[0]).to.have.trimmed.text('06');
      expect(inputs[1]).to.have.trimmed.text('15');
      expect(inputs[2]).to.have.trimmed.text('2023');
    });

    it('should update inputs when value changes', async () => {
      el.value = new Date(2023, 5, 15);
      await el.updateComplete;

      const newDate = new Date(2023, 11, 25);
      el.value = newDate;
      await el.updateComplete;

      const inputs = el.renderRoot.querySelectorAll('span[role="spinbutton"]');

      expect(inputs[0]).to.have.trimmed.text('12');
      expect(inputs[1]).to.have.trimmed.text('25');
      expect(inputs[2]).to.have.trimmed.text('2023');
    });

    it('should clear inputs when value is undefined', async () => {
      el.value = new Date(2023, 5, 15);
      await el.updateComplete;

      el.value = undefined;
      await el.updateComplete;

      const inputs = el.renderRoot.querySelectorAll('span[role="spinbutton"]');

      // en-US: MM/DD/YYYY placeholder text
      expect(inputs[0]).to.have.trimmed.text('MM');
      expect(inputs[1]).to.have.trimmed.text('DD');
      expect(inputs[2]).to.have.trimmed.text('YYYY');
    });

    it('should have placeholder-shown state when placeholder is set and no value', async () => {
      el.placeholder = 'Pick a date';
      await el.updateComplete;

      expect(el.internals.states.has('placeholder-shown')).to.be.true;
    });

    it('should not have placeholder-shown state when there is no placeholder', () => {
      expect(el.internals.states.has('placeholder-shown')).to.be.false;
    });

    it('should remove placeholder-shown state when a value is set', async () => {
      el.placeholder = 'Pick a date';
      await el.updateComplete;

      expect(el.internals.states.has('placeholder-shown')).to.be.true;

      el.value = new Date(2026, 2, 14);
      await el.updateComplete;

      expect(el.internals.states.has('placeholder-shown')).to.be.false;
    });

    it('should restore placeholder-shown state when the value is cleared', async () => {
      el.placeholder = 'Pick a date';
      el.value = new Date(2026, 2, 14);
      await el.updateComplete;

      expect(el.internals.states.has('placeholder-shown')).to.be.false;

      el.value = undefined;
      await el.updateComplete;

      expect(el.internals.states.has('placeholder-shown')).to.be.true;
    });

    it('should not have has-value state when there is no value', () => {
      expect(el.internals.states.has('has-value')).to.be.false;
    });

    it('should have has-value state when a value is set', async () => {
      el.value = new Date(2026, 2, 14);
      await el.updateComplete;

      expect(el.internals.states.has('has-value')).to.be.true;
    });

    it('should remove has-value state when the value is cleared', async () => {
      el.value = new Date(2026, 2, 14);
      await el.updateComplete;

      expect(el.internals.states.has('has-value')).to.be.true;

      el.value = undefined;
      await el.updateComplete;

      expect(el.internals.states.has('has-value')).to.be.false;
    });

    it('should have aria-hidden on the placeholder when a value is set', async () => {
      el.placeholder = 'Pick a date';
      el.value = new Date(2026, 2, 14);
      await el.updateComplete;

      const placeholder = el.renderRoot.querySelector('.placeholder');

      expect(placeholder).to.exist;
      expect(placeholder).to.have.attribute('aria-hidden', 'true');
    });

    it('should not have aria-hidden on the placeholder when there is no value', async () => {
      el.placeholder = 'Pick a date';
      await el.updateComplete;

      const placeholder = el.renderRoot.querySelector('.placeholder');

      expect(placeholder).to.exist;
      expect(placeholder).not.to.have.attribute('aria-hidden');
    });

    it('should not require confirmation', () => {
      expect(el.requireConfirmation).not.to.be.true;
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
  });

  describe('popover', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-date-field></sl-date-field>`);
    });

    it('should not show calendar initially', () => {
      const dialog = el.renderRoot.querySelector('dialog[popover]');

      expect(dialog).not.to.match(':popover-open');
    });

    it('should render the calendar when the popover is opened', async () => {
      const dialog = el.renderRoot.querySelector('dialog[popover]');

      expect(dialog).not.to.match(':popover-open');
      expect(dialog).not.to.contain('sl-calendar');

      el.renderRoot.querySelector('sl-field-button')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(dialog).to.match(':popover-open');
      expect(dialog).to.contain('sl-calendar');
    });

    it('should hide popover when calendar date is selected', async () => {
      el.renderRoot.querySelector('sl-field-button')?.click();
      await new Promise(resolve => setTimeout(resolve));

      const calendar = el.renderRoot.querySelector('sl-calendar')!;
      calendar.dispatchEvent(
        new CustomEvent('sl-change', {
          detail: new Date(2023, 5, 15),
          bubbles: true,
          composed: true
        })
      );
      await el.updateComplete;

      expect(el.renderRoot.querySelector('dialog')).not.to.match(':popover-open');
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

    it('should focus first spinbutton after calendar date selection', async () => {
      el.renderRoot.querySelector('sl-field-button')?.click();
      await new Promise(resolve => setTimeout(resolve));

      const calendar = el.renderRoot.querySelector('sl-calendar')!;
      calendar.dispatchEvent(
        new CustomEvent('sl-change', {
          detail: new Date(2023, 5, 15),
          bubbles: true,
          composed: true
        })
      );
      await new Promise(resolve => setTimeout(resolve, 100));

      const firstSpan = el.renderRoot.querySelector('span[role="spinbutton"]');
      expect((el.renderRoot as ShadowRoot).activeElement).to.equal(firstSpan);
    });

    it('should emit sl-focus when component gains focus', () => {
      const onFocus = spy();
      el.addEventListener('sl-focus', onFocus);

      const firstSpan = el.renderRoot.querySelector<HTMLElement>('span[role="spinbutton"]')!;
      firstSpan.focus();

      expect(onFocus).to.have.been.calledOnce;
    });

    it('should not emit sl-focus again when moving focus between date parts', () => {
      const onFocus = spy();
      el.addEventListener('sl-focus', onFocus);

      const spans = el.renderRoot.querySelectorAll<HTMLElement>('span[role="spinbutton"]');
      spans[0].focus();
      spans[1].focus();
      spans[2].focus();

      expect(onFocus).to.have.been.calledOnce;
    });

    it('should emit sl-blur when component loses focus', () => {
      const onBlur = spy();
      el.addEventListener('sl-blur', onBlur);

      const firstSpan = el.renderRoot.querySelector<HTMLElement>('span[role="spinbutton"]')!;
      firstSpan.focus();
      firstSpan.blur();

      expect(onBlur).to.have.been.calledOnce;
    });

    it('should not emit sl-blur when moving focus between date parts', () => {
      const onBlur = spy();
      el.addEventListener('sl-blur', onBlur);

      const spans = el.renderRoot.querySelectorAll<HTMLElement>('span[role="spinbutton"]');
      spans[0].focus();
      spans[1].focus();
      spans[2].focus();

      expect(onBlur).not.to.have.been.called;
    });
  });

  describe('form integration', () => {
    it('should use ElementInternals for form association', async () => {
      const form = await fixture(html`
        <form>
          <sl-date-field name="date"></sl-date-field>
        </form>
      `);
      el = form.querySelector('sl-date-field')!;

      expect(el.internals).to.exist;
      expect(el.internals.form).to.equal(form);
    });

    it('should have role="group" on internals', async () => {
      el = await fixture(html`<sl-date-field></sl-date-field>`);

      expect(el.internals.role).to.equal('group');
    });

    it('should update validity when value changes', async () => {
      el = await fixture(html`<sl-date-field required></sl-date-field>`);

      expect(el.valid).to.be.false;

      el.value = new Date(2023, 5, 15);
      await el.updateComplete;

      expect(el.valid).to.be.true;
    });

    it('should report form value as ISO string', async () => {
      const form = await fixture(html`
        <form>
          <sl-date-field name="date" .value=${new Date(2026, 2, 14)}></sl-date-field>
        </form>
      `);
      el = form.querySelector('sl-date-field')!;
      await el.updateComplete;

      expect(el.formValue).to.equal('2026-03-14');
    });
  });

  describe('accessibility', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-date-field></sl-date-field>`);
    });

    it('should have aria-controls on the calendar button', () => {
      const button = el.renderRoot.querySelector('sl-field-button'),
        dialog = el.renderRoot.querySelector('dialog');

      expect(button).to.have.attribute('aria-controls', dialog?.id);
    });

    it('should have aria-expanded false on the calendar button by default', () => {
      const button = el.renderRoot.querySelector('sl-field-button');

      expect(button).to.have.attribute('aria-expanded', 'false');
    });

    it('should have aria-expanded true on the calendar button when the popover is open', async () => {
      el.renderRoot.querySelector('sl-field-button')?.click();
      await new Promise(resolve => setTimeout(resolve));

      const button = el.renderRoot.querySelector('sl-field-button');

      expect(button).to.have.attribute('aria-expanded', 'true');
    });

    it('should have aria-haspopup dialog on the calendar button', () => {
      const button = el.renderRoot.querySelector('sl-field-button');

      expect(button).to.have.attribute('aria-haspopup', 'dialog');
    });

    it('should have aria-label on calendar button', () => {
      const button = el.renderRoot.querySelector('sl-field-button');

      expect(button).to.have.attribute('aria-label');
    });

    it('should have tabindex 0 on calendar button', () => {
      const button = el.renderRoot.querySelector('sl-field-button');

      expect(button).to.have.attribute('tabindex', '0');
    });

    it('should have tabindex -1 on calendar button when disabled', async () => {
      el.disabled = true;
      await el.updateComplete;

      const button = el.renderRoot.querySelector('sl-field-button');

      expect(button).to.have.attribute('tabindex', '-1');
    });

    it('should have tabindex -1 on calendar button when readonly', async () => {
      el.readonly = true;
      await el.updateComplete;

      const button = el.renderRoot.querySelector('sl-field-button');

      expect(button).to.have.attribute('tabindex', '-1');
    });

    it('should have role="spinbutton" on each date part', () => {
      const spans = el.renderRoot.querySelectorAll('span[role="spinbutton"]');

      expect(spans).to.have.length(3);
      spans.forEach(input => expect(input).to.have.attribute('role', 'spinbutton'));
    });

    it('should have aria-label on each spinbutton', () => {
      const spans = el.renderRoot.querySelectorAll('span[role="spinbutton"]');

      spans.forEach(input => expect(input).to.have.attribute('aria-label'));
    });

    it('should have aria-valuemin and aria-valuemax on each spinbutton', () => {
      const spans = el.renderRoot.querySelectorAll('span[role="spinbutton"]');

      spans.forEach(input => {
        expect(input).to.have.attribute('aria-valuemin');
        expect(input).to.have.attribute('aria-valuemax');
      });

      // en-US: month, day, year
      expect(spans[0]).to.have.attribute('aria-valuemin', '1');
      expect(spans[0]).to.have.attribute('aria-valuemax', '12');
      expect(spans[1]).to.have.attribute('aria-valuemin', '1');
      expect(spans[1]).to.have.attribute('aria-valuemax', '31');
      expect(spans[2]).to.have.attribute('aria-valuemin', '1');
      expect(spans[2]).to.have.attribute('aria-valuemax', '9999');
    });

    it('should have aria-valuenow when part has a value', async () => {
      el.value = new Date(2026, 2, 14);
      await el.updateComplete;

      const spans = el.renderRoot.querySelectorAll('span[role="spinbutton"]');

      // en-US: month=3, day=14, year=2026
      expect(spans[0]).to.have.attribute('aria-valuenow', '3');
      expect(spans[1]).to.have.attribute('aria-valuenow', '14');
      expect(spans[2]).to.have.attribute('aria-valuenow', '2026');
    });

    it('should have aria-valuetext on each spinbutton', async () => {
      el.value = new Date(2026, 2, 14);
      await el.updateComplete;

      const spans = el.renderRoot.querySelectorAll('span[role="spinbutton"]');

      expect(spans[0]).to.have.attribute('aria-valuetext', 'March');
      expect(spans[1]).to.have.attribute('aria-valuetext', '14');
      expect(spans[2]).to.have.attribute('aria-valuetext', '2026');
    });

    it('should use the padded number for aria-valuetext when month is out of range', async () => {
      el = await fixture(html`<sl-date-field></sl-date-field>`);
      const spans = el.renderRoot.querySelectorAll<HTMLElement>('span[role="spinbutton"]');

      // Type "0" in the month part to get month value 0 (out of range)
      spans[0].focus();
      await userEvent.keyboard('0');
      await el.updateComplete;

      expect(spans[0]).to.have.attribute('aria-valuetext', '00');
    });

    it('should have inputmode="numeric" on each spinbutton', () => {
      const spans = el.renderRoot.querySelectorAll('span[role="spinbutton"]');

      spans.forEach(input => expect(input).to.have.attribute('inputmode', 'numeric'));
    });

    it('should have tabindex 0 on the first spinbutton by default', () => {
      const spans = el.renderRoot.querySelectorAll('span[role="spinbutton"]');

      expect(spans[0]).to.have.attribute('tabindex', '0');
    });

    it('should have tabindex -1 on non-active spinbuttons', () => {
      const spans = el.renderRoot.querySelectorAll('span[role="spinbutton"]');

      expect(spans[1]).to.have.attribute('tabindex', '-1');
      expect(spans[2]).to.have.attribute('tabindex', '-1');
    });

    it('should move tabindex 0 to the focused spinbutton', async () => {
      const spans = el.renderRoot.querySelectorAll<HTMLElement>('span[role="spinbutton"]');

      spans[1].focus();
      await el.updateComplete;

      expect(spans[0]).to.have.attribute('tabindex', '-1');
      expect(spans[1]).to.have.attribute('tabindex', '0');
      expect(spans[2]).to.have.attribute('tabindex', '-1');
    });

    it('should update roving tabindex when navigating with arrow keys', async () => {
      const spans = el.renderRoot.querySelectorAll<HTMLElement>('span[role="spinbutton"]');

      spans[0].focus();
      await userEvent.keyboard('{ArrowRight}');
      await el.updateComplete;

      expect(spans[0]).to.have.attribute('tabindex', '-1');
      expect(spans[1]).to.have.attribute('tabindex', '0');
    });

    it('should clear the selection when focus leaves all date parts', async () => {
      el.value = new Date(2026, 2, 14);
      await el.updateComplete;

      const spans = el.renderRoot.querySelectorAll<HTMLElement>('span[role="spinbutton"]');

      spans[0].focus();
      await new Promise(resolve => setTimeout(resolve));

      const selection = el.renderRoot.ownerDocument.getSelection()!;
      expect(selection.rangeCount).to.be.greaterThan(0);

      spans[0].blur();

      expect(selection.rangeCount).to.equal(0);
    });
  });

  describe('keyboard entry', () => {
    let spans: NodeListOf<HTMLElement>;

    beforeEach(async () => {
      el = await fixture(html`<sl-date-field></sl-date-field>`);
      spans = el.renderRoot.querySelectorAll<HTMLElement>('span[role="spinbutton"]');
    });

    it('should show placeholder text on each part', () => {
      // en-US: MM, DD, YYYY
      expect(spans[0]).to.have.trimmed.text('MM');
      expect(spans[1]).to.have.trimmed.text('DD');
      expect(spans[2]).to.have.trimmed.text('YYYY');
    });

    it('should enter single digit in focused part', async () => {
      spans[0].focus();
      await userEvent.keyboard('5');

      expect(spans[0]).to.have.trimmed.text('05');
    });

    it('should select all text after entering a single digit', async () => {
      spans[0].focus();
      await userEvent.keyboard('5');

      await new Promise(resolve => requestAnimationFrame(resolve));

      const selection = document.getSelection();
      expect(selection?.toString()).to.equal('05');
    });

    it('should combine two digits in focused part', async () => {
      spans[0].focus();
      await userEvent.keyboard('1');
      await userEvent.keyboard('2');

      expect(spans[0]).to.have.trimmed.text('12');
    });

    it('should auto-advance to next input after max digits', async () => {
      spans[0].focus();
      await userEvent.keyboard('1');
      await userEvent.keyboard('2');

      expect((el.renderRoot as ShadowRoot).activeElement).to.equal(spans[1]);
    });

    it('should enter digits in day part', async () => {
      spans[1].focus();
      await userEvent.keyboard('1');
      await userEvent.keyboard('5');

      expect(spans[1]).to.have.trimmed.text('15');
    });

    it('should auto-advance from day to year', async () => {
      spans[1].focus();
      await userEvent.keyboard('1');
      await userEvent.keyboard('5');

      expect((el.renderRoot as ShadowRoot).activeElement).to.equal(spans[2]);
    });

    it('should enter four digits in year part', async () => {
      spans[2].focus();
      await userEvent.keyboard('2');
      await userEvent.keyboard('0');
      await userEvent.keyboard('2');
      await userEvent.keyboard('3');

      expect(spans[2]).to.have.trimmed.text('2023');
    });

    it('should set value after entering complete valid date', async () => {
      // Enter month
      spans[0].focus();
      await userEvent.keyboard('0');
      await userEvent.keyboard('6');
      // Auto-advance to day
      await userEvent.keyboard('1');
      await userEvent.keyboard('2');
      // Auto-advance to year
      await userEvent.keyboard('2');
      await userEvent.keyboard('0');
      await userEvent.keyboard('2');
      await userEvent.keyboard('3');

      expect(el.value).to.equalDate(new Date(2023, 5, 12));
    });

    it('should not set value for incomplete date', async () => {
      spans[0].focus();
      await userEvent.keyboard('1');
      await userEvent.keyboard('2');

      expect(el.value).to.be.undefined;
    });

    it('should not set value for invalid date (e.g. Feb 31)', async () => {
      // Enter month = 02
      spans[0].focus();
      await userEvent.keyboard('0');
      await userEvent.keyboard('2');
      // Enter day = 31
      await userEvent.keyboard('3');
      await userEvent.keyboard('1');
      // Enter year = 2023
      await userEvent.keyboard('2');
      await userEvent.keyboard('0');
      await userEvent.keyboard('2');
      await userEvent.keyboard('3');

      expect(el.value).to.be.undefined;
    });

    it('should move focus to next input on ArrowRight', async () => {
      spans[0].focus();
      await userEvent.keyboard('{ArrowRight}');

      expect((el.renderRoot as ShadowRoot).activeElement).to.equal(spans[1]);
    });

    it('should move focus to previous input on ArrowLeft', async () => {
      spans[1].focus();
      await userEvent.keyboard('{ArrowLeft}');

      expect((el.renderRoot as ShadowRoot).activeElement).to.equal(spans[0]);
    });

    it('should increment value on ArrowUp', async () => {
      el.value = new Date(2026, 2, 14);
      await el.updateComplete;

      spans[0].focus();
      await userEvent.keyboard('{ArrowUp}');

      expect(spans[0]).to.have.trimmed.text('04');
    });

    it('should decrement value on ArrowDown', async () => {
      el.value = new Date(2026, 2, 14);
      await el.updateComplete;

      spans[0].focus();
      await userEvent.keyboard('{ArrowDown}');

      expect(spans[0]).to.have.trimmed.text('02');
    });

    it('should update day on ArrowDown after entering date with arrow keys', async () => {
      // Enter 01/01/2023 using arrow keys
      spans[0].focus();
      await userEvent.keyboard('{ArrowUp}'); // month = 1
      await userEvent.keyboard('{ArrowRight}'); // focus day
      await userEvent.keyboard('{ArrowUp}'); // day = 1
      await userEvent.keyboard('{ArrowRight}'); // focus year
      await userEvent.keyboard('{ArrowUp}'); // year = 2023

      await el.updateComplete;

      // Navigate back to day
      await userEvent.keyboard('{ArrowLeft}');

      // Press ArrowDown on day
      await userEvent.keyboard('{ArrowDown}');

      expect(spans[1]).to.have.trimmed.text('31');
    });

    it('should update day on ArrowDown after typing complete date', async () => {
      // Type 01/01/2023
      spans[0].focus();
      await userEvent.keyboard('0');
      await userEvent.keyboard('1');
      await userEvent.keyboard('0');
      await userEvent.keyboard('1');
      await userEvent.keyboard('2');
      await userEvent.keyboard('0');
      await userEvent.keyboard('2');
      await userEvent.keyboard('3');

      await el.updateComplete;

      // Navigate back to day
      spans[1].focus();
      await new Promise(resolve => requestAnimationFrame(resolve));

      // Press ArrowDown on day
      await userEvent.keyboard('{ArrowDown}');

      expect(spans[1]).to.have.trimmed.text('31');
    });

    it('should preserve parts when arrow adjustment creates an invalid date', async () => {
      // Set March 31 (a month with 31 days)
      el.value = new Date(2023, 2, 31);
      await el.updateComplete;

      // Increment month to April (which only has 30 days, making April 31 invalid)
      spans[0].focus();
      await userEvent.keyboard('{ArrowUp}');

      await el.updateComplete;

      // Value should be undefined (April 31 is not valid)
      expect(el.value).to.be.undefined;

      // But parts should be preserved, not cleared to placeholders
      expect(spans[0]).to.have.trimmed.text('04');
      expect(spans[1]).to.have.trimmed.text('31');
      expect(spans[2]).to.have.trimmed.text('2023');
    });

    it('should wrap day from 31 to 1 on ArrowUp', async () => {
      el.value = new Date(2026, 0, 31);
      await el.updateComplete;

      spans[1].focus();
      await userEvent.keyboard('{ArrowUp}');

      expect(spans[1]).to.have.trimmed.text('01');
    });

    it('should wrap month from 12 to 1 on ArrowUp', async () => {
      el.value = new Date(2026, 11, 14);
      await el.updateComplete;

      spans[0].focus();
      await userEvent.keyboard('{ArrowUp}');

      expect(spans[0]).to.have.trimmed.text('01');
    });

    it('should clear part on Backspace', async () => {
      el.value = new Date(2026, 2, 14);
      await el.updateComplete;

      spans[0].focus();
      await userEvent.keyboard('{Backspace}');

      expect(spans[0]).to.have.trimmed.text('MM');
      expect(el.value).to.be.undefined;
    });

    it('should clear part on Delete', async () => {
      el.value = new Date(2026, 2, 14);
      await el.updateComplete;

      spans[0].focus();
      await userEvent.keyboard('{Delete}');

      expect(spans[0]).to.have.trimmed.text('MM');
      expect(el.value).to.be.undefined;
    });

    it('should move focus to next input on separator key', async () => {
      spans[0].focus();
      await userEvent.keyboard('/');

      expect((el.renderRoot as ShadowRoot).activeElement).to.equal(spans[1]);
    });

    it('should emit sl-change when complete valid date is entered', async () => {
      const onChange = spy();
      el.addEventListener('sl-change', onChange);

      spans[0].focus();
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

    it('should not do anything on ArrowUp/ArrowDown when selectOnly', async () => {
      el.selectOnly = true;
      await el.updateComplete;

      spans[0].focus();
      await userEvent.keyboard('{ArrowUp}');

      expect(spans[0]).to.have.trimmed.text('MM');
    });

    it('should not allow non-numeric characters to be entered', async () => {
      spans[0].focus();
      await userEvent.keyboard('a');

      expect(spans[0]).to.have.trimmed.text('MM');
    });

    it('should not allow symbol characters to be entered', async () => {
      spans[0].focus();
      await userEvent.keyboard('!');

      expect(spans[0]).to.have.trimmed.text('MM');
    });

    it('should not allow space to be entered', async () => {
      spans[0].focus();
      await userEvent.keyboard(' ');

      expect(spans[0]).to.have.trimmed.text('MM');
    });
  });

  describe('readonly', () => {
    let spans: NodeListOf<HTMLElement>;

    beforeEach(async () => {
      el = await fixture(html`<sl-date-field readonly .value=${new Date(2026, 2, 14)}></sl-date-field>`);
      spans = el.renderRoot.querySelectorAll<HTMLElement>('span[role="spinbutton"]');
    });

    it('should not allow digit entry', async () => {
      spans[0].focus();
      await userEvent.keyboard('5');

      expect(spans[0]).to.have.trimmed.text('03');
    });

    it('should not change value on ArrowUp', async () => {
      spans[0].focus();
      await userEvent.keyboard('{ArrowUp}');

      expect(spans[0]).to.have.trimmed.text('03');
    });

    it('should not change value on ArrowDown', async () => {
      spans[0].focus();
      await userEvent.keyboard('{ArrowDown}');

      expect(spans[0]).to.have.trimmed.text('03');
    });

    it('should not clear value on Backspace', async () => {
      spans[0].focus();
      await userEvent.keyboard('{Backspace}');

      expect(spans[0]).to.have.trimmed.text('03');
      expect(el.value).to.equalDate(new Date(2026, 2, 14));
    });

    it('should not clear value on Delete', async () => {
      spans[0].focus();
      await userEvent.keyboard('{Delete}');

      expect(spans[0]).to.have.trimmed.text('03');
      expect(el.value).to.equalDate(new Date(2026, 2, 14));
    });

    it('should navigate to next part on ArrowRight', async () => {
      spans[0].focus();
      await userEvent.keyboard('{ArrowRight}');

      expect((el.renderRoot as ShadowRoot).activeElement).to.equal(spans[1]);
    });

    it('should navigate to previous part on ArrowLeft', async () => {
      spans[1].focus();
      await userEvent.keyboard('{ArrowLeft}');

      expect((el.renderRoot as ShadowRoot).activeElement).to.equal(spans[0]);
    });
  });

  describe('select all', () => {
    let spans: NodeListOf<HTMLElement>;

    beforeEach(async () => {
      el = await fixture(html`<sl-date-field .value=${new Date(2026, 2, 15)}></sl-date-field>`);
      spans = el.renderRoot.querySelectorAll<HTMLElement>('span[role="spinbutton"]');
    });

    it('should switch to a single select-all input on Ctrl+A', async () => {
      spans[0].focus();
      await userEvent.keyboard('{Control>}a{/Control}');
      await el.updateComplete;

      const selectAll = el.renderRoot.querySelector('.select-all');

      expect(selectAll).to.exist;
      expect(selectAll).to.have.trimmed.text('03/15/2026');
      expect(el.renderRoot.querySelectorAll('span[role="spinbutton"]')).to.have.length(0);
    });

    it('should switch to a single select-all input on Meta+A', async () => {
      spans[0].focus();
      await userEvent.keyboard('{Meta>}a{/Meta}');
      await el.updateComplete;

      const selectAll = el.renderRoot.querySelector('.select-all');

      expect(selectAll).to.exist;
      expect(selectAll).to.have.trimmed.text('03/15/2026');
    });

    it('should have the text selected in select-all mode', async () => {
      spans[0].focus();
      await userEvent.keyboard('{Control>}a{/Control}');
      await el.updateComplete;

      const selection = el.renderRoot.ownerDocument.getSelection()!;
      expect(selection.rangeCount).to.equal(1);
      expect(selection.toString()).to.equal('03/15/2026');
    });

    it('should exit select-all mode and restore spinbuttons on keydown', async () => {
      spans[0].focus();
      await userEvent.keyboard('{Control>}a{/Control}');
      await new Promise(resolve => setTimeout(resolve));

      await userEvent.keyboard('{ArrowRight}');
      await new Promise(resolve => setTimeout(resolve));

      expect(el.renderRoot.querySelector('input')).to.not.exist;
      expect(el.renderRoot.querySelectorAll('span[role="spinbutton"]')).to.have.length(3);
    });

    it('should focus the first spinbutton when exiting select-all via keydown', async () => {
      spans[0].focus();
      await userEvent.keyboard('{Control>}a{/Control}');
      await el.updateComplete;

      await userEvent.keyboard('{ArrowRight}');
      await el.updateComplete;

      const newSpans = el.renderRoot.querySelectorAll<HTMLElement>('span[role="spinbutton"]');

      expect((el.renderRoot as ShadowRoot).activeElement).to.equal(newSpans[0]);
    });

    it('should not exit select-all mode on modifier key alone', async () => {
      spans[0].focus();
      await userEvent.keyboard('{Control>}a{/Control}');
      await el.updateComplete;

      const selectAll = el.renderRoot.querySelector('.select-all')!;
      selectAll.dispatchEvent(new KeyboardEvent('keydown', { key: 'Control', ctrlKey: true, bubbles: true }));
      await el.updateComplete;

      expect(el.renderRoot.querySelector('.select-all')).to.exist;
    });

    it('should allow Ctrl+C without exiting select-all mode', async () => {
      spans[0].focus();
      await userEvent.keyboard('{Control>}a{/Control}');
      await el.updateComplete;

      const selectAll = el.renderRoot.querySelector('.select-all')!;
      selectAll.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'c', ctrlKey: true, bubbles: true, cancelable: true })
      );
      await el.updateComplete;

      expect(el.renderRoot.querySelector('.select-all')).to.exist;
    });

    it('should exit select-all mode on mousedown', async () => {
      spans[0].focus();
      await userEvent.keyboard('{Control>}a{/Control}');
      await el.updateComplete;

      const selectAll = el.renderRoot.querySelector('.select-all')!;
      selectAll.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
      await el.updateComplete;

      expect(el.renderRoot.querySelector('.select-all')).to.not.exist;
      expect(el.renderRoot.querySelectorAll('span[role="spinbutton"]')).to.have.length(3);
    });

    it('should exit select-all mode on blur', async () => {
      spans[0].focus();
      await userEvent.keyboard('{Control>}a{/Control}');
      await el.updateComplete;

      const selectAll = el.renderRoot.querySelector('.select-all')!;
      selectAll.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
      await el.updateComplete;

      expect(el.renderRoot.querySelector('.select-all')).to.not.exist;
    });

    it('should show placeholder text for empty parts in select-all mode', async () => {
      el = await fixture(html`<sl-date-field></sl-date-field>`);
      const emptyInputs = el.renderRoot.querySelectorAll<HTMLElement>('span[role="spinbutton"]');

      emptyInputs[0].focus();
      await userEvent.keyboard('3');

      await userEvent.keyboard('{Control>}a{/Control}');
      await el.updateComplete;

      const selectAll = el.renderRoot.querySelector('.select-all')!;
      expect(selectAll).to.have.trimmed.text('03/DD/YYYY');
    });

    it('should exit select-all mode on Tab', async () => {
      spans[0].focus();
      await userEvent.keyboard('{Control>}a{/Control}');
      await el.updateComplete;

      expect(el.renderRoot.querySelector('.select-all')).to.exist;

      await userEvent.keyboard('{Tab}');
      await el.updateComplete;

      expect(el.renderRoot.querySelector('.select-all')).to.not.exist;
    });

    it('should focus the field-button when pressing Tab in select-all mode', async () => {
      spans[0].focus();
      await userEvent.keyboard('{Control>}a{/Control}');
      await el.updateComplete;

      await userEvent.keyboard('{Tab}');
      await el.updateComplete;

      expect((el.renderRoot as ShadowRoot).activeElement).to.equal(el.renderRoot.querySelector('sl-field-button'));
    });

    it('should exit select-all mode on Shift-Tab', async () => {
      spans[0].focus();
      await userEvent.keyboard('{Control>}a{/Control}');
      await el.updateComplete;

      expect(el.renderRoot.querySelector('.select-all')).to.exist;

      await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
      await el.updateComplete;

      expect(el.renderRoot.querySelector('.select-all')).to.not.exist;
    });
  });

  describe('paste', () => {
    let spans: NodeListOf<HTMLElement>;

    beforeEach(async () => {
      el = await fixture(html`<sl-date-field></sl-date-field>`);
      spans = el.renderRoot.querySelectorAll<HTMLElement>('span[role="spinbutton"]');
    });

    const paste = (target: HTMLElement, text: string): void => {
      const dataTransfer = new DataTransfer();
      dataTransfer.setData('text/plain', text);

      target.dispatchEvent(
        new ClipboardEvent('paste', { clipboardData: dataTransfer, bubbles: true, cancelable: true })
      );
    };

    it('should set the value when pasting a locale-formatted date', async () => {
      spans[0].focus();
      paste(spans[0], '03/14/2026');
      await el.updateComplete;

      expect(el.value).to.deep.equal(new Date(2026, 2, 14));
    });

    it('should set the value when pasting an ISO-formatted date', async () => {
      spans[0].focus();
      paste(spans[0], '2026-03-14');
      await el.updateComplete;

      expect(el.value).to.deep.equal(new Date(2026, 2, 14));
    });

    it('should update the displayed parts after pasting', async () => {
      spans[0].focus();
      paste(spans[0], '03/14/2026');
      await el.updateComplete;

      spans = el.renderRoot.querySelectorAll<HTMLElement>('span[role="spinbutton"]');
      expect(spans[0]).to.have.trimmed.text('03');
      expect(spans[1]).to.have.trimmed.text('14');
      expect(spans[2]).to.have.trimmed.text('2026');
    });

    it('should emit a change event when pasting a valid date', async () => {
      const onChange = spy();
      el.addEventListener('sl-change', onChange);

      spans[0].focus();
      paste(spans[0], '03/14/2026');
      await el.updateComplete;

      expect(onChange).to.have.been.calledOnce;
    });

    it('should not change the value when pasting an invalid string', async () => {
      spans[0].focus();
      paste(spans[0], 'not-a-date');
      await el.updateComplete;

      expect(el.value).to.be.undefined;
    });

    it('should not change the value when pasting an invalid date like Feb 30', async () => {
      spans[0].focus();
      paste(spans[0], '02/30/2026');
      await el.updateComplete;

      expect(el.value).to.be.undefined;
    });

    it('should not change the value when readonly', async () => {
      el.readonly = true;
      await el.updateComplete;
      spans = el.renderRoot.querySelectorAll<HTMLElement>('span[role="spinbutton"]');

      spans[0].focus();
      paste(spans[0], '03/14/2026');
      await el.updateComplete;

      expect(el.value).to.be.undefined;
    });

    it('should not change the value when selectOnly', async () => {
      el.selectOnly = true;
      el.value = new Date(2025, 0, 1);
      await el.updateComplete;
      spans = el.renderRoot.querySelectorAll<HTMLElement>('span[role="spinbutton"]');

      spans[0].focus();
      paste(spans[0], '03/14/2026');
      await el.updateComplete;

      expect(el.value).to.deep.equal(new Date(2025, 0, 1));
    });
  });

  describe('require confirmation', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-date-field require-confirmation></sl-date-field>`);
    });

    it('should require confirmation', () => {
      expect(el.requireConfirmation).to.be.true;
    });

    it('should render a confirmation button in the popover', async () => {
      el.renderRoot.querySelector('sl-field-button')?.click();
      await new Promise(resolve => setTimeout(resolve));

      const button = el.renderRoot.querySelector('sl-button');
      expect(button).to.exist;
      expect(button).to.have.trimmed.text('Confirm');
    });

    it('should not close the popover when a date is selected', async () => {
      el.renderRoot.querySelector('sl-field-button')?.click();
      await new Promise(resolve => setTimeout(resolve));

      const calendar = el.renderRoot.querySelector('sl-calendar')!;
      calendar.dispatchEvent(
        new CustomEvent('sl-change', {
          detail: new Date(2023, 5, 15),
          bubbles: true,
          composed: true
        })
      );
      await el.updateComplete;

      expect(el.renderRoot.querySelector('dialog')).to.match(':popover-open');
    });

    it('should close the popover when the confirm button is clicked', async () => {
      el.renderRoot.querySelector('sl-field-button')?.click();
      await new Promise(resolve => setTimeout(resolve));

      const calendar = el.renderRoot.querySelector('sl-calendar')!;
      calendar.dispatchEvent(
        new CustomEvent('sl-change', {
          detail: new Date(2023, 5, 15),
          bubbles: true,
          composed: true
        })
      );
      await el.updateComplete;

      el.renderRoot.querySelector('sl-button')?.click();
      await el.updateComplete;

      expect(el.renderRoot.querySelector('dialog')).not.to.match(':popover-open');
    });
  });

  describe('validation', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-date-field></sl-date-field>`);
    });

    it('should be invalid when value is before min date', async () => {
      el.min = new Date(2026, 5, 1);
      el.value = new Date(2026, 4, 31);
      await el.updateComplete;

      expect(el.valid).to.be.false;
      expect(el.validationMessage).to.equal('Please select a date that is no earlier than 06/01/2026.');
    });

    it('should be valid when value is equal to min date', async () => {
      el.min = new Date(2026, 5, 1);
      el.value = new Date(2026, 5, 1);
      await el.updateComplete;

      expect(el.valid).to.be.true;
    });

    it('should be valid when value is after min date', async () => {
      el.min = new Date(2026, 5, 1);
      el.value = new Date(2026, 5, 15);
      await el.updateComplete;

      expect(el.valid).to.be.true;
    });

    it('should be invalid when value is after max date', async () => {
      el.max = new Date(2026, 5, 30);
      el.value = new Date(2026, 6, 1);
      await el.updateComplete;

      expect(el.valid).to.be.false;
      expect(el.validationMessage).to.equal('Please select a date that is no later than 06/30/2026.');
    });

    it('should be valid when value is equal to max date', async () => {
      el.max = new Date(2026, 5, 30);
      el.value = new Date(2026, 5, 30);
      await el.updateComplete;

      expect(el.valid).to.be.true;
    });

    it('should be valid when value is before max date', async () => {
      el.max = new Date(2026, 5, 30);
      el.value = new Date(2026, 5, 15);
      await el.updateComplete;

      expect(el.valid).to.be.true;
    });

    it('should be valid when value is between min and max dates', async () => {
      el.min = new Date(2026, 5, 1);
      el.max = new Date(2026, 5, 30);
      el.value = new Date(2026, 5, 15);
      await el.updateComplete;

      expect(el.valid).to.be.true;
    });

    it('should update validation state when min changes', async () => {
      el.value = new Date(2026, 5, 15);
      await el.updateComplete;

      expect(el.valid).to.be.true;

      el.min = new Date(2026, 5, 20);
      await el.updateComplete;

      expect(el.valid).to.be.false;
    });

    it('should update validation state when max changes', async () => {
      el.value = new Date(2026, 5, 15);
      await el.updateComplete;

      expect(el.valid).to.be.true;

      el.max = new Date(2026, 5, 10);
      await el.updateComplete;

      expect(el.valid).to.be.false;
    });
  });

  describe('custom calendar', () => {
    let calendar: Calendar;

    beforeEach(async () => {
      el = await fixture(html`
        <sl-date-field>
          <sl-calendar slot="calendar" show-today></sl-calendar>
        </sl-date-field>
      `);
      calendar = el.querySelector('sl-calendar[slot="calendar"]')!;
    });

    it('should work with a slotted calendar for date selection', async () => {
      el.renderRoot.querySelector('sl-field-button')?.click();
      await new Promise(resolve => setTimeout(resolve));

      const testDate = new Date(2026, 5, 15);
      calendar.dispatchEvent(
        new CustomEvent('sl-change', {
          detail: testDate,
          bubbles: true,
          composed: true
        })
      );
      await el.updateComplete;

      expect(el.value).to.equalDate(testDate);
    });

    it('should emit sl-change event when slotted calendar date is selected', async () => {
      const onChange = spy();
      el.addEventListener('sl-change', onChange);

      el.renderRoot.querySelector('sl-field-button')?.click();
      await new Promise(resolve => setTimeout(resolve));

      const testDate = new Date(2026, 5, 15);
      calendar.dispatchEvent(
        new CustomEvent('sl-change', {
          detail: testDate,
          bubbles: true,
          composed: true
        })
      );
      await el.updateComplete;

      expect(onChange).to.have.been.calledOnce;
    });

    describe('with requireConfirmation', () => {
      beforeEach(async () => {
        el.requireConfirmation = true;
        await el.updateComplete;
      });

      it('should not update value immediately when calendar date is selected', async () => {
        el.renderRoot.querySelector('sl-field-button')?.click();
        await new Promise(resolve => setTimeout(resolve));

        calendar.renderRoot
          .querySelector('sl-select-day')
          ?.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])')
          ?.renderRoot.querySelector<HTMLElement>('button[part~="today"]')
          ?.click();

        expect(el.value).to.be.undefined;

        el.renderRoot.querySelector('sl-button')?.click();
        await el.updateComplete;

        expect(el.value).to.equalDate(new Date(2026, 2, 14));
      });

      it('should not emit sl-change immediately when calendar date is selected', async () => {
        const onChange = spy();
        el.addEventListener('sl-change', onChange);

        el.renderRoot.querySelector('sl-field-button')?.click();
        await new Promise(resolve => setTimeout(resolve));

        calendar.renderRoot
          .querySelector('sl-select-day')
          ?.renderRoot.querySelector<MonthView>('sl-month-view:not([inert])')
          ?.renderRoot.querySelector<HTMLElement>('button[part~="today"]')
          ?.click();

        expect(onChange).not.to.have.been.called;

        el.renderRoot.querySelector('sl-button')?.click();
        await el.updateComplete;

        expect(onChange).to.have.been.calledOnce;
      });
    });
  });
});
