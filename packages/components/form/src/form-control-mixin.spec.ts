import { fixture, oneEvent } from '@sl-design-system/vitest-browser-lit';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { spy } from 'sinon';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FormControlMixin, type FormControlShowValidity, type SlUpdateValidityEvent } from './form-control-mixin.js';

/** Helper to set the writable `showValidity` property that the `FormControl` interface marks readonly. */
function setShowValidity(el: NativeTestElement, value: FormControlShowValidity): void {
  (el as unknown as { showValidity: FormControlShowValidity }).showValidity = value;
}

class NativeTestElement extends FormControlMixin(LitElement) {
  @property() override value?: unknown;

  override render() {
    return html`<input />`;
  }

  override firstUpdated(): void {
    super.firstUpdated({} as Map<PropertyKey, unknown>);

    this.setFormControlElement(this.renderRoot.querySelector('input')!);
  }
}

class RequiredNativeTestElement extends FormControlMixin(LitElement) {
  @property({ type: Boolean }) override required = false;

  override render() {
    return html`<input .required=${this.required} />`;
  }

  override firstUpdated(): void {
    super.firstUpdated({} as Map<PropertyKey, unknown>);

    this.setFormControlElement(this.renderRoot.querySelector('input')!);
  }
}

try {
  customElements.define('fcm-native-test', NativeTestElement);
  customElements.define('fcm-required-native-test', RequiredNativeTestElement);
} catch {
  // Elements may already be defined in watch / repeated test runs
}

