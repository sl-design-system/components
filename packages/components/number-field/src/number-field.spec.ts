import { fixture } from '@sl-design-system/vitest-browser-lit';
import { userEvent } from '@vitest/browser/context';
import { html } from 'lit';
import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { type NumberField } from './number-field.js';

describe('sl-number-field', () => {
  let el: NumberField;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-number-field></sl-number-field>`);
    });

    it('should have no buttons', () => {
      expect(el.renderRoot.querySelector('sl-field-button')).not.to.exist;
    });

    it('should not be disabled', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el.disabled).not.to.be.true;
    });

    it('should be disabled when set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.have.attribute('disabled');
    });

    it('should have a numeric inputmode', () => {
      expect(el.querySelector('input')).to.have.attribute('inputmode', 'numeric');
    });

    it('should not have a placeholder', () => {
      expect(el.placeholder).to.be.undefined;
      expect(el.querySelector('input')).to.not.have.attribute('placeholder');
    });

    it('should have a placeholder when set', async () => {
      el.placeholder = 'Enter a number';
      await el.updateComplete;

      expect(el.querySelector('input')).to.have.attribute('placeholder', 'Enter a number');
    });

    it('should not be readonly', () => {
      expect(el).not.to.have.attribute('readonly');
      expect(el.readonly).not.to.be.true;
    });

    it('should be readonly when set', async () => {
      el.readonly = true;
      await el.updateComplete;

      expect(el).to.have.attribute('readonly');
    });

    it('should emit an sl-change event when typing', async () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      el.input.focus();
      await userEvent.keyboard('100');

      expect(onChange).to.have.been.calledThrice;
    });

    it('should emit an sl-change event when using the up/down arrow keys', async () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      el.focus();
      await userEvent.keyboard('{ArrowUp}');
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{ArrowUp}');

      expect(onChange).to.have.been.calledThrice;
    });

    it('should emit an sl-validate event when typing', async () => {
      const onValidate = spy();

      el.addEventListener('sl-validate', onValidate);
      el.input.focus();
      await userEvent.keyboard('100');

      expect(onValidate).to.have.been.calledThrice;
    });

    it('should emit an sl-validate event when using the up/down arrow keys', async () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      el.focus();
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{ArrowUp}');
      await userEvent.keyboard('{ArrowDown}');

      expect(onChange).to.have.been.calledThrice;
    });

    it('should not format the value while typing', async () => {
      el.input.focus();
      await userEvent.keyboard('1000');
      await el.updateComplete;

      expect(el.input.value).to.equal('1000');
    });

    it('should format the value on blur', async () => {
      el.input.focus();
      await userEvent.keyboard('1000');

      el.input.blur();
      await el.updateComplete;

      expect(el.input.value).to.equal('1,000');
    });
  });

  describe('with value', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-number-field value="1000"></sl-number-field>`);
    });

    it('should have the correct initial value', () => {
      expect(el.value).to.equals('1000');
    });

    it('should have the correct initial value as number', () => {
      expect(el.valueAsNumber).to.equal(1000);
    });

    it('should show the formatted initial value', () => {
      expect(el.input.value).to.equal('1,000');
    });

    it('should show the formatted valueAsNumber when changed programmatically', async () => {
      el.valueAsNumber = 2000;
      await el.updateComplete;

      expect(el.input.value).to.equal('2,000');
    });

    it('should show the formatted value when changed programmatically', async () => {
      el.value = '2000';
      await el.updateComplete;

      expect(el.input.value).to.equal('2,000');
    });

    it('should update the formatted value after typing and leaving the field', async () => {
      el.input.focus();
      await userEvent.keyboard('{ArrowRight}');
      await userEvent.keyboard('123');
      el.input.blur();
      await el.updateComplete;

      expect(el.input.value).to.equal('1,000,123');
      expect(el.valid).to.be.true;
    });

    it('should be valid with a valid value', () => {
      expect(el.valid).to.be.true;
    });
  });

  describe('required', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-number-field required></sl-number-field>`);
    });

    it('should be invalid', () => {
      expect(el.valid).to.be.false;
    });

    it('should be valid after typing a number', async () => {
      el.focus();
      await userEvent.keyboard('1 ');
      await el.updateComplete;

      expect(el.valid).to.be.true;
    });

    it('should be valid after pressing the arrow down key', async () => {
      el.focus();
      await userEvent.keyboard('{ArrowDown}');
      await el.updateComplete;

      expect(el.valid).to.be.true;
    });

    it('should be valid after pressing the arrow up key', async () => {
      el.focus();
      await userEvent.keyboard('{ArrowUp}');
      await el.updateComplete;

      expect(el.valid).to.be.true;
    });

    it('should indicate that a value is missing', () => {
      expect(el.validationMessage).to.equal('Please fill out this field.');
      expect(el.input.matches(':invalid')).to.be.true;
      expect(el.input.validity.valid).to.be.false;
      expect(el.input.validity.valueMissing).to.be.true;
    });

    it('should indicate a custom error when the value is not a valid number', async () => {
      el.input.focus();
      await userEvent.keyboard('asdf');
      await el.updateComplete;

      el.input.blur();
      await el.updateComplete;

      expect(el.validationMessage).to.equal('Please enter a valid number.');
      expect(el.input.matches(':invalid')).to.be.true;
      expect(el.input.validity.customError).to.be.true;
      expect(el.input.validity.valid).to.be.false;
      expect(el.input.validity.valueMissing).to.be.false;
    });

    it('should not have a show-validity attribute until reported', async () => {
      expect(el).not.to.have.attribute('show-validity');

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

  describe('min', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-number-field min="2" value="-1"></sl-number-field>`);
    });

    it('should be invalid when value is lower than min', () => {
      expect(el.valid).to.be.false;
    });

    it('should have an invalid input', () => {
      expect(el.input.matches(':invalid')).to.be.true;
      expect(el.input.validity.valid).to.be.false;
      expect(el.input.validity.customError).to.be.true;
    });

    it('should have a validation message', () => {
      expect(el.input.validationMessage).to.equal('The value must be greater than or equal to 2.');
    });
  });

  describe('max', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-number-field max="12" value="13"></sl-number-field>`);
    });

    it('should be invalid when value is greater than max', () => {
      expect(el.valid).to.be.false;
    });

    it('should have an invalid input', () => {
      expect(el.input.matches(':invalid')).to.be.true;
      expect(el.input.validity.valid).to.be.false;
      expect(el.input.validity.customError).to.be.true;
    });

    it('should have a validation message', () => {
      expect(el.input.validationMessage).to.equal('The value must be less than or equal to 12.');
    });
  });

  describe('step buttons', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-number-field step-buttons="end" value="10"></sl-number-field>`);
    });

    it('should have step buttons', () => {
      const buttons = el.renderRoot.querySelectorAll('sl-field-button');
      expect(buttons).to.have.length(2);
      expect(buttons[0].getAttribute('aria-label')).to.equal('Step down');
      expect(buttons[1].getAttribute('aria-label')).to.equal('Step up');

      const icons = el.renderRoot.querySelectorAll('sl-icon');
      expect(icons).to.have.length(2);
      expect(icons[0]).to.have.attribute('name', 'minus');
    });

    it('should increase the value when step up button is clicked', async () => {
      const button = el.renderRoot.querySelector('sl-field-button[aria-label="Step up"]') as HTMLButtonElement;

      expect(button).to.exist;

      button.click();
      await el.updateComplete;

      expect(el.valueAsNumber).to.equal(11);
    });

    it('should decrease the value when step down button is clicked', async () => {
      const button = el.renderRoot.querySelector('sl-field-button[aria-label="Step down"]') as HTMLButtonElement;

      expect(button).to.exist;

      button.click();
      await el.updateComplete;

      expect(el.valueAsNumber).to.equal(9);
    });
  });

  describe('step up and down with arrow keys', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-number-field value="10" step="1"></sl-number-field>`);
    });

    it('should increase the value when ArrowUp key is pressed', async () => {
      el.focus();
      await userEvent.keyboard('{ArrowUp}');
      await el.updateComplete;

      expect(el.valueAsNumber).to.equal(11);
    });

    it('should decrease the value when ArrowDown key is pressed', async () => {
      el.focus();
      await userEvent.keyboard('{ArrowDown}');
      await el.updateComplete;

      expect(el.valueAsNumber).to.equal(9);
    });

    it('should not change the value when readonly', async () => {
      el.readonly = true;
      await el.updateComplete;

      el.focus();
      await userEvent.keyboard('{ArrowUp}');
      await userEvent.keyboard('{ArrowUp}');
      await userEvent.keyboard('{ArrowDown}');
      await el.updateComplete;

      expect(el.valueAsNumber).to.equal(10);
    });
  });

  describe('percentage', () => {
    let input: HTMLInputElement;

    beforeEach(async () => {
      el = await fixture(html`
        <sl-number-field
          value="10.809"
          .formatOptions=${{ style: 'percent', maximumFractionDigits: 2 }}
        ></sl-number-field>
      `);
      input = el.querySelector('input')!;
    });

    it('should have a proper value with percentage', () => {
      expect(input.value).to.equal('10.81%');
    });

    it('should have a valid input', () => {
      expect(input.matches(':invalid')).to.be.false;
      expect(input.validity.valid).to.be.true;
    });
  });

  describe('validation', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-number-field></sl-number-field>`);
    });

    it('should toggle the validation message when the number becomes (in)valid', async () => {
      el.valueAsNumber = NaN;
      await el.updateComplete;

      expect(el.validationMessage).to.equal('Please enter a valid number.');

      el.focus();
      await userEvent.keyboard('123');

      expect(el.validationMessage).to.equal('');
    });
  });
});
