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
import { EventsController, event, getValueByPath, setValueByPath } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './form.scss.js';
export class Form extends LitElement {
  constructor() {
    super(...arguments);
    // eslint-disable-next-line no-unused-private-class-members
    this.#events = new EventsController(this, {
      'sl-form-control': this.#onFormControl,
      'sl-form-field': this.#onFormField
    });
    /** Indicates whether to show validity state. */
    this.#showValidity = false;
    /** The controls in the form; not necessarily the same amount as the fields. */
    this.controls = [];
    /** The fields in the form. */
    this.fields = [];
  }
  static {
    /** @internal */
    this.styles = styles;
  }
  #events;
  #showValidity;
  /**
   * The form value explicitly set; this may be set before the form controls have registered
   * themselves with the form. So we cache this value so that we can set it on the form controls
   * when they are ready.
   */
  #value;
  /** Value when the form is initialized, used when the form is reset. */
  #initialValue;
  /** A form is marked dirty when the user has modified a form control. */
  get dirty() {
    return this.controls.some(c => c.dirty);
  }
  /** Whether the form is invalid. */
  get invalid() {
    return !this.valid;
  }
  /** A form is marked pristine as long as the user hasn't modified anything in the form. */
  get pristine() {
    return !this.dirty;
  }
  /** Indicates whether to show validity state. */
  get showValidity() {
    return this.#showValidity;
  }
  /** A form is marked touched once the user has triggered a blur event on a form control. */
  get touched() {
    return this.controls.some(c => c.touched);
  }
  /** A form is marked untouched as long as the user hasn't trigger a blur event on a form control. */
  get untouched() {
    return !this.touched;
  }
  /** Whether the form is valid. */
  get valid() {
    return this.controls.every(c => c.valid);
  }
  /** The aggregated value of all form controls. */
  get value() {
    const value = this.controls.reduce((value2, control) => {
      if (control.name) {
        setValueByPath(value2, control.name, control.formValue);
      }
      return value2;
    }, {});
    if (!this.#initialValue && !!value) {
      this.#initialValue = value;
    }
    return value;
  }
  set value(value) {
    this.#value = value;
    if (value) {
      this.controls.filter(c => c.name).forEach(c => (c.formValue = getValueByPath(value, c.name)));
    } else {
      this.controls.forEach(c => (c.formValue = void 0));
    }
  }
  firstUpdated(changes) {
    super.firstUpdated(changes);
    this.#initialValue = this.#value;
  }
  updated(changes) {
    super.updated(changes);
    if (changes.has('disabled')) {
      this.controls.forEach(control => (control.disabled = this.disabled));
    }
  }
  // Waits for the form and all controls that implement `updateComplete` to complete their update cycle
  async getUpdateComplete() {
    const superComplete = await super.getUpdateComplete();
    await Promise.all(this.controls.map(c => c.updateComplete).filter(p => p !== void 0));
    return superComplete;
  }
  render() {
    return html`<slot></slot>`;
  }
  /** Calls `reportValidity()` on all form controls and returns if they are all valid. */
  reportValidity() {
    this.#showValidity = true;
    return this.controls.map(c => c.reportValidity()).every(Boolean);
  }
  /** If the form is valid, it will emit an `sl-submit` event. */
  requestSubmit() {
    if (this.reportValidity()) {
      this.submitEvent.emit();
    }
  }
  /** Puts all the initial values of the form controls back and updates the validity of all fields. */
  reset() {
    this.controls.map(c => {
      if (c.name) {
        c.reset(this.#initialValue?.[c.name]);
      }
    });
    this.resetEvent.emit();
  }
  #isFormControl(element) {
    return element instanceof HTMLElement && 'formControlElement' in element;
  }
  #onFormControl(event2) {
    if (
      !(event2.composedPath()[0] instanceof EventTarget) ||
      !(event2.composedPath()[0] instanceof HTMLElement) ||
      !this.#isFormControl(event2.composedPath()[0])
    ) {
      return;
    }
    const control = event2.composedPath()[0];
    event2.preventDefault();
    event2.stopPropagation();
    event2.detail.unregister = () => {
      this.controls = this.controls.filter(c => c !== control);
    };
    requestAnimationFrame(() => {
      if (control.name && this.#value) {
        control.formValue = getValueByPath(this.#value, control.name);
      }
      if (this.disabled) {
        control.disabled = this.disabled;
      }
      this.controls = [...this.controls, control];
      this.controls.find(c => c.autofocus)?.focus();
    });
  }
  async #onFormField(event2) {
    const field = event2.target;
    event2.preventDefault();
    event2.stopPropagation();
    event2.detail.unregister = () => {
      this.fields = this.fields.filter(f => f !== field);
      this.#updateMarkedFields();
    };
    this.fields = [...this.fields, field];
    await field.updateComplete;
    this.#updateMarkedFields();
  }
  #updateMarkedFields() {
    const requiredCount = this.fields.reduce((count, field) => {
      return count + (field.control?.required ? 1 : 0);
    }, 0);
    const optionalCount = this.fields.length - requiredCount,
      mark = requiredCount <= optionalCount ? 'required' : 'optional';
    this.fields.forEach(field => (field.mark = mark));
  }
}
__decorateClass([property({ type: Boolean })], Form.prototype, 'disabled', 2);
__decorateClass([event({ name: 'sl-reset' })], Form.prototype, 'resetEvent', 2);
__decorateClass([event({ name: 'sl-submit' })], Form.prototype, 'submitEvent', 2);
__decorateClass([property({ attribute: false })], Form.prototype, 'value', 1);
//# sourceMappingURL=form.js.map
