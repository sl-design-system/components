import type { CSSResultGroup, TemplateResult } from 'lit';
import type { FormField } from './form-field.js';
import { EventsController } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import styles from './form.scss.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-form-field': CustomEvent;
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

  get showValidity(): boolean {
    return this.#showValidity;
  }

  get valid(): boolean {
    return this.fields.map(f => f.control?.valid).every(Boolean);
  }

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

  reportValidity(): boolean {
    this.#showValidity = true;

    return this.fields.map(f => f.control?.reportValidity()).every(Boolean);
  }

  #onFormField(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.fields = [...this.fields, event.target as FormField];
  }

  #onSlotchange(): void {
    this.fields = this.fields.filter(f => !!f.parentElement);
  }
}
