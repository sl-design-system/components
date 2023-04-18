import type { CSSResultGroup, TemplateResult } from 'lit';
import type { SelectOverlay } from './select-overlay.js';
import type { SelectOptionGroup } from './select-option-group.js';
import { LitElement } from 'lit';
import { SelectOption } from './select-option.js';
declare const Select_base: typeof LitElement & import("@sl-design-system/shared").Constructor<import("@sl-design-system/shared").FormControlInterface>;
export declare class Select extends Select_base {
    #private;
    static styles: CSSResultGroup;
    static formAssociated: boolean;
    overlay?: SelectOverlay;
    selectedOptionPlaceholder?: HTMLElement;
    /** The slotted options. */
    options?: SelectOption[];
    optionGroups?: SelectOptionGroup[];
    /** render helpers */
    size?: {
        width: string;
        height: string;
    };
    maxOverlayHeight?: string;
    get allOptions(): SelectOption[];
    /** Element internals. */
    readonly internals: ElementInternals;
    /** The current tab node selected in the tab group. */
    private selectedOption?;
    render(): TemplateResult;
    connectedCallback(): void;
    firstUpdated(): void;
    openSelect(event: Event & {
        target: HTMLElement;
    }): void;
}
export {};
