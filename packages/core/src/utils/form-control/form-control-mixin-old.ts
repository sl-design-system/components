import type { IElementInternals } from 'element-internals-polyfill';
import type { ReactiveElement } from 'lit';
import type { Constructor } from '../mixin-types.js';
import type { Validator } from './validators.js';
import { property } from 'lit/decorators.js';
import { EventsController } from '../controllers/events.js';

export type CustomValidityState = Partial<Record<keyof ValidityState, boolean>>;

export interface FormControlInterface {
  readonly form: HTMLFormElement;
  readonly internals: ElementInternals & IElementInternals;
  readonly validity: ValidityState;

  disabled?: boolean;
  required?: boolean;
  validationMessage?: string;
  value?: string;

  checkValidity(): boolean;
  formResetCallback(): void;
  setValue(value: FormValue): void;
  shouldFormValueUpdate(): boolean;
}

export type FormValue = File | FormData | string | null;

export function FormControlMixinOld<T extends Constructor<ReactiveElement>>(
  constructor: T
): T & Constructor<FormControlInterface> {
  class FormControl extends constructor {
    /** Enable integration with native forms. */
    static get formAssociated(): boolean {
      return true;
    }

    /**
     * A list of Validator objects that will be evaluated when a control's form
     * value is modified or optionally when a given attribute changes.
     *
     * When a Validator's callback returns false, the entire form control will
     * be set to an invalid state.
     */
    static formControlValidators: Validator[] = [];

    /**
     * If set to true the control described should be evaluated and validated
     * as part of a group. Like a radio, if any member of the group's validity
     * changes the the other members should update as well.
     */
    static formControlValidationGroup = false;

    /** An internal abort controller for cancelling pending async validation. */
    #abortController?: AbortController;
    #previousAbortController?: AbortController;

    /** Events controller. */
    #events = new EventsController(this);

    /** Whether the control has focus. */
    #focused = false;

    /** Whether validation is pending. */
    #isValidationPending = false;

    /** Whether the control has *had* focus. */
    #touched = false;

    /** Promise for keeping track when validation is complete. */
    #validationComplete = Promise.resolve();

    /** Save a reference to the validation complete resolver. */
    #validationCompleteResolver?: (value: void | PromiseLike<void>) => void;

    /**
     * Acts as a cache for the current value so the value can be re-evaluated
     * whenever an attribute changes or on some other event.
     */
    #value: FormValue = '';

    /** Whether the form control is disabled. */
    @property({ type: Boolean, reflect: true }) disabled?: boolean;

    /** Whether this input must be filled in before form submission. */
    @property({ type: Boolean, reflect: true }) required?: boolean;

    /** The ElementInternals instance for the control. */
    internals = this.attachInternals() as ElementInternals & IElementInternals;

    /** Reference to the control's form. */
    get form(): HTMLFormElement {
      return this.internals.form;
    }

    /** A promise that will resolve when all pending validations are complete. */
    get validationComplete(): Promise<void> {
      return new Promise(resolve => resolve(this.#validationComplete));
    }

    /** The control's validity state. */
    get validity(): ValidityState {
      return this.internals.validity;
    }

    override connectedCallback(): void {
      super.connectedCallback();

      this.#events.listen(this, 'blur', this.#onBlur);
      this.#events.listen(this, 'focus', this.#onFocus);
      this.#events.listen(this, 'invalid', this.#onInvalid);
    }

    /** Returns the valid state of the control. */
    checkValidity(): boolean {
      return this.internals.checkValidity();
    }

    /** Reset control state when the form is reset */
    formResetCallback(): void {
      this.#touched = false;
    }

    /**
     * Sets the control's form value if the call to `shouldFormValueUpdate`
     * returns `true`.
     * @param value {FormValue} - The value to pass to the form
     */
    setValue(value: FormValue): void {
      this.#value = value;

      const valueToUpdate = this.shouldFormValueUpdate() ? value : null;

      this.internals.setFormValue(valueToUpdate as string);
      this.#runValidators(valueToUpdate);
    }

    /**
     * This method can be overridden to determine if the control's form value
     * should be set on a call to `setValue`. An example of when a user might want
     * to skip this step is when implementing checkbox-like behavior, first checking
     * to see if `this.checked` is set to a truthy value. By default this returns
     * `true`.
     */
    shouldFormValueUpdate(): boolean {
      return true;
    }

    #onBlur(): void {
      this.#focused = false;

      this.#runValidators(this.shouldFormValueUpdate() ? this.#value : '');
    }

    #onFocus(): void {
      this.#focused = this.#touched = true;
    }

    #onInvalid(event: Event): void {
      console.log('invalid');

      // Disable native validation UI
      event.preventDefault();
    }

    #runValidators(value: FormValue): void {
      const validity: CustomValidityState = {},
        validators = (this.constructor as typeof FormControl).formControlValidators || [],
        asyncValidators: Array<Promise<boolean | void>> = [],
        hasAsyncValidators = validators.some(validator => validator.isValid instanceof Promise);

      if (!this.#isValidationPending) {
        this.#validationComplete = new Promise(resolve => {
          this.#validationCompleteResolver = resolve;
        });
        this.#isValidationPending = true;
      }

      /**
       * If an abort controller exists from a previous validation step
       * notify still-running async validators that we are requesting they
       * discontinue any work.
       */
      if (this.#abortController) {
        this.#abortController.abort();
        this.#previousAbortController = this.#abortController;
      }

      /**
       * Create a new abort controller and replace the instance reference
       * so we can clean it up for next time
       */
      const abortController = new AbortController();
      this.#abortController = abortController;
      let validationMessage: string | undefined = undefined;

      /** Track to see if any validity key has changed */
      let hasChange = false;

      if (!validators.length) {
        return;
      }

      validators.forEach(validator => {
        const key = validator.key || 'customError',
          isValid = validator.isValid(this, value, abortController.signal),
          isAsyncValidator = isValid instanceof Promise;

        if (isAsyncValidator) {
          asyncValidators.push(isValid);

          void isValid.then(isValidatorValid => {
            if (isValidatorValid === undefined || isValidatorValid === null) {
              return;
            }
            /** Invert the validity state to correspond to the ValidityState API */
            validity[key] = !isValidatorValid;

            validationMessage = this.#getValidatorMessageForValue(validator, value);
            this.#setValidityWithOptionalTarget(validity, validationMessage);
          });
        } else {
          /** Invert the validity state to correspond to the ValidityState API */
          validity[key] = !isValid;

          if (this.validity[key] !== !isValid) {
            hasChange = true;
          }

          if (!isValid) {
            validationMessage = this.#getValidatorMessageForValue(validator, value);
          }
        }
      });

      /** Once all the async validators have settled, resolve validationComplete */
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      Promise.allSettled(asyncValidators).then(() => {
        /** Don't resolve validations if the signal is aborted */
        if (!abortController?.signal.aborted) {
          this.#isValidationPending = false;
          this.#validationCompleteResolver?.();
        }
      });

      /**
       * If async validators are present:
       * Only run updates when a sync validator has a change. This is to prevent
       * situations where running sync validators can override async validators
       * that are still in progress
       *
       * If async validators are not present, always update validity
       */
      if (hasChange || !hasAsyncValidators) {
        this.#setValidityWithOptionalTarget(validity, validationMessage);
      }
    }

    /**
     * If the validationTarget is not set, the user can decide how they would
     * prefer to handle focus when the field is validated.
     */
    #setValidityWithOptionalTarget(validity: Partial<ValidityState>, validationMessage: string | undefined): void {
      this.internals.setValidity(validity, validationMessage);
    }

    /** Process the validator message attribute. */
    #getValidatorMessageForValue(validator: Validator, value: FormValue): string {
      if (validator.message instanceof Function) {
        return validator.message(this, value);
      } else {
        return validator.message;
      }
    }
  }

  return FormControl;
}
