import { expect, fixture } from '@open-wc/testing';
import { type SlFormControlEvent } from '@sl-design-system/form';
import { sendKeys } from '@web/test-runner-commands';
import { LitElement, type TemplateResult, html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { RadioGroup } from './radio-group.js';

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

    it('should be valid', () => {
      expect(el.valid).to.be.true;
    });

    it('should not have a horizontal orientation', () => {
      expect(el.horizontal).not.to.be.true;
      expect(el).not.to.have.attribute('horizontal');
    });

    it('should be horizontal when set', async () => {
      el.horizontal = true;
      await el.updateComplete;

      expect(el).to.have.attribute('horizontal');
    });

    it('should be pristine', () => {
      expect(el.dirty).not.to.be.true;
    });

    it('should be dirty after clicking on a checkbox', async () => {
      el.querySelector('sl-radio')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(el.dirty).to.be.true;
    });

    it('should be untouched', () => {
      expect(el.touched).not.to.be.true;
    });

    it('should emit an sl-update-state event after clicking the radio', async () => {
      const onUpdateState = spy();

      el.addEventListener('sl-update-state', onUpdateState);
      el.querySelector('sl-radio')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(onUpdateState).to.have.been.calledOnce;
    });

    it('should be touched after the checkbox loses focus', () => {
      const radio = el.querySelector('sl-radio');

      radio?.focus();
      radio?.blur();

      expect(el.touched).to.be.true;
    });

    it('should emit an sl-update-state event after the radio loses focus', () => {
      const radio = el.querySelector('sl-radio'),
        onUpdateState = spy();

      el.addEventListener('sl-update-state', onUpdateState);

      radio?.focus();
      radio?.blur();

      expect(onUpdateState).to.have.been.calledOnce;
    });

    it('should focus the first radio after calling focus()', () => {
      el.focus();

      expect(document.activeElement).to.equal(el.querySelector('sl-radio'));
    });

    it('should emit an sl-change event when clicking an option', async () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      el.querySelector('sl-radio')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(onChange).to.have.been.calledOnce;
    });

    it('should emit an sl-change event when pressing the space key on an option', async () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      el.querySelector('sl-radio')?.focus();
      await sendKeys({ press: 'Space' });

      expect(onChange).to.have.been.calledOnce;
    });

    it('should emit an sl-change event when pressing the enter key on an option', async () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      el.querySelector('sl-radio')?.focus();
      await sendKeys({ press: 'Enter' });

      expect(onChange).to.have.been.calledOnce;
    });

    it('should emit an sl-focus event when focusing the group', async () => {
      const onFocus = spy();

      el.addEventListener('sl-focus', onFocus);
      el.querySelector('sl-radio')?.focus();
      await new Promise(resolve => setTimeout(resolve));

      expect(onFocus).to.have.been.calledOnce;
    });

    it('should emit an sl-blur event when blurring the group', () => {
      const onBlur = spy();

      el.addEventListener('sl-blur', onBlur);
      el.querySelector('sl-radio')?.focus();
      el.querySelector('sl-radio')?.blur();

      expect(onBlur).to.have.been.calledOnce;
    });

    it('should emit an sl-validate event when calling reportValidity', () => {
      const onValidate = spy();

      el.addEventListener('sl-validate', onValidate);
      el.reportValidity();

      expect(onValidate).to.have.been.calledOnce;
    });

    it('should emit an sl-validate event when selecting an option', async () => {
      const onValidate = spy();

      el.addEventListener('sl-validate', onValidate);
      el.querySelector('sl-radio')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(onValidate).to.have.been.calledOnce;
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

  describe('validation', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-radio-group>
          <sl-radio value="1">Option 1</sl-radio>
          <sl-radio value="2">Option 2</sl-radio>
          <sl-radio value="3">Option 3</sl-radio>
        </sl-radio-group>
      `);
    });

    it('should be invalid when required and no option is selected', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el.valid).to.be.false;
    });

    it('should have no validation message when valid', () => {
      expect(el.validationMessage).to.equal('');
    });

    it('should be valid when required and an option is selected', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el.valid).to.be.false;

      el.querySelector('sl-radio')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(el.valid).to.be.true;
    });

    it('should not have a show-validity attribute when reported', async () => {
      el.reportValidity();
      await el.updateComplete;

      expect(el).not.to.have.attribute('show-validity');
    });

    it('should have an invalid show-validity attribute when required and reported', async () => {
      el.required = true;
      await el.updateComplete;

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

    it('should have a validation message when required and no option is selected', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el.validationMessage).to.equal('Please select an option.');
    });

    it('should have a custom validation message when it has a custom-validity attribute', async () => {
      el.setAttribute('custom-validity', 'Custom validation message');
      await el.updateComplete;

      expect(el.validationMessage).to.equal('Custom validation message');
    });

    it('should have a custom validation message after calling setCustomValidity', async () => {
      el.setCustomValidity('Custom validation message');
      await el.updateComplete;

      expect(el.validationMessage).to.equal('Custom validation message');
    });

    it('should have a custom validation message when calling setCustomValidity on validate', async () => {
      el.addEventListener('sl-validate', () => el.setCustomValidity('Custom validation message'));

      el.required = true;
      await el.updateComplete;

      el.querySelector('sl-radio')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(el.validationMessage).to.equal('Custom validation message');
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

  describe('form reset', () => {
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

      form.reset();

      expect(el.value).to.be.undefined;
    });

    it('should reset the checked state of the radios', () => {
      const radio = el.querySelector('sl-radio');

      radio?.click();
      form.reset();

      expect(radio).not.to.have.attribute('checked');
    });

    it('should emit an sl-change event', async () => {
      const onChange = spy();

      el.querySelector('sl-radio')?.click();
      await new Promise(resolve => setTimeout(resolve));

      el.addEventListener('sl-change', onChange);
      form.reset();

      expect(onChange).to.have.been.calledOnce;
    });
  });

  describe('form integration', () => {
    let el: FormIntegrationTestComponent;

    class FormIntegrationTestComponent extends LitElement {
      onFormControl: (event: SlFormControlEvent) => void = spy();

      override render(): TemplateResult {
        return html`
          <sl-radio-group @sl-form-control=${this.onFormControl}>
            <sl-radio>Option 1</sl-radio>
            <sl-radio>Option 2</sl-radio>
            <sl-radio>Option 3</sl-radio>
          </sl-radio-group>
        `;
      }
    }

    beforeEach(async () => {
      customElements.define('form-integration-test-component', FormIntegrationTestComponent);

      el = await fixture(html`<form-integration-test-component></form-integration-test-component>`);
    });

    it('should emit an sl-form-control event after first render', () => {
      expect(el.onFormControl).to.have.been.calledOnce;
    });
  });
});
