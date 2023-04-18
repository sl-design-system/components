import type { TemplateResult } from 'lit-html';
import type { CSSResultGroup } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import { LitElement } from 'lit';
declare const Dialog_base: typeof LitElement & import("@open-wc/dedupe-mixin").Constructor<import("@open-wc/scoped-elements/types.js").ScopedElementsHost>;
/**
 * A dialog component for displaying modal UI.
 *
 * @slot action - Area where action buttons are placed
 * @slot default - Body content for the dialog
 * @slot footer - Footer content for the dialog
 * @slot header - Header content for the dialog
 * @slot title - The title of the dialog
 */
export declare class Dialog extends Dialog_base {
    #private;
    /** @private */
    static get scopedElements(): ScopedElementsMap;
    /** @private */
    static styles: CSSResultGroup;
    dialog?: HTMLDialogElement;
    /** Disables the ability to close the dialog using the Escape key. */
    disableClose: boolean;
    /** The ARIA role of the dialog. */
    role: 'dialog' | 'alertdialog';
    connectedCallback(): void;
    render(): TemplateResult;
    showModal(): void;
    close(): void;
}
export {};
