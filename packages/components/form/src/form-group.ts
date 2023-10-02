import type { DirectiveResult } from 'lit/directive.js';
import type { ReactiveControllerHost } from 'lit';
import { AbstractControl } from './abstract-control.js';
import { bind } from './bind-directive.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class FormGroup<T extends Record<string, AbstractControl> = any> extends AbstractControl {
  constructor(host: ReactiveControllerHost, public controls: T) {
    super(host);
  }

  override bind(): DirectiveResult {
    return bind(this);
  }

  override getRawValue(): string {
    return this.value;
  }

  override setValue(value: string): void {
    this.value = value;
  }

  override patchValue(value: string): void {
    this.value = value;
  }
}
