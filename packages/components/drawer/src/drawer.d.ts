import type { TemplateResult } from 'lit-html';
import type { CSSResultGroup } from 'lit';
import type { ButtonSize } from '@sl-design-system/button';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import { LitElement } from 'lit';
export type DrawerAttachment = 'right' | 'left' | 'top' | 'bottom';
declare const Drawer_base: typeof LitElement & import("@open-wc/dedupe-mixin").Constructor<import("@open-wc/scoped-elements/types.js").ScopedElementsHost>;
/**
 * A drawer component for displaying UI at the side of the screen.
 *
 * @slot default - Body content for the drawer
 * @slot header - Header content for the drawer
 * @slot title - The title of the drawer
 */
export declare class Drawer extends Drawer_base {
    #private;
    /** @private */
    static get scopedElements(): ScopedElementsMap;
    /** @private */
    static styles: CSSResultGroup;
    dialog?: HTMLDialogElement;
    /** Disables the ability to close the dialog using the Escape key. */
    disableClose: boolean;
    /** The side of the screen where the drawer is attached */
    attachment: DrawerAttachment;
    /** The size of the button */
    closeButtonSize: ButtonSize;
    connectedCallback(): void;
    render(): TemplateResult;
    showModal(): void;
    close(): void;
}
export {};
