import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { FormControlInterface } from '@sl-design-system/shared';
import { LitElement } from 'lit';
export declare class Label extends LitElement {
    #private;
    /** @private */
    static styles: CSSResultGroup;
    /** The DOM id of the form control this is linked to. */
    for?: string;
    /** The associated form control. */
    formControl: (HTMLElement & FormControlInterface) | null;
    /** Whether this label should be marked as optional. */
    optional?: boolean;
    /** Whether this label should be marked as required. */
    required?: boolean;
    disconnectedCallback(): void;
    willUpdate(changes: PropertyValues<this>): void;
    render(): TemplateResult;
}
