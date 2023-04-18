import type { IElementInternals } from 'element-internals-polyfill';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { LitElement } from 'lit';
export type RadioButtonSize = 'md' | 'lg';
declare const Radio_base: typeof LitElement & import("@sl-design-system/shared").Constructor<import("@sl-design-system/shared").FormControlInterface>;
export declare class Radio extends Radio_base {
    #private;
    /** @private */
    static formAssociated: boolean;
    /** @private */
    static styles: CSSResultGroup;
    /** Element internals. */
    readonly internals: import("element-internals-polyfill/dist/element-internals.js").ElementInternals & IElementInternals;
    /** Whether the radio is selected. */
    checked?: boolean;
    /** The value for this radio button. */
    value: string;
    /** Button size. */
    size: RadioButtonSize;
    connectedCallback(): void;
    updated(changes: PropertyValues<this>): void;
    render(): TemplateResult;
}
export {};
