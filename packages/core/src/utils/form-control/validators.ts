import type { FormControlInterface, FormValue } from './form-control-mixin-old.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type validationMessageCallback = (instance: any, value: FormValue) => string;

/**
 * Generic Validator shape. These objects
 * are used to create Validation behaviors on FormControl
 * instances.
 */
export interface ValidatorBase {
  /**
   * If present, the FormControl object will be re-run
   * when this attribute changes. Some validators won't need this
   * like a validator that ensures a given value can be cast
   * to a number.
   */
  attribute?: string;

  /**
   * This key determines which field on the control's validity
   * object will be toggled when a given Validator is run. This
   * property must exist on the global constraint validation
   * (ValidityState) object. Defaults to `customError`.
   */
  key?: keyof ValidityState;

  /**
   * When a control becomes invalid, this property will be set
   * as the control's validityMessage. If the property is of type
   * string it will be used outright. If it is a function, the
   * returned string will be used as the validation message.
   *
   * One thing to be concerned with is that overriding a given
   * Validator's message property via reference will affect
   * all controls that use that validator. If a user wants to change
   * the default message, it is best to clone the validator and
   * change the message that way.
   *
   * Validation messages can also be changed by using the
   * FormControl.prototype.validityCallback, which takes a given
   * ValidityState key as an argument and must return a validationMessage
   * for the given instance.
   */
  message: string | validationMessageCallback;
}

export interface SyncValidator extends ValidatorBase {
  /**
   * Callback for a given validator. Takes the FormControl instance
   * and the form control value as arguments and returns a
   * boolean to evaluate for that Validator.
   * @param instance {FormControlInterface} - The FormControl instance
   * @param value {FormValue} - The form control value
   * @returns {boolean} - The validity of a given Validator
   */
  isValid(instance: HTMLElement, value: FormValue): boolean;
}

export interface AsyncValidator extends ValidatorBase {
  /**
   * Callback for a given validator. Takes the FormControl instance
   * and the form control value as arguments and returns a
   * boolean to evaluate for that Validator as a promise.
   * @param instance {FormControlInterface} - The FormControl instance
   * @param value {FormValue} - The form control value
   * @returns {Promise<boolean>} - The validity of a given Validator
   */
  isValid(instance: HTMLElement, value: FormValue, signal: AbortSignal): Promise<boolean | void>;
}

export type Validator = SyncValidator | AsyncValidator;

export const requiredValidator: Validator = {
  attribute: 'required',
  key: 'valueMissing',
  message: 'Please fill out this field',
  isValid(instance: HTMLElement & { required: boolean }, value: FormValue): boolean {
    let valid = true;

    if ((instance.hasAttribute('required') || instance.required) && !value) {
      valid = false;
    }

    return valid;
  }
};

export const programmaticValidator: Validator = {
  attribute: 'error',
  message(instance: HTMLElement & { error: string }): string {
    return instance.error;
  },
  isValid(instance: HTMLElement & { error: string }): boolean {
    return !instance.error;
  }
};

export const minLengthValidator: Validator = {
  attribute: 'minlength',
  key: 'rangeUnderflow',
  message(instance: FormControlInterface & { minLength: number }, value: FormValue): string {
    const _value = (value as string) || '';
    return `Please use at least ${instance.minLength} characters (you are currently using ${_value.length} characters).`;
  },
  isValid(instance: HTMLElement & { minLength: number }, value: string): boolean {
    /** If no value is provided, this validator should return true */
    if (!value) {
      return true;
    }

    if (!!value && instance.minLength > value.length) {
      return false;
    }

    return true;
  }
};

export const maxLengthValidator: Validator = {
  attribute: 'maxlength',
  key: 'rangeOverflow',
  message(instance: FormControlInterface & { maxLength: number }, value: FormValue): string {
    const _value = (value as string) || '';
    return `Please use no more than ${instance.maxLength} characters (you are currently using ${_value.length} characters).`;
  },
  isValid(instance: HTMLElement & { maxLength: number }, value: string): boolean {
    /** If maxLength isn't set, this is valid */
    if (!instance.maxLength) {
      return true;
    }

    if (!!value && instance.maxLength < value.length) {
      return false;
    }

    return true;
  }
};

export const patternValidator: Validator = {
  attribute: 'pattern',
  key: 'patternMismatch',
  message: 'Please match the requested format',
  isValid(instance: HTMLElement & { pattern: string }, value: string): boolean {
    /** If no value is provided, this validator should return true */
    if (!value || !instance.pattern) {
      return true;
    }

    const regExp = new RegExp(instance.pattern);
    return !!regExp.exec(value);
  }
};
