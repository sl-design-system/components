import {AbstractControl, ValidationErrors} from "@angular/forms";
import {ValidationValue, Validator} from "@sl-design-system/shared";

export function ValidateUrl(control: AbstractControl): ValidationErrors | null {
  const otherErrors = control.errors ? Object.keys(control.errors).length : null
  console.log('control in custom valdator url', control, control.errors, otherErrors, control.errors ? Object.keys(control.errors)?.find(error => error === 'invalidUrl') : null);
  if ((!control.value.startsWith('https') || !control.value.includes('.com')) && otherErrors <= 1 /*&& otherErrors === null*/) {
    console.log('control in custom valdator url in if', control, control.errors ? Object.keys(control.errors) : null, control.errors ? Object.keys(control.errors).length : null);
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
