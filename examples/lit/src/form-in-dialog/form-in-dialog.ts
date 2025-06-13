import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { Checkbox } from '@sl-design-system/checkbox';
import { Dialog } from '@sl-design-system/dialog';
import { Error, Form, FormController, FormField, FormValidationErrors, Label } from '@sl-design-system/form';
import { Option } from '@sl-design-system/listbox';
import { NumberField } from '@sl-design-system/number-field';
import { Select } from '@sl-design-system/select';
import { TextArea } from '@sl-design-system/text-area';
import { TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { state } from 'lit/decorators.js';
import styles from './form-in-dialog.scss.js';

export class FormInDialog extends Dialog {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      ...super.scopedElements,
      'sl-checkbox': Checkbox,
      'sl-error': Error,
      'sl-form': Form,
      'sl-form-field': FormField,
      'sl-form-validation-errors': FormValidationErrors,
      'sl-label': Label,
      'sl-number-field': NumberField,
      'sl-option': Option,
      'sl-select': Select,
      'sl-text-area': TextArea,
      'sl-text-field': TextField
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = [Dialog.styles, styles];

  /** Controller for managing form state. */
  #form = new FormController<{
    type: string;
    description?: string;
    indefinitely: boolean;
    rentalPeriodAmount?: number;
    rentalPeriodUnit?: string;
    amount: number;
    deposit: number;
  }>(this);

  /** @internal Invalid rental period state. */
  @state() invalidRentalPeriod?: boolean;

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    this.#form.value = {
      type: 'Small',
      indefinitely: true,
      amount: 15,
      deposit: 15
    };
  }

  override renderHeader(): TemplateResult {
    return super.renderHeader('Change locker type');
  }

  override renderBody(): TemplateResult {
    return html`
      <sl-form @sl-update-validity=${this.#onUpdateValidity}>
        <sl-form-field label="Type">
          <sl-text-field autofocus name="type" required></sl-text-field>
        </sl-form-field>
        <sl-form-field label="Description">
          <sl-text-area name="description"></sl-text-area>
        </sl-form-field>
        <sl-form-field>
          <sl-label mark="required">Rental period</sl-label>
          <sl-checkbox name="indefinitely">Indefinitely</sl-checkbox>
          <div class="container">
            <sl-number-field
              ?disabled=${this.#form.value?.indefinitely}
              name="rentalPeriodAmount"
              placeholder="0"
            ></sl-number-field>
            <sl-select ?disabled=${this.#form.value?.indefinitely} name="rentalPeriodUnit" placeholder="Select unit">
              <sl-option value="day">Day</sl-option>
              <sl-option value="week">Week</sl-option>
              <sl-option value="month">Month</sl-option>
              <sl-option value="year">Year</sl-option>
            </sl-select>
          </div>
          ${this.invalidRentalPeriod ? html`<sl-error>Please select a rental period.</sl-error>` : nothing}
        </sl-form-field>
        <sl-form-field class="amount" label="Amount">
          <sl-number-field
            .formatOptions=${{ style: 'currency', currency: 'EUR' }}
            name="amount"
            required
          ></sl-number-field>
        </sl-form-field>
        <sl-form-field class="deposit" label="Deposit">
          <sl-number-field
            .formatOptions=${{ style: 'currency', currency: 'EUR' }}
            name="deposit"
            required
          ></sl-number-field>
        </sl-form-field>

        <sl-form-validation-errors .controller=${this.#form}></sl-form-validation-errors>
      </sl-form>
    `;
  }

  override renderPrimaryActions(): TemplateResult {
    return html`
      <sl-button sl-dialog-close>Cancel</sl-button>
      <sl-button @click=${this.#onSave} variant="primary">Save</sl-button>
    `;
  }

  #onSave(): void {
    if (this.#form.reportValidity()) {
      this.close();
    }
  }

  #onUpdateValidity(): void {
    const { rentalPeriodAmount, rentalPeriodUnit, indefinitely } = this.#form.value || {};

    this.invalidRentalPeriod = !indefinitely && (!rentalPeriodAmount || !rentalPeriodUnit);
  }
}
