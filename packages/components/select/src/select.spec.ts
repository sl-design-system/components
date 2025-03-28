import { expect, fixture } from '@open-wc/testing';
import { type SlFormControlEvent } from '@sl-design-system/form';
import '@sl-design-system/form/register.js';
import '@sl-design-system/listbox/register.js';
import { sendKeys } from '@web/test-runner-commands';
import { LitElement, type TemplateResult, html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { SelectButton } from './select-button.js';
import { Select } from './select.js';

describe('sl-select', () => {
  let el: Select, button: SelectButton;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-select>
          <sl-option value="1">Option 1</sl-option>
          <sl-option value="2">Option 2</sl-option>
          <sl-option value="3">Option 3</sl-option>
        </sl-select>
      `);

      button = el.querySelector('sl-select-button')!;
    });

    it('should have a button', () => {
      expect(button).to.exist;
    });

    it('should have a tabindex of 0', () => {
      expect(button).to.have.attribute('tabindex', '0');
    });

    it('should not be disabled', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el.disabled).not.to.be.true;
      expect(button).not.to.have.attribute('disabled');
    });

    it('should be disabled when set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.have.attribute('disabled');
      expect(el.disabled).to.be.true;
      expect(button).to.have.attribute('disabled');
    });

    it('should have a placeholder when set', async () => {
      el.placeholder = 'Placeholder';
      await el.updateComplete;

      expect(button.renderRoot).to.have.trimmed.text('Placeholder');
    });

    it('should not be required', () => {
      expect(el).not.to.have.attribute('required');
      expect(el.required).not.to.be.true;
      expect(el.internals.ariaRequired).not.to.equal('true');
      expect(button).not.to.have.attribute('aria-required');
    });

    it('should be required when set', async () => {
      el.required = true;
      await new Promise(resolve => setTimeout(resolve));

      expect(el).to.have.attribute('required');
      expect(el.internals.ariaRequired).to.equal('true');
      expect(button).to.have.attribute('aria-required', 'true');
    });

    it('should be valid by default', () => {
      expect(el.valid).to.be.true;
    });

    it('should be invalid when required', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el.valid).to.be.false;
      expect(el.validity.valueMissing).to.be.true;
    });

    it('should have a listbox part', () => {
      expect(el.renderRoot.querySelector('[role="listbox"]')).to.have.attribute('part', 'listbox');
    });

    it('should not have a value', () => {
      expect(el.value).to.be.undefined;
    });

    it('should have set aria-selected to false on all options', () => {
      const allNotSelected = Array.from(el.querySelectorAll('sl-option')).every(
        option => option.getAttribute('aria-selected') === 'false'
      );

      expect(allNotSelected).to.be.true;
    });

    it('should have a selected option after setting a value', async () => {
      el.value = '2';
      await el.updateComplete;

      expect(el.querySelector('sl-option[value="2"]')).to.have.attribute('aria-selected', 'true');
    });

    it('should have a value after selection', async () => {
      const button = el.querySelector('sl-select-button') as SelectButton;

      button?.click();
      await el.updateComplete;

      el.querySelector('sl-option')?.click();
      await el.updateComplete;

      expect(el.value).to.equal('1');
    });

    it('should be pristine', () => {
      expect(el.dirty).not.to.be.true;
    });

    it('should be dirty after clicking an option', async () => {
      el.querySelector<SelectButton>('sl-select-button')?.click();
      await el.updateComplete;

      el.querySelector('sl-option')?.click();
      await el.updateComplete;

      expect(el.dirty).to.be.true;
    });

    it('should emit an sl-update-state event after clicking an option', async () => {
      const onUpdateState = spy();

      el.addEventListener('sl-update-state', onUpdateState);

      el.querySelector<SelectButton>('sl-select-button')?.click();
      await el.updateComplete;

      el.querySelector('sl-option')?.click();
      await el.updateComplete;

      expect(onUpdateState).to.have.been.calledOnce;
    });

    it('should be untouched', () => {
      expect(el.touched).not.to.be.true;
    });

    it('should be touched after losing focus', () => {
      el.focus();
      el.dispatchEvent(new Event('focusout'));

      expect(el.touched).to.be.true;
    });

    it('should emit an sl-update-state event after losing focus', () => {
      const onUpdateState = spy();

      el.addEventListener('sl-update-state', onUpdateState);
      el.focus();
      el.dispatchEvent(new Event('focusout'));

      expect(onUpdateState).to.have.been.calledOnce;
    });

    it('should emit an sl-change event when selecting an option', async () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);

      el.querySelector<SelectButton>('sl-select-button')?.click();
      await el.updateComplete;

      el.querySelector('sl-option')?.click();
      await el.updateComplete;

      expect(onChange).to.have.been.calledOnce;
    });

    it('should delegate focus to the button when focusing the select', () => {
      el.focus();

      expect(document.activeElement).to.equal(el.querySelector('sl-select-button'));
    });

    it('should emit an sl-focus event when focusing the select', async () => {
      const onFocus = spy();

      el.addEventListener('sl-focus', onFocus);
      el.focus();
      await el.updateComplete;

      expect(onFocus).to.have.been.calledOnce;
    });

    it('should emit an sl-blur event when blurring the select', () => {
      const onBlur = spy();

      el.addEventListener('sl-blur', onBlur);
      el.focus();
      el.querySelector<HTMLElement>('sl-select-button')?.blur();

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
      el.querySelector('sl-option')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(onValidate).to.have.been.calledOnce;
    });

    it('should mark an option as selected if it has the same value', async () => {
      el.value = '2';
      await el.updateComplete;

      expect(el.querySelector('sl-option[value="2"]')).to.have.attribute('selected');
    });
  });

  describe('groups', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-select>
          <sl-option-group label="Group 1">
            <sl-option value="1">Option 1</sl-option>
            <sl-option value="2">Option 2</sl-option>
            <sl-option value="3">Option 3</sl-option>
          </sl-option-group>
          <sl-option-group label="Group 2">
            <sl-option value="4">Option 4</sl-option>
          </sl-option-group>
        </sl-select>
      `);

      button = el.querySelector('sl-select-button')!;
    });

    it('should handle keyboard navigation across all nested options', async () => {
      button.focus();
      await sendKeys({ press: 'ArrowDown' });
      await el.updateComplete;

      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'Enter' });
      await el.updateComplete;

      expect(el.value).to.equal('4');
    });

    it('should be able to navigate options that were added later', async () => {
      button.focus();
      await sendKeys({ press: 'ArrowDown' });
      await el.updateComplete;

      const option = document.createElement('sl-option');
      option.innerText = 'Option 5';
      option.value = '5';

      el.querySelector<HTMLElement>('sl-option-group:last-of-type')!.appendChild(option);

      // Give the MutationObserver time to fire
      await new Promise(resolve => setTimeout(resolve, 50));

      await sendKeys({ press: 'ArrowUp' });
      await sendKeys({ press: 'Enter' });
      await el.updateComplete;

      expect(el.value).to.equal('5');
    });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-select disabled>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
        </sl-select>
      `);
    });

    it('should be marked as disabled', () => {
      expect(el.disabled).to.be.true;
    });

    it('should have a tabindex of -1', () => {
      expect(el.querySelector('sl-select-button')).to.have.attribute('tabindex', '-1');
    });

    it('should not toggle the expanded state when clicked', async () => {
      const button = el.querySelector<SelectButton>('sl-select-button');

      button?.click();
      await el.updateComplete;

      expect(button).to.have.attribute('aria-expanded', 'false');
    });

    it('should not toggle the expanded state on enter', async () => {
      const button = el.querySelector<SelectButton>('sl-select-button');

      button?.focus();
      await sendKeys({ press: 'Enter' });
      await el.updateComplete;

      expect(button).to.have.attribute('aria-expanded', 'false');
    });
  });

  describe('required', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-select required>
          <sl-option value="1">Option 1</sl-option>
          <sl-option value="2">Option 2</sl-option>
          <sl-option value="3">Option 3</sl-option>
        </sl-select>
      `);
    });

    it('should be invalid', () => {
      expect(el.valid).to.be.false;
    });

    it('should be valid when an option is selected', async () => {
      el.querySelector<SelectButton>('sl-select-button')?.click();
      await el.updateComplete;

      el.querySelector('sl-option')?.click();
      await el.updateComplete;

      expect(el.valid).to.be.true;
    });

    it('should be valid after setting a value', async () => {
      el.value = '2';
      await el.updateComplete;

      expect(el.valid).to.be.true;
    });

    it('should have a validation message', () => {
      expect(el.validationMessage).to.equal('Please choose an option from the list.');
    });

    it('should have an invalid show-validity attribute when reported', async () => {
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

      el.querySelector<SelectButton>('sl-select-button')?.click();
      await el.updateComplete;

      el.querySelector('sl-option')?.click();
      await el.updateComplete;

      expect(el.validationMessage).to.equal('Custom validation message');
    });
  });

  describe('form reset', () => {
    let form: HTMLFormElement;

    describe('selected', () => {
      beforeEach(async () => {
        form = await fixture(html`
          <form>
            <sl-select value="2">
              <sl-option value="1">Option 1</sl-option>
              <sl-option value="2">Option 2</sl-option>
              <sl-option value="3">Option 3</sl-option>
            </sl-select>
          </form>
        `);

        el = form.firstElementChild as Select;
      });

      it('should revert back to the initial state', async () => {
        el.querySelector<SelectButton>('sl-select-button')?.click();
        await el.updateComplete;

        el.querySelector('sl-option')?.click();
        await el.updateComplete;

        expect(el.value).to.equal('1');

        form.reset();

        expect(el.value).to.equal('2');
      });

      it('should emit an sl-change event', async () => {
        const onChange = spy();

        el.querySelector<SelectButton>('sl-select-button')?.click();
        await el.updateComplete;

        el.querySelector('sl-option')?.click();
        await el.updateComplete;

        el.addEventListener('sl-change', onChange);
        form.reset();

        expect(onChange).to.have.been.calledOnce;
      });
    });

    describe('unselected', () => {
      beforeEach(async () => {
        form = await fixture(html`
          <form>
            <sl-select>
              <sl-option value="1">Option 1</sl-option>
              <sl-option value="2">Option 2</sl-option>
              <sl-option value="3">Option 3</sl-option>
            </sl-select>
          </form>
        `);

        el = form.firstElementChild as Select;
      });

      it('should revert back to the correct initial state when the form is reset', async () => {
        el.querySelector<SelectButton>('sl-select-button')?.click();
        await el.updateComplete;

        el.querySelector('sl-option')?.click();
        await el.updateComplete;

        expect(el.value).to.equal('1');

        form.reset();

        expect(el.value).to.be.undefined;
      });

      it('should emit an sl-change event', async () => {
        const onChange = spy();

        el.querySelector<SelectButton>('sl-select-button')?.click();
        await el.updateComplete;

        el.querySelector('sl-option')?.click();
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
            <sl-select @sl-form-control=${this.onFormControl}>
              <sl-option>Option 1</sl-option>
              <sl-option>Option 2</sl-option>
              <sl-option>Option 3</sl-option>
            </sl-select>
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

    it('should focus the button when the label is clicked', async () => {
      const button = el.renderRoot.querySelector('sl-select-button'),
        label = el.renderRoot.querySelector('label');

      label?.click();
      await el.updateComplete;

      expect(el.shadowRoot!.activeElement).to.equal(button);
    });
  });

  describe('keyboard interactions', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-select>
          <sl-option value="1">Option 1</sl-option>
          <sl-option value="2">Option 2</sl-option>
          <sl-option value="3">Option 3</sl-option>
        </sl-select>
      `);

      button = el.querySelector('sl-select-button')!;
    });

    it('should open the popover on ArrowDown key', async () => {
      button.focus();
      await sendKeys({ press: 'ArrowDown' });
      await el.updateComplete;

      expect(button).to.have.attribute('aria-expanded', 'true');
    });

    it('should close the popover on Escape key', async () => {
      button.focus();
      await sendKeys({ press: 'Enter' });
      await el.updateComplete;

      await sendKeys({ press: 'Escape' });
      await el.updateComplete;

      expect(button).to.have.attribute('aria-expanded', 'false');
    });

    it('should close the popover when focus leaves the select', async () => {
      const listbox = el.renderRoot.querySelector('sl-listbox');

      button.focus();
      await sendKeys({ press: 'ArrowDown' });
      await el.updateComplete;

      expect(listbox).to.match(':popover-open');

      await sendKeys({ press: 'Tab' });
      await el.updateComplete;

      expect(listbox).not.to.match(':popover-open');
    });

    it('should focus the button after the popover closes', async () => {
      button.focus();

      // Open popover
      await sendKeys({ press: 'ArrowDown' });

      // Select the first option
      await sendKeys({ press: 'Enter' });

      expect(document.activeElement).to.equal(button);
    });

    it('should navigate options with ArrowDown key', async () => {
      button.focus();
      await sendKeys({ press: 'ArrowDown' });
      await el.updateComplete;

      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'Enter' });
      await el.updateComplete;

      const selectedOption = el.querySelectorAll('sl-option')[1];

      expect(selectedOption).to.have.attribute('selected');
      expect(selectedOption).to.have.attribute('aria-selected', 'true');
    });

    it('should be able to navigate options that were added later', async () => {
      button.focus();
      await sendKeys({ press: 'ArrowDown' });
      await el.updateComplete;

      el.appendChild(document.createElement('sl-option')).innerText = 'Option 4';

      // Give the MutationObserver time to fire
      await new Promise(resolve => setTimeout(resolve, 50));

      await sendKeys({ press: 'ArrowUp' });
      await sendKeys({ press: 'Enter' });
      await el.updateComplete;

      const selectedOption = el.querySelectorAll('sl-option')[3];

      expect(selectedOption).to.have.attribute('selected');
      expect(selectedOption).to.have.attribute('aria-selected', 'true');
    });
  });
});
