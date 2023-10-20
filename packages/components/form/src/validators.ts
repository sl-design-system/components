import type { FormControl } from './form-control.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ValidatorErrors = { [key: string]: any };

export type ValidatorFn = (control: FormControl) => ValidatorErrors | null;

export class Validators {
  static required(): ValidatorFn {
    return control => (control.value ? null : { required: true });
  }

  // static minLength(minLength: number): ValidatorFn {
  //   return control => {
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //     return control.value && control.value.length >= minLength ? null : { minLength: true };
  //   };
  // }

  // static maxLength(maxLength: number): ValidatorFn {
  //   return control => {
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //     return control.value && control.value.length <= maxLength ? null : { maxLength: true };
  //   };
  // }
}
