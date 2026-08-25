import { type EventEmitter } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { type FormControl } from './form-control-mixin.js';
import { FormField } from './form-field.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-form': Form;
  }
}
export type SlResetEvent = CustomEvent<void> & {
  target: Form;
};
export type SlSubmitEvent = CustomEvent<void> & {
  target: Form;
};
/**
 * This component is a wrapper for the form controls.
 *
 * It is used to provide the ability to report the validity of all the form controls, not just the
 * invalid ones. By calling the `reportValidity()` method, it in turn will call the
 * `reportValidity()` methods of all the form controls.
 *
 * This wrapper is necessary because the native form lacks this behavior. See
 * https://github.com/whatwg/html/issues/9878
 */
export declare class Form<T extends Record<string, any> = Record<string, any>> extends LitElement {
  #private;
  /** @internal */
  static styles: CSSResultGroup;
  /** The controls in the form; not necessarily the same amount as the fields. */
  controls: Array<HTMLElement & FormControl>;
  /** The fields in the form. */
  fields: FormField[];
  /** A form is marked dirty when the user has modified a form control. */
  get dirty(): boolean;
  /** Will disable the entire form when true. */
  disabled?: boolean;
  /** Whether the form is invalid. */
  get invalid(): boolean;
  /** A form is marked pristine as long as the user hasn't modified anything in the form. */
  get pristine(): boolean;
  /** @internals Emits when the form has been reset. */
  resetEvent: EventEmitter<SlResetEvent>;
  /** Indicates whether to show validity state. */
  get showValidity(): boolean;
  /** @internal Emits when the form is to be submitted. */
  submitEvent: EventEmitter<SlSubmitEvent>;
  /** A form is marked touched once the user has triggered a blur event on a form control. */
  get touched(): boolean;
  /** A form is marked untouched as long as the user hasn't trigger a blur event on a form control. */
  get untouched(): boolean;
  /** Whether the form is valid. */
  get valid(): boolean;
  /** The aggregated value of all form controls. */
  get value(): T;
  set value(value: T | undefined);
  firstUpdated(changes: PropertyValues<this>): void;
  updated(changes: PropertyValues<this>): void;
  protected getUpdateComplete(): Promise<boolean>;
  render(): TemplateResult;
  /** Calls `reportValidity()` on all form controls and returns if they are all valid. */
  reportValidity(): boolean;
  /** If the form is valid, it will emit an `sl-submit` event. */
  requestSubmit(): void;
  /** Puts all the initial values of the form controls back and updates the validity of all fields. */
  reset(): void;
}
