import { expect, fixture } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { type TextField } from './text-field.js';

describe('sl-text-field', () => {
  let el: TextField, input: HTMLInputElement;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-text-field></sl-text-field>`);
      input = el.querySelector('input')!;
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should have an input slot', () => {
      const slot = el.renderRoot.querySelector('slot[name="input"]');

      expect(slot).to.exist;
    });

    it('should not be disabled', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el.disabled).not.to.be.true;
      expect(input.disabled).to.be.false;
    });

    it('should be disabled if set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.have.attribute('disabled');
      expect(input.disabled).to.be.true;
    });

    it('should not have a value', () => {
      expect(el.value).to.equal('');
      expect(input.value).to.equal('');
    });

    it('should have a value when set', async () => {
      el.value = 'my value';
      await el.updateComplete;

      expect(input.value).to.equal('my value');
    });

    it('should have a medium size', () => {
      expect(el).to.have.attribute('size', 'md');
      expect(el.size).to.equal('md');
    });

    it('should have a large size when set', async () => {
      el.size = 'lg';
      await el.updateComplete;

      expect(el).to.have.attribute('size', 'lg');
    });

    it('should not be readonly', () => {
      expect(el.readonly).not.to.be.true;
      expect(input.readOnly).to.be.false;
    });

    it('should be readonly when set', async () => {
      el.readonly = true;
      await el.updateComplete;

      expect(el).to.have.attribute('readonly');
      expect(input.readOnly).to.be.true;
    });

    it('should have autocomplete turned off', () => {
      expect(el.autocomplete).to.be.undefined;
      expect(input).to.have.attribute('autocomplete', 'off');
    });

    it('should have autocomplete when set', async () => {
      el.autocomplete = 'on';
      await el.updateComplete;

      expect(input).to.have.attribute('autocomplete', 'on');
    });

    it('should not have a placeholder', () => {
      expect(el.placeholder).to.be.undefined;
      expect(input).to.have.attribute('placeholder', '');
    });

    it('should have a placeholder when set', async () => {
      el.placeholder = 'my placeholder';
      await el.updateComplete;

      expect(input).to.have.attribute('placeholder', 'my placeholder');
    });

    it('should have a text type', () => {
      expect(el.type).to.equal('text');
      expect(input.type).to.equal('text');
    });

    it('should have a type when set', async () => {
      el.type = 'email';
      await el.updateComplete;

      expect(input.type).to.equal('email');
    });

    it('should not have a pattern by default', () => {
      expect(el.pattern).to.be.undefined;
      expect(input).not.to.have.attribute('pattern');
    });

    it('should have a pattern when set', async () => {
      el.pattern = '.{3,5}';
      await el.updateComplete;

      expect(input).to.have.attribute('pattern', '.{3,5}');
    });

    it('should not have a maxlength', () => {
      expect(el.maxLength).to.be.undefined;
      expect(el).not.to.have.attribute('maxlength');
    });

    it('should have a maxlength when set', async () => {
      el.maxLength = 3;
      await el.updateComplete;

      expect(input).to.have.attribute('maxlength', '3');
    });

    it('should not have a minlength', () => {
      expect(el.minLength).to.be.undefined;
      expect(el).not.to.have.attribute('minlength');
    });

    it('should have a minlength when set', async () => {
      el.minLength = 3;
      await el.updateComplete;

      expect(input).to.have.attribute('minlength', '3');
    });

    it('should focus the input when focusing the element', () => {
      el.focus();

      expect(document.activeElement).to.equal(input);
    });

    it('should emit an sl-focus event when focusing the input', () => {
      const onFocus = spy();

      el.addEventListener('sl-focus', onFocus);
      input.focus();

      expect(onFocus).to.have.been.calledOnce;
    });

    it('should emit an sl-blur event when blurring the input', async () => {
      const onBlur = spy();

      el.addEventListener('sl-blur', onBlur);
      input.focus();
      await sendKeys({ press: 'Tab' });

      expect(onBlur).to.have.been.calledOnce;
    });

    it('should emit an sl-change event when typing in the input', async () => {
      const onInput = spy();

      el.addEventListener('sl-change', onInput);
      input.focus();
      await sendKeys({ type: 'Lorem' });

      expect(onInput.callCount).to.equal(5);
    });

    it('should emit an sl-validate event when calling reportValidity', () => {
      const onValidate = spy();

      el.addEventListener('sl-validate', onValidate);
      el.reportValidity();

      expect(onValidate).to.have.been.calledOnce;
    });

    it('should emit an sl-validate event when typing text', async () => {
      const onValidate = spy();

      el.addEventListener('sl-validate', onValidate);
      el.focus();
      await sendKeys({ type: 'Lorem' });

      expect(onValidate).to.have.been.callCount(5);
    });
  });

  describe('invalid', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-text-field required></sl-text-field>`);
      input = el.querySelector('input')!;
    });

    it('should have an invalid input', () => {
      expect(input.matches(':invalid')).to.be.true;
      expect(input.validity.valid).to.be.false;
      expect(input.validity.valueMissing).to.be.true;
    });

    it('should have a validation message', () => {
      expect(el.validationMessage).to.equal('Please fill out this field.');
    });

    it('should have a custom validation message after calling setCustomValidity', () => {
      el.setCustomValidity('Custom validation message');

      expect(el.validationMessage).to.equal('Custom validation message');
    });

    it('should have a custom validation message if calling setCustomValidity in the sl-validate handler', async () => {
      el.addEventListener('sl-validate', () => el.setCustomValidity('Custom validation message'));

      el.focus();
      await sendKeys({ type: 'L' });

      expect(el.validationMessage).to.equal('Custom validation message');
    });

    it('should have a show-validity attribute when reported', async () => {
      el.reportValidity();
      await el.updateComplete;

      expect(el).to.have.attribute('show-validity', 'invalid');
    });

    it('should emit an update-validity event when reported', async () => {
      const onUpdateValidity = spy();

      el.addEventListener('sl-update-validity', onUpdateValidity);
      el.reportValidity();
      await el.updateComplete;

      expect(onUpdateValidity).to.have.been.calledOnce;
    });
  });

  describe('valid', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-text-field required value="foo"></sl-text-field>`);
      input = el.querySelector('input')!;
    });

    it('should have an valid input', () => {
      expect(input.matches(':valid')).to.be.true;
      expect(input.validity.valid).to.be.true;
      expect(input.validity.valueMissing).to.be.false;
    });

    it('should not have a validation message', () => {
      expect(el.validationMessage).to.equal('');
    });

    it('should have a valid show-validity attribute when reported and showValid is set', async () => {
      el.showValid = true;
      el.reportValidity();
      await el.updateComplete;

      expect(el).to.have.attribute('show-validity', 'valid');
    });

    it('should not show a correct icon when reported', async () => {
      el.reportValidity();
      await el.updateComplete;

      expect(el.renderRoot.querySelector('sl-icon')).not.to.exist;
    });

    it('should show a correct icon when show-valid and reported', async () => {
      el.showValid = true;
      el.reportValidity();
      await el.updateComplete;

      const icon = el.renderRoot.querySelector('sl-icon');
      expect(icon).to.exist;
      expect(icon).to.have.attribute('name', 'circle-check-solid');
    });
  });

  describe('slotted input', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-text-field>
          <input id="foo" slot="input" placeholder="I am a custom input" type="color" />
        </sl-text-field>
      `);

      input = el.querySelector('input')!;
    });

    it('should use the slotted input', () => {
      expect(el.input).to.equal(input);
    });

    it('should overwrite text field properties except for "type"', () => {
      expect(input).to.have.attribute('placeholder', '');
      expect(input.type).to.equal('color');
    });
  });

  describe('slotted prefix / suffix', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-text-field>
          <span slot="prefix">prefix example</span>
          <span slot="suffix">suffix example</span>
        </sl-text-field>
      `);
    });

    it('should use the slotted prefix', () => {
      const prefix = el.querySelector('[slot="prefix"]');

      expect(prefix).to.exist;
      expect(prefix).to.have.trimmed.text('prefix example');
    });

    it('should use the slotted suffix', () => {
      const prefix = el.querySelector('[slot="suffix"]');

      expect(prefix).to.exist;
      expect(prefix).to.have.trimmed.text('suffix example');
    });
  });
});