describe('FormControlMixin', () => {
  let el: NativeTestElement;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<fcm-native-test></fcm-native-test>`);
    });

    it('should have a static extendsFormControlMixin property', () => {
      expect((NativeTestElement as unknown as { extendsFormControlMixin: boolean }).extendsFormControlMixin).to.be.true;
    });

    it('should not be dirty', () => {
      expect(el.dirty).to.be.false;
    });

    it('should not be touched', () => {
      expect(el.touched).to.be.false;
    });

    it('should not have a showValidity value', () => {
      expect(el.showValidity).to.be.undefined;
    });

    it('should be valid', () => {
      expect(el.valid).to.be.true;
    });

    it('should have a "valid" validityState', () => {
      expect(el.validityState).to.equal('valid');
    });

    it('should have an empty validationMessage', () => {
      expect(el.validationMessage).to.equal('');
    });

    it('should not have a name', () => {
      expect(el.name).to.be.undefined;
    });

    it('should not have a value', () => {
      expect(el.value).to.be.undefined;
    });

    it('should return the input as formControlElement', () => {
      expect(el.formControlElement).to.equal(el.renderRoot.querySelector('input'));
    });
  });

  describe('formControlElement', () => {
    it('should throw when accessed before setFormControlElement is called', () => {
      // Create a fresh element without appending to the DOM so firstUpdated never fires
      const fresh = new NativeTestElement();

      expect(() => fresh.formControlElement).to.throw('A formControlElement must be set');
    });
  });

  describe('formValue', () => {
    beforeEach(async () => {
      el = await fixture(html`<fcm-native-test></fcm-native-test>`);
    });

    it('should return the value', () => {
      el.value = 'test';
      expect(el.formValue).to.equal('test');
    });

    it('should set the value when formValue is set', () => {
      el.formValue = 'test';
      expect(el.value).to.equal('test');
    });
  });

  describe('nativeFormValue', () => {
    beforeEach(async () => {
      el = await fixture(html`<fcm-native-test></fcm-native-test>`);
    });

    it('should return null for undefined value', () => {
      expect(el.nativeFormValue).to.be.null;
    });

    it('should return null for null value', () => {
      el.value = null;
      expect(el.nativeFormValue).to.be.null;
    });

    it('should return the string value as-is', () => {
      el.value = 'hello';
      expect(el.nativeFormValue).to.equal('hello');
    });

    it('should convert boolean true to string', () => {
      el.value = true;
      expect(el.nativeFormValue).to.equal('true');
    });

    it('should convert boolean false to string', () => {
      el.value = false;
      expect(el.nativeFormValue).to.equal('false');
    });

    it('should convert a number to string', () => {
      el.value = 42;
      expect(el.nativeFormValue).to.equal('42');
    });

    it('should return a File value as-is', () => {
      const file = new File(['content'], 'test.txt');
      el.value = file;
      expect(el.nativeFormValue).to.equal(file);
    });

    it('should return a FormData value as-is', () => {
      const formData = new FormData();
      el.value = formData;
      expect(el.nativeFormValue).to.equal(formData);
    });

    it('should call toString() on an object value', () => {
      el.value = { toString: () => 'custom' };
      expect(el.nativeFormValue).to.equal('custom');
    });
  });

  describe('name', () => {
    beforeEach(async () => {
      el = await fixture(html`<fcm-native-test name="my-field"></fcm-native-test>`);
    });

    it('should reflect the name attribute', () => {
      expect(el).to.have.attribute('name', 'my-field');
    });

    it('should sync the name to the native input', () => {
      expect(el.renderRoot.querySelector('input')).to.have.attribute('name', 'my-field');
    });

    it('should update the native input when name changes', async () => {
      el.name = 'new-name';
      await el.updateComplete;

      expect(el.renderRoot.querySelector('input')).to.have.attribute('name', 'new-name');
    });
  });

  describe('sl-form-control event', () => {
    it('should emit sl-form-control on first render', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const eventPromise = oneEvent(container, 'sl-form-control');

      const element = document.createElement('fcm-native-test');
      container.appendChild(element);

      const event = await eventPromise;

      expect(event).to.be.an.instanceOf(CustomEvent);
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;

      container.remove();
    });
  });

  describe('reportValidity', () => {
    let requiredEl: RequiredNativeTestElement;

    beforeEach(async () => {
      requiredEl = await fixture(html`<fcm-required-native-test required></fcm-required-native-test>`);
    });

    it('should return true when the control is valid', async () => {
      el = await fixture(html`<fcm-native-test></fcm-native-test>`);

      expect(el.reportValidity()).to.be.true;
    });

    it('should return false when the control is invalid', () => {
      expect(requiredEl.reportValidity()).to.be.false;
    });

    it('should set showValidity to "invalid" when invalid', async () => {
      requiredEl.reportValidity();
      await requiredEl.updateComplete;

      expect(requiredEl.showValidity).to.equal('invalid');
    });

    it('should not set showValidity to "valid" by default when valid', async () => {
      el = await fixture(html`<fcm-native-test></fcm-native-test>`);
      el.reportValidity();
      await el.updateComplete;

      expect(el.showValidity).to.be.undefined;
    });

    it('should set showValidity to "valid" when valid and showValid is true', async () => {
      el = await fixture(html`<fcm-native-test></fcm-native-test>`);
      el.showValid = true;
      el.reportValidity();
      await el.updateComplete;

      expect(el.showValidity).to.equal('valid');
    });

    it('should emit the sl-validate event', () => {
      const onValidate = spy();
      requiredEl.addEventListener('sl-validate', onValidate);

      requiredEl.reportValidity();

      expect(onValidate).to.have.been.calledOnce;
    });

    it('should emit the sl-update-validity event', () => {
      const onUpdateValidity = spy();
      requiredEl.addEventListener('sl-update-validity', onUpdateValidity);

      requiredEl.reportValidity();

      expect(onUpdateValidity).to.have.been.calledOnce;
    });

    it('should include validity info in sl-update-validity event', () => {
      let detail: SlUpdateValidityEvent['detail'] | undefined;
      requiredEl.addEventListener('sl-update-validity', ((event: SlUpdateValidityEvent) => {
        detail = event.detail;
      }) as EventListener);

      requiredEl.reportValidity();

      expect(detail).to.exist;
      expect(detail!.valid).to.be.false;
      expect(detail!.showValidity).to.equal('invalid');
      expect(detail!.validationMessage).to.be.a('string').and.not.equal('');
    });
  });

  describe('setCustomValidity', () => {
    beforeEach(async () => {
      el = await fixture(html`<fcm-native-test></fcm-native-test>`);
    });

    it('should make the control invalid with a non-empty string', () => {
      el.setCustomValidity('Error');

      expect(el.valid).to.be.false;
      expect(el.validationMessage).to.equal('Error');
    });

    it('should make the control valid again with an empty string', () => {
      el.setCustomValidity('Error');
      el.setCustomValidity('');

      expect(el.valid).to.be.true;
      expect(el.validationMessage).to.equal('');
    });

    it('should call updateValidity when called outside of updateValidity', () => {
      const onUpdateValidity = spy();
      el.addEventListener('sl-update-validity', onUpdateValidity);

      el.setCustomValidity('Error');

      expect(onUpdateValidity).to.have.been.calledOnce;
    });

    it('should not call updateValidity when called inside an sl-validate handler', () => {
      const onUpdateValidity = spy();

      // The first call to updateValidity triggers sl-validate, which calls setCustomValidity.
      // setCustomValidity should NOT re-trigger updateValidity.
      el.addEventListener('sl-validate', () => {
        el.setCustomValidity('Error from validate');
      });

      el.addEventListener('sl-update-validity', onUpdateValidity);
      el.updateValidity();

      // Should be called exactly once (from the explicit updateValidity call)
      expect(onUpdateValidity).to.have.been.calledOnce;
    });

    describe('with a promise', () => {
      it('should set validityState to "pending"', () => {
        const promise = new Promise<string>(() => {
          // Never resolves
        });

        el.setCustomValidity(promise);

        expect(el.validityState).to.equal('pending');
      });

      it('should resolve the validity once the promise resolves', async () => {
        el.setCustomValidity(Promise.resolve('Async error'));

        // Wait for the microtask to resolve
        await new Promise(resolve => setTimeout(resolve));

        expect(el.valid).to.be.false;
        expect(el.validationMessage).to.equal('Async error');
        expect(el.validityState).to.equal('invalid');
      });

      it('should make the control valid when the promise resolves with an empty string', async () => {
        el.setCustomValidity('Initial error');
        el.setCustomValidity(Promise.resolve(''));

        await new Promise(resolve => setTimeout(resolve));

        expect(el.valid).to.be.true;
        expect(el.validityState).to.equal('valid');
      });

      it('should not emit sl-validate when the promise resolves', async () => {
        const onValidate = spy();
        el.addEventListener('sl-validate', onValidate);

        el.setCustomValidity(Promise.resolve('Error'));

        // Wait for the microtask to resolve
        await new Promise(resolve => setTimeout(resolve));

        // The promise path returns early without calling updateValidity synchronously,
        // and the async resolution calls updateValidity(false) which skips sl-validate
        expect(onValidate).not.to.have.been.called;
      });

      it('should not cause an infinite loop with async validation in sl-validate handler', async () => {
        vi.useFakeTimers();

        let validateCount = 0;

        el.addEventListener('sl-validate', (event: Event) => {
          validateCount++;

          const target = event.target as NativeTestElement;
          const promise = new Promise<string>(resolve => {
            setTimeout(() => resolve(target.value === 'SLDS' ? '' : 'Enter "SLDS"'), 2000);
          });

          target.setCustomValidity(promise);
        });

        el.reportValidity();

        // First validate event fires synchronously
        expect(validateCount).to.equal(1);

        // Advance past the setTimeout in the promise
        await vi.advanceTimersByTimeAsync(2500);

        // The sl-validate event should NOT have fired again
        expect(validateCount).to.equal(1);

        vi.useRealTimers();
      });

      it('should emit sl-update-validity when the promise resolves', async () => {
        const onUpdateValidity = spy();
        el.addEventListener('sl-update-validity', onUpdateValidity);

        el.setCustomValidity(Promise.resolve('Error'));

        await new Promise(resolve => setTimeout(resolve));

        // The promise path returns early (no sync updateValidity), then
        // the async resolution calls updateValidity(false) — one event total
        expect(onUpdateValidity).to.have.been.calledOnce;
      });
    });
  });

  describe('customValidity attribute', () => {
    beforeEach(async () => {
      el = await fixture(html`<fcm-native-test></fcm-native-test>`);
    });

    it('should set custom validity from the attribute', async () => {
      el.setAttribute('custom-validity', 'Attr error');
      await el.updateComplete;

      expect(el.valid).to.be.false;
      expect(el.validationMessage).to.equal('Attr error');
    });

    it('should clear custom validity when the attribute is removed', async () => {
      el.setAttribute('custom-validity', 'Attr error');
      await el.updateComplete;

      el.removeAttribute('custom-validity');
      await el.updateComplete;

      expect(el.valid).to.be.true;
    });
  });

  describe('reset', () => {
    beforeEach(async () => {
      el = await fixture(html`<fcm-native-test></fcm-native-test>`);
    });

    it('should reset dirty to false', () => {
      el.dirty = true;
      el.reset('');

      expect(el.dirty).to.be.false;
    });

    it('should reset touched to false', () => {
      el.touched = true;
      el.reset('');

      expect(el.touched).to.be.false;
    });

    it('should reset showValidity to undefined', () => {
      setShowValidity(el, 'invalid');
      el.reset('');

      expect(el.showValidity).to.be.undefined;
    });

    it('should set the formValue to the given value', () => {
      el.value = 'old';
      el.reset('new');

      expect(el.formValue).to.equal('new');
    });

    it('should call updateValidity', () => {
      const onUpdateValidity = spy();
      el.addEventListener('sl-update-validity', onUpdateValidity);

      el.reset('');

      expect(onUpdateValidity).to.have.been.calledOnce;
    });
  });

  describe('updateState', () => {
    beforeEach(async () => {
      el = await fixture(html`<fcm-native-test></fcm-native-test>`);
    });

    it('should update dirty state', () => {
      el.updateState({ dirty: true });

      expect(el.dirty).to.be.true;
    });

    it('should update touched state', () => {
      el.updateState({ touched: true });

      expect(el.touched).to.be.true;
    });

    it('should emit sl-update-state when dirty changes', () => {
      const onUpdateState = spy();
      el.addEventListener('sl-update-state', onUpdateState);

      el.updateState({ dirty: true });

      expect(onUpdateState).to.have.been.calledOnce;
    });

    it('should emit sl-update-state when touched changes', () => {
      const onUpdateState = spy();
      el.addEventListener('sl-update-state', onUpdateState);

      el.updateState({ touched: true });

      expect(onUpdateState).to.have.been.calledOnce;
    });

    it('should not emit sl-update-state when the value has not changed', () => {
      const onUpdateState = spy();
      el.addEventListener('sl-update-state', onUpdateState);

      el.updateState({ dirty: false });

      expect(onUpdateState).not.to.have.been.called;
    });
  });

  describe('updateValidity', () => {
    beforeEach(async () => {
      el = await fixture(html`<fcm-native-test></fcm-native-test>`);
    });

    it('should emit sl-validate by default', () => {
      const onValidate = spy();
      el.addEventListener('sl-validate', onValidate);

      el.updateValidity();

      expect(onValidate).to.have.been.calledOnce;
    });

    it('should not emit sl-validate when emitValidateEvent is false', () => {
      const onValidate = spy();
      el.addEventListener('sl-validate', onValidate);

      el.updateValidity(false);

      expect(onValidate).not.to.have.been.called;
    });

    it('should emit sl-update-validity', () => {
      const onUpdateValidity = spy();
      el.addEventListener('sl-update-validity', onUpdateValidity);

      el.updateValidity();

      expect(onUpdateValidity).to.have.been.calledOnce;
    });
  });

  describe('showValidity and aria-invalid', () => {
    beforeEach(async () => {
      el = await fixture(html`<fcm-native-test></fcm-native-test>`);
    });

    it('should set aria-invalid on the input when showValidity is "invalid"', async () => {
      setShowValidity(el, 'invalid');
      await el.updateComplete;

      expect(el.renderRoot.querySelector('input')).to.have.attribute('aria-invalid', 'true');
    });

    it('should remove aria-invalid from the input when showValidity is not "invalid"', async () => {
      setShowValidity(el, 'invalid');
      await el.updateComplete;

      setShowValidity(el, 'valid');
      await el.updateComplete;

      expect(el.renderRoot.querySelector('input')).not.to.have.attribute('aria-invalid');
    });

    it('should remove aria-invalid when showValidity is undefined', async () => {
      setShowValidity(el, 'invalid');
      await el.updateComplete;

      setShowValidity(el, undefined);
      await el.updateComplete;

      expect(el.renderRoot.querySelector('input')).not.to.have.attribute('aria-invalid');
    });

    it('should reflect show-validity attribute', async () => {
      setShowValidity(el, 'invalid');
      await el.updateComplete;

      expect(el).to.have.attribute('show-validity', 'invalid');
    });
  });

  describe('getLocalizedValidationMessage', () => {
    let requiredEl: RequiredNativeTestElement;

    beforeEach(async () => {
      requiredEl = await fixture(html`<fcm-required-native-test required></fcm-required-native-test>`);
    });

    it('should return a localized message for valueMissing', () => {
      requiredEl.reportValidity();

      expect(requiredEl.getLocalizedValidationMessage()).to.equal('Please fill in this field.');
    });

    it('should return the custom validity message for customError', () => {
      requiredEl.setCustomValidity('Custom message');

      expect(requiredEl.getLocalizedValidationMessage()).to.equal('Custom message');
    });

    it('should return empty string when valid', async () => {
      el = await fixture(html`<fcm-native-test></fcm-native-test>`);

      expect(el.getLocalizedValidationMessage()).to.equal('');
    });
  });

  describe('disconnectedCallback', () => {
    it('should clean up the invalid event listener', async () => {
      el = await fixture(html`<fcm-native-test></fcm-native-test>`);

      const input = el.renderRoot.querySelector('input')!;
      const removeEventListenerSpy = spy(input, 'removeEventListener');

      el.remove();

      expect(removeEventListenerSpy).to.have.been.calledWith('invalid');
    });
  });
});
