import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import { Checkbox } from './checkbox.js';
import './register.js';

describe('sl-checkbox', () => {
  let el: Checkbox;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-checkbox>Hello world</sl-checkbox>`);
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should not be checked by default', () => {
      expect(el.checked).to.equal(false);
      expect(el.internals.ariaChecked).to.equal('false');
    });

    it('should not be disabled', () => {
      expect(el).not.to.have.attribute('disabled');
    });

    it('should be disabled if set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.have.attribute('disabled');
    });

    it('should change the state to checked when clicked', async () => {
      el.disabled = false;
      await el.updateComplete;
      
      el.click();

      expect(el.checked).to.equal(true);
    });
  });

  describe('checked', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-checkbox checked>Hello world</sl-checkbox>`);
    });

    it('should be checked when the property is set', () => {
      expect(el.checked).to.equal(true);
      expect(el.internals.ariaChecked).to.equal('true');
    });

    it('should change the state to unchecked when clicked', async () => {
      
      el.click();

      expect(el.checked).to.equal(false);
    });
  });

  describe('indeterminate', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-checkbox indeterminate>Hello world</sl-checkbox>`);
    });

    it('should not be indeterminate by default', () => {
      expect(el.indeterminate).to.equal(true);
    });
  });
});
