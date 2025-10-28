import { type TextField } from '@sl-design-system/text-field';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { userEvent } from '@vitest/browser/context';
import { html } from 'lit';
import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
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
      el.textField.focus();
      await userEvent.keyboard('12:34');
      el.textField.input.blur();

      expect(el.value).to.equal('12:34');
      expect(el.textField.value).to.equal('12:34');
      expect(el.textField.input.selectionStart).to.equal(5);
      expect(el.textField.input.selectionEnd).to.equal(5);
    });

    it('should emit a change event when the time is changed via the keyboard', async () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      el.textField.focus();
      await userEvent.keyboard('12:34');
      el.textField.input.blur();
      await el.updateComplete;

      expect(onChange).to.have.been.calledOnce;
    });

    it('should emit a change event when the time is changed via the arrow keys', async () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      el.textField.focus();
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
  });

  describe('text field', () => {
    let textField: TextField;

    beforeEach(async () => {
      el = await fixture(html`<sl-time-field></sl-time-field>`);
      textField = el.renderRoot.querySelector('sl-text-field')!;
    });

    it('should exist', () => {
      expect(textField).to.exist;
    });

    it('should have a text type', () => {
      expect(textField.type).to.equal('text');
    });

    it('should not be disabled', () => {
      expect(textField).not.to.have.attribute('disabled');
    });

    it('should be disabled when set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(textField).to.have.attribute('disabled');
    });

    it('should not be readonly', () => {
      expect(textField).not.to.have.attribute('readonly');
    });

    it('should be readonly when set', async () => {
      el.readonly = true;
      await el.updateComplete;

      expect(textField).to.have.attribute('readonly');
    });

    it('should not have a placeholder', () => {
      expect(textField).not.to.have.attribute('placeholder');
    });

    it('should have a placeholder when set', async () => {
      el.placeholder = 'Select time';
      await el.updateComplete;

      expect(textField).to.have.attribute('placeholder', 'Select time');
    });

    it('should not be required', () => {
      expect(textField).not.to.have.attribute('required');
    });

    it('should be required when set', async () => {
      el.required = true;
      await el.updateComplete;

      expect(textField).to.have.attribute('required');
    });

    it('should not have a value', () => {
      expect(textField.input.value).to.equal('');
      expect(textField.value).to.equal('');
    });

    it('should have a value when set', async () => {
      el.value = '2:45';
      await el.updateComplete;

      expect(textField.input.value).to.equal('02:45');
      expect(textField.value).to.equal('02:45');
    });

    it('should open the popover on click', async () => {
      textField.click();
      await el.updateComplete;

      const dialog = el.renderRoot.querySelector<HTMLElement>('dialog')!;

      expect(dialog).to.exist;
      expect(dialog).to.match(':popover-open');
    });

    it('should not open the popover on focus', async () => {
      textField.focus();
      await el.updateComplete;

      const dialog = el.renderRoot.querySelector<HTMLElement>('dialog')!;

      expect(dialog).to.exist;
      expect(dialog).not.to.match(':popover-open');
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
      expect(el.textField.value).to.equal('04:10');
    });

    it('should focus the start hour when opened', async () => {
      el.textField.focus();
      await userEvent.tab();
      await userEvent.keyboard('{Space}');

      expect(el.shadowRoot?.activeElement).to.match('li');
      expect(el.shadowRoot?.activeElement?.parentElement).to.match('ul.hours');
    });

    it('should switch focus between start hour and minute when pressing horizontal arrows', async () => {
      el.textField.focus();
      await userEvent.tab();
      await userEvent.keyboard('{Space}');

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
      el.textField.focus();
      await userEvent.tab();
      await userEvent.keyboard('{Enter}');

      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{Enter}');

      expect(el.value).to.equal('13:00');
      expect(el.textField.value).to.equal('13:00');
    });

    it('should select the hour when pressing space on an hour option', async () => {
      el.textField.focus();
      await userEvent.tab();
      await userEvent.keyboard('{Space}');

      await userEvent.keyboard('{ArrowUp}');
      await userEvent.keyboard('{Space}');

      expect(el.value).to.equal('11:00');
      expect(el.textField.value).to.equal('11:00');
    });

    it('should select the minute when pressing enter on a minute option', async () => {
      el.textField.focus();
      await userEvent.tab();
      await userEvent.keyboard('{Enter}');

      await userEvent.keyboard('{ArrowRight}');
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{Enter}');

      expect(el.value).to.equal('12:05');
      expect(el.textField.value).to.equal('12:05');
    });

    it('should select the minute when pressing space on a minute option', async () => {
      el.textField.focus();
      await userEvent.tab();
      await userEvent.keyboard('{Space}');

      await userEvent.keyboard('{ArrowRight}');
      await userEvent.keyboard('{ArrowUp}');
      await userEvent.keyboard('{Space}');

      expect(el.value).to.equal('12:55');
      expect(el.textField.value).to.equal('12:55');
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
      el.value = '09:00';
      await el.updateComplete;

      el.textField.focus();
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{ArrowDown}');

      expect(el.value).to.equal('08:00');
      expect(el.textField.value).to.equal('08:00');
    });

    it('should not go above the maximum time when using the arrow keys', async () => {
      el.value = '13:00';
      await el.updateComplete;

      el.textField.focus();
      await userEvent.keyboard('{ArrowUp}');
      await userEvent.keyboard('{ArrowUp}');

      expect(el.value).to.equal('14:00');
      expect(el.textField.value).to.equal('14:00');
    });

    it('should be invalid when the value is before the minimum time', async () => {
      el.textField.focus();
      await userEvent.keyboard('07:00');
      el.textField.input.blur();
      await el.updateComplete;

      expect(el.valid).to.be.false;
      expect(el.validationMessage).to.equal('Please select a time that is no earlier than 08:00.');
    });

    it('should be invalid when the value is after the maximum time', async () => {
      el.textField.focus();
      await userEvent.keyboard('19:00');
      el.textField.input.blur();
      await el.updateComplete;

      expect(el.valid).to.be.false;
      expect(el.validationMessage).to.equal('Please select a time that is no later than 14:00.');
    });

    it('should be valid when the value is within the range', async () => {
      el.textField.focus();
      await userEvent.keyboard('10:00');
      el.textField.input.blur();
      await el.updateComplete;

      expect(el.valid).to.be.true;
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
      expect(el.validationMessage).to.equal('Please fill out this field.');
    });

    it('should be invalid when the time has the wrong syntax', async () => {
      el.value = 'ab:cd';
      await el.updateComplete;

      console.log('eeel value2', el.value);

      expect(el.valid).to.be.false;
      expect(el.validationMessage).to.equal('Please enter a time.');
    });

    it('should be valid when the time has the correct syntax', async () => {
      el.textField.focus();
      await userEvent.keyboard('12:34');
      el.textField.input.blur();
      await el.updateComplete;

      expect(el.valid).to.be.true;
    });
  });

  describe('start time', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-time-field></sl-time-field>`);
    });

    it('should use the current time by default', async () => {
      const now = new Date(),
        hours = (now.getHours() - 1).toString().padStart(2, '0'),
        current = `${hours}:00`;

      el.textField.focus();
      await el.updateComplete;

      await userEvent.keyboard('{ArrowDown}');

      expect(el.value).to.equal(current);
      expect(el.textField.value).to.equal(current);
    });

    it('should use the start time when pressing the up/down arrows', async () => {
      el.start = '09:00';
      await el.updateComplete;

      el.textField.focus();
      await el.updateComplete;

      await userEvent.keyboard('{ArrowDown}');

      expect(el.value).to.equal('08:00');
      expect(el.textField.value).to.equal('08:00');
    });
  });

  describe('value', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-time-field value="09:00"></sl-time-field>`);
    });

    it('should be reflected in the text field', () => {
      const textField = el.renderRoot.querySelector('sl-text-field')!;

      expect(textField.input.value).to.equal('09:00');
      expect(textField.value).to.equal('09:00');
    });

    it('should be possible to enter a new time via the keyboard', async () => {
      el.textField.focus();
      await userEvent.keyboard('12:34');
      el.textField.input.blur();

      expect(el.value).to.equal('12:34');
      expect(el.textField.value).to.equal('12:34');
      expect(el.textField.input.selectionStart).to.equal(5);
      expect(el.textField.input.selectionEnd).to.equal(5);
    });

    it('should clear the value after removing all the text', async () => {
      el.textField.focus();
      for (let i = 0; i < 5; i++) {
        await userEvent.keyboard('{Delete}');
      }
      el.textField.input.blur();

      expect(el.value).to.be.undefined;
      expect(el.textField.value).to.equal('');
      expect(el.textField.input.selectionStart).to.equal(0);
      expect(el.textField.input.selectionEnd).to.equal(0);
    });

    it('should clear the selection after removing all text', async () => {
      el.textField.focus();
      for (let i = 0; i < 5; i++) {
        await userEvent.keyboard('{Delete}');
      }
      await userEvent.tab();
      await userEvent.keyboard('{Enter}');

      const selected = el.renderRoot.querySelectorAll('dialog li[aria-selected="true"]');
      expect(selected).to.have.lengthOf(0);
    });

    it('should focus the hour when focusing the text field', async () => {
      const textField = el.renderRoot.querySelector('sl-text-field')!;
      textField.focus();
      await el.updateComplete;

      const { selectionStart, selectionEnd } = textField.input;
      expect(selectionStart).to.equal(0);
      expect(selectionEnd).to.equal(2);
    });

    it('should switch between hour and minute when using the horizontal arrow keys', async () => {
      el.textField.focus();
      await el.updateComplete;

      // Move focus to the minutes
      await userEvent.keyboard('{ArrowRight}');

      expect(el.textField.input.selectionStart).to.equal(3);
      expect(el.textField.input.selectionEnd).to.equal(5);

      // Move focus to the end
      await userEvent.keyboard('{ArrowRight}');

      expect(el.textField.input.selectionStart).to.equal(5);
      expect(el.textField.input.selectionEnd).to.equal(5);

      // Move focus 1 space left
      await userEvent.keyboard('{ArrowLeft}');

      expect(el.textField.input.selectionStart).to.equal(4);
      expect(el.textField.input.selectionEnd).to.equal(4);

      // Move focus 1 space left (now just before the ':')
      await userEvent.keyboard('{ArrowLeft}');

      expect(el.textField.input.selectionStart).to.equal(3);
      expect(el.textField.input.selectionEnd).to.equal(3);

      // Move focus to the hours
      await userEvent.keyboard('{ArrowLeft}');

      expect(el.textField.input.selectionStart).to.equal(0);
      expect(el.textField.input.selectionEnd).to.equal(2);

      // Move focus to the start
      await userEvent.keyboard('{ArrowLeft}');

      expect(el.textField.input.selectionStart).to.equal(0);
      expect(el.textField.input.selectionEnd).to.equal(0);
    });

    it('should increment the hour when pressing the up arrow with the hour selected', async () => {
      el.textField.focus();
      await el.updateComplete;

      await userEvent.keyboard('{ArrowUp}');

      expect(el.value).to.equal('10:00');
      expect(el.textField.value).to.equal('10:00');
      expect(el.textField.input.selectionStart).to.equal(0);
      expect(el.textField.input.selectionEnd).to.equal(2);
    });

    it('should decrement the hour when pressing the down arrow with the hour selected', async () => {
      el.textField.focus();
      await el.updateComplete;

      await userEvent.keyboard('{ArrowDown}');

      expect(el.value).to.equal('08:00');
      expect(el.textField.value).to.equal('08:00');
      expect(el.textField.input.selectionStart).to.equal(0);
      expect(el.textField.input.selectionEnd).to.equal(2);
    });

    it('should increment the minute when pressing the up arrow with the minute selected', async () => {
      el.textField.focus();
      await el.updateComplete;

      await userEvent.keyboard('{ArrowRight}');
      await userEvent.keyboard('{ArrowUp}');

      expect(el.value).to.equal('09:01');
      expect(el.textField.value).to.equal('09:01');
      expect(el.textField.input.selectionStart).to.equal(3);
      expect(el.textField.input.selectionEnd).to.equal(5);
    });

    it('should decrement the minute when pressing the down arrow with the minute selected', async () => {
      el.textField.focus();
      await el.updateComplete;

      await userEvent.keyboard('{ArrowRight}');
      await userEvent.keyboard('{ArrowDown}');

      expect(el.value).to.equal('09:59');
      expect(el.textField.value).to.equal('09:59');
      expect(el.textField.input.selectionStart).to.equal(3);
      expect(el.textField.input.selectionEnd).to.equal(5);
    });
  });
});
