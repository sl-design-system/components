declare global {
    interface CSSStyleDeclaration {
        anchorName: string;
    }
    interface HTMLElement {
        showPopover?(): void;
        hidePopover?(): void;
    }
}
export type Overlay = {
    hideOverlay: (_event?: Event) => void;
    open: boolean;
    shadowRoot: ShadowRoot;
    showOverlay: (_event?: Event) => void;
};
