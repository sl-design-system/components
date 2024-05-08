import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Dialog } from '@sl-design-system/dialog';
import { Form, FormController, FormField } from '@sl-design-system/form';
import { InlineMessage } from '@sl-design-system/inline-message';
import { TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
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
      'sl-inline-message': InlineMessage,
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
        ${this.#form.invalid && this.#form.showValidity
          ? html`<sl-inline-message variant="danger">The form has errors.</sl-inline-message>`
          : nothing}
        <sl-form>
          <sl-form-field label="First name">
            <sl-text-field autofocus name="firstName" required></sl-text-field>
          </sl-form-field>
          <sl-form-field label="Last name">
            <sl-text-field name="lastName" required></sl-text-field>
          </sl-form-field>
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
