import { type SlFormControlEvent } from '@sl-design-system/form';
import '@sl-design-system/form/register.js';
import { Icon } from '@sl-design-system/icon';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { LitElement, type TemplateResult, html } from 'lit';
import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
import { Switch } from './switch.js';

describe('sl-switch', () => {
  let el: Switch;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-switch></sl-switch>`);
    });

    it('should be a form-associated custom element with switch role', () => {
      expect(Switch.formAssociated).to.be.true;
      expect(el.internals.role).to.equal('switch');
    });

    it('should not be checked', () => {
      expect(el.checked).not.to.be.true;
      expect(el).not.to.match(':state(checked)');
      expect(el.internals.ariaChecked).to.equal('false');
    });

    it('should be checked when set', async () => {
      el.checked = true;
      await el.updateComplete;

      expect(el.checked).to.be.true;
      expect(el).to.match(':state(checked)');
      expect(el.internals.ariaChecked).to.equal('true');
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

    it('should not have an explicit size', () => {
      expect(el).not.to.have.attribute('size');
      expect(el.size).to.be.undefined;
    });

    it('should have a size when set', async () => {
      el.size = 'lg';
      await el.updateComplete;

      expect(el).to.have.attribute('size', 'lg');
    });

    it('should not have an icon when size is sm', async () => {
      el.size = 'sm';
      await el.updateComplete;

      expect(el.renderRoot.querySelector('sl-icon')).to.be.null;
    });

    it('should have an icon when size is md or lg', async () => {
      expect(el.renderRoot.querySelector('sl-icon')).to.exist;

      el.size = 'lg';
      await el.updateComplete;

      expect(el.renderRoot.querySelector('sl-icon')).to.exist;
    });

    it('should have no-label state when no label text is provided', () => {
      expect(el).to.match(':state(no-label)');
    });

    it('should not have no-label state when label text is provided', async () => {
      el = await fixture(html`<sl-switch>Label</sl-switch>`);

      expect(el).not.to.match(':state(no-label)');
    });

    it('should be pristine', () => {
      expect(el.dirty).not.to.be.true;
    });

    it('should be dirty after clicking the switch', () => {
      el.click();

      expect(el.dirty).to.be.true;
    });

    it('should emit an sl-update-state event after clicking', () => {
      const onUpdateState = spy();

      el.addEventListener('sl-update-state', onUpdateState);
      el.click();

      expect(onUpdateState).to.have.been.calledOnce;
    });

    it('should be untouched', () => {
      expect(el.touched).not.to.be.true;
    });

    it('should be touched after losing focus', () => {
      el.focus();
      el.blur();

      expect(el.touched).to.be.true;
    });

    it('should emit an sl-update-state event after losing focus', async () => {
      const onUpdateState = spy();

      el.addEventListener('sl-update-state', onUpdateState);
      el.focus();
      el.blur();

      await el.updateComplete;

      expect(onUpdateState).to.have.been.calledOnce;
    });

    it('should emit an sl-change event when clicking an option', async () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      el.click();
      await el.updateComplete;

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
      await el.updateComplete;

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

    it('should emit an sl-validate event when selecting an option', async () => {
      const onValidate = spy();

      el.addEventListener('sl-validate', onValidate);
      el.click();
      await el.updateComplete;

      expect(onValidate).to.have.been.calledOnce;
    });

    it('should have a blank validation message', () => {
      expect(el.validationMessage).to.equal('');
    });

    it('should have a validation message after custom validation', async () => {
      el.addEventListener('sl-validate', () => el.setCustomValidity('Custom validation message'));
      el.click();
      await el.updateComplete;

      expect(el.validationMessage).to.equal('Custom validation message');
    });

    it('should toggle the state when clicked', async () => {
      el.click();
      await el.updateComplete;

      expect(el.checked).to.equal(true);
      expect(el).to.match(':state(checked)');
      expect(el.internals.ariaChecked).to.equal('true');

      el.click();
      await el.updateComplete;

      expect(el.checked).to.equal(false);
      expect(el).not.to.match(':state(checked)');
      expect(el.internals.ariaChecked).to.equal('false');
    });

    it('should toggle the state on Enter', async () => {
      el.focus();
      await userEvent.keyboard('{Enter}');

      expect(el.checked).to.equal(true);
      expect(el).to.match(':state(checked)');
      expect(el.internals.ariaChecked).to.equal('true');

      await userEvent.keyboard('{Enter}');

      expect(el.checked).to.equal(false);
      expect(el).not.to.match(':state(checked)');
      expect(el.internals.ariaChecked).to.equal('false');
    });

    it('should toggle the state on Space', async () => {
      el.focus();
      await userEvent.keyboard('{Space}');

      expect(el.checked).to.equal(true);
      expect(el).to.match(':state(checked)');
      expect(el.internals.ariaChecked).to.equal('true');

      await userEvent.keyboard('{Space}');

      expect(el.checked).to.equal(false);
      expect(el).not.to.match(':state(checked)');
      expect(el.internals.ariaChecked).to.equal('false');
    });

    it('should support custom icons', async () => {
      el.iconOn = 'sun';
      el.iconOff = 'moon';
      await el.updateComplete;

      const icon = el.renderRoot.querySelector<Icon>('sl-icon');

      expect(icon?.name).to.equal('moon');

      el.click();
      await el.updateComplete;

      expect(icon?.name).to.equal('sun');
    });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-switch disabled></sl-switch>`);
    });

    it('should have an attribute', () => {
      expect(el).to.have.attribute('disabled');
    });

    it('should not change the state when clicked', () => {
      el.click();

      expect(el.checked).not.to.be.true;
      expect(el).not.to.match(':state(checked)');
    });

    it('should not change the state on Enter', async () => {
      el.focus();
      await userEvent.keyboard('{Enter}');

      expect(el.checked).not.to.be.true;
      expect(el).not.to.match(':state(checked)');
    });

    it('should not change the state on Space', async () => {
      el.focus();
      await userEvent.keyboard('{Space}');

      expect(el.checked).not.to.be.true;
      expect(el).not.to.match(':state(checked)');
    });
  });

  describe('checked', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-switch checked></sl-switch>`);
    });

    it('should be on when the property is set', () => {
      expect(el.checked).to.equal(true);
      expect(el).to.match(':state(checked)');
      expect(el.internals.ariaChecked).to.equal('true');
    });
  });

  describe('validation', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-switch></sl-switch>`);
    });

    it('should be valid by default', () => {
      expect(el.valid).to.be.true;
    });

    it('should be invalid when required and not checked', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el.valid).to.be.false;
    });

    it('should be valid when required and checked', async () => {
      el.required = true;
      el.checked = true;
      await el.updateComplete;

      expect(el.valid).to.be.true;
    });

    it('should have a validation message when unchecked and required', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el.getLocalizedValidationMessage()).to.equal('Please enable this switch.');
    });

    it('should have a custom validation message when it has a custom-validity attribute', async () => {
      el = await fixture(html`<sl-switch custom-validity="Custom validation message"></sl-switch>`);

      expect(el.validationMessage).to.equal('Custom validation message');
    });

    it('should have a custom validation message after calling setCustomValidity', () => {
      el.setCustomValidity('Custom validation message');

      expect(el.validationMessage).to.equal('Custom validation message');
    });
  });

  describe('form reset', () => {
    let form: HTMLFormElement;

    describe('unchecked', () => {
      beforeEach(async () => {
        form = await fixture(html`
          <form>
            <sl-switch></sl-switch>
          </form>
        `);

        el = form.firstElementChild as Switch;
      });

      it('should revert back to the initial state', async () => {
        el.click();

        await el.updateComplete;

        expect(el.checked).to.equal(true);
        expect(el).to.match(':state(checked)');
        expect(el.internals.ariaChecked).to.equal('true');

        form.reset();

        await el.updateComplete;

        expect(el.checked).to.equal(false);
        expect(el).not.to.match(':state(checked)');
        expect(el.internals.ariaChecked).to.equal('false');
      });

      it('should emit an sl-change event', async () => {
        const onChange = spy();

        el.click();
        await el.updateComplete;

        el.addEventListener('sl-change', onChange);
        form.reset();

        expect(onChange).to.have.been.calledOnce;
      });
    });

    describe('checked', () => {
      beforeEach(async () => {
        form = await fixture(html`
          <form>
            <sl-switch checked></sl-switch>
          </form>
        `);

        el = form.firstElementChild as Switch;
      });

      it('should revert back to the initial states', async () => {
        el.click();

        await el.updateComplete;

        expect(el.checked).to.equal(false);
        expect(el).not.to.match(':state(checked)');
        expect(el.internals.ariaChecked).to.equal('false');

        form.reset();

        await el.updateComplete;

        expect(el.checked).to.equal(true);
        expect(el).to.match(':state(checked)');
        expect(el.internals.ariaChecked).to.equal('true');
      });

      it('should emit an sl-change event', async () => {
        const onChange = spy();

        el.click();
        await el.updateComplete;

        el.addEventListener('sl-change', onChange);
        form.reset();

        expect(onChange).to.have.been.calledOnce;
      });
    });
  });

  describe('form integration', () => {
    let el: FormIntegrationTestComponent;

    class FormIntegrationTestComponent extends LitElement {
      onFormControl: (event: SlFormControlEvent) => void = spy();

      override render(): TemplateResult {
        return html`
          <sl-form-field label="Label">
            <sl-switch @sl-form-control=${this.onFormControl}></sl-switch>
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

    it('should toggle the switch when the label is clicked', async () => {
      const control = el.renderRoot.querySelector('sl-switch'),
        label = el.renderRoot.querySelector('label');

      label?.click();
      await el.updateComplete;

      expect(control?.checked).to.be.true;
      expect(control).to.match(':state(checked)');
    });
  });
});
