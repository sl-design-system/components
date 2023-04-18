import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { Validator } from '@sl-design-system/shared';
import { LitElement } from 'lit';
import { Radio } from './radio.js';
declare const RadioGroup_base: typeof LitElement & import("@sl-design-system/shared").Constructor<import("@sl-design-system/shared").HintInterface> & import("@sl-design-system/shared").Constructor<import("@sl-design-system/shared").FormControlInterface>;
export declare class RadioGroup extends RadioGroup_base {
    #private;
    /** @private */
    static formAssociated: boolean;
    /** @private */
    static styles: CSSResultGroup;
    /** Element internals. */
    readonly internals: import("element-internals-polyfill/dist/element-internals.js").ElementInternals & import("element-internals-polyfill").IElementInternals;
    /** The assigned nodes. */
    defaultNodes?: Node[];
    /** If true, displays the radio buttons next to each other instead of below. */
    horizontal?: boolean;
    /** Custom validators specified by the user. */
    validators?: Validator[];
    /** The value for this group. */
    value?: string;
    get buttons(): Radio[];
    connectedCallback(): void;
    willUpdate(changes: PropertyValues<this>): void;
    render(): TemplateResult;
    formAssociatedCallback(): void;
    formResetCallback(): void;
}
export {};
