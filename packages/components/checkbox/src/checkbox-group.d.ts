import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Checkbox } from './checkbox.js';
import type { Validator } from '@sl-design-system/shared';
import { LitElement } from 'lit';
declare const CheckboxGroup_base: typeof LitElement & import("@sl-design-system/shared").Constructor<import("@sl-design-system/shared").HintInterface>;
export declare class CheckboxGroup extends CheckboxGroup_base {
    #private;
    /** @private */
    static formAssociated: boolean;
    /** @private */
    static styles: CSSResultGroup;
    /** Element internals. */
    readonly internals: import("element-internals-polyfill/dist/element-internals.js").ElementInternals & import("element-internals-polyfill").IElementInternals;
    /** The slotted checkboxes. */
    boxes?: Checkbox[];
    /** Custom validators. */
    validators?: Validator[];
    /** Name of the form element */
    name?: string;
    get form(): HTMLFormElement | null;
    render(): TemplateResult;
}
export {};
