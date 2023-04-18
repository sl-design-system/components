import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { Validator } from '@sl-design-system/shared';
import { LitElement } from 'lit';
declare const Input_base: typeof LitElement & import("@sl-design-system/shared").Constructor<import("@sl-design-system/shared").HintInterface> & import("@sl-design-system/shared").Constructor<import("@sl-design-system/shared").FormControlInterface>;
/**
 * Single line text input component.
 *
 * @slot prefix - Content shown before the input
 * @slot input - The slot for the input element
 * @slot suffix - Content shown after the input
 */
export declare class Input extends Input_base {
    #private;
    /** @private */
    static styles: CSSResultGroup;
    /** The input element in the light DOM. */
    input: HTMLInputElement;
    /** Element internals. */
    readonly internals: ElementInternals;
    /** Specifies which type of data the browser can use to pre-fill the input. */
    autocomplete?: string;
    /** Maximum length (number of characters). */
    maxLength?: number;
    /** Minimum length (number of characters). */
    minLength?: number;
    /** Validation using pattern. */
    pattern?: string;
    /** Placeholder text in the input. */
    placeholder?: string;
    /**
     * The input type. Only text types are valid here. For other types,
     * see their respective components.
     */
    type: 'email' | 'number' | 'password' | 'tel' | 'text' | 'url';
    /** Custom validators specified by the user. */
    validators?: Validator[];
    /** The value for the input. */
    value?: string;
    connectedCallback(): void;
    updated(changes: PropertyValues<this>): void;
    render(): TemplateResult;
}
export {};
