import { expect, fixture } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import { Radio } from './radio.js';
import './register.js';

describe('sl-radio', () => {
  let el: Radio;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-radio>Hello world</sl-radio>`);

      el.disabled = false;
      await el.updateComplete;
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should not be checked by default', () => {
      expect(el.checked).to.equal(false);
      expect(el.internals.ariaChecked).to.equal('false');
    });

    it('should not be disabled by default', () => {
      expect(el).not.to.have.attribute('disabled');
    });

    it('should change the state to checked when clicked', async () => {
      el.click();

      expect(el.checked).to.equal(true);
    });

    it('should change the state to checked on key down', async () => {
      el.focus();
      await sendKeys({ press: 'Enter' });

      expect(el.checked).to.equal(true);
    });

  });
  
  describe('disabled', () => {
    beforeEach(async ()=>{
      const group = await fixture(html`<sl-radio-group><sl-radio value="1">Hello world</sl-radio></sl-radio-group>`);
      el = group.firstElementChild as Radio;

      el.disabled = true;
      el.setAttribute('disabled', '');
      await el.updateComplete;
    });
    it('should be disabled if set', async () => {

      expect(el).to.have.attribute('disabled');
    });

    it('should not change the state to checked when clicked', async () => {
      el.click();

      expect(el.checked).to.equal(false);
    });

    it('should change the state to checked when clicked on the wrapper', async () => {
      (el.renderRoot.querySelector('.wrapper') as HTMLElement)?.click();

      expect(el.checked).to.equal(false);
    });

    it('should not change the state to checked on key down', async () => {
      el.disabled = true;
      await el.updateComplete;
      
      el.focus();
      await sendKeys({ press: 'Enter' });

      expect(el.checked).to.equal(false);
    });
  });

  describe('checked', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-radio checked>Hello world</sl-radio>`);
    });

    it('should be checked when the property is set', () => {
      expect(el.checked).to.equal(true);
      expect(el.internals.ariaChecked).to.equal('true');
    });
  });
});
