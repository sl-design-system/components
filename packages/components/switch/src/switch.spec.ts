import { expect, fixture } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import { Switch } from './switch.js';
import './register.js';

describe('sl-switch', () => {
  let el: Switch;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-switch></sl-switch>`);
      await el.updateComplete;
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should not be on by default', () => {
      expect(el.checked).not.to.equal(true);
      expect(el.internals.ariaChecked).to.equal('false');
    });

    it('should not be disabled by default', () => {
      expect(el).not.to.have.attribute('disabled');
    });

    it('should change the state to checked when clicked', async () => {
      el.click();

      expect(el.checked).to.equal(true);
    });

    it('should change the state to on when clicked on the track', async () => {
      (el.renderRoot.querySelector('.track') as HTMLElement)?.click();

      expect(el.checked).to.equal(true);
    });

    it('should change the state to on on key down', async () => {
      el.focus();
      await sendKeys({ press: 'Enter' });

      expect(el.checked).to.equal(true);
    });

  });
  
  describe('disabled', () => {
    beforeEach(async ()=>{
      el = await fixture(html`<sl-switch disabled></sl-switch>`);
    });

    it('should be disabled if set', async () => {
      expect(el).to.have.attribute('disabled');
    });

    it('should not change the state to on when clicked', async () => {
      el.click();

      expect(el.checked).not.to.equal(true);
    });

    it('should not change the state to on when clicked on the track', async () => {
      (el.renderRoot.querySelector('.track') as HTMLElement)?.click();

      expect(el.checked).not.to.equal(true);
    });

    it('should not change the state to on on key down', async () => {
      el.disabled = true;
      await el.updateComplete;

      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(el.checked).not.to.equal(true);
    });
  });

  describe('checked', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-switch checked></sl-switch>`);
    });

    it('should be on when the property is set', () => {
      expect(el.checked).to.equal(true);
      expect(el.internals.ariaChecked).to.equal('true');
    });

    it('should change the state to off when clicked', async () => {
      el.click();

      expect(el.checked).to.equal(false);
    });
  });

  describe('form integration', () => {
    describe('unchecked', () => {
      let form: HTMLFormElement;
      beforeEach(async () => {
        form = await fixture(html`
          <form>
              <sl-switch></sl-switch>
          </form>
        `);

        el = form.firstElementChild as Switch;
      });

      it('should revert back to the correct initial state (off) when the form is reset', () => {
        el.click();

        expect(el.checked).to.equal(true);
        
        el.formResetCallback();
        
        expect(el.checked).to.equal(false);
      });
    });

    describe('checked', () => {
      let form: HTMLFormElement;
      beforeEach(async () => {
        form = await fixture(html`
          <form>
              <sl-switch checked></sl-switch>
          </form>
        `);

        el = form.firstElementChild as Switch;
      });

      it('should revert back to the correct initial state (on) when the form is reset', () => {
        el.click();

        expect(el.checked).to.equal(false);
        
        el.formResetCallback();
        
        expect(el.checked).to.equal(true);
      });
    });
  });
});
