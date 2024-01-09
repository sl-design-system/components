import type { CSSResultGroup, TemplateResult } from 'lit';
import type { FormFieldEvent } from './form-field-event.js';
import type { FormField } from './form-field.js';
import type { FormValue } from './form-control-mixin.js';
import { EventsController } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import styles from './form.scss.js';

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
export class Form extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Events controller. */
  #events = new EventsController(this, {
    'sl-form-field': this.#onFormField
  });

  /** The fields in the form. */
  fields: FormField[] = [];

  get value(): Record<string, FormValue> {
    return Object.fromEntries(
      this.fields
        .map(f => (f.control ? [f.control.name, f.control.formValue] : null))
        .filter((entry): entry is [string, FormValue] => entry != null)
    );
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }

  reportValidity(): boolean {
    return this.fields.map(f => f.control?.reportValidity()).every(Boolean);
  }

  #onFormField(event: FormFieldEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (event.state === 'add') {
      this.fields = [...this.fields, event.target as FormField];
    } else {
      this.fields = this.fields.filter(f => f !== event.target);
    }
  }
}
