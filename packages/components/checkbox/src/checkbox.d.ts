import type { IElementInternals } from 'element-internals-polyfill';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { EventEmitter } from '@sl-design-system/shared';
import { LitElement } from 'lit';
export type CheckboxSize = 'md' | 'lg';
declare const Checkbox_base: typeof LitElement & import("@sl-design-system/shared").Constructor<import("@sl-design-system/shared").HintInterface> & import("@sl-design-system/shared").Constructor<import("@sl-design-system/shared").FormControlInterface>;
export declare class Checkbox extends Checkbox_base {
    #private;
    /** @private */
    static formAssociated: boolean;
    /** @private */
    static styles: CSSResultGroup;
    /** Element internals. */
    readonly internals: ElementInternals & IElementInternals;
    /** Emits when the checked state changes. */
    change: EventEmitter<boolean>;
    /** Whether the checkbox is checked. */
    checked?: boolean;
    /** Whether the checkbox is invalid. */
    invalid?: boolean;
    /** Whether the checkbox has the indeterminate state. */
    indeterminate: boolean;
    /** Button size. */
    size: CheckboxSize;
    /** The value for the checkbox. */
    value?: string;
    connectedCallback(): void;
    updated(changes: PropertyValues<this>): void;
    formAssociatedCallback(): void;
    formResetCallback(): void;
    render(): TemplateResult;
}
export {};
