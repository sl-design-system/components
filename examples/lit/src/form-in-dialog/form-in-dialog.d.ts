import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type CSSResultGroup, LitElement, type TemplateResult } from 'lit';
declare const FormInDialog_base: typeof LitElement & import("@open-wc/scoped-elements/lit-element.js").ScopedElementsHostConstructor;
export declare class FormInDialog extends FormInDialog_base {
    #private;
    /** @internal */
    static get scopedElements(): ScopedElementsMap;
    /** @internal */
    static styles: CSSResultGroup;
    render(): TemplateResult;
    showModal(): void;
}
export {};
