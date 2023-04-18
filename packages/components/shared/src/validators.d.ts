export type ValidationValue = File | FormData | string | undefined;
export type ValidationMessageCallback = (instance: any, value: ValidationValue) => string;
/**
 * Generic Validator shape. These objects are used to create
 * Validation behaviors on FormControl instances.
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
    message: string | ValidationMessageCallback;
}
export interface SyncValidator extends ValidatorBase {
    /**
     * Callback for a given validator. Takes the FormControl instance
     * and the form control value as arguments and returns a
     * boolean to evaluate for that Validator.
     * @param instance {FormControlInterface} - The FormControl instance
     * @param value {ValidationValue} - The form control value
     * @returns {boolean} - The validity of a given Validator
     */
    isValid(instance: HTMLElement, value: ValidationValue): boolean;
}
export interface AsyncValidator extends ValidatorBase {
    /**
     * Callback for a given validator. Takes the FormControl instance
     * and the form control value as arguments and returns a
     * boolean to evaluate for that Validator as a promise.
     * @param instance {FormControlInterface} - The FormControl instance
     * @param value {ValidationValue} - The form control value
     * @returns {Promise<boolean>} - The validity of a given Validator
     */
    isValid(instance: HTMLElement, value: ValidationValue, signal: AbortSignal): Promise<boolean | void>;
}
export type Validator = SyncValidator | AsyncValidator;
export declare const requiredValidator: Validator;
export declare const programmaticValidator: Validator;
export declare const minLengthValidator: Validator;
export declare const maxLengthValidator: Validator;
export declare const patternValidator: Validator;
