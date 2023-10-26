import type { ReactiveControllerHost } from 'lit';
import type { AbstractControlOptions } from './abstract-control.js';
import type { AsyncValidatorFn, ValidatorFn } from './validators.js';
import type { DirectiveResult } from 'lit/directive.js';
import type { Signal } from '@lit-labs/preact-signals';
import { computed, signal } from '@lit-labs/preact-signals';
import { AbstractControl } from './abstract-control.js';
import { bind } from './bind-directive.js';

export type FormArrayValue<Type> = Array<{
  [Property in keyof Type]: Type[Property] extends AbstractControl ? Type[Property]['initialValue'] : never;
}>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class FormArray<T extends AbstractControl = any> extends AbstractControl<FormArrayValue<T>> {
  /** A signal containing all the controls in the array. */
  readonly controls: Signal<T[]> = signal([]);

  /** A computed signal with all the values in the array. */
  override readonly value = computed(() => {
    return this.controls.value.map(control => control.value.value) as FormArrayValue<T>;
  });

  get length(): number {
    return this.controls.value.length;
  }

  constructor(
    host: ReactiveControllerHost,
    controls: T[],
    validatorOrOptions?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(host, undefined, validatorOrOptions, asyncValidators);

    this.controls.value = controls;
  }

  append(control: T): void {
    this.controls.value = [...this.controls.value, control];
  }

  at(index: number): T | undefined {
    return this.controls.value.at(index);
  }

  override bind(): DirectiveResult {
    return bind(this);
  }

  insertAt(index: number, control: T): void {
    this.controls.value = [...this.controls.value.slice(0, index), control, ...this.controls.value.slice(index)];
  }

  prepend(control: T): void {
    this.controls.value = [control, ...this.controls.value];
  }

  removeAt(index: number): void {
    const control = this.at(index);

    this.controls.value = this.controls.value.filter(c => c !== control);
  }

  clear(): void {
    this.controls.value = [];
  }

  override setValue(value?: FormArrayValue<T>): void {
    if (value?.length !== this.length) {
      throw new Error('The length of the value array must match the amount of controls');
    }

    value?.forEach((v, index) => this.at(index)?.setValue(v));
  }
}
