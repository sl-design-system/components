import {
  type EventEmitter,
  EventsController,
  type Path,
  type PathKeys,
  event,
  getValueByPath,
  setValueByPath
} from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { type FormControl, type SlFormControlEvent } from './form-control-mixin.js';
import { FormField, type SlFormFieldEvent } from './form-field.js';
import styles from './form.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-form': Form;
  }
}

export type SlResetEvent = CustomEvent<void> & { target: Form };
export type SlSubmitEvent = CustomEvent<void> & { target: Form };

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
  /** @internal */
  static override styles: CSSResultGroup = styles;

  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, {
    'sl-form-control': this.#onFormControl,
    'sl-form-field': this.#onFormField
  });

  #showValidity = false;

  /**
   * The form value explicitly set; this may be set before the form controls have
   * registered themselves with the form. So we cache this value so that we can
   * set it on the form controls when they are ready.
   */
  #value: T | undefined;

  /** Value when the form is initialized, used when the form is reset. */
  #initialValue: T | undefined;

  /** The controls in the form; not necessarily the same amount as the fields. */
  controls: Array<HTMLElement & FormControl> = [];

  /** The fields in the form. */
  fields: FormField[] = [];

  /** A form is marked dirty when the user has modified a form control. */
  get dirty(): boolean {
    return this.controls.some(c => c.dirty);
  }

  /** Will disable the entire form when true. */
  @property({ type: Boolean }) disabled?: boolean;

  /** Whether the form is invalid. */
  get invalid(): boolean {
    return !this.valid;
  }

  /** A form is marked pristine as long as the user hasn't modified anything in the form. */
  get pristine(): boolean {
    return !this.dirty;
  }

  /** @internals Emits when the form has been reset. */
  @event({ name: 'sl-reset' }) resetEvent!: EventEmitter<SlResetEvent>;

  /** Indicates whether to show validity state. */
  get showValidity(): boolean {
    return this.#showValidity;
  }

  /** @internal Emits when the form is to be submitted. */
  @event({ name: 'sl-submit' }) submitEvent!: EventEmitter<SlSubmitEvent>;

  /** A form is marked touched once the user has triggered a blur event on a form control. */
  get touched(): boolean {
    return this.controls.some(c => c.touched);
  }

  /** A form is marked untouched as long as the user hasn't trigger a blur event on a form control. */
  get untouched(): boolean {
    return !this.touched;
  }

  /** Whether the form is valid. */
  get valid(): boolean {
    return this.controls.every(c => c.valid);
  }

  /** The aggregated value of all form controls. */
  get value(): T {
    const value = this.controls.reduce((value, control) => {
      if (control.name) {
        setValueByPath(value as T, control.name as PathKeys<T>, control.formValue as Path<T, PathKeys<T>>);
      }
      return value;
    }, {}) as T;

    if (!this.#initialValue && !!value) {
      this.#initialValue = value;
    }

    return value;
  }

  @property({ attribute: false })
  set value(value: T | undefined) {
    this.#value = value;

    if (value) {
      this.controls.filter(c => c.name).forEach(c => (c.formValue = getValueByPath(value, c.name! as PathKeys<T>)));
    } else {
      this.controls.forEach(c => (c.formValue = undefined));
    }
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    this.#initialValue = this.#value;
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('disabled')) {
      this.controls.forEach(control => (control.disabled = this.disabled));
    }
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }

  /** Calls `reportValidity()` on all form controls and returns if they are all valid. */
  reportValidity(): boolean {
    this.#showValidity = true;

    // First .map(), then .every() to ensure all reportValidity() calls are made
    return this.controls.map(c => c.reportValidity()).every(Boolean);
  }

  /** If the form is valid, it will emit an `sl-submit` event. */
  requestSubmit(): void {
    if (this.reportValidity()) {
      this.submitEvent.emit();
    }
  }

  /** Puts all the initial values of the form controls back and updates the validity of all fields. */
  reset(): void {
    this.controls.map(c => {
      if (c.name) {
        c.reset(this.#initialValue?.[c.name]);
      }
    });

    this.resetEvent.emit();
  }

  #onFormControl(event: SlFormControlEvent): void {
    const control = event.target;

    event.preventDefault();
    event.stopPropagation();

    // Allow the control to unregister itself; this is necessary because by the
    // time `disconnectedCallback` is called, the control has already
    // been removed from the DOM; so any events emitted will never reach the form.
    event.detail.unregister = () => {
      this.controls = this.controls.filter(c => c !== control);
    };

    // Wait for the next frame change the control's properties
    requestAnimationFrame(() => {
      if (control.name && this.#value) {
        control.formValue = getValueByPath(this.#value, control.name as PathKeys<T>);
      }

      if (this.disabled) {
        control.disabled = this.disabled;
      }

      this.controls = [...this.controls, control];
    });
  }

  async #onFormField(event: SlFormFieldEvent): Promise<void> {
    const field = event.target;

    event.preventDefault();
    event.stopPropagation();

    // Allow the field to unregister itself; this is necessary because by the
    // time `disconnectedCallback` is called, the field has already
    // been removed from the DOM; so any events emitted will never reach the form.
    event.detail.unregister = () => {
      this.fields = this.fields.filter(f => f !== field);
      this.#updateMarkedFields();
    };

    this.fields = [...this.fields, field];

    // Give the form field time to set the control
    await field.updateComplete;
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
