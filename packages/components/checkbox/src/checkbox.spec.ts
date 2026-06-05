import { type SlFormControlEvent } from '@sl-design-system/form';
import '@sl-design-system/form/register.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { LitElement, type TemplateResult, html } from 'lit';
import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
import { Checkbox } from './checkbox.js';

describe('sl-checkbox', () => {
  let el: Checkbox;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-checkbox>Hello world</sl-checkbox>`);
    });

    it('should be a form-associated custom element with checkbox role', () => {
      expect(Checkbox.formAssociated).to.be.true;
      expect(el.internals.role).to.equal('checkbox');
    });

    it('should not be checked', () => {
      expect(el).not.to.match(':state(checked)');
      expect(el.checked).not.to.be.true;
      expect(el.internals.ariaChecked).to.equal('false');
    });

    it('should be checked when set', async () => {
      el.checked = true;
      await el.updateComplete;

      expect(el.checked).to.be.true;
      expect(el).to.match(':state(checked)');
      expect(el.internals.ariaChecked).to.equal('true');
    });

    it('should not have an explicit size', () => {
      expect(el).not.to.have.attribute('size');
      expect(el.size).to.be.undefined;
    });

    it('should have a size when set', async () => {
      el.size = 'lg';
      await el.updateComplete;

      expect(el).to.have.attribute('size', 'lg');
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
      expect(el.indeterminate).not.to.be.true;
      expect(el).not.to.match(':state(indeterminate)');
      expect(el.internals.ariaChecked).to.equal('false');
    });

    it('should be indeterminate when set', async () => {
      el.indeterminate = true;
      await el.updateComplete;

      expect(el.indeterminate).to.be.true;
      expect(el).to.match(':state(indeterminate)');
      expect(el.internals.ariaChecked).to.equal('mixed');
    });

    it('should not be required', () => {
      expect(el.required).not.to.be.true;
      expect(el.internals.ariaRequired).to.equal('false');
    });

    it('should be required when set', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el.required).to.be.true;
      expect(el.internals.ariaRequired).to.equal('true');
    });

    it('should have no-label state when no label text is provided', async () => {
      el = await fixture(html`<sl-checkbox></sl-checkbox>`);

      expect(el).to.match(':state(no-label)');
    });

    it('should not have no-label state when label text is provided', () => {
      expect(el).not.to.match(':state(no-label)');
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
      el.blur();

      await new Promise(resolve => setTimeout(resolve));

      expect(el.touched).to.be.true;
    });

    it('should emit an sl-update-state event after losing focus', async () => {
      const onUpdateState = spy();

      el.addEventListener('sl-update-state', onUpdateState);
      el.focus();
      el.blur();

      await new Promise(resolve => setTimeout(resolve));

      expect(onUpdateState).to.have.been.calledOnce;
    });

    it('should toggle the state to checked when clicking the element', async () => {
      el.click();
      await el.updateComplete;

      expect(el.checked).to.be.true;
      expect(el).to.match(':state(checked)');

      el.click();
      await el.updateComplete;

      expect(el.checked).to.be.false;
      expect(el).not.to.match(':state(checked)');
    });

    it('should change the state to checked when pressing enter', async () => {
      el.focus();
      await userEvent.keyboard('{Enter}');
      await el.updateComplete;

      expect(el.checked).to.be.true;
      expect(el).to.match(':state(checked)');
    });

    it('should change the state to checked when pressing space', async () => {
      el.focus();
      await userEvent.keyboard('{Space}');
      await el.updateComplete;

      expect(el.checked).to.be.true;
      expect(el).to.match(':state(checked)');
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
      await userEvent.keyboard('{Space}');

      expect(onChange).to.have.been.calledOnce;
    });

    it('should emit an sl-change event when pressing the enter key on an option', async () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      el.focus();
      await userEvent.keyboard('{Enter}');

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
      el.blur();

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
    });

    it('should be marked as disabled', () => {
      expect(el).to.have.attribute('disabled');
      expect(el.disabled).to.be.true;
    });

    it('should not change the state to checked when clicked', async () => {
      el.click();
      await el.updateComplete;

      expect(el.checked).not.to.be.true;
      expect(el).not.to.match(':state(checked)');
    });

    it('should not change the state to checked on enter', async () => {
      el.focus();
      await userEvent.keyboard('{Enter}');
      await new Promise(resolve => setTimeout(resolve));

      expect(el.checked).not.to.be.true;
      expect(el).not.to.match(':state(checked)');
    });

    it('should not change the state to checked on space', async () => {
      el.focus();
      await userEvent.keyboard('{Space}');
      await new Promise(resolve => setTimeout(resolve));

      expect(el.checked).not.to.be.true;
      expect(el).not.to.match(':state(checked)');
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

    it('should toggle the checkbox when the label is clicked', async () => {
      const checkbox = el.renderRoot.querySelector('sl-checkbox'),
        label = el.renderRoot.querySelector('label');

      label?.click();
      await el.updateComplete;

      expect(checkbox?.checked).to.be.true;
      expect(checkbox).to.match(':state(checked)');
    });
  });
});
