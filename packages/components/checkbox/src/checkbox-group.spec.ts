import { expect, fixture } from '@open-wc/testing';
import { type SlFormControlEvent } from '@sl-design-system/form';
import { sendKeys } from '@web/test-runner-commands';
import { LitElement, type TemplateResult, html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { CheckboxGroup } from './checkbox-group.js';

describe('sl-checkbox-group', () => {
  describe('defaults', () => {
    let el: CheckboxGroup;

    beforeEach(async () => {
      el = await fixture(html`
        <sl-checkbox-group>
          <sl-checkbox value="0">Option 1</sl-checkbox>
          <sl-checkbox value="1">Option 2</sl-checkbox>
          <sl-checkbox value="2">Option 3</sl-checkbox>
        </sl-checkbox-group>
      `);
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should not be disabled', () => {
      expect(el.disabled).to.not.be.true;
      expect(el).not.to.have.attribute('disabled');
    });

    it('should be disabled if set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el.disabled).to.be.true;
      expect(el).to.have.attribute('disabled');
    });

    it('should disable all checkboxes if set', async () => {
      el.disabled = true;
      await el.updateComplete;

      const allDisabled = Array.from(el.querySelectorAll('sl-checkbox')).every(c => c.disabled);

      expect(allDisabled).to.be.true;
    });

    it('should be valid', () => {
      expect(el.valid).to.equal(true);
    });

    it('should be invalid when required', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el.valid).to.equal(false);
      expect(el.validity.valueMissing).to.equal(true);
    });

    it('should be valid when required and checked', async () => {
      el.required = true;
      await el.updateComplete;

      el.querySelector('sl-checkbox')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(el.valid).to.equal(true);
      expect(el.validity.valueMissing).to.equal(false);
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

    it('should check the boxes when setting the value', async () => {
      el.value = ['0', '1'];
      await el.updateComplete;

      const boxes = el.querySelectorAll('sl-checkbox');

      expect(boxes[0]).to.have.attribute('checked');
      expect(boxes[1]).to.have.attribute('checked');
      expect(boxes[2]).not.to.have.attribute('checked');
    });

    it('should be pristine', () => {
      expect(el.dirty).not.to.be.true;
    });

    it('should be dirty after clicking on a checkbox', async () => {
      el.querySelector('sl-checkbox')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(el.dirty).to.be.true;
    });

    it('should be untouched', () => {
      expect(el.touched).not.to.be.true;
    });

    it('should emit an sl-update-state event after clicking the checkbox', async () => {
      const onUpdateState = spy();

      el.addEventListener('sl-update-state', onUpdateState);

      el.querySelector('sl-checkbox')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(onUpdateState).to.have.been.calledTwice;
    });

    it('should be touched after the checkbox loses focus', () => {
      const checkbox = el.querySelector('sl-checkbox');

      checkbox?.focus();
      checkbox?.blur();

      expect(el.touched).to.be.true;
    });

    it('should emit an sl-update-state event after the checkbox loses focus', () => {
      const checkbox = el.querySelector('sl-checkbox'),
        onUpdateState = spy();

      el.addEventListener('sl-update-state', onUpdateState);

      checkbox?.focus();
      checkbox?.blur();

      expect(onUpdateState).to.have.been.calledTwice;
    });

    it('should focus the first checkbox after calling focus()', () => {
      el.focus();

      expect(document.activeElement).to.equal(el.querySelector('sl-checkbox'));
    });

    it('should emit an sl-update-validity event when calling reportValidity', async () => {
      const onUpdateValidity = spy();

      el.addEventListener('sl-update-validity', onUpdateValidity);
      el.reportValidity();
      await el.updateComplete;

      expect(onUpdateValidity).to.have.been.callCount(4);
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
      el.querySelector('sl-checkbox')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(onValidate).to.have.been.calledOnce;
    });

    it('should not have a validation message', () => {
      expect(el.validationMessage).to.equal('');
    });

    it('should have a validation message when required and no option is checked', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el.validationMessage).to.equal('Please check at least one option.');
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

      el.querySelector('sl-checkbox')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(el.validationMessage).to.equal('Custom validation message');
    });

    it('should propagate the group size to the checkboxes', async () => {
      el.size = 'lg';
      await el.updateComplete;

      const allLarge = Array.from(el.querySelectorAll('sl-checkbox')).every(c => c.size === 'lg');

      expect(allLarge).to.be.true;
    });

    it('should handle navigating between options correctly', async () => {
      expect(el.boxes?.[0].checked).not.to.equal(true);
      expect(el.boxes?.[0].tabIndex).to.equal(0);
      expect(el.boxes?.[1].checked).not.to.equal(true);
      expect(el.boxes?.[1].tabIndex).to.equal(-1);

      el.boxes?.[0]?.focus();
      await sendKeys({ press: 'Space' });

      expect(el.boxes?.[0].checked).to.equal(true);
      expect(el.boxes?.[1].checked).not.to.equal(true);

      await sendKeys({ press: 'ArrowRight' });
      await sendKeys({ press: 'Enter' });

      expect(el.boxes?.[0].checked).to.equal(true);
      expect(el.boxes?.[1].checked).to.equal(true);
    });
  });

  describe('form integration', () => {
    let el: FormIntegrationTestComponent;

    class FormIntegrationTestComponent extends LitElement {
      onFormControl: (event: SlFormControlEvent) => void = spy();

      override render(): TemplateResult {
        return html`
          <sl-checkbox-group @sl-form-control=${this.onFormControl}>
            <sl-checkbox>Option 1</sl-checkbox>
            <sl-checkbox>Option 2</sl-checkbox>
            <sl-checkbox>Option 3</sl-checkbox>
          </sl-checkbox-group>
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
