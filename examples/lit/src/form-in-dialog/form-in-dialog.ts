import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Dialog } from '@sl-design-system/dialog';
import { Form, FormController, FormField, FormValidationErrors } from '@sl-design-system/form';
import { TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { query } from 'lit/decorators.js';
import styles from './form-in-dialog.scss.js';

export class FormInDialog extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-dialog': Dialog,
      'sl-form': Form,
      'sl-form-field': FormField,
      'sl-form-validation-errors': FormValidationErrors,
      'sl-text-field': TextField
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Controller for managing form state. */
  #form = new FormController(this);

  /** The dialog component. */
  @query('sl-dialog') dialog!: Dialog;

  override render(): TemplateResult {
    return html`
      <sl-dialog>
        <span slot="title">Title</span>
        <sl-form>
          <sl-form-field label="First name">
            <sl-text-field autofocus name="firstName" required></sl-text-field>
          </sl-form-field>
          <sl-form-field label="Last name">
            <sl-text-field name="lastName" required></sl-text-field>
          </sl-form-field>

          <sl-form-validation-errors .controller=${this.#form}></sl-form-validation-errors>
        </sl-form>
        <sl-button sl-dialog-close fill="ghost" slot="actions">Cancel</sl-button>
        <sl-button @click=${this.#onSave} slot="actions" variant="primary">Save</sl-button>
      </sl-dialog>
    `;
  }

  showModal(): void {
    this.dialog.showModal();
  }

  #onSave(): void {
    if (this.#form.reportValidity()) {
      this.dialog.close();
    }
  }
}
