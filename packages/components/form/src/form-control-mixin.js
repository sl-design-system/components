var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if ((decorator = decorators[i]))
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
import { msg } from '@lit/localize';
import { event } from '@sl-design-system/shared';
import { property } from 'lit/decorators.js';
const isNative = element =>
  element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement;
export function FormControlMixin(constructor) {
  class FormControlImpl extends constructor {
    constructor() {
      super(...arguments);
      this.#onInvalid = event2 => {
        event2.preventDefault();
        if (!this.report) {
          this.report = true;
          this.updateValidity();
        }
      };
      /** Flag indicating whether the validity is being updated. */
      this.#updatingValidity = false;
      /** A control is dirty if the user has changed the value in the UI. */
      this.dirty = false;
      /** Optional property to indicate the valid state should be shown. */
      this.showValid = false;
      /** A control is marked touched once the user has triggered a blur event on it. */
      this.touched = false;
    }
    static {
      /**
       * This is necessary so we can check if an element implements this Mixin, since the
       * `FormControl` class isn't a generic class we can use in an `instanceof` comparison.
       *
       * @internal
       */
      this.extendsFormControlMixin = true;
    }
    /** The promise that resolves into a custom validity message. */
    #customValidityPromise;
    /**
     * The actual element that integrates with the form; either a Form Associated Custom Element, an
     * `<input>` or a `<textarea>`.
     */
    #formControlElement;
    #onInvalid;
    #updatingValidity;
    // A callback returned by the parent form component to unregister the control
    #unregister;
    /** The value used when submitting the form. */
    get formValue() {
      return this.value;
    }
    set formValue(value) {
      this.value = value;
    }
    /** @internal */
    get formControlElement() {
      if (this.#formControlElement) {
        return this.#formControlElement;
      } else {
        throw new Error('A formControlElement must be set for the FormControlMixin to work');
      }
    }
    /** The form associated with the control. */
    get form() {
      if (isNative(this.formControlElement)) {
        return this.formControlElement.form;
      } else {
        return this.formControlElement.internals.form;
      }
    }
    /**
     * The labels associated with the control.
     *
     * @type {`NodeListOf<HTMLLabelElement>` | null}
     */
    get labels() {
      if (isNative(this.formControlElement)) {
        return this.formControlElement.labels;
      } else {
        return this.formControlElement.internals.labels;
      }
    }
    /**
     * Returns the form value as used in a native `<form>`. This is always a string, File, FormData
     * or null.
     */
    get nativeFormValue() {
      if (
        this.formValue === null ||
        this.formValue === void 0 ||
        this.formValue instanceof File ||
        this.formValue instanceof FormData ||
        typeof this.formValue === 'string'
      ) {
        return this.formValue ?? null;
      } else if (typeof this.formValue === 'boolean') {
        return Boolean(this.formValue).toString();
      } else if (typeof this.formValue === 'number') {
        return Number(this.formValue).toString();
      } else if (typeof this.formValue === 'object' && 'toString' in this.formValue) {
        return this.formValue.toString();
      } else {
        console.warn('Unknown form value type', this.formValue);
        return null;
      }
    }
    /** Returns whether the form control is valid or not. */
    get valid() {
      return this.validity.valid;
    }
    /**
     * String representing a localized (by the browser) message that describes the validation
     * constraints that the control does not satisfy (if any). The string is empty if the control is
     * not a candidate for constraint validation, or it satisfies its constraints.
     *
     * For true localization, see `getLocalizedValidationMessage()` instead.
     */
    get validationMessage() {
      if (isNative(this.formControlElement)) {
        return this.formControlElement.validationMessage;
      } else {
        return this.formControlElement.internals.validationMessage;
      }
    }
    /** Returns the validity state the control is in. */
    get validity() {
      if (isNative(this.formControlElement)) {
        return this.formControlElement.validity;
      } else {
        return this.formControlElement.internals.validity;
      }
    }
    /**
     * Returns the current validity state.
     *
     * @type {'valid' | 'invalid' | 'pending'}
     */
    get validityState() {
      return this.#customValidityPromise ? 'pending' : this.valid ? 'valid' : 'invalid';
    }
    /** @internal */
    firstUpdated(changes) {
      super.firstUpdated(changes);
      const event2 = new CustomEvent('sl-form-control', {
        bubbles: true,
        composed: true,
        detail: {}
      });
      this.formControlEvent.emit(event2);
      this.#unregister = event2.detail.unregister;
    }
    /** @internal */
    disconnectedCallback() {
      this.#unregister?.();
      this.#unregister = void 0;
      this.#formControlElement?.removeEventListener('invalid', this.#onInvalid);
      super.disconnectedCallback();
    }
    /** @internal */
    willUpdate(changes) {
      super.willUpdate(changes);
      if (changes.has('customValidity')) {
        this.setCustomValidity(this.customValidity ?? '');
      }
    }
    /** @internal */
    updated(changes) {
      super.updated(changes);
      if (changes.has('name') && isNative(this.formControlElement)) {
        this.formControlElement.name = this.name ?? '';
      }
      if (changes.has('showValidity')) {
        if (isNative(this.formControlElement)) {
          if (this.showValidity === 'invalid') {
            this.formControlElement.setAttribute('aria-invalid', 'true');
          } else {
            this.formControlElement.removeAttribute('aria-invalid');
          }
        } else {
          this.formControlElement.internals.ariaInvalid =
            this.showValidity === 'invalid' ? 'true' : null;
        }
      }
    }
    /**
     * Returns whether the control is valid. If the control is invalid, calling this will also cause
     * an `invalid` event to be dispatched. After calling this, the control will also report the
     * validity to the user.
     */
    reportValidity() {
      this.report = true;
      const valid = isNative(this.formControlElement)
        ? this.formControlElement.reportValidity()
        : this.formControlElement.internals.reportValidity();
      this.updateValidity();
      return valid;
    }
    /** @internal Reset the form control state */
    reset(value) {
      this.dirty = false;
      this.formValue = value;
      this.report = false;
      this.showValidity = void 0;
      this.touched = false;
      this.updateValidity();
    }
    /**
     * Updates the state of the form control. It also emits an `sl-update-state` event to signal
     * that the state has changed.
     *
     * @internal
     */
    updateState({ dirty, touched }) {
      let emitEvent = false;
      if (dirty !== void 0) {
        emitEvent = this.dirty !== dirty;
        this.dirty = dirty;
      }
      if (touched !== void 0) {
        emitEvent = this.touched !== touched;
        this.touched = touched;
      }
      if (emitEvent) {
        this.updateStateEvent.emit();
      }
    }
    /**
     * Override this in a component to update internal validity using `setCustomValidity`. This is
     * called during the validity check. Use this for custom validation within a component. This
     * way, only a single `sl-update-validity` will be emitted.
     *
     * @internal
     */
    updateInternalValidity() {}
    /**
     * Updates the validity of the form control. This does not _change_ the `validity` of the form
     * control, it just updates the display of any validation message. Changing the validity is up
     * to the form control itself.
     *
     * NOTE: This method updates the `showValidity` property and therefore should be called from
     * `willUpdate`, never from `updated` or you will trigger a new lifecycle update.
     *
     * @internal
     */
    updateValidity(emitValidateEvent = true) {
      this.#updatingValidity = true;
      this.updateInternalValidity();
      if (emitValidateEvent) {
        this.validateEvent.emit();
      }
      if (this.report) {
        if (this.valid) {
          this.showValidity = this.showValid ? 'valid' : void 0;
        } else {
          this.showValidity = 'invalid';
        }
      }
      this.updateValidityEvent.emit({
        valid: this.valid,
        validationMessage: this.getLocalizedValidationMessage(),
        showValidity: this.showValidity
      });
      this.#updatingValidity = false;
    }
    /**
     * This returns a localized validation message. It does not support all `ValidityState`
     * properties, since some require more context than we have here. If you need to support more,
     * you can override this method in your own form control.
     */
    getLocalizedValidationMessage() {
      if (!isNative(this.formControlElement) || this.validity.valid || this.validity.customError) {
        return this.validationMessage;
      } else if (this.validity.badInput || this.validity.typeMismatch) {
        return msg('Please enter a valid value.', { id: 'sl.form.validation.invalidValue' });
      } else if (this.validity.patternMismatch) {
        return msg('Please match the format requested.', {
          id: 'sl.form.validation.patternMismatch'
        });
      } else if (this.validity.valueMissing) {
        return msg('Please fill in this field.', { id: 'sl.form.validation.valueMissing' });
      } else {
        let missingKey = '';
        for (const key in this.validity) {
          if (this.validity[key] === true) {
            missingKey = key;
            break;
          }
        }
        console.warn(
          `Missing localized validation message for validity state "${missingKey}". Provide your own getLocalizedValidationMessage() method in your form control.`
        );
        return this.validationMessage;
      }
    }
    /**
     * Sets a custom validation message for the form control. If the message is not an empty string,
     * that will make the control invalid. By setting it to an empty string again, you can make the
     * control valid again.
     *
     * @param message The validation message.
     */
    setCustomValidity(message) {
      if (typeof message !== 'string') {
        this.#customValidityPromise = message;
        message
          .then(result => {
            this.#setNativeCustomValidity(result);
            this.updateValidity(false);
          })
          .finally(() => {
            this.#customValidityPromise = void 0;
          });
        return;
      }
      this.#setNativeCustomValidity(message);
      if (!this.#updatingValidity) {
        this.updateValidity();
      }
    }
    /**
     * This tells the mixin what the form control element is. This can either be a native input or
     * textarea element, or a Form Associated Custom Element (FACE) with an internals property.
     *
     * The form control element must be either the same as the FormControlMixin host (in the case of
     * a FACE), or a child of it. Otherwise we can't link the validation message to the form control
     * element, which is necessary for accessibility.
     *
     * @param element The form control element.
     * @internal
     */
    setFormControlElement(element) {
      this.#formControlElement = element;
      this.#formControlElement.addEventListener('invalid', this.#onInvalid);
    }
    #setNativeCustomValidity(message) {
      if (isNative(this.formControlElement)) {
        this.formControlElement.setCustomValidity(message);
      } else {
        if (message === '') {
          this.formControlElement.internals.setValidity({});
        } else {
          this.formControlElement.internals.setValidity({ customError: true }, message);
        }
      }
    }
  }
  __decorateClass(
    [property({ attribute: 'custom-validity' })],
    FormControlImpl.prototype,
    'customValidity',
    2
  );
  __decorateClass(
    [event({ name: 'sl-form-control' })],
    FormControlImpl.prototype,
    'formControlEvent',
    2
  );
  __decorateClass([property({ reflect: true })], FormControlImpl.prototype, 'name', 2);
  __decorateClass(
    [property({ attribute: 'show-validity', reflect: true })],
    FormControlImpl.prototype,
    'showValidity',
    2
  );
  __decorateClass(
    [event({ name: 'sl-update-state' })],
    FormControlImpl.prototype,
    'updateStateEvent',
    2
  );
  __decorateClass(
    [event({ name: 'sl-update-validity' })],
    FormControlImpl.prototype,
    'updateValidityEvent',
    2
  );
  __decorateClass([event({ name: 'sl-validate' })], FormControlImpl.prototype, 'validateEvent', 2);
  __decorateClass([property({ attribute: false })], FormControlImpl.prototype, 'formValue', 1);
  return FormControlImpl;
}
//# sourceMappingURL=form-control-mixin.js.map
