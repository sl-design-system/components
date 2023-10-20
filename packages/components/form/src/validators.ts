import type { Signal } from '@lit-labs/preact-signals';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ValidatorErrors = { [key: string]: any };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ValidatorFn = (value: Signal<any>) => ValidatorErrors | null;

export class Validators {
  static required: ValidatorFn = value => (value.value ? null : { required: true });

  static minLength(minLength: number): ValidatorFn {
    return value => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return value.value && value.value.length >= minLength ? null : { minLength: true };
    };
  }

  static maxLength(maxLength: number): ValidatorFn {
    return value => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return value.value && value.value.length <= maxLength ? null : { maxLength: true };
    };
  }
}
