import type { DirectiveResult } from 'lit/directive.js';
import type { ReactiveControllerHost } from 'lit';
import type { AsyncValidatorFn, ValidatorFn } from './validators.js';
import type { AbstractControlOptions } from './abstract-control.js';
import { AbstractControl } from './abstract-control.js';
import { bind } from './bind-directive.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class FormControl<T = any> extends AbstractControl<T> {
  constructor(
    host: ReactiveControllerHost,
    initialValue: T,
    validatorOrOptions?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(host, initialValue, validatorOrOptions, asyncValidators);
  }

  override bind(): DirectiveResult {
    return bind(this);
  }
}
