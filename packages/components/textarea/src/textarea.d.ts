import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { Validator } from '@sl-design-system/shared';
import { LitElement } from 'lit';
declare const Textarea_base: typeof LitElement & import("@sl-design-system/shared").Constructor<import("@sl-design-system/shared").HintInterface> & import("@sl-design-system/shared").Constructor<import("@sl-design-system/shared").FormControlInterface>;
export declare class Textarea extends Textarea_base {
    #private;
    /** @private */
    static styles: CSSResultGroup;
    /** Element internals. */
    readonly internals: ElementInternals;
    /** The textarea in the light DOM. */
    textarea: HTMLTextAreaElement;
    /** Maximum length (number of characters). */
    maxLength?: number;
    /** Minimum length (number of characters). */
    minLength?: number;
    /** Placeholder text in the input. */
    placeholder?: string;
    /** Custom validators specified by the user. */
    validators?: Validator[];
    /** The value for the textarea. */
    value?: string;
    connectedCallback(): void;
    updated(changes: PropertyValues<this>): void;
    render(): TemplateResult;
}
export {};
