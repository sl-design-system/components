import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Form, FormController, FormField } from '@sl-design-system/form';
import { InlineMessage } from '@sl-design-system/inline-message';
import { TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import styles from './composite-form.scss.js';

export class CompositeForm extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-form': Form,
      'sl-form-field': FormField,
      'sl-inline-message': InlineMessage,
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
          <sl-text-field></sl-text-field>
        </sl-form-field>
        <sl-button-bar>
          <sl-button sl-dialog-close fill="ghost" slot="actions">Cancel</sl-button>
          <sl-button @click=${this.#onSave} slot="actions" variant="primary">Save</sl-button>
        </sl-button-bar>
      </sl-form>
    `;
  }

  #onSave(): void {
    console.log('Save');
  }
}
