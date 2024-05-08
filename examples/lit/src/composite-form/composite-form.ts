import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { ButtonBar } from '@sl-design-system/button-bar';
import { Checkbox } from '@sl-design-system/checkbox';
import { Form, FormController, FormField, FormValidationErrors } from '@sl-design-system/form';
import { Radio, RadioGroup } from '@sl-design-system/radio-group';
import { TextField } from '@sl-design-system/text-field';
import { Textarea } from '@sl-design-system/textarea';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import styles from './composite-form.scss.js';

export class CompositeForm extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-button-bar': ButtonBar,
      'sl-checkbox': Checkbox,
      'sl-form': Form,
      'sl-form-field': FormField,
      'sl-form-validation-errors': FormValidationErrors,
      'sl-radio': Radio,
      'sl-radio-group': RadioGroup,
      'sl-text-field': TextField,
      'sl-textarea': Textarea
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Controller for managing form state. */
  #form = new FormController<{
    firstName: string;
    lastName: string;
    emailAddress: string;
    age: 'under-10' | 'under-12' | 'under-18' | 'other';
    otherAge: string;
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
          <sl-textarea name="remarks" placeholder="Enter any remarks here" required></sl-textarea>
        </sl-form-field>

        <sl-form-field>
          <sl-checkbox aria-label="Terms and conditions" name="terms" required>
            I agree to all terms and conditions
          </sl-checkbox>
        </sl-form-field>

        <sl-form-validation-errors .controller=${this.#form}></sl-form-validation-errors>

        <sl-button-bar align="end">
          <sl-button @click=${this.#onSave} variant="primary">Save</sl-button>
        </sl-button-bar>
      </sl-form>
      <pre>${JSON.stringify(this.#form.value, null, 2)}</pre>
    `;
  }

  #onSave(): void {
    this.#form.reportValidity();
  }
}
