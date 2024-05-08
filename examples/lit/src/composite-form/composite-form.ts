import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { ButtonBar } from '@sl-design-system/button-bar';
import { Form, FormController, FormField } from '@sl-design-system/form';
import { InlineMessage } from '@sl-design-system/inline-message';
import { Radio, RadioGroup } from '@sl-design-system/radio-group';
import { TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import styles from './composite-form.scss.js';

export class CompositeForm extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-button-bar': ButtonBar,
      'sl-form': Form,
      'sl-form-field': FormField,
      'sl-inline-message': InlineMessage,
      'sl-radio': Radio,
      'sl-radio-group': RadioGroup,
      'sl-text-field': TextField
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Controller for managing form state. */
  #form = new FormController(this);

  override render(): TemplateResult {
    return html`
      ${this.#form.showValidity
        ? html`<sl-inline-message variant="danger">The form has errors.</sl-inline-message>`
        : nothing}
      <sl-form>
        <sl-form-field label="First name">
          <sl-text-field autofocus name="firstName" required></sl-text-field>
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
            name="otherAge"
            placeholder="Enter your age"
          ></sl-text-field>
        </sl-form-field>

        <sl-button-bar align="end">
          <sl-button @click=${this.#onSave} variant="primary">Save</sl-button>
        </sl-button-bar>
      </sl-form>
      <pre>${JSON.stringify(this.#form.value)}</pre>
    `;
  }

  #onSave(): void {
    this.#form.reportValidity();
  }
}
