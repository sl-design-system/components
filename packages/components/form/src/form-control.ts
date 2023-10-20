import type { DirectiveResult } from 'lit/directive.js';
import type { ReactiveControllerHost } from 'lit';
import type { ValidatorFn } from './validators.js';
import { AbstractControl } from './abstract-control.js';
import { bind } from './bind-directive.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class FormControl<T = any> extends AbstractControl {
  constructor(host: ReactiveControllerHost, initialValue: T, validators: ValidatorFn[] = []) {
    super(host, initialValue, validators);
  }

  override bind(): DirectiveResult {
    return bind(this);
  }
}
