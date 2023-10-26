import type { Signal } from '@lit-labs/preact-signals';
import { msg, str } from '@lit/localize';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ValidatorErrors = { [key: string]: { message: string } };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ValidatorFn = (value: Signal<any>) => ValidatorErrors | null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AsyncValidatorFn = (value: Signal<any>) => Promise<ValidatorErrors | null>;

export class Validators {
  static required: ValidatorFn = value => {
    if (
      value.value === null ||
      ((typeof value.value === 'string' || Array.isArray(value.value)) && value.value.length === 0)
    ) {
      return { required: { message: msg('Please fill in this field') } };
    } else {
      return null;
    }
  };

  static minLength(minLength: number): ValidatorFn {
    return value => {
      if (typeof value.value === 'string' || Array.isArray(value.value)) {
        return value.value.length >= minLength
          ? null
          : {
              minLength: {
                message: msg(
                  str`Please enter a minimum of ${minLength} characters or more (you have currently entered ${value.value.length} characters)`
                )
              }
            };
      } else {
        return null;
      }
    };
  }

  static maxLength(maxLength: number): ValidatorFn {
    return value => {
      if (typeof value.value === 'string' || Array.isArray(value.value)) {
        return value.value.length <= maxLength
          ? null
          : {
              maxLength: {
                message: msg(
                  str`Please enter no more than ${maxLength} characters (you have currently entered ${value.value.length} characters)`
                )
              }
            };
      } else {
        return null;
      }
    };
  }
}
