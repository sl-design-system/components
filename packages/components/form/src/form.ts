import { EventsController } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { type FormControl, type SlFormControlEvent } from './form-control-mixin.js';
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
    'sl-form-control': this.#onFormControl,
    'sl-form-field': this.#onFormField
  });

  #showValidity = false;

  /** The controls in the form; not necessarily the same amount as the fields. */
  controls: Array<HTMLElement & FormControl> = [];

  /** The fields in the form. */
  fields: FormField[] = [];

  /** A form is marked dirty when the user has modified a form control. */
  get dirty(): boolean {
    return this.controls.map(c => c.dirty).some(Boolean);
  }

  /** Whether the form is invalid. */
  get invalid(): boolean {
    return !this.valid;
  }

  /** A form is marked pristine as long as the user hasn't modified anything in the form. */
  get pristine(): boolean {
    return !this.dirty;
  }

  /** Indicates whether to show validity state. */
  get showValidity(): boolean {
    return this.#showValidity;
  }

  /** A form is marked touched once the user has triggered a blur event on a form control. */
  get touched(): boolean {
    return this.controls.map(c => c.touched).some(Boolean);
  }

  /** Whether the form is valid. */
  get valid(): boolean {
    return this.controls.map(c => c.valid).every(Boolean);
  }

  /** A form is marked untouched as long as the user hasn't trigger a blur event on a form control. */
  get untouched(): boolean {
    return !this.touched;
  }

  /** The aggregated value of all form fields. */
  get value(): T {
    return Object.fromEntries(
      this.controls
        .map(control => [control.name, control.formValue])
        .filter(
          (entry): entry is [keyof T, T[keyof T]] =>
            entry != null && !!entry[0] && entry[1] != null && entry[1] !== undefined
        )
    ) as T;
  }

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#onSlotchange}></slot>`;
  }

  /** Calls `reportValidity()` on all form controls. */
  reportValidity(): boolean {
    this.#showValidity = true;

    return this.controls.map(c => c.reportValidity()).every(Boolean);
  }

  #onFormControl(event: SlFormControlEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.controls = [...this.controls, event.target];
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
