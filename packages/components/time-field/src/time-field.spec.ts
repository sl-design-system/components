import { expect, fixture } from '@open-wc/testing';
import { type TextField } from '@sl-design-system/text-field';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import { spy } from 'sinon';
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
      el.textField.input.focus();
      await sendKeys({ type: '12:34' });
      el.textField.input.blur();

      expect(el.value).to.equal('12:34');
      expect(el.textField.value).to.equal('12:34');
      expect(el.textField.input.selectionStart).to.equal(5);
      expect(el.textField.input.selectionEnd).to.equal(5);
    });

    it('should emit a change event when the time is changed via the keyboard', async () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      el.textField.input.focus();
      await sendKeys({ type: '12:34' });
      el.textField.input.blur();
      await el.updateComplete;

      expect(onChange).to.have.been.calledOnce;
    });

    it('should emit a change event when the time is changed via the arrow keys', async () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      el.textField.input.focus();
      await sendKeys({ press: 'ArrowUp' });

      expect(onChange).to.have.been.calledOnce;
    });

    it('should emit a change event when the time is changed via the listbox', () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      el.renderRoot.querySelector('sl-field-button')?.click();
      el.renderRoot.querySelector<HTMLElement>('[popover] button')?.click();

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

      const popover = el.renderRoot.querySelector<HTMLElement>('[popover]')!;

      expect(popover).to.exist;
      expect(popover).to.match(':popover-open');
    });

    it('should show the popover when focused and Enter is pressed', async () => {
      button.focus();
      await sendKeys({ press: 'Enter' });

      const popover = el.renderRoot.querySelector<HTMLElement>('[popover]')!;

      expect(popover).to.exist;
      expect(popover).to.match(':popover-open');
    });

    it('should show the popover when focused and Space is pressed', async () => {
      button.focus();
      await sendKeys({ press: ' ' });

      const popover = el.renderRoot.querySelector<HTMLElement>('[popover]')!;

      expect(popover).to.exist;
      expect(popover).to.match(':popover-open');
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

      const popover = el.renderRoot.querySelector<HTMLElement>('[popover]')!;

      expect(popover).to.exist;
      expect(popover).to.match(':popover-open');
    });

    it('should not open the popover on focus', async () => {
      textField.focus();
      await el.updateComplete;

      const popover = el.renderRoot.querySelector<HTMLElement>('[popover]')!;

      expect(popover).to.exist;
      expect(popover).not.to.match(':popover-open');
    });
  });

  describe('listbox', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-time-field start="12:00"></sl-time-field>`);
    });

    it('should contain columns for hours', () => {
      const hours = Array.from(el.renderRoot.querySelectorAll('.hours button')).map(button =>
        button.textContent?.trim()
      );

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
      const minutes = Array.from(el.renderRoot.querySelectorAll('.minutes button')).map(button =>
        button.textContent?.trim()
      );

      expect(minutes).to.deep.equal(['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']);
    });

    it('should contain options for each time based on the step', async () => {
      el.hourStep = 2;
      el.minuteStep = 10;
      await el.updateComplete;

      const hours = Array.from(el.renderRoot.querySelectorAll('.hours button')).map(button =>
        button.textContent?.trim()
      );
      const minutes = Array.from(el.renderRoot.querySelectorAll('.minutes button')).map(button =>
        button.textContent?.trim()
      );

      expect(hours).to.deep.equal(['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22']);
      expect(minutes).to.deep.equal(['00', '10', '20', '30', '40', '50']);
    });

    it('should update the value when an option is selected', async () => {
      el.renderRoot.querySelector('sl-field-button')?.click();
      el.renderRoot.querySelector<HTMLElement>('.hours button:nth-of-type(5)')?.click();
      el.renderRoot.querySelector<HTMLElement>('.minutes button:nth-of-type(3)')?.click();
      await el.updateComplete;

      expect(el.value).to.equal('04:10');
      expect(el.textField.value).to.equal('04:10');
    });

    it('should focus the start hour when opened', async () => {
      el.textField.focus();
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: ' ' });

      expect(el.shadowRoot?.activeElement).to.match('button');
      expect(el.shadowRoot?.activeElement?.parentElement).to.match('div.hours');
    });

    it('should switch focus between start hour and minute when pressing horizontal arrows', async () => {
      el.textField.focus();
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: ' ' });

      await sendKeys({ press: 'ArrowRight' });

      expect(el.shadowRoot?.activeElement).to.match('button');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('00');
      expect(el.shadowRoot?.activeElement?.parentElement).to.match('div.minutes');

      await sendKeys({ press: 'ArrowLeft' });

      expect(el.shadowRoot?.activeElement).to.match('button');
      expect(el.shadowRoot?.activeElement).to.have.trimmed.text('12');
      expect(el.shadowRoot?.activeElement?.parentElement).to.match('div.hours');
    });

    it('should select the hour when pressing enter on an hour option', async () => {
      el.textField.focus();
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Enter' });

      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'Enter' });

      expect(el.value).to.equal('13:00');
      expect(el.textField.value).to.equal('13:00');
    });

    it('should select the hour when pressing space on an hour option', async () => {
      el.textField.focus();
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: ' ' });

      await sendKeys({ press: 'ArrowUp' });
      await sendKeys({ press: ' ' });

      expect(el.value).to.equal('11:00');
      expect(el.textField.value).to.equal('11:00');
    });

    it('should select the minute when pressing enter on a minute option', async () => {
      el.textField.focus();
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Enter' });

      await sendKeys({ press: 'ArrowRight' });
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'Enter' });

      expect(el.value).to.equal('12:05');
      expect(el.textField.value).to.equal('12:05');
    });

    it('should select the minute when pressing space on a minute option', async () => {
      el.textField.focus();
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: ' ' });

      await sendKeys({ press: 'ArrowRight' });
      await sendKeys({ press: 'ArrowUp' });
      await sendKeys({ press: ' ' });

      expect(el.value).to.equal('12:55');
      expect(el.textField.value).to.equal('12:55');
    });
  });

  describe('min/max', () => {});

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
  });

  describe('start time', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-time-field></sl-time-field>`);
    });

    it('should use the current time by default', async () => {
      const now = new Date(),
        hours = (now.getHours() - 1).toString().padStart(2, '0'),
        minutes = now.getMinutes().toString().padStart(2, '0'),
        current = `${hours}:${minutes}`;

      el.textField.focus();
      await el.updateComplete;

      await sendKeys({ press: 'ArrowDown' });

      expect(el.value).to.equal(current);
      expect(el.textField.value).to.equal(current);
    });

    it('should use the start time when pressing the up/down arrows', async () => {
      el.start = '09:00';
      await el.updateComplete;

      el.textField.focus();
      await el.updateComplete;

      await sendKeys({ press: 'ArrowDown' });

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
      el.textField.input.focus();
      await sendKeys({ type: '12:34' });
      el.textField.input.blur();

      expect(el.value).to.equal('12:34');
      expect(el.textField.value).to.equal('12:34');
      expect(el.textField.input.selectionStart).to.equal(5);
      expect(el.textField.input.selectionEnd).to.equal(5);
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
      await sendKeys({ press: 'ArrowRight' });

      expect(el.textField.input.selectionStart).to.equal(3);
      expect(el.textField.input.selectionEnd).to.equal(5);

      // Move focus to the end
      await sendKeys({ press: 'ArrowRight' });

      expect(el.textField.input.selectionStart).to.equal(5);
      expect(el.textField.input.selectionEnd).to.equal(5);

      // Move focus 1 space left
      await sendKeys({ press: 'ArrowLeft' });

      expect(el.textField.input.selectionStart).to.equal(4);
      expect(el.textField.input.selectionEnd).to.equal(4);

      // Move focus 1 space left (now just before the ':')
      await sendKeys({ press: 'ArrowLeft' });

      expect(el.textField.input.selectionStart).to.equal(3);
      expect(el.textField.input.selectionEnd).to.equal(3);

      // Move focus to the hours
      await sendKeys({ press: 'ArrowLeft' });

      expect(el.textField.input.selectionStart).to.equal(0);
      expect(el.textField.input.selectionEnd).to.equal(2);

      // Move focus to the start
      await sendKeys({ press: 'ArrowLeft' });

      expect(el.textField.input.selectionStart).to.equal(0);
      expect(el.textField.input.selectionEnd).to.equal(0);
    });

    it('should increment the hour when pressing the up arrow with the hour selected', async () => {
      el.textField.focus();
      await el.updateComplete;

      await sendKeys({ press: 'ArrowUp' });

      expect(el.value).to.equal('10:00');
      expect(el.textField.value).to.equal('10:00');
      expect(el.textField.input.selectionStart).to.equal(0);
      expect(el.textField.input.selectionEnd).to.equal(2);
    });

    it('should decrement the hour when pressing the down arrow with the hour selected', async () => {
      el.textField.focus();
      await el.updateComplete;

      await sendKeys({ press: 'ArrowDown' });

      expect(el.value).to.equal('08:00');
      expect(el.textField.value).to.equal('08:00');
      expect(el.textField.input.selectionStart).to.equal(0);
      expect(el.textField.input.selectionEnd).to.equal(2);
    });

    it('should increment the minute when pressing the up arrow with the minute selected', async () => {
      el.textField.focus();
      await el.updateComplete;

      await sendKeys({ press: 'ArrowRight' });
      await sendKeys({ press: 'ArrowUp' });

      expect(el.value).to.equal('09:01');
      expect(el.textField.value).to.equal('09:01');
      expect(el.textField.input.selectionStart).to.equal(3);
      expect(el.textField.input.selectionEnd).to.equal(5);
    });

    it('should decrement the minute when pressing the down arrow with the minute selected', async () => {
      el.textField.focus();
      await el.updateComplete;

      await sendKeys({ press: 'ArrowRight' });
      await sendKeys({ press: 'ArrowDown' });

      expect(el.value).to.equal('09:59');
      expect(el.textField.value).to.equal('09:59');
      expect(el.textField.input.selectionStart).to.equal(3);
      expect(el.textField.input.selectionEnd).to.equal(5);
    });
  });
});
