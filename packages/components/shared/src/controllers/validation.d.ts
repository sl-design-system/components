import type { CSSResultGroup, ReactiveController, ReactiveControllerHost, TemplateResult } from 'lit';
import type { ValidationValue, Validator } from '../validators.js';
export type CustomValidityState = Partial<Record<keyof ValidityState, boolean>>;
export interface NativeValidationTarget extends HTMLElement {
    readonly form: HTMLFormElement | null;
    validationMessage: string;
    validity: ValidityState;
    checkValidity(): boolean;
    reportValidity(): boolean;
    setCustomValidity(message: string): void;
}
export interface CustomValidationTarget extends HTMLElement {
    internals: ElementInternals;
}
export type ValidationTarget = NativeValidationTarget | CustomValidationTarget;
export type ValidationConfig = {
    target?: ValidationTarget | (() => ValidationTarget);
    validators?: Validator[];
};
export declare const validationStyles: CSSResultGroup;
export declare class ValidationController implements ReactiveController {
    #private;
    get target(): ValidationTarget;
    get validationMessage(): string;
    get validity(): ValidityState;
    constructor(host: ReactiveControllerHost & HTMLElement, { target, validators }: ValidationConfig);
    hostConnected(): Promise<void>;
    hostDisconnected(): void;
    hostUpdated(): void;
    render(): TemplateResult | void;
    addValidator(validator: Validator): void;
    removeValidator(validator: Validator): void;
    setCustomValidity(message: string): void;
    validate(value?: ValidationValue): void;
}
