import type { DirectiveResult } from 'lit/directive.js';
import type { ReactiveControllerHost } from 'lit';
import type { ValidatorFn } from './validators.js';
import { AbstractControl } from './abstract-control.js';
import { bind } from './bind-directive.js';

export type FormGroupValue<Type> = {
  [Property in keyof Type]: Type[Property] extends AbstractControl ? Type[Property]['value'] : never;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class FormGroup<T extends Record<string, AbstractControl> = any> extends AbstractControl {
  constructor(host: ReactiveControllerHost, public controls: T, validators: ValidatorFn[] = []) {
    super(host, validators);
  }

  override bind(name: string): DirectiveResult {
    return bind(this.get(name), name);
  }

  override getRawValue(): FormGroupValue<T> {
    return this.value;
  }

  override setValue(value: Partial<FormGroupValue<T>>): void {
    this.value = value;
  }

  override patchValue(value: Partial<FormGroupValue<T>>): void {
    this.value = value;
  }

  override _find(name: string): AbstractControl | null {
    return this.controls[name] || null;
  }
}
