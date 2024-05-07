import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Dialog } from '@sl-design-system/dialog';
import { Form, FormController, FormField } from '@sl-design-system/form';
import { TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import styles from './form-in-dialog.scss.js';

export class FormInDialog extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-dialog': Dialog,
      'sl-form': Form,
      'sl-form-field': FormField,
      'sl-text-field': TextField
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Controller for managing form state. */
  #form = new FormController(this);

  override render(): TemplateResult {
    return html`
      <sl-dialog>
        <span slot="title">Title</span>
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
        </sl-form>
        <sl-button sl-dialog-close fill="ghost" slot="actions">Cancel</sl-button>
        <sl-button @click=${this.#onSave} slot="actions" variant="primary">Save</sl-button>
      </sl-dialog>
    `;
  }

  showModal(): void {
    this.renderRoot.querySelector('sl-dialog')?.showModal();
  }

  #onSave(): void {
    console.log('onSave');
  }
}
