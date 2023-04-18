import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Placement } from '@sl-design-system/popover';
import { LitElement } from 'lit';
declare const SelectOverlay_base: typeof LitElement & import("@sl-design-system/shared").Constructor<import("@sl-design-system/popover").AnchoredInterface & import("@sl-design-system/popover").PopoverInterface>;
export declare class SelectOverlay extends SelectOverlay_base {
    #private;
    /** @private */
    static styles: CSSResultGroup;
    /** Tooltip placement. */
    placement: Placement;
    connectedCallback(): void;
    render(): TemplateResult;
    show(target: HTMLElement): void;
    hide(target: EventTarget | null): void;
}
export {};
