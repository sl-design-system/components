import { expect, fixture } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import { RadioGroup } from './radio-group.js';
import '../register.js';

describe('sl-radio-group', () => {
  let el: RadioGroup;

  describe('empty', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-radio-group></sl-radio-group>`);
    });

    it('should not break', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });
  });

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-radio-group>
          <sl-radio value="1">Option 1</sl-radio>
          <sl-radio value="2">Option 2</sl-radio>
          <sl-radio value="3">Option 3</sl-radio>
        </sl-radio-group>
      `);
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should have a role of radiogroup', () => {
      expect(el.internals.role).to.equal('radiogroup');
    });

    it('should not be disabled', () => {
      const allDisabled = Array.from(el.querySelectorAll('sl-radio')).every(radio => radio.disabled);

      expect(el).not.to.have.attribute('disabled');
      expect(el.disabled).not.to.be.true;
      expect(allDisabled).to.be.false;
    });

    it('should be disabled when set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.have.attribute('disabled');
      expect(el.radios?.every(radio => radio.disabled)).to.be.true;
    });

    it('should not be required', () => {
      expect(el).not.to.have.attribute('required');
      expect(el.required).not.to.be.true;
    });

    it('should be required when set', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el).to.have.attribute('required');
    });

    it('should be valid', () =>{
      expect(el.valid).to.be.true;
    });

    it('should be invalid when required', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el.valid).to.be.false;
    });

    it('should be valid when required and an option is selected', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el.valid).to.be.false;

      el.querySelector('sl-radio')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(el.valid).to.be.true;
    });

    it('should handle the navigating between options correctly', async () => {
      const radios = Array.from(el.querySelectorAll('sl-radio'));

      expect(radios.at(0)?.checked).to.be.false;
      expect(radios.at(0)?.tabIndex).to.equal(0);
      expect(radios.at(1)?.checked).to.be.false;
      expect(radios.at(1)?.tabIndex).to.equal(-1);

      radios.at(0)?.focus();
      await sendKeys({ press: 'Space' });

      expect(radios.at(0)?.checked).to.be.true;
      expect(radios.at(1)?.checked).to.be.false;

      await sendKeys({ press: 'ArrowRight' });
      await sendKeys({ press: 'Enter' });

      expect(radios.at(0)?.checked).to.be.false;
      expect(radios.at(1)?.checked).to.be.true;
    });
  });


  describe('selected option', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-radio-group value="2">
          <sl-radio value="1">Option 1</sl-radio>
          <sl-radio value="2">Option 2</sl-radio>
          <sl-radio value="3">Option 3</sl-radio>
        </sl-radio-group>
      `);
    });

    it('should have the right option selected to match the value', () => {
      const radios = Array.from(el.querySelectorAll('sl-radio'));

      expect(el.value).to.equal('2');

      expect(radios.at(0)?.checked).to.be.false;
      expect(radios.at(1)?.checked).to.be.true;
      expect(radios.at(2)?.checked).to.be.false;
    });

    it('should not break when the value does not match any of the options', async () => {
      const radios = Array.from(el.querySelectorAll('sl-radio'));

      el.setAttribute('value', 'dummy');
      await el.updateComplete;

      expect(el.value).to.equal('dummy');

      expect(radios.at(0)?.checked).to.be.false;
      expect(radios.at(1)?.checked).to.be.false;
      expect(radios.at(2)?.checked).to.be.false;
    });
  });

  describe('form integration', () => {
    let form: HTMLFormElement;

    beforeEach(async () => {
      form = await fixture(html`
        <form>
          <sl-radio-group required>
            <sl-radio value="1">Option 1</sl-radio>
            <sl-radio value="2">Option 2</sl-radio>
            <sl-radio value="3">Option 3</sl-radio>
          </sl-radio-group>
        </form>
      `);

      el = form.firstElementChild as RadioGroup;
    });

    it('should change the value back to the initial state when the form is reset', async () => {
      el.querySelector('sl-radio')?.focus();
      await sendKeys({ press: 'Space' });

      expect(el.value).to.equal('1');

      el.formResetCallback();

      expect(el.value).to.be.null;
    });
  });
});
