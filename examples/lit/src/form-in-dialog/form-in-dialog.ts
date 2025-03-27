import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { Dialog } from '@sl-design-system/dialog';
import { Form, FormController, FormField, FormValidationErrors } from '@sl-design-system/form';
import { TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, type TemplateResult, html } from 'lit';
import styles from './form-in-dialog.scss.js';

export class FormInDialog extends Dialog {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      ...super.scopedElements,
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

  override renderHeader(): TemplateResult {
    return super.renderHeader('Form in dialog');
  }

  override renderBody(): TemplateResult {
    return html`
      <sl-form>
        <sl-form-field label="First name">
          <sl-text-field autofocus name="firstName" required></sl-text-field>
        </sl-form-field>
        <sl-form-field label="Last name">
          <sl-text-field name="lastName" required></sl-text-field>
        </sl-form-field>

        <sl-form-validation-errors .controller=${this.#form}></sl-form-validation-errors>
      </sl-form>
    `;
  }

  override renderActions(): TemplateResult {
    return html`
      <sl-button sl-dialog-close fill="ghost" slot="actions">Cancel</sl-button>
      <sl-button @click=${this.#onSave} slot="actions" variant="primary">Save</sl-button>
    `;
  }

  #onSave(): void {
    if (this.#form.reportValidity()) {
      this.close();
    }
  }
}
