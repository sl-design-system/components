import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Placement } from '@sl-design-system/popover';
import { LitElement } from 'lit';
declare const Tooltip_base: typeof LitElement & import("@sl-design-system/shared").Constructor<import("@sl-design-system/popover").AnchoredInterface & import("@sl-design-system/popover").PopoverInterface>;
/**
 * Tooltip component.
 */
export declare class Tooltip extends Tooltip_base {
    #private;
    /** @private */
    static styles: CSSResultGroup;
    static lazy(target: Element, callback: (target: Tooltip) => void): void;
    /** Tooltip placement. */
    placement: Placement;
    connectedCallback(): void;
    render(): TemplateResult;
}
export {};
