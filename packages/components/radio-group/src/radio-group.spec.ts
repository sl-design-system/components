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

    it('should be valid when no option is chosen but the group is not required', () =>{
      expect(el.internals.validity.valid).to.equal(true);
    });

    it('should handle the navigating between options correctly', async () => {
      expect(el.buttons?.[0].checked).to.equal(false);
      expect(el.buttons?.[0].tabIndex).to.equal(0);
      expect(el.buttons?.[1].checked).to.equal(false);
      expect(el.buttons?.[1].tabIndex).to.equal(-1);

      el.buttons?.[0]?.focus();
      await sendKeys({ press: 'Space' });

      expect(el.buttons?.[0].checked).to.equal(true);
      expect(el.buttons?.[1].checked).to.equal(false);

      await sendKeys({ press: 'ArrowRight' });
      await sendKeys({ press: 'Enter' });

      expect(el.buttons?.[0].checked).to.equal(false);
      expect(el.buttons?.[1].checked).to.equal(true);
    });
  });


  describe('selected option', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-radio-group value="2">
      <sl-radio value="1">Option 1</sl-radio>
      <sl-radio value="2">Option 2</sl-radio>
      <sl-radio value="3">Option 3</sl-radio>
    </sl-radio-group>`);
    });

    it('should have the right option selected to match the value', () => {
      expect(el.value).to.equal("2");

      expect(el.buttons?.[0].checked).to.equal(false);
      expect(el.buttons?.[1].checked).to.equal(true);
      expect(el.buttons?.[2].checked).to.equal(false);
    });

    it('should not break when the value doesn\'t match any of the options', async () => {
      el.setAttribute('value', 'non-existend');
      await el.updateComplete;

      expect(el.value).to.equal("non-existend");

      expect(el.buttons?.[0].checked).to.equal(false);
      expect(el.buttons?.[1].checked).to.equal(false);
      expect(el.buttons?.[2].checked).to.equal(false);
    });
  });

  describe('validation', () => {
    beforeEach(async () => {
      el = await fixture(html`
          <sl-radio-group required>
            <sl-radio value="1">Option 1</sl-radio>
            <sl-radio value="2">Option 2</sl-radio>
            <sl-radio value="3">Option 3</sl-radio>
          </sl-radio-group>
      `);
    });

    it('should not be valid when no option is chosen when it is a required group', async () => {
      expect(el.internals.validity.valid).to.equal(false);
    });

    it('should be valid when an option is chosen when it is a required group', async () => {
      expect(el.internals.validity.valid).to.equal(false);

      el.buttons?.[0]?.focus();
      await sendKeys({ press: 'Space' });
      await el.form?.checkValidity();

      expect(el.internals.validity.valid).to.equal(true);
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
      el.buttons?.[0]?.focus();
      await sendKeys({ press: 'Space' });

      expect(el.value).to.equal('1');

      el.formResetCallback();

      expect(el.value).to.equal(undefined);
    });
  });
});
