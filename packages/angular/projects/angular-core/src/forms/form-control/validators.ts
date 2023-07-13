import {AbstractControl, ValidationErrors} from "@angular/forms";
import {ValidationValue, Validator} from "@sl-design-system/shared";

export function ValidateUrl(control: AbstractControl): ValidationErrors | null {
  const otherErrors = control.errors ? Object.keys(control.errors).length : 0;
  console.log('control in custom valdator url', control, control.errors, otherErrors, control.errors ? Object.keys(control.errors)?.find(error => error === 'invalidUrl') : null);
  if ((!control.value.startsWith('https') || !control.value.includes('.com')) && otherErrors <= 1 /*&& otherErrors === null*/) {
    console.log('control in custom valdator url in if', control, control.errors ? Object.keys(control.errors) : null, control.errors ? Object.keys(control.errors).length : null);
    return { invalidUrl: true };
  }
  return null;
}

export function PasswordStrength(control: AbstractControl): ValidationErrors | null {
  const otherErrors = control.errors ? Object.keys(control.errors).length : 0;
  console.log('control in custom valdator url password', control, control.errors, otherErrors, control.errors ? Object.keys(control.errors)?.find(error => error === 'invalidUrl') : null);
  // if ((!control.value.startsWith('https') || !control.value.includes('.com')) && otherErrors <= 1 /*&& otherErrors === null*/) {
  //   console.log('control in custom valdator url in if', control, control.errors ? Object.keys(control.errors) : null, control.errors ? Object.keys(control.errors).length : null);
  //   return { invalidUrl: true };
  // }
  // return null;


  const value = control.value;

  if (!value) {
    return null;
  }

  const hasUpperCase = /[A-Z]+/.test(value);

  const hasLowerCase = /[a-z]+/.test(value);

  const hasNumeric = /[0-9]+/.test(value);

  const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;

  return !passwordValid && otherErrors <= 1 ? { passwordStrength: true }: null;
}

export function StartsWithThisIs(control: AbstractControl): ValidationErrors | null {
  const otherErrors = control.errors ? Object.keys(control.errors).length : 0;
  const value = control.value;

  if (!value) {
    return null;
  }

  const controlValid = value.startsWith('This is');

  return !controlValid && otherErrors <= 1 ? { invalidStart: true }: null;
}

// TODO: move to form stories

