import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { ButtonBar } from '@sl-design-system/button-bar';
import { Form, FormController, FormField } from '@sl-design-system/form';
import { TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { type Address, ChildForm } from './child-form.js';
import styles from './nested-form.scss.js';

type Profile = {
  user: {
    firstName: string;
    lastName: string;
    address: Address;
  };
};

export class NestedForm extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'example-child-form': ChildForm,
      'sl-button': Button,
      'sl-button-bar': ButtonBar,
      'sl-form': Form,
      'sl-form-field': FormField,
      'sl-text-field': TextField
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  #form = new FormController<Profile>(this);

  override render(): TemplateResult {
    return html`
      <sl-form>
        <sl-form-field label="First name">
          <sl-text-field name="user.firstName" required></sl-text-field>
        </sl-form-field>

        <sl-form-field label="Last name">
          <sl-text-field name="user.lastName" required></sl-text-field>
        </sl-form-field>

        <sl-form-field label="Address">
          <example-child-form name="user.address" required></example-child-form>
        </sl-form-field>

        <sl-button-bar align="end">
          <sl-button @click=${this.#onClick}>Submit</sl-button>
        </sl-button-bar>
      </sl-form>
      <pre>${JSON.stringify(this.#form.value ?? {}, null, 2)}</pre>
    `;
  }

  #onClick() {
    this.#form.reportValidity();
  }
}
