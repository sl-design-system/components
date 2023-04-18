import type { Placement } from './utils/position-anchored-element.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement } from 'lit';
declare const Popover_base: typeof LitElement & import("packages/shared/index.js").Constructor<import("./mixins/anchored.js").AnchoredInterface & import("./mixins/popover.js").PopoverInterface>;
/**
 * Base popover web component.
 *
 * @csspart container - The container for the popover
 */
export declare class Popover extends Popover_base {
    #private;
    /** @private */
    static styles: CSSResultGroup;
    /** The arrow linking the popover to the anchor element. */
    arrow: Element;
    /** Popover placement relative to the anchor. */
    placement: Placement;
    connectedCallback(): void;
    render(): TemplateResult;
    addEventListenersToAnchor(): void;
    removeEventListenersFromAnchor(): void;
}
export {};
