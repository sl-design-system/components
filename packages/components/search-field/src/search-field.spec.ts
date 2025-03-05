import { expect, fixture } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { type SearchField, type SlSearchEvent } from './search-field.js';

describe('sl-search-field', () => {
  let el: SearchField;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-search-field></sl-search-field>`);
    });

    it('should have a search icon', () => {
      expect(el.renderRoot.querySelector('sl-icon[name="search"]')).to.exist;
    });

    it('should not have a clear button', () => {
      expect(el.renderRoot.querySelector('button')).to.not.exist;
    });

    it('should not be disabled', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el.disabled).not.to.be.true;
    });

    it('should be disabled when set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.have.attribute('disabled');
      expect(el.disabled).to.be.true;
    });
  });

  describe('with value', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-search-field value="Foo"></sl-search-field>`);
    });

    it('should have a clear button', () => {
      const button = el.renderRoot.querySelector('sl-field-button');

      expect(button).to.exist;
      expect(button).to.contain('sl-icon[name="xmark"]');
    });

    it('should not have a clear button when disabled', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el.renderRoot.querySelector('sl-field-button')).to.not.exist;
    });

    it('should clear the input when the clear button is clicked', () => {
      el.renderRoot.querySelector('sl-field-button')?.click();

      expect(el.value).to.equal('');
    });

    it('should clear the input when the escape key is pressed', async () => {
      el.focus();
      await sendKeys({ press: 'Escape' });

      expect(el.value).to.equal('');
    });

    it('should focus the input when the clear button is clicked', () => {
      el.renderRoot.querySelector('sl-field-button')?.click();

      expect(document.activeElement).to.equal(el.querySelector('input'));
    });

    it('should emit a clear event when the clear button is clicked', () => {
      const onClear = spy();

      el.addEventListener('sl-clear', onClear);
      el.renderRoot.querySelector('sl-field-button')?.click();

      expect(onClear).to.be.calledOnce;
    });

    it('should emit a clear event when the escape key is pressed', async () => {
      const onClear = spy();

      el.addEventListener('sl-clear', onClear);
      el.focus();
      await sendKeys({ press: 'Escape' });

      expect(onClear).to.be.calledOnce;
    });

    it('should emit a search event with the value when enter is pressed', async () => {
      const onSearch: (value: string) => void = spy();

      el.addEventListener('sl-search', (event: SlSearchEvent) => onSearch(event.detail));
      el.focus();
      await sendKeys({ press: 'Enter' });

      expect(onSearch).to.be.calledOnce;
      expect(onSearch).to.be.calledWith('Foo');
    });
  });
});
