import { type Constructor } from '@open-wc/dedupe-mixin';
import { type ReactiveElement } from 'lit';
declare global {
  interface GlobalEventHandlersEventMap {
    'sl-form-control': SlFormControlEvent;
    'sl-update-state': SlUpdateStateEvent;
    'sl-update-validity': SlUpdateValidityEvent;
    'sl-validate': SlValidateEvent;
  }
}
export type FormValue = Parameters<ElementInternals['setFormValue']>[0];
export interface NativeFormControlElement extends HTMLElement {
  form: HTMLFormElement | null;
  labels: NodeListOf<HTMLLabelElement> | null;
  name: string;
  validationMessage: string;
  validity: ValidityState;
  reportValidity(): boolean;
  setCustomValidity(message: string): void;
}
export interface CustomFormControlElement extends HTMLElement {
  internals: ElementInternals;
}
export type FormControlElement = NativeFormControlElement | CustomFormControlElement;
export type FormControlShowValidity = 'valid' | 'invalid' | undefined;
export type FormControlValidityState = 'valid' | 'invalid' | 'pending';
export type SlFormControlEvent = CustomEvent<{
  unregister?(): void;
}> & {
  target: HTMLElement & FormControl;
};
export type SlUpdateStateEvent = CustomEvent<void> & {
  target: HTMLElement & FormControl;
};
export type SlUpdateValidityEvent = CustomEvent<{
  valid: boolean;
  validationMessage: string;
  showValidity: FormControlShowValidity;
}> & {
  target: HTMLElement & FormControl;
};
export type SlValidateEvent = CustomEvent<void> & {
  target: HTMLElement & FormControl;
};
export interface FormControl {
  readonly form: HTMLFormElement | null;
  readonly formControlElement: FormControlElement;
  readonly labels: NodeListOf<HTMLLabelElement> | null;
  readonly nativeFormValue: FormValue;
  readonly required?: boolean;
  readonly showValidity: FormControlShowValidity;
  readonly valid: boolean;
  readonly validationMessage: string;
  readonly validity: ValidityState;
  readonly validityState: FormControlValidityState;
  readonly updateComplete?: Promise<boolean>;
  customValidity?: string;
  dirty?: boolean;
  disabled?: boolean;
  formValue: unknown;
  name?: string;
  showValid?: boolean;
  touched?: boolean;
  value?: unknown;
  reportValidity(): boolean;
  reset(value: unknown): void;
  updateState(options: { dirty?: boolean; touched?: boolean }): void;
  updateValidity(emitValidateEvent?: boolean): void;
  updateInternalValidity(): void;
  getLocalizedValidationMessage(): string;
  setCustomValidity(message: string | Promise<string>): void;
  setFormControlElement(element: FormControlElement): void;
}
/**
 * Mixin that adds form control functionality to a component.
 *
 * @slot error-text - The error text to display
 * @slot hint-text - The hint text to display
 */
export declare function FormControlMixin<T extends Constructor<ReactiveElement>>(
  constructor: T
): T & Constructor<FormControl>;
