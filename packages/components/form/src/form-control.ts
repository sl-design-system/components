import type { DirectiveResult } from 'lit/directive.js';
import type { ReactiveControllerHost } from 'lit';
import { AbstractControl } from './abstract-control.js';
import { bind } from './bind-directive.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class FormControl<T = any> extends AbstractControl {
  readonly defaultValue: T = null as unknown as T;

  constructor(host: ReactiveControllerHost, value: T) {
    super(host);

    this.value = value;
    this.defaultValue = value;
  }

  override bind(): DirectiveResult {
    return bind(this);
  }

  override getRawValue(): T {
    return this.value;
  }

  override setValue(value: T): void {
    this.value = value;
  }

  override patchValue(value: T): void {
    this.value = value;
  }
}
