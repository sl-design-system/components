import type { DirectiveResult } from 'lit/directive.js';
import type { ReactiveControllerHost } from 'lit';
import type { ValidatorFn } from './validators.js';
import { type Signal, computed } from '@lit-labs/preact-signals';
import { AbstractControl } from './abstract-control.js';
import { bind } from './bind-directive.js';

export type FormGroupValue<Type> = {
  [Property in keyof Type]: Type[Property] extends AbstractControl ? Type[Property]['initialValue'] : never;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class FormGroup<T extends Record<string, AbstractControl> = any> extends AbstractControl<FormGroupValue<T>> {
  override value: Signal<FormGroupValue<T> | undefined> = computed(() => {
    const value: FormGroupValue<T> = {} as FormGroupValue<T>;

    Object.keys(this.controls).forEach((key: keyof T) => {
      const control = this.find(key.toString());

      if (control?.value?.value) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        value[key] = control.value.value as unknown as any;
      }
    });

    return value;
  });

  constructor(host: ReactiveControllerHost, public controls: T, validators: ValidatorFn[] = []) {
    super(host, undefined, validators);
  }

  override bind(name: string): DirectiveResult {
    return bind(this.get(name), name);
  }

  override find(name: keyof T): AbstractControl<T[keyof T]> | null {
    return this.controls[name] || null;
  }

  /**
   * Set's the value of each control in the group.
   * @param value the form group value
   */
  override setValue(value?: FormGroupValue<T>): void {
    Object.keys(value ?? {}).forEach(key => {
      this.get(key)?.setValue(value![key]);
    });
  }
}
