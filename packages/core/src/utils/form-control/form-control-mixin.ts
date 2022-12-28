import type { IElementInternals } from 'element-internals-polyfill';
import type { ReactiveElement } from 'lit';
import type { Constructor } from '../mixin-types.js';
import type { Validator } from './validators.js';
import { EventsController } from '../controllers/events.js';

export interface FormControlInterface {
  readonly form: HTMLFormElement;
  readonly internals: ElementInternals & IElementInternals;
  readonly validity: ValidityState;

  checkValidity(): boolean;
  formResetCallback(): void;
  setValue(value: FormValue): void;
  shouldFormValueUpdate(): boolean;
}

export type FormValue = File | FormData | string | null;

export function FormControlMixin<T extends Constructor<ReactiveElement>>(
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

    /** Events controller. */
    #events = new EventsController(this);

    /** Whether the control has focus. */
    #focused = false;

    /** Whether the control has *had* focus. */
    #touched = false;

    /**
     * Acts as a cache for the current value so the value can be re-evaluated
     * whenever an attribute changes or on some other event.
     */
    #value: FormValue = '';

    /** The ElementInternals instance for the control. */
    internals = this.attachInternals() as ElementInternals & IElementInternals;

    /** Reference to the control's form. */
    get form(): HTMLFormElement {
      return this.internals.form;
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
      const valueShouldUpdate = this.shouldFormValueUpdate();
      const valueToUpdate = valueShouldUpdate ? value : null;
      this.internals.setFormValue(valueToUpdate as string);
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
    }

    #onFocus(): void {
      this.#focused = this.#touched = true;
    }

    #onInvalid(event: Event): void {
      // Disable native validation UI
      event.preventDefault();
    }
  }

  return FormControl;
}
