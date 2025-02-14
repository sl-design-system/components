import { expect, fixture } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { type NumberField } from './number-field.js';

describe('sl-number-field', () => {
  let el: NumberField;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-number-field></sl-search-field>`);
    });

    it('should have no buttons', () => {
      expect(el.renderRoot.querySelector('button')).not.to.exist;
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

    it('should not be readonly', () => {
      expect(el).not.to.have.attribute('readonly');
      expect(el.readonly).not.to.be.true;
    });

    it('should be readonly when set', async () => {
      el.readonly = true;
      await el.updateComplete;

      expect(el).to.have.attribute('readonly');
      expect(el.readonly).to.be.true;
    });
  });

  describe('with value', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-number-field value="10"></sl-search-field>`);
    });

    it('should have the correct initial value', () => {
      expect(el.valueAsNumber).to.equal(10);
    });

    it('should update the value when changed programmatically', async () => {
      el.valueAsNumber = 20;
      await el.updateComplete;

      expect(el.valueAsNumber).to.equal(20);
    });

    it('should reflect the value in the input element', async () => {
      const input = el.querySelector('input')!;
      expect(input.value).to.equal('10');

      el.valueAsNumber = 15;
      await el.updateComplete;

      expect(input.value).to.equal('15');
    });

    it('should be valid with a valid value', () => {
      expect(el.valid).to.be.true;
    });
  });

  describe('with buttons', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-number-field value="10"></sl-search-field>`);
    });
  });

  describe('required', () => {
    let input: HTMLInputElement;

    beforeEach(async () => {
      el = await fixture(html`<sl-number-field required></sl-text-area>`);
      input = el.querySelector('input')!;
    });

    it('should be invalid', () => {
      expect(el.valid).to.be.false;
    });

    it('should have an invalid input', () => {
      expect(input.matches(':invalid')).to.be.true;
      expect(input.validity.valid).to.be.false;
      expect(input.validity.valueMissing).to.be.true;
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

    it('should be valid after typing a number', async () => {
      el.focus();
      await sendKeys({ type: '123 ' });
      await el.updateComplete;

      expect(el.valid).to.equal(true);
    });
  });

  describe('min', () => {
    let input: HTMLInputElement;

    beforeEach(async () => {
      el = await fixture(html`<sl-number-field min="2" value="-1"></sl-text-area>`);
      input = el.querySelector('input')!;
    });

    it('should be invalid when value is greater than max', () => {
      expect(el.valid).to.be.false;
    });

    it('should have an invalid input', () => {
      expect(input.matches(':invalid')).to.be.true;
      expect(input.validity.valid).to.be.false;
      expect(input.validity.customError).to.be.true;
    });

    it('should have a validation message', () => {
      expect(input.validationMessage).to.equal('The value must be greater than or equal to 2.');
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

  describe('max', () => {
    let input: HTMLInputElement;

    beforeEach(async () => {
      el = await fixture(html`<sl-number-field max="12" value="13"></sl-text-area>`);
      input = el.querySelector('input')!;
    });

    it('should be invalid when value is greater than max', () => {
      expect(el.valid).to.be.false;
    });

    it('should have an invalid input', () => {
      expect(input.matches(':invalid')).to.be.true;
      expect(input.validity.valid).to.be.false;
      expect(input.validity.customError).to.be.true;
    });

    it('should have a validation message', () => {
      expect(input.validationMessage).to.equal('The value must be less than or equal to 12.');
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

  describe('step buttons', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-number-field step-buttons="end" value="10"></sl-number-field>`);
    });

    it('should have step buttons', () => {
      const buttons = el.renderRoot.querySelectorAll('button');
      expect(buttons).to.have.length(2);
      expect(buttons[0].getAttribute('aria-label')).to.equal('Step down');
      expect(buttons[1].getAttribute('aria-label')).to.equal('Step up');

      const icons = el.renderRoot.querySelectorAll('sl-icon');
      expect(icons).to.have.length(2);
      expect(icons[0]).to.have.attribute('name', 'minus');
    });

    it('should increase the value when step up button is clicked', async () => {
      const button = el.renderRoot.querySelector('button[aria-label="Step up"]') as HTMLButtonElement;

      expect(button).to.exist;

      button.click();
      await el.updateComplete;

      expect(el.valueAsNumber).to.equal(11);
    });

    it('should decrease the value when step down button is clicked', async () => {
      const button = el.renderRoot.querySelector('button[aria-label="Step down"]') as HTMLButtonElement;

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
      await sendKeys({ press: 'ArrowUp' });
      await el.updateComplete;

      expect(el.valueAsNumber).to.equal(11);
    });

    it('should decrease the value when ArrowDown key is pressed', async () => {
      el.focus();
      await sendKeys({ press: 'ArrowDown' });
      await el.updateComplete;

      expect(el.valueAsNumber).to.equal(9);
    });
  });

  describe('percentage', () => {
    let input: HTMLInputElement;

    beforeEach(async () => {
      el = await fixture(
        html`<sl-number-field
          value="10.809"
          .formatOptions=${{ style: 'percent', maximumFractionDigits: 2 }}
        ></sl-number-field>`
      );
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
});
