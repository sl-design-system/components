import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { ButtonBar } from '@sl-design-system/button-bar';
import { Checkbox, CheckboxGroup } from '@sl-design-system/checkbox';
import { Form, FormController, FormField, FormValidationErrors } from '@sl-design-system/form';
import { Radio, RadioGroup } from '@sl-design-system/radio-group';
import { Switch } from '@sl-design-system/switch';
import { TextArea } from '@sl-design-system/text-area';
import { TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import styles from './composite-form.scss.js';

export class CompositeForm extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-button-bar': ButtonBar,
      'sl-checkbox': Checkbox,
      'sl-checkbox-group': CheckboxGroup,
      'sl-form': Form,
      'sl-form-field': FormField,
      'sl-form-validation-errors': FormValidationErrors,
      'sl-radio': Radio,
      'sl-radio-group': RadioGroup,
      'sl-switch': Switch,
      'sl-text-field': TextField,
      'sl-text-area': TextArea
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Controller for managing form state. */
  #form = new FormController<{
    firstName: string;
    lastName: string;
    showFullName?: boolean;
    emailAddress: string;
    age: 'under-10' | 'under-12' | 'under-18' | 'other';
    otherAge: string;
    remarks: string;
    subscriptions: string[];
    termsAndConditions?: boolean;
  }>(this);

  override render(): TemplateResult {
    return html`
      <sl-form>
        <sl-form-field label="First name">
          <sl-text-field name="firstName" required></sl-text-field>
        </sl-form-field>

        <sl-form-field label="Last name">
          <sl-text-field
            ?disabled=${!this.#form.value?.firstName}
            name="lastName"
            placeholder="Enter a first name first"
            required
          ></sl-text-field>
        </sl-form-field>

        <sl-form-field>
          <sl-switch name="showFullName" required reverse>Always show full name</sl-switch>
        </sl-form-field>

        <sl-form-field label="Email">
          <sl-text-field name="emailAddress"></sl-text-field>
        </sl-form-field>

        <sl-form-field label="Age">
          <sl-radio-group name="age" required>
            <sl-radio value="under-10">Under 10</sl-radio>
            <sl-radio value="under-12">Between 10 and 12</sl-radio>
            <sl-radio value="under-18">Between 12 and 18</sl-radio>
            <sl-radio value="other">Other</sl-radio>
          </sl-radio-group>
          <sl-text-field
            ?disabled=${this.#form.value?.age !== 'other'}
            aria-label="Your own age"
            input-size="8"
            name="otherAge"
            placeholder="Your age"
            required
          ></sl-text-field>
        </sl-form-field>

        <sl-form-field label="Remarks">
          <sl-text-area name="remarks" placeholder="Enter any remarks here" required></sl-text-area>
        </sl-form-field>

        <sl-form-field label="Subscriptions">
          <sl-checkbox-group name="subscriptions" required>
            <sl-checkbox value="newsletter">Newsletter</sl-checkbox>
            <sl-checkbox value="promotions">Promotions</sl-checkbox>
            <sl-checkbox value="updates">Product updates</sl-checkbox>
          </sl-checkbox-group>
        </sl-form-field>

        <sl-form-field label="Terms and conditions">
          <sl-checkbox name="termsAndConditions" required> I agree to all terms and conditions </sl-checkbox>
        </sl-form-field>

        <sl-form-validation-errors .controller=${this.#form}></sl-form-validation-errors>

        <sl-button-bar align="end">
          <sl-button @click=${this.#onSetFormValue}>Set form value</sl-button>
          <sl-button @click=${this.#onSave} variant="primary">Save</sl-button>
        </sl-button-bar>
      </sl-form>
      <pre>${JSON.stringify(this.#form.value, null, 2)}</pre>
    `;
  }

  #onSave(): void {
    this.#form.reportValidity();
  }

  #onSetFormValue(): void {
    this.#form.value = {
      firstName: 'John',
      lastName: 'Doe',
      showFullName: true,
      emailAddress: 'john@doe.com',
      age: 'other',
      otherAge: '24',
      remarks: 'These are remarks',
      subscriptions: ['newsletter', 'updates'],
      termsAndConditions: true
    };
  }
}
