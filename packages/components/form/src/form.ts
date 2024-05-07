import { EventsController } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { type FormField, type SlFormFieldEvent } from './form-field.js';
import styles from './form.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-form': Form;
  }
}

/**
 * This component is a wrapper for the form controls.
 *
 * It is used to provide the ability to report the validity of all the form controls,
 * not just the invalid ones. By calling the `reportValidity()` method, it in turn will
 * call the `reportValidity()` methods of all the form controls.
 *
 * This wrapper is necessary because the native form lacks this behavior.
 * See https://github.com/whatwg/html/issues/9878
 */
export class Form<T extends Record<string, unknown> = Record<string, unknown>> extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Events controller. */
  #events = new EventsController(this, {
    'sl-form-field': this.#onFormField
  });

  #showValidity = false;

  /** The fields in the form. */
  fields: FormField[] = [];

  /** Whether the form is invalid. */
  get invalid(): boolean {
    return !this.valid;
  }

  /** Indicates whether to show validity state. */
  get showValidity(): boolean {
    return this.#showValidity;
  }

  /** Whether the form is valid. */
  get valid(): boolean {
    return this.fields.map(f => f.control?.valid).every(Boolean);
  }

  /** The aggregated value of all form fields. */
  get value(): T {
    return Object.fromEntries(
      this.fields
        .map(f => (f.control ? [f.control.name, f.control.formValue] : null))
        .filter(
          (entry): entry is [keyof T, T[keyof T]] =>
            entry != null && !!entry[0] && entry[1] != null && entry[1] !== undefined
        )
    ) as T;
  }

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#onSlotchange}></slot>`;
  }

  /** Calls `reportValidity()` on all form fields. */
  reportValidity(): boolean {
    this.#showValidity = true;

    return this.fields.map(f => f.control?.reportValidity()).every(Boolean);
  }

  async #onFormField(event: SlFormFieldEvent): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    this.fields = [...this.fields, event.target];

    // Give the form field time to set the control
    await event.target.updateComplete;
    this.#updateMarkedFields();
  }

  #onSlotchange(): void {
    this.fields = this.fields.filter(f => !!f.parentElement);
    this.#updateMarkedFields();
  }

  #updateMarkedFields(): void {
    // Count the required form controls
    const requiredCount = this.fields.reduce((count, field) => {
      return count + (field.control?.required ? 1 : 0);
    }, 0);

    /**
     * If the required form controls outnumber the optional form controls,
     * then mark the optional form controls. If the optional form controls
     * outnumber the required form controls, mark the required form controls.
     * If there is only a single form element, do nothing.
     */
    const optionalCount = this.fields.length - requiredCount,
      mark = requiredCount <= optionalCount ? 'required' : 'optional';

    this.fields.forEach(field => (field.mark = mark));
  }
}
