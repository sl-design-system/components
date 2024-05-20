import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Form, FormControlMixin, FormController, FormField } from '@sl-design-system/form';
import { TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './child-form.scss.js';

export type Address = {
  postalCode: string;
  houseNumber: string;
  street: string;
  city: string;
};

export class ChildForm extends ScopedElementsMixin(FormControlMixin(LitElement)) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-form': Form,
      'sl-form-field': FormField,
      'sl-text-field': TextField
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  #form = new FormController<Address>(this);

  /** Whether the address is a required field. */
  @property({ type: Boolean }) override required?: boolean;

  /** The form value. */
  override value?: Partial<Address> = {};

  override render(): TemplateResult {
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

  override reportValidity(): boolean {
    return this.#form.reportValidity();
  }

  #onChange(): void {
    const { postalCode, houseNumber, street, city } = this.#form.value ?? {};

    if (postalCode && houseNumber && !street && !city) {
      this.#form.value = { postalCode, houseNumber, street: 'Autofilled', city: 'Autofilled' };
    }
  }

  #onUpdate(): void {
    this.value = this.#form.value;
    this.updateState({ dirty: true });
    this.updateValidity();
  }
}
