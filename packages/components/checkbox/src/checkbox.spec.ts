import { expect, fixture } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import { Checkbox } from './checkbox.js';
import '../register.js';

describe('sl-checkbox', () => {
  let el: Checkbox;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-checkbox>Hello world</sl-checkbox>`);
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should not be checked', () => {
      expect(el.checked).not.to.be.true;
      expect(el.internals.ariaChecked).to.equal('false');
    });

    it('should not be disabled', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el.disabled).not.to.be.true;
      expect(el.internals.ariaDisabled).to.equal('false');
    });

    it('should change the state to checked when clicking the wrapper', async () => {
      el.renderRoot.querySelector<HTMLElement>('.wrapper')?.click();
      await el.updateComplete;

      expect(el.checked).to.be.true;
      expect(el.internals.ariaChecked).to.equal('true');
    });

    it('should change the state to checked on when pressing enter', async () => {
      el.focus();
      await sendKeys({ press: 'Enter' });
      await el.updateComplete;

      expect(el.checked).to.be.true;
    });

    it('should change the state to checked on when pressing space', async () => {
      el.focus();
      await sendKeys({ press: 'Space' });
      await el.updateComplete;

      expect(el.checked).to.be.true;
    });
  });

  describe('disabled', () => {
    beforeEach(async ()=>{
      el = await fixture(html`<sl-checkbox disabled>Hello world</sl-checkbox>`);
    });

    it('should be disabled if set', async () => {
      expect(el).to.have.attribute('disabled');
    });

    it('should not change the state to checked when clicked', async () => {
      el.click();

      expect(el.checked).not.to.be.true;
    });

    it('should change the state to checked when clicked on the wrapper', async () => {
      (el.renderRoot.querySelector('.wrapper') as HTMLElement)?.click();

      expect(el.checked).not.to.be.true;
    });

    it('should not change the state to checked on key down', async () => {
      el.disabled = true;
      await el.updateComplete;

      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(el.checked).not.to.be.true;
    });
  });

  describe('checked', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-checkbox checked>Hello world</sl-checkbox>`);
    });

    it('should be checked when the property is set', () => {
      expect(el.checked).to.be.true;
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
      expect(el.indeterminate).to.be.true;
    });
  });

  describe('form integration', () => {
    describe('unchecked', () => {
      let form: HTMLFormElement;
      beforeEach(async () => {
        form = await fixture(html`
          <form>
              <sl-checkbox>Hello world</sl-checkbox>
          </form>
        `);

        el = form.firstElementChild as Checkbox;
      });

      it('should revert back to the correct initial state (unchecked) when the form is reset', () => {
        el.click();

        expect(el.checked).to.be.true;

        el.formResetCallback();

        expect(el.checked).to.equal(false);
      });
    });

    describe('checked', () => {
      let form: HTMLFormElement;
      beforeEach(async () => {
        form = await fixture(html`
          <form>
              <sl-checkbox checked>Hello world</sl-checkbox>
          </form>
        `);

        el = form.firstElementChild as Checkbox;
      });

      it('should revert back to the correct initial state (checked) when the form is reset', () => {
        el.click();

        expect(el.checked).to.equal(false);

        el.formResetCallback();

        expect(el.checked).to.be.true;
      });
    });
  });
});
