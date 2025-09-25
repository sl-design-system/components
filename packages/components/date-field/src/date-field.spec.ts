import { expect, fixture } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import '../register.js';
import { type DateField } from './date-field.js';

describe('sl-date-field', () => {
  let el: DateField;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-date-field></sl-date-field>`);
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

    it('should have a value when set', async () => {
      el.value = '2025-09-24';
      await el.updateComplete;

      expect(el.valueAsDate).to.equal('2024-06-20');
    });

    it('should support entering a date via the keyboard', async () => {
      el.textField.focus();
      await sendKeys({ type: '2024-06-20' });

      expect(el.value).to.equal('2024-06-20');
    });

    it('should emit a change event when the date is changed via the keyboard', async () => {});

    it('should emit a change event when the date is changed via the arrow keys', async () => {});

    it('should emit a change event when the date is changed via the calendar', () => {});
  });

  describe('field button', () => {
    let button: HTMLElement;

    beforeEach(async () => {
      el = await fixture(html`<sl-date-field></sl-date-field>`);
      button = el.renderRoot.querySelector('sl-field-button')!;
    });

    it('should exist', () => {
      expect(button).to.exist;
    });

    it('should have a calendar icon', () => {
      expect(button).to.contain('sl-icon[name="calendar"]');
    });

    it('should not be disabled', () => {
      expect(button).not.to.have.attribute('disabled');
    });

    it('should be disabled when the date-field is disabled', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(button).to.have.attribute('disabled');
    });

    it('should be disabled when the date-field is readonly', async () => {
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
      await sendKeys({ press: 'Enter' });

      const dialog = el.renderRoot.querySelector<HTMLElement>('dialog')!;

      expect(dialog).to.exist;
      expect(dialog).to.match(':popover-open');
    });

    it('should show the popover when focused and Space is pressed', async () => {
      button.focus();
      await sendKeys({ press: ' ' });

      const dialog = el.renderRoot.querySelector<HTMLElement>('dialog')!;

      expect(dialog).to.exist;
      expect(dialog).to.match(':popover-open');
    });
  });
});
