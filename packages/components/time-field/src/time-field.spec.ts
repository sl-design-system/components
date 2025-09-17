import { expect, fixture } from '@open-wc/testing';
import { type TextField } from '@sl-design-system/text-field';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import '../register.js';
import { type TimeField } from './time-field.js';

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
    beforeEach(async () => {
      el = await fixture(html`<sl-time-field></sl-time-field>`);
    });

    it('should default to the current time', () => {});

    it('should be settable via the value property', async () => {});

    it('should use the start time when pressing the up/down arrows', async () => {});
  });
});
