import { expect, fixture } from '@open-wc/testing';
import { type SlFormControlEvent } from '@sl-design-system/form';
import '@sl-design-system/form/register.js';
import { sendKeys } from '@web/test-runner-commands';
import { LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { spy } from 'sinon';
import '../register.js';
import { TextField } from './text-field.js';

describe('sl-text-field', () => {
  let el: TextField, input: HTMLInputElement;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-text-field></sl-text-field>`);
      input = el.querySelector('input')!;
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

    it('should not have an explicit size', () => {
      expect(el).not.to.have.attribute('size');
      expect(el.size).to.be.undefined;
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

    it('should not have a focus ring attribute', () => {
      expect(el).not.to.have.attribute('has-focus-ring');
      expect(el.hasFocusRing).not.to.be.true;
    });

    it('should have a focus ring attribute when the input has focus', async () => {
      input.focus();
      await el.updateComplete;

      expect(el).to.have.attribute('has-focus-ring');
      expect(el.hasFocusRing).to.be.true;
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

    it('should not have a custom input size', () => {
      expect(el.inputSize).to.be.undefined;
    });

    it('should have a custom input size when set', async () => {
      el.inputSize = 10;
      await el.updateComplete;

      expect(el).to.have.attribute('input-size', '10');
      expect(input).to.have.attribute('size', '10');
    });

    it('should be pristine', () => {
      expect(el.dirty).not.to.be.true;
    });

    it('should be dirty after typing in the input', async () => {
      el.focus();
      await sendKeys({ type: 'L' });

      expect(el.dirty).to.be.true;
    });

    it('should emit an sl-update-state event after typing in the input', async () => {
      const onUpdateState = spy();

      el.addEventListener('sl-update-state', onUpdateState);

      el.focus();
      await sendKeys({ type: 'L' });

      expect(onUpdateState).to.have.been.calledOnce;
    });

    it('should be untouched', () => {
      expect(el.touched).not.to.be.true;
    });

    it('should be touched after input loses focus', () => {
      input.focus();
      input.blur();

      expect(el.touched).to.be.true;
    });

    it('should emit an sl-update-state event after losing focus', () => {
      const onUpdateState = spy();

      el.addEventListener('sl-update-state', onUpdateState);

      input.focus();
      input.blur();

      expect(onUpdateState).to.have.been.calledOnce;
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

    it('should not throw an error when querying state after the element has been disconnected', () => {
      const onError = spy();

      el.remove();

      try {
        el.updateValidity();
      } catch (error) {
        onError(error);
      }

      expect(onError).not.to.have.been.called;
    });
  });

  describe('aria attributes', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-text-field aria-label="my label" aria-disabled="true"></sl-checkbox>`);
      input = el.querySelector('input')!;

      // Give time to rewrite arias
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('should have an input with proper arias', () => {
      expect(el).not.to.have.attribute('aria-label', 'my label');
      expect(el).not.to.have.attribute('aria-disabled', 'true');
      expect(input).to.have.attribute('aria-label', 'my label');
      expect(input).to.have.attribute('aria-disabled', 'true');
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

  describe('form integration', () => {
    let el: FormIntegrationTestComponent;

    class FormIntegrationTestComponent extends LitElement {
      onFormControl: (event: SlFormControlEvent) => void = spy();

      override render(): TemplateResult {
        return html`
          <sl-form>
            <sl-form-field label="Label">
              <sl-text-field @sl-form-control=${this.onFormControl}></sl-text-field>
            </sl-form-field>
          </sl-form>
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

    it('should call requestSubmit after pressing Enter in the text-field', async () => {
      const form = el.renderRoot.querySelector('sl-form')!;

      spy(form, 'requestSubmit');

      el.renderRoot.querySelector('input')?.focus();
      await sendKeys({ press: 'Enter' });

      expect(form.requestSubmit).to.have.been.calledOnce;
    });
  });

  describe('inheritance', () => {
    let el: DateField;

    class DateField extends TextField<Date> {
      #value?: Date;

      override get value(): Date | undefined {
        return this.#value;
      }

      @property()
      override set value(value: number | string | Date | undefined) {
        if (value instanceof Date) {
          this.#value = value;
        } else if (typeof value === 'number') {
          this.#value = new Date(value);
        } else if (typeof value === 'string') {
          this.#value = new Date(value);
        } else {
          this.#value = undefined;
        }
      }

      /** Parse the string value as a date using a regex, or throw an error if the value is invalid. */
      override parseValue(value: string): Date | undefined {
        const match = value.match(/^(\d{2})-(\d{2})-(\d{4})$/);

        if (!match) {
          throw new Error('Invalid date format');
        } else {
          const [, day, month, year] = match,
            date = new Date(`${year}-${month}-${day}`);

          if (isNaN(date.getTime())) {
            throw new Error('Invalid date');
          }

          return date;
        }
      }

      /** Format the date as DD-MM-YYYY. */
      override formatValue(value?: Date): string {
        return value?.toLocaleDateString() ?? '';
      }
    }

    beforeEach(async () => {
      try {
        customElements.define('test-date-field', DateField);
      } catch {
        /* empty */
      }

      el = await fixture(html`<test-date-field></test-date-field>`);
    });

    it('should format the value correctly', async () => {
      const date = new Date(2024, 0, 1);

      el.value = date;
      await el.updateComplete;

      expect(el.querySelector('input')?.value).to.equal(date.toLocaleDateString());
    });

    it('should parse the value correctly', async () => {
      el.focus();
      await sendKeys({ type: '01-01-2024' });

      expect(el.value).to.be.an.instanceof(Date);
      expect(el.value!.getFullYear()).to.equal(2024);
      expect(el.value!.getMonth()).to.equal(0);
      expect(el.value!.getDate()).to.equal(1);
    });

    it('should support setting a date in milliseconds', async () => {
      el.value = new Date(2025, 0, 1).getTime();
      await el.updateComplete;

      expect(el.querySelector('input')?.value).to.equal('1/1/2025');
    });

    it('should support setting a date as text', async () => {
      el.value = '01-01-2025';
      await el.updateComplete;

      expect(el.querySelector('input')?.value).to.equal('1/1/2025');
    });
  });
});
