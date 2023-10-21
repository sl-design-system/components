import type { ReactiveController, ReactiveControllerHost } from 'lit';
import type { DirectiveResult } from 'lit/directive.js';
import type { AsyncValidatorFn, ValidatorErrors, ValidatorFn } from './validators.js';
import { computed } from '@lit-labs/preact-signals';
import { FormControlAdapter } from './adapter.js';

export type AbstractControlStatus = 'valid' | 'invalid' | 'pending' | 'disabled';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class AbstractControl<T = any> implements ReactiveController {
  adapter: FormControlAdapter<T> | null = null;
  host: ReactiveControllerHost;
  initialValue?: T;
  validators: Array<AsyncValidatorFn | ValidatorFn>;

  /** A signal containing any validator errors (if any). */
  readonly errors = computed<ValidatorErrors>(() => {
    return this.validators.reduce((errors: ValidatorErrors, validator: ValidatorFn) => {
      const error = validator(this.value);

      return error ? { ...errors, ...error } : errors;
    }, {});
  });

  /** A signal indicating whether the control is invalid. */
  readonly invalid = computed<boolean>(() => Object.keys(this.errors.value).length > 0);

  /** A signal indicating whether the control is valid. */
  readonly valid = computed<boolean>(() => !this.invalid.value);

  /** A signal containing the current value of the control. */
  readonly value = computed<T | undefined>(() => this.adapter?.value.value);

  constructor(
    host: ReactiveControllerHost,
    initialValue: T | undefined,
    validators: Array<AsyncValidatorFn | ValidatorFn>
  ) {
    (this.host = host).addController(this);
    this.initialValue = initialValue;
    this.validators = validators.slice();
  }

  /** @private */
  hostConnected(): void {}

  /**
   * This is used to bind an element to this control. This is used by the bind() directive.
   * @param name the name of the control to bind
   */
  abstract bind(name: string): DirectiveResult;

  /**
   * Retrieves a child control given the control's name.
   * @param name - The name of the control to find.
   * @returns The control associated with the specified name, or null if not found.
   */
  find(_name: string): AbstractControl | null {
    return null;
  }

  /**
   * Retrieves a child control given the control's path.
   * @param path - The path of the child control's name to retrieve.
   * @returns The child control associated with the specified path, or null if not found.
   */
  get(path: string | string[]): AbstractControl | null {
    const paths: string[] = Array.isArray(path) ? path : path.split('.');

    return paths.reduce((control: AbstractControl | null, name: string) => {
      return control?.find(name) || null;
    }, this);
  }

  /**
   * Set's the element bound to this control by the bind() directive. This causes an adapter
   * to be created for the element.
   * @param host the element bound to this control by the bind() directive
   */
  setBoundElement(host: Element | null): void {
    if (!host) {
      this.adapter?.disconnect();
      this.adapter = null;

      return;
    }

    this.adapter = FormControlAdapter.create<T>(host);

    if (this.adapter === undefined) {
      throw new Error(`Could not find a form control adapter for element: ${host.tagName.toLowerCase()}`);
    }

    this.setValue(this.initialValue);
  }

  /**
   * Set's the value of the control.
   * @param value the value to set on the control or undefined if resetting the control
   */
  setValue(value?: T): void {
    this.adapter?.setValue(value);
  }
}
