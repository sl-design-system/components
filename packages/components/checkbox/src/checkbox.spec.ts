import { expect, fixture } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { Checkbox } from './checkbox.js';

describe('sl-checkbox', () => {
  let el: Checkbox;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-checkbox>Hello world</sl-checkbox>`);
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should not be checked', () => {
      expect(el.checked).not.to.be.true;
      expect(el.internals.ariaChecked).not.to.equal('true');
    });

    it('should be checked when set', async () => {
      el.checked = true;
      await el.updateComplete;

      expect(el).to.have.attribute('checked');
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

    it('should not be indeterminate', () => {
      expect(el).not.to.have.attribute('indeterminate');
      expect(el.indeterminate).not.to.be.true;
      expect(el.internals.ariaChecked).not.to.equal('true');
    });

    it('should be indeterminate when set', async () => {
      el.indeterminate = true;
      await el.updateComplete;

      expect(el).to.have.attribute('indeterminate');
      expect(el.internals.ariaChecked).to.equal('mixed');
    });

    it('should not be required', () => {
      expect(el).not.to.have.attribute('required');
      expect(el.required).not.to.be.true;
      expect(el.internals.ariaRequired).not.to.equal('true');
    });

    it('should be required when set', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el).to.have.attribute('required');
      expect(el.internals.ariaRequired).to.equal('true');
    });

    it('should be pristine', () => {
      expect(el.dirty).not.to.be.true;
    });

    it('should be dirty after clicking the checkbox', () => {
      el.click();

      expect(el.dirty).to.be.true;
    });

    it('should be untouched', () => {
      expect(el.touched).not.to.be.true;
    });

    it('should be touched after the checkbox loses focus', () => {
      el.focus();
      el.blur();

      expect(el.touched).to.be.true;
    });

    it('should toggle the state to checked when clicking the element', async () => {
      el.click();
      await el.updateComplete;

      expect(el).to.have.attribute('checked');
      expect(el.checked).to.be.true;
      expect(el.internals.ariaChecked).to.equal('true');

      el.click();
      await el.updateComplete;

      expect(el).not.to.have.attribute('checked');
      expect(el.checked).to.be.false;
      expect(el.internals.ariaChecked).to.equal('false');
    });

    it('should change the state to checked on when pressing enter', async () => {
      el.focus();
      await sendKeys({ press: 'Enter' });
      await el.updateComplete;

      expect(el).to.have.attribute('checked');
      expect(el.checked).to.be.true;
      expect(el.internals.ariaChecked).to.equal('true');
    });

    it('should change the state to checked on when pressing space', async () => {
      el.focus();
      await sendKeys({ press: 'Space' });
      await el.updateComplete;

      expect(el).to.have.attribute('checked');
      expect(el.checked).to.be.true;
      expect(el.internals.ariaChecked).to.equal('true');
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
      expect(el.disabled).to.be.true;
    });

    it('should have a tabindex of -1', () => {
      const inner = el.renderRoot.querySelector('.inner');

      expect(inner).to.have.attribute('tabindex', '-1');
    });

    it('should not change the state to checked when clicked', async () => {
      el.click();
      await el.updateComplete;

      expect(el.checked).not.to.be.true;
    });

    it('should not change the state to checked on enter', async () => {
      el.focus();
      await sendKeys({ press: 'Enter' });
      await el.updateComplete;

      expect(el.checked).not.to.be.true;
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

      expect(el.validationMessage).to.equal('Please check this box.');
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

  describe('form reset', () => {
    let form: HTMLFormElement;

    describe('unchecked', () => {
      beforeEach(async () => {
        form = await fixture(html`
          <form>
            <sl-checkbox>Hello world</sl-checkbox>
          </form>
        `);

        el = form.firstElementChild as Checkbox;
      });

      it('should revert back to the initial state', () => {
        el.click();

        expect(el.checked).to.be.true;

        form.reset();

        expect(el.checked).to.equal(false);
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
            <sl-checkbox checked>Hello world</sl-checkbox>
          </form>
        `);

        el = form.firstElementChild as Checkbox;
      });

      it('should revert back to the initial state', () => {
        el.click();

        expect(el.checked).to.equal(false);

        form.reset();

        expect(el.checked).to.be.true;
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
});
