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
      expect(el.internals.ariaChecked).not.to.equal('true');
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

    it('should not be indeterminate', () => {
      expect(el).not.to.have.attribute('indeterminate');
      expect(el.indeterminate).not.to.be.true;
      expect(el.internals.ariaChecked).not.to.equal('true');
    });

    it('should be indeterminate when set', async () => {
      el.indeterminate = true;
      await el.updateComplete;

      expect(el).to.have.attribute('indeterminate');
      expect(el.internals.ariaChecked).to.equal('mixed');
    });

    it('should not be required', () => {
      expect(el).not.to.have.attribute('required');
      expect(el.required).not.to.be.true;
      expect(el.internals.ariaRequired).not.to.equal('true');
    });

    it('should be required when set', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el).to.have.attribute('required');
      expect(el.internals.ariaRequired).to.equal('true');
    });

    it('should toggle the state to checked when clicking the element', async () => {
      el.click();
      await el.updateComplete;

      expect(el).to.have.attribute('checked');
      expect(el.checked).to.be.true;
      expect(el.internals.ariaChecked).to.equal('true');

      el.click();
      await el.updateComplete;

      expect(el).not.to.have.attribute('checked');
      expect(el.checked).to.be.false;
      expect(el.internals.ariaChecked).to.equal('false');
    });

    it('should change the state to checked on when pressing enter', async () => {
      el.focus();
      await sendKeys({ press: 'Enter' });
      await el.updateComplete;

      expect(el).to.have.attribute('checked');
      expect(el.checked).to.be.true;
      expect(el.internals.ariaChecked).to.equal('true');
    });

    it('should change the state to checked on when pressing space', async () => {
      el.focus();
      await sendKeys({ press: 'Space' });
      await el.updateComplete;

      expect(el).to.have.attribute('checked');
      expect(el.checked).to.be.true;
      expect(el.internals.ariaChecked).to.equal('true');
    });
  });

  describe('disabled', () => {
    beforeEach(async ()=>{
      el = await fixture(html`<sl-checkbox disabled>Hello world</sl-checkbox>`);
    });

    it('should be marked as disabled', () => {
      expect(el.disabled).to.be.true;
    });

    it('should have a tabindex of -1', () => {
      const inner = el.renderRoot.querySelector('.inner');

      expect(inner).to.have.attribute('tabindex', '-1');
    });

    it('should not change the state to checked when clicked', async () => {
      el.click();
      await el.updateComplete;

      expect(el.checked).not.to.be.true;
    });

    it('should not change the state to checked on enter', async () => {
      el.focus();
      await sendKeys({ press: 'Enter' });
      await el.updateComplete;

      expect(el.checked).not.to.be.true;
    });
  });

  describe('form integration', () => {
    let form: HTMLFormElement;

    describe('unchecked', () => {
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
