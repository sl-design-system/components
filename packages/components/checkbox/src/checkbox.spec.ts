import { expect, fixture } from '@open-wc/testing';
import { type SlFormControlEvent } from '@sl-design-system/form';
import '@sl-design-system/form/register.js';
import { sendKeys } from '@web/test-runner-commands';
import { LitElement, type TemplateResult, html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { Checkbox } from './checkbox.js';

describe('sl-checkbox', () => {
  let el: Checkbox, input: HTMLInputElement;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-checkbox>Hello world</sl-checkbox>`);
      input = el.querySelector('input')!;
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should have an input of type checkbox', () => {
      expect(input).to.exist;
      expect(input.id).to.match(/sl-checkbox-(\d+)/);
      expect(input.type).to.equal('checkbox');
    });

    it('should not be checked', () => {
      expect(el.checked).not.to.be.true;
      expect(input.checked).not.to.be.true;
      expect(input).to.have.attribute('aria-checked', 'false');
      expect(input).not.to.match(':checked');
      expect(input.checked).to.be.false;
    });

    it('should be checked when set', async () => {
      el.checked = true;
      await el.updateComplete;

      expect(el).to.have.attribute('checked');
      expect(input).to.have.attribute('aria-checked', 'true');
      expect(input).to.match(':checked');
      expect(input.checked).to.be.true;
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
      expect(input).not.to.match(':indeterminate');
      expect(input.indeterminate).to.be.false;
    });

    it('should be indeterminate when set', async () => {
      el.indeterminate = true;
      await el.updateComplete;

      expect(el).to.have.attribute('indeterminate');
      expect(input).to.have.attribute('aria-checked', 'mixed');
      expect(input).to.match(':indeterminate');
      expect(input.indeterminate).to.be.true;
    });

    it('should not be required', () => {
      expect(el).not.to.have.attribute('required');
      expect(el.required).not.to.be.true;
      expect(input).not.to.have.attribute('required');
      expect(input.required).not.to.be.true;
    });

    it('should be required when set', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el).to.have.attribute('required');
      expect(input).to.have.attribute('required');
      expect(input.required).to.be.true;
    });

    it('should link the text to the input via label', () => {
      const label = el.querySelector('label');

      expect(label).to.exist;
      expect(label).to.have.text('Hello world');
      expect(label).to.have.attribute('for', input.id);
    });

    it('should be pristine', () => {
      expect(el.dirty).not.to.be.true;
    });

    it('should be dirty after clicking the checkbox', () => {
      el.click();

      expect(el.dirty).to.be.true;
    });

    it('should emit an sl-update-state event after clicking the checkbox', () => {
      const onUpdateState = spy();

      el.addEventListener('sl-update-state', onUpdateState);
      el.click();

      expect(onUpdateState).to.have.been.calledOnce;
    });

    it('should be untouched', () => {
      expect(el.touched).not.to.be.true;
    });

    it('should be touched after losing focus', async () => {
      el.focus();
      input.blur();

      await new Promise(resolve => setTimeout(resolve));

      expect(el.touched).to.be.true;
    });

    it('should emit an sl-update-state event after losing focus', async () => {
      const onUpdateState = spy();

      el.addEventListener('sl-update-state', onUpdateState);
      el.focus();
      input.blur();

      await new Promise(resolve => setTimeout(resolve));

      expect(onUpdateState).to.have.been.calledOnce;
    });

    it('should toggle the state to checked when clicking the element', async () => {
      el.click();
      await el.updateComplete;

      expect(el).to.have.attribute('checked');
      expect(el.checked).to.be.true;
      expect(input).to.have.attribute('aria-checked', 'true');
      expect(input).to.match(':checked');
      expect(input.checked).to.be.true;

      el.click();
      await el.updateComplete;

      expect(el).not.to.have.attribute('checked');
      expect(el.checked).to.be.false;
      expect(input).to.have.attribute('aria-checked', 'false');
      expect(input).not.to.match(':checked');
      expect(input.checked).to.be.false;
    });

    it('should change the state to checked on when pressing enter', async () => {
      el.focus();
      await sendKeys({ press: 'Enter' });
      await el.updateComplete;

      expect(el).to.have.attribute('checked');
      expect(el.checked).to.be.true;
      expect(input).to.have.attribute('aria-checked', 'true');
      expect(input).to.match(':checked');
      expect(input.checked).to.be.true;
    });

    it('should change the state to checked on when pressing space', async () => {
      el.focus();
      await sendKeys({ press: 'Space' });
      await el.updateComplete;

      expect(el).to.have.attribute('checked');
      expect(el.checked).to.be.true;
      expect(input).to.have.attribute('aria-checked', 'true');
      expect(input).to.match(':checked');
      expect(input.checked).to.be.true;
    });

    it('should emit an sl-change event when clicking an option', async () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      el.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(onChange).to.have.been.calledOnce;
    });

    it('should emit an sl-change event when pressing the space key on an option', async () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      el.focus();
      await sendKeys({ press: 'Space' });

      expect(onChange).to.have.been.calledOnce;
    });

    it('should emit an sl-change event when pressing the enter key on an option', async () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      el.focus();
      await sendKeys({ press: 'Enter' });

      expect(onChange).to.have.been.calledOnce;
    });

    it('should emit an sl-focus event when focusing the group', async () => {
      const onFocus = spy();

      el.addEventListener('sl-focus', onFocus);
      el.focus();
      await new Promise(resolve => setTimeout(resolve));

      expect(onFocus).to.have.been.calledOnce;
    });

    it('should emit an sl-blur event when blurring the group', () => {
      const onBlur = spy();

      el.addEventListener('sl-blur', onBlur);
      el.focus();
      input.blur();

      expect(onBlur).to.have.been.calledOnce;
    });

    it('should emit an sl-validate event when calling reportValidity', () => {
      const onValidate = spy();

      el.addEventListener('sl-validate', onValidate);
      el.reportValidity();

      expect(onValidate).to.have.been.calledOnce;
    });

    it('should emit an sl-validate event after click', async () => {
      const onValidate = spy();

      el.addEventListener('sl-validate', onValidate);
      el.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(onValidate).to.have.been.calledOnce;
    });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-checkbox disabled>Hello world</sl-checkbox>`);
      input = el.querySelector('input')!;
    });

    it('should be marked as disabled', () => {
      expect(el.disabled).to.be.true;
      expect(input.disabled).to.be.true;
      expect(input).to.have.attribute('disabled');
    });

    it('should not change the state to checked when clicked', async () => {
      el.click();
      await el.updateComplete;

      expect(el.checked).not.to.be.true;
      expect(input.checked).not.to.be.true;
    });

    it('should not change the state to checked on enter', async () => {
      el.focus();
      await sendKeys({ press: 'Enter' });
      await new Promise(resolve => setTimeout(resolve));

      expect(el.checked).not.to.be.true;
      expect(input.checked).not.to.be.true;
    });

    it('should not change the state to checked on space', async () => {
      el.focus();
      await sendKeys({ press: 'Space' });
      await new Promise(resolve => setTimeout(resolve));

      expect(el.checked).not.to.be.true;
      expect(input.checked).not.to.be.true;
    });
  });

  describe('validation', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-checkbox>Hello world</sl-checkbox>`);
    });

    it('should be invalid when required and no option is selected', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el.valid).to.be.false;
      expect(el.validity.valueMissing).to.be.true;
    });

    it('should have no validation message when valid', () => {
      expect(el.validationMessage).to.equal('');
    });

    it('should be valid when checked and required', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el.valid).to.be.false;

      el.click();
      await el.updateComplete;

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

    it('should have a validation message when unchecked and required', async () => {
      el.required = true;
      await el.updateComplete;

      // Check the localized validation message, since the native one can change
      expect(el.getLocalizedValidationMessage()).to.equal('Please check this box.');
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

      el.click();
      await el.updateComplete;

      expect(el.validationMessage).to.equal('Custom validation message');
    });
  });

  describe('form integration', () => {
    let el: FormIntegrationTestComponent;

    class FormIntegrationTestComponent extends LitElement {
      onFormControl: (event: SlFormControlEvent) => void = spy();

      override render(): TemplateResult {
        return html`
          <sl-form-field label="Label">
            <sl-checkbox @sl-form-control=${this.onFormControl}>Checkbox</sl-checkbox>
          </sl-form-field>
        `;
      }
    }

    beforeEach(async () => {
      try {
        customElements.define('form-integration-test-component', FormIntegrationTestComponent);
      } catch {
        // empty
      }

      el = await fixture(html`<form-integration-test-component></form-integration-test-component>`);
    });

    it('should emit an sl-form-control event after first render', () => {
      expect(el.onFormControl).to.have.been.calledOnce;
    });

    it('should focus the input when the label is clicked', async () => {
      const input = el.renderRoot.querySelector('input'),
        label = el.renderRoot.querySelector('label');

      label?.click();
      await el.updateComplete;

      expect(el.shadowRoot!.activeElement).to.equal(input);
    });

    it('should toggle the checkbox when the label is clicked', async () => {
      const checkbox = el.renderRoot.querySelector('sl-checkbox'),
        label = el.renderRoot.querySelector('label');

      label?.click();
      await el.updateComplete;

      expect(checkbox).to.have.attribute('checked');
      expect(checkbox?.checked).to.be.true;
    });
  });
});
