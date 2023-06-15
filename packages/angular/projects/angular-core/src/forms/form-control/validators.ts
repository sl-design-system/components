import {AbstractControl, ValidationErrors} from "@angular/forms";
import {ValidationValue, Validator} from "@sl-design-system/shared";

export function ValidateUrl(control: AbstractControl): ValidationErrors | null {
  if (!control.value.startsWith('https') || !control.value.includes('.com')) {
    return { invalidUrl: true };
  }
  return null;
}

/*
export function requiredValidator(control: AbstractControl): ValidationErrors | null {
  // attribute: 'required',
  // key: 'valueMissing',
  // message: 'Please fill out this field',
  // isValid(instance: HTMLElement & { required: boolean }, value: ValidationValue): boolean {
  //   let valid = true;

    if (!control.value) {
      // valid = false;
      return { valueMissing: true };
    }

    return null;
  // }
}
*/
