import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
import { TimeField } from './time-field.js';

describe('sl-time-field', () => {
  let el: TimeField;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-time-field></sl-time-field>`);
    });

    it('should not be disabled', () => {
      expect(el.disabled).not.to.be.true;
    });

    it('should not be readonly', () => {
      expect(el.readonly).not.to.be.true;
    });

    it('should not be required', () => {
      expect(el.required).not.to.be.true;
    });

    it('should not have a placeholder', () => {
      expect(el.placeholder).to.be.undefined;
    });

    it('should have no value', () => {
      expect(el.value).to.be.undefined;
    });

    it('should have an hour step of 1', () => {
      expect(TimeField.hourStep).to.equal(1);
      expect(el.hourStep).to.equal(1);
    });

    it('should have a minute step of 5', () => {
      expect(TimeField.minuteStep).to.equal(5);
      expect(el.minuteStep).to.equal(5);
    });

    it('should use the static step values for new elements', () => {
      TimeField.hourStep = 2;
      TimeField.minuteStep = 10;

      const newEl = document.createElement('sl-time-field');
      expect(newEl.hourStep).to.equal(2);
      expect(newEl.minuteStep).to.equal(10);

      // Reset values
      TimeField.hourStep = 1;
      TimeField.minuteStep = 5;
    });

    it('should support entering a time via the keyboard', async () => {
      const hourSpinbutton = el.renderRoot.querySelector<HTMLElement>('span[role="spinbutton"]')!;
      hourSpinbutton.focus();
      await userEvent.keyboard('12');
      await userEvent.keyboard('34');

      expect(el.value).to.equal('12:34');
    });

    it('should emit a change event when the time is changed via the keyboard', async () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      const hourSpinbutton = el.renderRoot.querySelector<HTMLElement>('span[role="spinbutton"]')!;
      hourSpinbutton.focus();
      await userEvent.keyboard('12');
      await userEvent.keyboard('34');
      await el.updateComplete;

      expect(onChange).to.have.been.called;
    });

    it('should emit a change event when the time is changed via the arrow keys', async () => {
      const onChange = spy();

      el.value = '12:00';
      await el.updateComplete;

      el.addEventListener('sl-change', onChange);
      el.renderRoot.querySelector<HTMLElement>('span[role="spinbutton"]')?.focus();
      await userEvent.keyboard('{ArrowUp}');

      expect(onChange).to.have.been.calledOnce;
    });

    it('should emit a change event when the time is changed via the listbox', () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      el.renderRoot.querySelector('sl-field-button')?.click();
      el.renderRoot.querySelector<HTMLElement>('dialog li')?.click();

      expect(onChange).to.have.been.calledOnce;
    });
  });

  describe('field button', () => {
    let button: HTMLElement;

    beforeEach(async () => {
      el = await fixture(html`<sl-time-field></sl-time-field>`);
      button = el.renderRoot.querySelector('sl-field-button')!;
    });

    it('should exist', () => {
      expect(button).to.exist;
    });

    it('should have a clock icon', () => {
      expect(button).to.contain('sl-icon[name="clock"]');
    });

    it('should not be disabled', () => {
      expect(button).not.to.have.attribute('disabled');
    });

    it('should be disabled when the time-field is disabled', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(button).to.have.attribute('disabled');
    });

    it('should be disabled when the time-field is readonly', async () => {
      el.readonly = true;
      await el.updateComplete;

      expect(button).to.have.attribute('disabled');
    });

    it('should show the popover when clicked', () => {
      button.click();

      const dialog = el.renderRoot.querySelector<HTMLElement>('dialog')!;

      expect(dialog).to.exist;
      expect(dialog).to.match(':popover-open');
    });

    it('should show the popover when focused and Enter is pressed', async () => {
      button.focus();
      await userEvent.keyboard('{Enter}');

      const dialog = el.renderRoot.querySelector<HTMLElement>('dialog')!;

      expect(dialog).to.exist;
      expect(dialog).to.match(':popover-open');
    });

    it('should show the popover when focused and Space is pressed', async () => {
      button.focus();
      await userEvent.keyboard('{Space}');

      const dialog = el.renderRoot.querySelector<HTMLElement>('dialog')!;

      expect(dialog).to.exist;
      expect(dialog).to.match(':popover-open');
    });

    it('should toggle the popover when clicking the clock button', () => {
      const dialog = el.renderRoot.querySelector<HTMLElement>('dialog')!;

      expect(dialog).to.exist;
      expect(dialog?.matches(':popover-open')).to.be.false;

      button?.click();
      expect(dialog?.matches(':popover-open')).to.be.true;

      button?.click();
      expect(dialog?.matches(':popover-open')).to.be.false;
    });

    it('should have an accessible name', () => {
      expect(button).to.have.attribute('aria-label');
    });

    it('should have aria-controls pointing to the dialog', () => {
      expect(button).to.have.attribute('aria-controls', 'dialog');
    });

    it('should have aria-expanded set to false initially', () => {
      expect(button).to.have.attribute('aria-expanded', 'false');
    });

    it('should update aria-expanded to true when popover is opened', async () => {
      button.click();
      await el.updateComplete;

      expect(button).to.have.attribute('aria-expanded', 'true');
    });

    it('should update aria-expanded to false when popover is closed', async () => {
      button.click();
      await el.updateComplete;

      button.click();
      await el.updateComplete;

      expect(button).to.have.attribute('aria-expanded', 'false');
    });

    it('should have aria-haspopup set to listbox', () => {
      expect(button).to.have.attribute('aria-haspopup', 'listbox');
    });
  });

  describe('dialog', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-time-field start="12:00"></sl-time-field>`);
    });

    it('should contain columns for hours', () => {
      const hours = Array.from(el.renderRoot.querySelectorAll('.hours li')).map(e => e.textContent?.trim());

      expect(hours).to.deep.equal([
        '00',
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23'
      ]);
    });

    it('should contain columns for minutes', () => {
      const minutes = Array.from(el.renderRoot.querySelectorAll('.minutes li')).map(e => e.textContent?.trim());

      expect(minutes).to.deep.equal(['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']);
    });

    it('should contain options for each time based on the step', async () => {
      el.hourStep = 2;
      el.minuteStep = 10;
      await el.updateComplete;

      const hours = Array.from(el.renderRoot.querySelectorAll('.hours li')).map(e => e.textContent?.trim());
      const minutes = Array.from(el.renderRoot.querySelectorAll('.minutes li')).map(e => e.textContent?.trim());

      expect(hours).to.deep.equal(['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22']);
      expect(minutes).to.deep.equal(['00', '10', '20', '30', '40', '50']);
    });

    it('should update the value when an option is selected', async () => {
      el.renderRoot.querySelector('sl-field-button')?.click();
      el.renderRoot.querySelector<HTMLElement>('.hours li:nth-of-type(5)')?.click();
      el.renderRoot.querySelector<HTMLElement>('.minutes li:nth-of-type(3)')?.click();
      await el.updateComplete;

      expect(el.value).to.equal('04:10');
    });

    it('should focus the start hour when opened', async () => {
      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el.shadowRoot?.activeElement).to.match('li');
      expect(el.shadowRoot?.activeElement?.parentElement).to.match('ul.hours');
    });

    it('should switch focus between start hour and minute when pressing horizontal arrows', async () => {
      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      await userEvent.keyboard('{ArrowRight}');

      expect(el.shadowRoot?.activeElement).to.match('li');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('00');
      expect(el.shadowRoot?.activeElement?.parentElement).to.match('ul.minutes');

      await userEvent.keyboard('{ArrowLeft}');

      expect(el.shadowRoot?.activeElement).to.match('li');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('12');
      expect(el.shadowRoot?.activeElement?.parentElement).to.match('ul.hours');
    });

    it('should select the hour when pressing enter on an hour option', async () => {
      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{Enter}');

      expect(el.value).to.equal('13:00');
    });

    it('should select the hour when pressing space on an hour option', async () => {
      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      await userEvent.keyboard('{ArrowUp}');
      await userEvent.keyboard(' ');

      expect(el.value).to.equal('11:00');
    });

    it('should select the minute when pressing enter on a minute option', async () => {
      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      await userEvent.keyboard('{ArrowRight}');
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{Enter}');

      expect(el.value).to.equal('12:05');
    });

    it('should select the minute when pressing space on a minute option', async () => {
      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      await userEvent.keyboard('{ArrowRight}');
      await userEvent.keyboard('{ArrowUp}');
      await userEvent.keyboard(' ');

      expect(el.value).to.equal('12:55');
    });

    it('should update the dialog selection when the timeField value is changed', async () => {
      el.value = '10:30';
      await el.updateComplete;

      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;

      const selectedHour = el.renderRoot.querySelector<HTMLElement>('.hours li[aria-selected="true"]'),
        selectedMinute = el.renderRoot.querySelector<HTMLElement>('.minutes li[aria-selected="true"]');

      expect(selectedHour).to.exist;
      expect(selectedHour).to.have.trimmed.text('10');
      expect(selectedMinute).to.exist;
      expect(selectedMinute).to.have.trimmed.text('30');
    });
  });

  describe('focusout', () => {
    let dialog: HTMLDialogElement, outsideButton: HTMLButtonElement;

    beforeEach(async () => {
      el = await fixture(html`
        <sl-time-field start="12:00"></sl-time-field>
        <button>Outside</button>
      `);

      dialog = el.renderRoot.querySelector('dialog')!;
      outsideButton = el.nextElementSibling as HTMLButtonElement;
    });

    it('should close the popover when focus moves outside the component', async () => {
      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;

      expect(dialog).to.match(':popover-open');

      outsideButton.focus();
      await el.updateComplete;

      expect(dialog).not.to.match(':popover-open');
    });

    it('should not close the popover when focus moves within the component', async () => {
      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;

      expect(dialog).to.match(':popover-open');

      el.dispatchEvent(
        new FocusEvent('focusout', {
          bubbles: true,
          composed: true,
          relatedTarget: el.renderRoot.querySelector('[role="spinbutton"]')!
        })
      );
      await el.updateComplete;

      expect(dialog).to.match(':popover-open');
    });

    it('should close the popover when focus leaves the page entirely', async () => {
      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;

      expect(dialog).to.match(':popover-open');

      el.dispatchEvent(new FocusEvent('focusout', { bubbles: true, composed: true, relatedTarget: null }));
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(dialog).not.to.match(':popover-open');
    });

    it('should not restore focus to the text-field when focus is leaving the component', async () => {
      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;

      outsideButton.focus();
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(document.activeElement).to.equal(outsideButton);
    });

    it('should restore focus to the text-field when the popover is closed by selecting a minute', async () => {
      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;

      expect(dialog).to.match(':popover-open');

      el.renderRoot.querySelector<HTMLElement>('.minutes li')?.click();
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(dialog).not.to.match(':popover-open');
      expect(el).to.match(':focus-within');
    });

    it('should restore focus to the text-field when the popover is closed by pressing Escape', async () => {
      const input = el.renderRoot.querySelector('[role="spinbutton"]');

      expect(input).to.exist;
      (input as HTMLInputElement).focus();

      await userEvent.tab();
      await userEvent.keyboard('{Space}');
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(dialog).to.match(':popover-open');

      await userEvent.keyboard('{Escape}');
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(dialog).not.to.match(':popover-open');
      expect(el).to.match(':focus-within');
    });

    it('should close the popover and move focus outside the component when pressing Tab', async () => {
      const input = el.renderRoot.querySelector('[role="spinbutton"]');

      expect(input).to.exist;
      (input as HTMLInputElement).focus();
      await userEvent.tab();
      await userEvent.keyboard('{Space}');
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(dialog).to.match(':popover-open');

      await userEvent.tab();
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(dialog).not.to.match(':popover-open');
      expect(document.activeElement).to.equal(outsideButton);
    });

    it('should close the popover and move focus to the button when pressing Shift+Tab', async () => {
      const input = el.renderRoot.querySelector('[role="spinbutton"]');

      expect(input).to.exist;
      (input as HTMLInputElement).focus();
      await userEvent.tab();
      await userEvent.keyboard('{Space}');
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(dialog).to.match(':popover-open');

      await userEvent.tab({ shift: true });
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(dialog).not.to.match(':popover-open');
      expect(el.shadowRoot?.activeElement).to.equal(el.button);
    });
  });

  describe('min/max', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-time-field min="08:00" max="14:00"></sl-time-field>`);
    });

    it('should only show the hours and minutes within the range', () => {
      el.renderRoot.querySelector('sl-field-button')?.click();

      const hours = Array.from(el.renderRoot.querySelectorAll('.hours li')).map(e => e.textContent?.trim());
      const minutes = Array.from(el.renderRoot.querySelectorAll('.minutes li')).map(e => e.textContent?.trim());

      expect(hours).to.deep.equal(['08', '09', '10', '11', '12', '13', '14']);
      expect(minutes).to.deep.equal(['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']);
    });

    it('should not go below the minimum time when using the arrow keys', async () => {
      el.value = '08:00';
      await el.updateComplete;

      const input = el.renderRoot.querySelector('[role="spinbutton"]');

      expect(input).to.exist;
      (input as HTMLInputElement).focus();

      await userEvent.keyboard('{ArrowDown}');
      await el.updateComplete;

      expect(el.value).to.equal('08:00');
    });

    it('should not go above the maximum time when using the arrow keys', async () => {
      el.value = '14:00';
      await el.updateComplete;

      const input = el.renderRoot.querySelector('[role="spinbutton"]');

      expect(input).to.exist;
      (input as HTMLInputElement).focus();

      await userEvent.keyboard('{ArrowUp}');
      await el.updateComplete;

      expect(el.value).to.equal('14:00');
    });

    it('should not go below the minimum time when using the arrow keys in the select dropdown', async () => {
      el.value = '08:30';
      el.min = '08:30';
      await el.updateComplete;

      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;

      const selectedMinute = el.renderRoot.querySelector<HTMLElement>('.minutes li[aria-selected="true"]');
      expect(selectedMinute).to.exist;

      selectedMinute?.focus();
      await userEvent.keyboard('{ArrowUp}');
      await el.updateComplete;

      const selectedHourAfter = el.renderRoot.querySelector<HTMLElement>('.hours li[aria-selected="true"]'),
        selectedMinuteAfter = el.renderRoot.querySelector<HTMLElement>('.minutes li[aria-selected="true"]');

      expect(selectedHourAfter).to.exist;
      expect(selectedHourAfter).to.have.trimmed.text('08');
      expect(selectedMinuteAfter).to.exist;
      expect(selectedMinuteAfter).to.have.trimmed.text('30');
      expect(el.value).to.equal('08:30');
    });

    it('should not go above the maximum time when using arrow keys in the select dropdown', async () => {
      el.value = '14:00';
      el.max = '14:00';
      await el.updateComplete;

      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;

      const selectedMinute = el.renderRoot.querySelector<HTMLElement>('.minutes li[aria-selected="true"]');

      expect(selectedMinute).to.exist;

      selectedMinute?.focus();
      await userEvent.keyboard('{ArrowDown}');
      await el.updateComplete;

      const selectedHourAfter = el.renderRoot.querySelector<HTMLElement>('.hours li[aria-selected="true"]'),
        selectedMinuteAfter = el.renderRoot.querySelector<HTMLElement>('.minutes li[aria-selected="true"]');

      expect(selectedHourAfter).to.exist;
      expect(selectedHourAfter).to.have.trimmed.text('14');
      expect(selectedMinuteAfter).to.exist;
      expect(selectedMinuteAfter).to.have.trimmed.text('00');
      expect(el.value).to.equal('14:00');
    });
    it('should be invalid when the value is before the minimum time', async () => {
      el.value = '07:00';
      await el.updateComplete;

      expect(el.valid).to.be.false;
      expect(el.validationMessage).to.equal('Please select a time that is no earlier than 08:00.');
    });

    it('should be invalid when the value is after the maximum time', async () => {
      el.value = '19:00';
      await el.updateComplete;

      expect(el.valid).to.be.false;
      expect(el.validationMessage).to.equal('Please select a time that is no later than 14:00.');
    });

    it('should be valid when the value is within the range', async () => {
      el.value = '10:00';
      await el.updateComplete;

      expect(el.valid).to.be.true;
    });
  });

  describe('disabling minutes based on min/max', () => {
    it('should disable minutes when selected hour equals min hour', async () => {
      el = await fixture(html`<sl-time-field min="08:40" value="08:00"></sl-time-field>`);
      await el.updateComplete;

      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;

      el.requestUpdate();
      await el.updateComplete;

      const minutes00 = Array.from(el.renderRoot.querySelectorAll('.minutes li')).find(
          li => li.textContent?.trim() === '00'
        ),
        minutes35 = Array.from(el.renderRoot.querySelectorAll('.minutes li')).find(
          li => li.textContent?.trim() === '35'
        ),
        minutes40 = Array.from(el.renderRoot.querySelectorAll('.minutes li')).find(
          li => li.textContent?.trim() === '40'
        ),
        minutes45 = Array.from(el.renderRoot.querySelectorAll('.minutes li')).find(
          li => li.textContent?.trim() === '45'
        );

      expect(minutes00).to.have.attribute('disabled');
      expect(minutes35).to.have.attribute('disabled');
      expect(minutes40).not.to.have.attribute('disabled');
      expect(minutes45).not.to.have.attribute('disabled');
    });

    it('should disable minutes when selected hour equals max hour', async () => {
      el = await fixture(html`<sl-time-field max="14:20" value="14:00"></sl-time-field>`);
      await el.updateComplete;

      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;

      const minutes15 = Array.from(el.renderRoot.querySelectorAll('.minutes li')).find(
          li => li.textContent?.trim() === '15'
        ),
        minutes20 = Array.from(el.renderRoot.querySelectorAll('.minutes li')).find(
          li => li.textContent?.trim() === '20'
        ),
        minutes25 = Array.from(el.renderRoot.querySelectorAll('.minutes li')).find(
          li => li.textContent?.trim() === '25'
        ),
        minutes55 = Array.from(el.renderRoot.querySelectorAll('.minutes li')).find(
          li => li.textContent?.trim() === '55'
        );

      expect(minutes15).not.to.have.attribute('disabled');
      expect(minutes20).not.to.have.attribute('disabled');
      expect(minutes25).to.have.attribute('disabled');
      expect(minutes55).to.have.attribute('disabled');
    });

    it('should not disable minutes when selected hour is between min and max hours', async () => {
      el = await fixture(html`<sl-time-field min="08:40" max="14:20" value="10:00"></sl-time-field>`);
      await el.updateComplete;

      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;

      const disabledMinutes = Array.from(el.renderRoot.querySelectorAll('.minutes li[disabled]'));
      expect(disabledMinutes).to.have.length(0);
    });

    it('should not change value when clicking on a disabled minute', async () => {
      el = await fixture(html`<sl-time-field min="08:40" value="08:50"></sl-time-field>`);
      await el.updateComplete;

      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;

      const minutes30 = Array.from(el.renderRoot.querySelectorAll('.minutes li')).find(
        li => li.textContent?.trim() === '30'
      );

      expect(minutes30).to.have.attribute('disabled');

      const originalValue = el.value;
      (minutes30 as HTMLElement)?.click();
      await el.updateComplete;

      expect(el.value).to.equal(originalValue);
    });

    it('should focus first enabled minute when navigating to minutes column', async () => {
      el = await fixture(html`<sl-time-field min="08:40" value="08:00" minute-step="5"></sl-time-field>`);
      await el.updateComplete;

      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;

      const hour08 = Array.from(el.renderRoot.querySelectorAll('.hours li')).find(
        li => li.textContent?.trim() === '08'
      ) as HTMLElement;
      hour08.focus();

      await userEvent.keyboard('{ArrowRight}');

      const focusedElement = el.shadowRoot?.activeElement;

      expect(focusedElement).to.exist;
      expect(focusedElement).to.have.trimmed.text('40');
    });

    it('should go to first enabled minutes when pressing ArrowDown from last enabled minutes', async () => {
      el = await fixture(html`<sl-time-field max="14:20" value="14:00" minute-step="5"></sl-time-field>`);
      await el.updateComplete;

      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;

      const minute20 = Array.from(el.renderRoot.querySelectorAll('.minutes li')).find(
        li => li.textContent?.trim() === '20'
      ) as HTMLElement;
      minute20.focus();

      await userEvent.keyboard('{ArrowDown}');

      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('00');
    });

    it('should take into account minutes constraints when using arrow keys on input with min', async () => {
      el = await fixture(html`<sl-time-field min="08:40" value="08:40"></sl-time-field>`);
      await el.updateComplete;

      const spinbuttons = el.renderRoot.querySelectorAll<HTMLElement>('span[role="spinbutton"]');
      spinbuttons[1].focus(); // Focus on minutes
      await userEvent.keyboard('{ArrowDown}');
      await el.updateComplete;

      expect(el.value).to.equal('08:40');
    });

    it('should take into account minutes constraints when using arrow keys on input with max', async () => {
      el = await fixture(html`<sl-time-field max="14:20" value="14:20"></sl-time-field>`);
      await el.updateComplete;

      const spinbuttons = el.renderRoot.querySelectorAll<HTMLElement>('span[role="spinbutton"]');
      spinbuttons[1].focus(); // Focus on minutes
      await userEvent.keyboard('{ArrowUp}');
      await el.updateComplete;

      expect(el.value).to.equal('14:20');
    });

    it('should adjust minutes when arrowing hours down to min hour with minute constraints', async () => {
      el = await fixture(html`<sl-time-field min="08:40" value="09:30"></sl-time-field>`);
      await el.updateComplete;

      const spinbuttons = el.renderRoot.querySelectorAll<HTMLElement>('span[role="spinbutton"]');
      spinbuttons[0].focus(); // Focus on hours
      await userEvent.keyboard('{ArrowDown}');
      await el.updateComplete;

      expect(el.value).to.equal('08:40');
    });

    it('should adjust minutes when arrowing hours up to max hour with minute constraints', async () => {
      el = await fixture(html`<sl-time-field max="14:20" value="13:30"></sl-time-field>`);
      await el.updateComplete;

      const spinbuttons = el.renderRoot.querySelectorAll<HTMLElement>('span[role="spinbutton"]');
      spinbuttons[0].focus(); // Focus on hours
      await userEvent.keyboard('{ArrowUp}');
      await el.updateComplete;

      expect(el.value).to.equal('14:20');
    });

    it('should handle arrowing hours below min hour and adjust both hours and minutes', async () => {
      el = await fixture(html`<sl-time-field min="10:45" value="10:30"></sl-time-field>`);
      await el.updateComplete;

      const spinbuttons = el.renderRoot.querySelectorAll<HTMLElement>('span[role="spinbutton"]');
      spinbuttons[0].focus(); // Focus on hours
      await userEvent.keyboard('{ArrowDown}');
      await el.updateComplete;

      expect(el.value).to.equal('10:45');
    });

    it('should handle arrowing hours above max hour and adjust both hours and minutes', async () => {
      el = await fixture(html`<sl-time-field max="15:30" value="15:45"></sl-time-field>`);
      await el.updateComplete;

      const spinbuttons = el.renderRoot.querySelectorAll<HTMLElement>('span[role="spinbutton"]');
      spinbuttons[0].focus(); // Focus on hours
      await userEvent.keyboard('{ArrowUp}');
      await el.updateComplete;

      expect(el.value).to.equal('15:30');
    });

    it('should keep minutes when arrowing to hour that allows current minutes', async () => {
      el = await fixture(html`<sl-time-field max="14:20" value="12:15"></sl-time-field>`);
      await el.updateComplete;

      const spinbuttons = el.renderRoot.querySelectorAll<HTMLElement>('span[role="spinbutton"]');
      spinbuttons[0].focus(); // Focus on hours
      await userEvent.keyboard('{ArrowUp}');
      await el.updateComplete;

      expect(el.value).to.equal('13:15');
    });

    it('should pick a valid minute when an hour is clicked and some minutes are disabled and min is set', async () => {
      el = await fixture(html`<sl-time-field min="08:40"></sl-time-field>`);
      await el.updateComplete;

      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;

      const hour08 = Array.from(el.renderRoot.querySelectorAll('.hours li')).find(
        li => li.textContent?.trim() === '08'
      );
      (hour08 as HTMLElement)?.click();
      await el.updateComplete;

      expect(el.value).to.equal('08:40');
    });

    it('should constrain minutes when selecting an hour via click and max is set', async () => {
      el = await fixture(html`<sl-time-field max="14:20" value="10:00"></sl-time-field>`);
      await el.updateComplete;

      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;

      const hour14 = Array.from(el.renderRoot.querySelectorAll('.hours li')).find(
        li => li.textContent?.trim() === '14'
      ) as HTMLElement;
      hour14.click();
      await el.updateComplete;

      expect(el.value).to.equal('14:00');
    });

    it('should have aria-selected set to false for disabled minutes', async () => {
      el = await fixture(html`<sl-time-field min="08:40" value="08:30"></sl-time-field>`);
      await el.updateComplete;

      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;

      const minutes30 = Array.from(el.renderRoot.querySelectorAll('.minutes li')).find(
        li => li.textContent?.trim() === '30'
      );

      expect(minutes30).to.have.attribute('disabled');
      expect(minutes30).to.have.attribute('aria-selected', 'false');
    });

    it('should scroll to constrained minute when opening picker with invalid minute', async () => {
      el = await fixture(html`<sl-time-field min="08:40" value="08:30"></sl-time-field>`);
      await el.updateComplete;

      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;

      const minutes30 = Array.from(el.renderRoot.querySelectorAll('.minutes li')).find(
          li => li.textContent?.trim() === '30'
        ),
        minutes40 = Array.from(el.renderRoot.querySelectorAll('.minutes li')).find(
          li => li.textContent?.trim() === '40'
        );

      expect(minutes30).to.have.attribute('disabled');
      expect(minutes40).not.have.attribute('disabled');
    });

    it('should handle both min and max minute constraints for the same hour', async () => {
      el = await fixture(html`<sl-time-field min="10:20" max="10:40" value="10:00"></sl-time-field>`);
      await el.updateComplete;

      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;

      const minutes15 = Array.from(el.renderRoot.querySelectorAll('.minutes li')).find(
          li => li.textContent?.trim() === '15'
        ),
        minutes20 = Array.from(el.renderRoot.querySelectorAll('.minutes li')).find(
          li => li.textContent?.trim() === '20'
        ),
        minutes40 = Array.from(el.renderRoot.querySelectorAll('.minutes li')).find(
          li => li.textContent?.trim() === '40'
        ),
        minutes45 = Array.from(el.renderRoot.querySelectorAll('.minutes li')).find(
          li => li.textContent?.trim() === '45'
        );

      expect(minutes15).to.have.attribute('disabled');
      expect(minutes20).not.to.have.attribute('disabled');
      expect(minutes40).not.to.have.attribute('disabled');
      expect(minutes45).to.have.attribute('disabled');
    });

    it('should handle minute step that does not align with min constraint', async () => {
      el = await fixture(html`<sl-time-field min="08:42" minute-step="15" value="08:00"></sl-time-field>`);
      await el.updateComplete;

      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      const minutes00 = Array.from(el.renderRoot.querySelectorAll('.minutes li')).find(
          li => li.textContent?.trim() === '00'
        ),
        minutes30 = Array.from(el.renderRoot.querySelectorAll('.minutes li')).find(
          li => li.textContent?.trim() === '30'
        ),
        minutes45 = Array.from(el.renderRoot.querySelectorAll('.minutes li')).find(
          li => li.textContent?.trim() === '45'
        );

      expect(minutes00).to.have.attribute('disabled');
      expect(minutes30).to.have.attribute('disabled');
      expect(minutes45).not.to.have.attribute('disabled');

      const hour08 = Array.from(el.renderRoot.querySelectorAll('.hours li')).find(
        li => li.textContent?.trim() === '08'
      );
      (hour08 as HTMLElement)?.click();
      await el.updateComplete;

      expect(el.value).to.equal('08:45');
    });

    it('should not allow using Enter to select minutes on disabled minutes', async () => {
      el = await fixture(html`<sl-time-field min="08:40" value="08:50"></sl-time-field>`);
      await el.updateComplete;

      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      const minutes30 = Array.from(el.renderRoot.querySelectorAll('.minutes li')).find(
        li => li.textContent?.trim() === '30'
      ) as HTMLElement;

      expect(minutes30).to.have.attribute('disabled');

      const originalValue = el.value;
      minutes30.focus();
      await userEvent.keyboard('{Enter}');
      await el.updateComplete;

      expect(el.value).to.equal(originalValue);
    });

    it('should not allow using Space to select minutes on disabled minutes', async () => {
      el = await fixture(html`<sl-time-field min="08:40" value="08:50"></sl-time-field>`);
      await el.updateComplete;

      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      const minutes30 = Array.from(el.renderRoot.querySelectorAll('.minutes li')).find(
        li => li.textContent?.trim() === '30'
      ) as HTMLElement;

      expect(minutes30).to.have.attribute('disabled');

      const originalValue = el.value;
      minutes30.focus();
      await userEvent.keyboard(' ');
      await el.updateComplete;

      expect(el.value).to.equal(originalValue);
    });

    it('should not focus disabled minutes when value contains disabled minute', async () => {
      el = await fixture(html`<sl-time-field min="08:40" value="08:30"></sl-time-field>`);
      await el.updateComplete;

      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 100));

      const minutes30 = Array.from(el.renderRoot.querySelectorAll('.minutes li')).find(
        li => li.textContent?.trim() === '30'
      );

      expect(minutes30).to.have.attribute('disabled');

      const originalValue = el.value;
      (minutes30 as HTMLElement)?.click();
      await el.updateComplete;

      expect(el.value).to.equal(originalValue);
    });

    it('should not have tabindex on disabled minutes to prevent focus', async () => {
      el = await fixture(html`<sl-time-field min="08:40" value="08:50"></sl-time-field>`);
      await el.updateComplete;

      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;

      const minutes30 = Array.from(el.renderRoot.querySelectorAll('.minutes li')).find(
        li => li.textContent?.trim() === '30'
      ) as HTMLElement;

      expect(minutes30).to.have.attribute('disabled');

      minutes30.focus();

      expect(el.shadowRoot?.activeElement).not.to.equal(minutes30);

      const minutes40 = Array.from(el.renderRoot.querySelectorAll('.minutes li')).find(
        li => li.textContent?.trim() === '40'
      ) as HTMLElement;

      expect(minutes40).not.to.have.attribute('disabled');
      expect(minutes40).to.have.attribute('tabindex', '-1');

      minutes40.focus();

      expect(el.shadowRoot?.activeElement).to.equal(minutes40);
    });

    it('should maintain keyboard navigation after clicking near disabled minute', async () => {
      el = await fixture(html`<sl-time-field min="08:40" value="08:50" minute-step="5"></sl-time-field>`);
      await el.updateComplete;

      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 100));

      const minutes30 = Array.from(el.renderRoot.querySelectorAll('.minutes li')).find(
        li => li.textContent?.trim() === '30'
      ) as HTMLElement;

      expect(minutes30).to.have.attribute('disabled');

      minutes30.click();
      await el.updateComplete;

      const minutes40 = Array.from(el.renderRoot.querySelectorAll('.minutes li')).find(
        li => li.textContent?.trim() === '40'
      ) as HTMLElement;

      minutes40.focus();
      await el.updateComplete;

      expect(el.shadowRoot?.activeElement).to.equal(minutes40);
      await userEvent.keyboard('{ArrowDown}');

      const focusedElement = el.shadowRoot?.activeElement;

      expect(focusedElement).to.have.trimmed.text('45');
    });

    it('should handle min time with minutes 59 when minute-step is set to 5', async () => {
      el = await fixture(html`<sl-time-field min="10:59" minute-step="5"></sl-time-field>`);
      await el.updateComplete;

      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;

      const hour10 = Array.from(el.renderRoot.querySelectorAll('.hours li')).find(
        li => li.textContent?.trim() === '10'
      );

      (hour10 as HTMLElement)?.click();
      await el.updateComplete;

      // Should be 10:59, not 10:60
      expect(el.value).to.equal('10:59');
    });

    it('should handle min time at 23:59 when minute-step is set to 5', async () => {
      el = await fixture(html`<sl-time-field min="23:59" minute-step="5"></sl-time-field>`);
      await el.updateComplete;

      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;

      const hour23 = Array.from(el.renderRoot.querySelectorAll('.hours li')).find(
        li => li.textContent?.trim() === '23'
      );

      (hour23 as HTMLElement)?.click();
      await el.updateComplete;

      // Should be 23:59, not 23:60 or 24:00
      expect(el.value).to.equal('23:59');
    });

    it('should handle min time with large minute step near hour boundary', async () => {
      el = await fixture(html`<sl-time-field min="10:58" minute-step="15"></sl-time-field>`);
      await el.updateComplete;

      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;

      const hour10 = Array.from(el.renderRoot.querySelectorAll('.hours li')).find(
        li => li.textContent?.trim() === '10'
      );

      (hour10 as HTMLElement).click();
      await el.updateComplete;

      // Should be 10:59, not 10:60 or 10:75
      expect(el.value).to.equal('10:59');
    });

    it('should not change current value when opening dialog with constraints', async () => {
      el = await fixture(html`<sl-time-field min="08:00" max="17:00" value="10:37"></sl-time-field>`);
      await el.updateComplete;

      const originalValue = el.value;
      expect(originalValue).to.equal('10:37');

      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;

      expect(el.value).to.equal(originalValue);
      expect(el.value).to.equal('10:37');

      el.dialog?.hidePopover();
      await el.updateComplete;

      expect(el.value).to.equal('10:37');
    });

    it('should not change the value when opening dialog with minute step constraints', async () => {
      el = await fixture(html`<sl-time-field minute-step="15" value="10:23"></sl-time-field>`);
      await el.updateComplete;

      const originalValue = el.value;
      expect(originalValue).to.equal('10:23');

      el.renderRoot.querySelector('sl-field-button')?.click();
      await el.updateComplete;

      expect(el.value).to.equal('10:23');
    });
  });

  describe('required', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-time-field required></sl-time-field>`);
    });

    it('should be invalid when empty', () => {
      expect(el.valid).to.be.false;
      expect(el.validity.valueMissing).to.be.true;
    });

    it('should have a validation message', () => {
      expect(el.validationMessage).to.equal('Please enter a time.');
    });

    it('should be valid when a time is selected', async () => {
      el.value = '09:00';
      await el.updateComplete;

      expect(el.valid).to.be.true;
    });

    it('should be invalid when the input is empty', async () => {
      el.value = '';
      await el.updateComplete;

      expect(el.valid).to.be.false;
      expect(el.validationMessage).to.equal('Please enter a time.');
    });

    // it('should be invalid when the time has the wrong syntax', async () => {
    //   el.textField.focus();
    //   await userEvent.keyboard('ab:cd');

    //   el.textField.input.blur();
    //   await el.updateComplete;

    //   expect(el.valid).to.be.false;
    //   expect(el.validationMessage).to.equal('Please enter a valid time in HH:MM.');
    // });

    it('should be valid when the time has the correct syntax', async () => {
      el.value = '12:34';
      await el.updateComplete;

      expect(el.valid).to.be.true;
    });
  });

  describe('locale', () => {
    it('should gracefully handle "default" locale without crashing', async () => {
      const field = await fixture<TimeField>(html`<sl-time-field locale="default" value="00:00"></sl-time-field>`);

      expect(field).to.exist;
      expect(field.value).to.equal('00:00');
      expect(field.renderRoot.querySelectorAll('span[role="spinbutton"]')).to.have.length(2);
    });

    it('should gracefully handle an empty locale attribute without crashing', async () => {
      const field = await fixture<TimeField>(html`<sl-time-field locale="" value="00:00"></sl-time-field>`);

      expect(field).to.exist;
      expect(field.value).to.equal('00:00');
      expect(field.renderRoot.querySelectorAll('span[role="spinbutton"]')).to.have.length(2);
    });

    it('should gracefully handle an empty locale property after initialization', async () => {
      const field = await fixture<TimeField>(html`<sl-time-field value="12:34"></sl-time-field>`);

      field.locale = '';
      await field.updateComplete;

      expect(field.value).to.equal('12:34');
      expect(field.renderRoot.querySelectorAll('span[role="spinbutton"]')).to.have.length(2);
    });

    it('should keep keyboard interaction working when locale is set to an empty string', async () => {
      const field = await fixture<TimeField>(html`<sl-time-field locale=""></sl-time-field>`),
        hourSpinbutton = field.renderRoot.querySelector<HTMLElement>('span[role="spinbutton"]')!;

      hourSpinbutton.focus();
      await userEvent.keyboard('09');
      await userEvent.keyboard('15');

      expect(field.value).to.equal('09:15');
    });

    it('should keep popover interaction working when locale is set to an empty string', async () => {
      const field = await fixture<TimeField>(html`<sl-time-field locale="" start="12:00"></sl-time-field>`),
        button = field.renderRoot.querySelector<HTMLElement>('sl-field-button')!,
        dialog = field.renderRoot.querySelector<HTMLDialogElement>('dialog')!;

      button.click();
      await field.updateComplete;

      expect(dialog).to.match(':popover-open');
    });
  });
});
