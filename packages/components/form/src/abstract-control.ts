import type { ReactiveController, ReactiveControllerHost } from 'lit';
import type { DirectiveResult } from 'lit/directive.js';
import type { AsyncValidatorFn, ValidatorErrors, ValidatorFn } from './validators.js';
import type { Signal } from '@lit-labs/preact-signals';
import { computed, effect, signal } from '@lit-labs/preact-signals';
import { FormControlAdapter } from './adapter.js';

export type AbstractControlUpdateOn = 'change' | 'blur' | 'submit';

export interface AbstractControlOptions {
  validators?: ValidatorFn[];
  asyncValidators?: AsyncValidatorFn[];
  updateOn?: AbstractControlUpdateOn;
}

export type AbstractControlStatus = 'valid' | 'invalid' | 'pending' | 'disabled';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class AbstractControl<T = any> implements ReactiveController {
  adapter: FormControlAdapter<T> | null = null;
  host: ReactiveControllerHost;
  initialValue?: T;
  validators: ValidatorFn[];
  asyncValidators: AsyncValidatorFn[] = [];
  disposeAsyncValidators: () => void;
  disposeSyncAdapterValue?: () => void;
  updateOn: AbstractControlUpdateOn = 'change';

  /** A signal containing any async validator errors. */
  readonly asyncErrors = signal({} as ValidatorErrors);

  /** A signal containing any non-async validator errors. */
  readonly syncErrors = computed<ValidatorErrors>(() => {
    return this.validators.reduce((errors: ValidatorErrors, validator: ValidatorFn) => {
      const error = validator(this.value);

      return error ? { ...errors, ...error } : errors;
    }, {});
  });

  /** A signal containing all validator errors (sync and async). */
  readonly errors = computed<ValidatorErrors>(() => ({ ...this.syncErrors.value, ...this.asyncErrors.value }));

  /** A signal indicating whether the control is invalid. */
  readonly invalid = computed<boolean>(() => Object.keys(this.errors.value).length > 0);

  /** A signal indicating whether the control is valid. */
  readonly valid = computed<boolean>(() => !this.invalid.value);

  /** A signal containing the current value of the control. */
  readonly value: Signal<T | undefined> = signal(undefined);

  constructor(
    host: ReactiveControllerHost,
    initialValue: T | undefined,
    validatorOrOptions?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    (this.host = host).addController(this);
    this.value.value = this.initialValue = initialValue;

    if (typeof validatorOrOptions === 'function') {
      this.validators = [validatorOrOptions];
    } else if (Array.isArray(validatorOrOptions)) {
      this.validators = validatorOrOptions.slice();
    } else {
      this.asyncValidators = validatorOrOptions?.asyncValidators ?? [];
      this.updateOn = validatorOrOptions?.updateOn ?? 'change';
      this.validators = validatorOrOptions?.validators ?? [];
    }

    if (typeof asyncValidators === 'function') {
      this.asyncValidators = [asyncValidators];
    } else if (Array.isArray(asyncValidators)) {
      this.asyncValidators = asyncValidators.slice();
    }

    this.disposeAsyncValidators = effect(() => {
      if (this.asyncValidators.length === 0) {
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-floating-promises, @typescript-eslint/promise-function-async
      Promise.all(this.asyncValidators.map(validator => validator(this.value))).then(
        (errors: Array<ValidatorErrors | null>) => {
          console.log('validated', errors);

          this.asyncErrors.value = errors
            .filter((err): err is ValidatorErrors => !!err)
            .reduce((errors: ValidatorErrors, error: ValidatorErrors) => {
              return error ? { ...errors, ...error } : errors;
            }, {});
        }
      );
    });
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
      this.disposeSyncAdapterValue?.();
      this.adapter?.disconnect();
      this.adapter = null;

      return;
    }

    this.adapter = FormControlAdapter.create<T>(host, { updateOn: this.updateOn });

    // This effect synchronizes the adapter value with the value here
    this.disposeSyncAdapterValue = effect(() => {
      this.value.value = this.adapter!.value.value;
    });

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
