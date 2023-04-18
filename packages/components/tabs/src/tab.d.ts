import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement } from 'lit';
export declare class Tab extends LitElement {
    /** @private */
    static styles: CSSResultGroup;
    /** Whether the tab item is selected */
    selected: boolean;
    /** Whether the tab item is disabled */
    disabled: boolean;
    render(): TemplateResult;
    /**
     * Apply accessible attributes and values to the tab button.
     * Observe the selected property if it changes
     */
    protected handleSelectionChange(): void;
    connectedCallback(): void;
}
