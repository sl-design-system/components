import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement } from 'lit';
export declare class SelectOptionGroup extends LitElement {
    /** @private */
    static styles: CSSResultGroup;
    groupTitle?: string;
    render(): TemplateResult;
    connectedCallback(): void;
}
