import { expect, fixture } from '@open-wc/testing';
import { type SlFormControlEvent } from '@sl-design-system/form';
import { sendKeys } from '@web/test-runner-commands';
import { LitElement, type TemplateResult, html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { TextArea } from './text-area.js';

describe('sl-text-area', () => {
  let el: TextArea, textArea: HTMLTextAreaElement;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-text-area></sl-text-area>`);
      textArea = el.querySelector('textarea')!;
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should have a textarea slot', () => {
      const slot = el.renderRoot.querySelector('slot[name="textarea"]');

      expect(slot).to.exist;
    });

    it('should be valid', () => {
      expect(el.valid).to.be.true;
    });

    it('should not be disabled', () => {
      expect(el.disabled).not.to.be.true;
      expect(el).not.to.have.attribute('disabled');
      expect(el.querySelector('textarea')?.disabled).to.be.false;
    });

    it('should be disabled if set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.have.attribute('disabled');
      expect(el.querySelector('textarea')?.disabled).to.be.true;
    });

    it('should not be required', () => {
      expect(el.required).not.to.be.true;
      expect(el.querySelector('textarea')?.required).to.be.false;
    });

    it('should be required if set', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el.querySelector('textarea')?.required).to.be.true;
    });

    it('should not have a value', () => {
      expect(el.value).to.equal('');
      expect(el.querySelector('textarea')?.value).to.equal('');
    });

    it('should have a value when set', async () => {
      el.value = 'my value';
      await el.updateComplete;

      expect(el.querySelector('textarea')?.value).to.equal('my value');
    });

    it('should have a value after typing', async () => {
      el.focus();
      await sendKeys({ type: 'Lorem' });
      await el.updateComplete;

      expect(el.value).to.equal('Lorem');
      expect(el.querySelector('textarea')?.value).to.equal('Lorem');
    });

    it('should have a medium size', () => {
      expect(el).to.have.attribute('size', 'md');
      expect(el.size).to.equal('md');
    });

    it('should have a large size when set', async () => {
      el.size = 'lg';
      await el.updateComplete;

      expect(el).to.have.attribute('size', 'lg');
    });

    it('should have a wrap property of soft', () => {
      expect(el.wrap).to.equal('soft');
      expect(el.querySelector('textarea')?.wrap).to.equal('soft');
    });

    it('should have a wrap property of hard when set', async () => {
      el.wrap = 'hard';
      await el.updateComplete;

      expect(el.querySelector('textarea')?.wrap).to.equal('hard');
    });

    it('should not be readonly', () => {
      expect(el.readonly).not.to.be.true;
      expect(el.querySelector('textarea')?.readOnly).to.be.false;
    });

    it('should be readonly when set', async () => {
      el.readonly = true;
      await el.updateComplete;

      expect(el.querySelector('textarea')?.readOnly).to.be.true;
    });

    it('should have autocomplete turned off', () => {
      expect(el.querySelector('textarea')?.autocomplete).to.equal('off');
    });

    it('should have an autocomplete when set', async () => {
      el.autocomplete = 'username';
      await el.updateComplete;

      expect(el.querySelector('textarea')?.autocomplete).to.equal('username');
    });

    it('should not have a placeholder by default', () => {
      expect(el).not.to.have.attribute('placeholder');
      expect(el.placeholder).to.be.undefined;
    });

    it('should have a placeholder when set', async () => {
      el.placeholder = 'my placeholder';
      await el.updateComplete;

      expect(el.querySelector('textarea')?.placeholder).to.equal('my placeholder');
    });

    it('should not have a minlength by default', () => {
      expect(el).not.to.have.attribute('minlength');
      expect(el.minLength).to.be.undefined;
    });

    it('should have a minlength when set', async () => {
      el.minLength = 2;
      await el.updateComplete;

      expect(el.querySelector('textarea')?.minLength).to.equal(2);
    });

    it('should not have a maxlength by default', () => {
      expect(el).not.to.have.attribute('maxlength');
      expect(el.maxLength).to.be.undefined;
    });

    it('should have a maxlength when set', async () => {
      el.maxLength = 2;
      await el.updateComplete;

      expect(el.querySelector('textarea')?.maxLength).to.equal(2);
    });

    it('should resize vertically', () => {
      expect(el).to.have.attribute('resize', 'vertical');
      expect(el.resize).to.equal('vertical');
    });

    it('should resize automatically when set', async () => {
      el.resize = 'auto';
      await el.updateComplete;

      expect(el).to.have.attribute('resize', 'auto');
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

    it('should be touched after textarea loses focus', () => {
      textArea.focus();
      textArea.blur();

      expect(el.touched).to.be.true;
    });

    it('should emit an sl-update-state event after losing focus', () => {
      const onUpdateState = spy();

      el.addEventListener('sl-update-state', onUpdateState);

      textArea.focus();
      textArea.blur();

      expect(onUpdateState).to.have.been.calledOnce;
    });

    it('should focus the textarea when focusing the element', () => {
      el.focus();

      expect(document.activeElement).to.equal(textArea);
    });

    it('should emit an sl-focus event when focusing the input', () => {
      const onFocus = spy();

      el.addEventListener('sl-focus', onFocus);
      textArea.focus();

      expect(onFocus).to.have.been.calledOnce;
    });

    it('should emit an sl-blur event when blurring the input', async () => {
      const onBlur = spy();

      el.addEventListener('sl-blur', onBlur);
      textArea.focus();
      await sendKeys({ press: 'Tab' });

      expect(onBlur).to.have.been.calledOnce;
    });

    it('should emit an sl-change event when typing in the input', async () => {
      const onInput = spy();

      el.addEventListener('sl-change', onInput);
      textArea.focus();
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
  });

  describe('required', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-text-area required></sl-text-area>`);
    });

    it('should be invalid', () => {
      expect(el.valid).to.be.false;
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

    it('should be valid after typing', async () => {
      el.focus();
      await sendKeys({ type: 'asdf ' });
      await el.updateComplete;

      expect(el.valid).to.equal(true);
    });
  });

  describe('maxlength', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-text-area maxlength="3"></sl-text-area>`);
    });

    it('should be valid', () => {
      expect(el.valid).to.be.true;
    });

    it('should not allow typing more characters than the maxlength', async () => {
      el.focus();
      await sendKeys({ type: 'qwerty' });
      await el.updateComplete;

      expect(el.value).to.equal('qwe');
    });
  });

  describe('minlength', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-text-area minlength="3"></sl-text-area>`);
      el.focus();
      await sendKeys({ type: 'a' });
      await el.updateComplete;
    });

    it('should be invalid', () => {
      expect(el.valid).to.be.false;
    });

    it('should have a validation message', () => {
      expect(el.validationMessage).to.equal(
        'Please lengthen this text to 3 characters or more (you are currently using 1 character).'
      );
    });

    it('should be valid after typing', async () => {
      el.focus();
      await sendKeys({ type: 'dsf' });
      await el.updateComplete;

      expect(el.valid).to.equal(true);
    });
  });

  describe('show-valid', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-text-area show-valid></sl-text-area>`);
    });

    it('should reflect the attribute', () => {
      expect(el.showValid).to.be.true;
    });

    it('should not have a valid icon', () => {
      expect(el.renderRoot.querySelector('sl-icon')).to.be.null;
    });

    it('should have a valid icon after reporting', async () => {
      el.reportValidity();
      await el.updateComplete;

      const icon = el.renderRoot.querySelector('sl-icon');

      expect(icon).to.exist;
      expect(icon).to.have.class('valid-icon');
    });
  });

  describe('auto resize', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-text-area resize="auto"></sl-text-area>`);
    });

    // it('should set the textarea height to the value of the scrollHeight', async () => {
    //   const textarea = el.querySelector('textarea') as HTMLTextAreaElement,
    //    textareaStyleStub = stub(Object.getPrototypeOf(textarea), 'scrollHeight').get(() => 100);

    //   textarea.value = 'Test input event on textarea';
    //   const event = new Event('input', { bubbles: true });
    //   textarea.dispatchEvent(event);

    //   expect(textarea.style.height).to.equal('100px');
    //   textareaStyleStub.restore();
    //   el.disconnectedCallback();
    // });
  });

  describe('slotted textarea', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-text-area>
          <textarea id="foo" placeholder="I am a custom textarea" spellcheck="true" slot="textarea"></textarea>
        </sl-text-area>
      `);
    });

    it('should use the slotted textarea', () => {
      expect(el.textarea).to.equal(el.querySelector('textarea#foo'));
    });

    it('should overwrite any properties managed by the component', () => {
      const textarea = el.querySelector('textarea');

      expect(textarea?.placeholder).to.equal('');
      expect(textarea?.spellcheck).to.be.true;
    });
  });

  describe('form integration', () => {
    let el: FormIntegrationTestComponent;

    class FormIntegrationTestComponent extends LitElement {
      onFormControl: (event: SlFormControlEvent) => void = spy();

      override render(): TemplateResult {
        return html`<sl-text-area @sl-form-control=${this.onFormControl}></sl-text-area>`;
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
