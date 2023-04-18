import type { CSSResultGroup, TemplateResult } from 'lit';
import type { FormControlValue } from '@sl-design-system/shared';
import { LitElement } from 'lit';
export declare class SelectOption extends LitElement {
    #private;
    /** @private */
    static styles: CSSResultGroup;
    /** Whether the option item is selected*/
    value?: FormControlValue;
    /** Whether the option item is selected*/
    selected: boolean;
    /** Whether the option item is disabled*/
    disabled: boolean;
    /** Whether the content of the option item is a node*/
    contentType?: 'string' | 'element';
    size: {
        width: number;
        height: number;
    };
    /**
     * Apply accessible attributes and values to the tab button.
     * Observe the selected property if it changes
     */
    protected handleSelectionChange(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    firstUpdated(): void;
    render(): TemplateResult;
}
