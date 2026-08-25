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
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Form, FormControlMixin, FormController, FormField } from '@sl-design-system/form';
import { TextField } from '@sl-design-system/text-field';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './child-form.scss.js';
export class ChildForm extends ScopedElementsMixin(FormControlMixin(LitElement)) {
  constructor() {
    super(...arguments);
    this.#form = new FormController(this);
    this.#valueUpdatedFromInternal = false;
    /** Needed since we don't have a native input element. */
    this.internals = this.attachInternals();
    this.value = {};
  }
  static {
    /** @internal */
    this.formAssociated = true;
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-form': Form,
      'sl-form-field': FormField,
      'sl-text-field': TextField
    };
  }
  static {
    /** @internal */
    this.styles = styles;
  }
  #form;
  #valueUpdatedFromInternal;
  connectedCallback() {
    super.connectedCallback();
    this.setFormControlElement(this);
  }
  render() {
    return html`
      <sl-form @sl-update-state=${this.#onUpdate} @sl-update-validity=${this.#onUpdate}>
        <sl-form-field label="Postal code">
          <sl-text-field @sl-change=${this.#onChange} name="postalCode" required></sl-text-field>
        </sl-form-field>

        <sl-form-field label="House number">
          <sl-text-field @sl-change=${this.#onChange} name="houseNumber" required></sl-text-field>
        </sl-form-field>

        <sl-form-field label="Street">
          <sl-text-field name="street" required></sl-text-field>
        </sl-form-field>

        <sl-form-field label="City">
          <sl-text-field name="city" required></sl-text-field>
        </sl-form-field>
      </sl-form>
    `;
  }
  reportValidity() {
    super.reportValidity();
    return this.#form.reportValidity();
  }
  updated(changes) {
    super.updated(changes);
    if (changes.has('value')) {
      if (this.#valueUpdatedFromInternal) {
        this.#valueUpdatedFromInternal = false;
      } else {
        const form = this.renderRoot.querySelector('sl-form');
        if (form) {
          form.value = this.value;
          void form.updateComplete.then(() => {
            this.setCustomValidity(form.invalid ? 'Please enter a valid address.' : '');
          });
        }
      }
    }
  }
  #onChange() {
    const { postalCode, houseNumber, street, city } = this.#form.value ?? {};
    if (postalCode && houseNumber && !street && !city) {
      this.#form.value = { postalCode, houseNumber, street: 'Autofilled', city: 'Autofilled' };
    }
  }
  #onUpdate(event) {
    event.preventDefault();
    event.stopPropagation();
    this.#valueUpdatedFromInternal = true;
    this.value = this.#form.value;
    this.setCustomValidity(this.#form.invalid ? 'Please enter a valid address.' : '');
    this.updateState({ dirty: true });
    this.updateValidity();
  }
}
__decorateClass([property({ type: Boolean })], ChildForm.prototype, 'required', 2);
__decorateClass([property({ attribute: false })], ChildForm.prototype, 'value', 2);
//# sourceMappingURL=child-form.js.map
