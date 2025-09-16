import { expect, fixture } from '@open-wc/testing';
import { type TextField } from '@sl-design-system/text-field';
import { html } from 'lit';
import '../register.js';
import { type TimeField } from './time-field.js';

describe('sl-time-field', () => {
  let el: TimeField, textField: TextField;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-time-field></sl-time-field>`);
      textField = el.renderRoot.querySelector('sl-text-field')!;
    });

    it('should have a text field', () => {
      expect(textField).to.exist;
    });

    it('should have a field button', () => {
      const button = el.renderRoot.querySelector('sl-field-button');

      expect(button).to.exist;
      expect(button).to.contain('sl-icon[name="far-clock"]');
    });

    it('should not be disabled', () => {
      expect(el.disabled).not.to.be.true;
      expect(textField).not.to.have.attribute('disabled');
    });

    it('should be disabled when set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(textField).to.have.attribute('disabled');
    });

    it('should not be readonly', () => {
      expect(el.readonly).not.to.be.true;
      expect(textField).not.to.have.attribute('readonly');
    });

    it('should be readonly when set', async () => {
      el.readonly = true;
      await el.updateComplete;

      expect(textField).to.have.attribute('readonly');
    });

    it('should not have a placeholder', () => {
      expect(el.placeholder).to.be.undefined;
      expect(textField).not.to.have.attribute('placeholder');
    });

    it('should have a placeholder when set', async () => {
      el.placeholder = 'Select time';
      await el.updateComplete;

      expect(textField).to.have.attribute('placeholder', 'Select time');
    });

    it('should have no value', () => {
      expect(el.value).to.be.undefined;
      expect(textField.value).to.equal('');
    });

    it('should have a value when set', async () => {
      el.value = '2:45';
      await el.updateComplete;

      expect(textField.value).to.equal('02:45');
    });
  });
});
