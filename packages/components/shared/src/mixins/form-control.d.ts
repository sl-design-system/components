import type { ReactiveElement } from 'lit';
import type { Constructor } from '../types.js';
import type { ValidationValue } from '../validators.js';
export type FormControlValue = ValidationValue;
export interface NativeFormControlElement extends HTMLElement {
    form: HTMLFormElement | null;
    labels: NodeListOf<HTMLLabelElement> | null;
    name: string;
    value?: FormControlValue;
    checkValidity(): boolean;
    reportValidity(): boolean;
}
export interface CustomFormControlElement extends HTMLElement {
    internals: ElementInternals;
}
export type FormControlElement = NativeFormControlElement | CustomFormControlElement;
export interface FormControlInterface {
    readonly form: HTMLFormElement | null;
    readonly formControlElement: FormControlElement;
    readonly labels: NodeListOf<HTMLLabelElement> | null;
    disabled?: boolean;
    name?: string;
    required?: boolean;
    checkValidity(): boolean;
    reportValidity(): boolean;
    setFormControlElement(element: FormControlElement): void;
    setFormValue(value?: FormControlValue): void;
    setValidity(flags?: ValidityStateFlags, message?: string, anchor?: HTMLElement): void;
}
export declare function FormControlMixin<T extends Constructor<ReactiveElement>>(constructor: T): T & Constructor<FormControlInterface>;
