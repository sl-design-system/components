import { expect, fixture } from '@open-wc/testing';
import { type TextField } from '@sl-design-system/text-field';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import { type SinonFakeTimers, useFakeTimers } from 'sinon';
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
      el = await fixture(html`<sl-time-field></sl-time-field>`);
    });

    it('should contain columns for hours and minutes', () => {});

    it('should contain options for each time based on the step', () => {});

    it('should update the value when an option is selected', () => {});

    it('should focus the start hour when opened', () => {});

    it('should focus the start minute when pressing arrow right', async () => {});

    it('should focus the start hour when pressing arrow left', async () => {});

    it('should select the hour when pressing enter on an hour option', async () => {});

    it('should select the hour when pressing space on an hour option', async () => {});

    it('should select the minute when pressing enter on a minute option', async () => {});

    it('should select the minute when pressing space on a minute option', async () => {});
  });

  describe('start time', () => {
    let clock: SinonFakeTimers;

    beforeEach(async () => {
      clock = useFakeTimers(new Date(2025, 0, 1, 9, 0, 0));

      el = await fixture(html`<sl-time-field></sl-time-field>`);
    });

    afterEach(() => clock.restore());

    it('should show the current time at the top of the listbox', () => {});

    it('should be settable via the value property', async () => {});

    it('should use the start time when pressing the up/down arrows', async () => {
      el.textField.focus();
      await el.updateComplete;

      await sendKeys({ press: 'ArrowDown' });

      expect(el.value).to.equal('08:00');
      expect(el.textField.value).to.equal('08:00');
      expect(el.textField.input.selectionStart).to.equal(0);
      expect(el.textField.input.selectionEnd).to.equal(2);
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

      await sendKeys({ press: 'ArrowRight' });

      expect(el.textField.input.selectionStart).to.equal(3);
      expect(el.textField.input.selectionEnd).to.equal(5);

      // Pressing right again should do nothing
      await sendKeys({ press: 'ArrowRight' });

      expect(el.textField.input.selectionStart).to.equal(3);
      expect(el.textField.input.selectionEnd).to.equal(5);

      await sendKeys({ press: 'ArrowLeft' });

      expect(el.textField.input.selectionStart).to.equal(0);
      expect(el.textField.input.selectionEnd).to.equal(2);

      // Pressing left again should do nothing
      await sendKeys({ press: 'ArrowLeft' });

      expect(el.textField.input.selectionStart).to.equal(0);
      expect(el.textField.input.selectionEnd).to.equal(2);
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
