import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement } from 'lit';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonFill = 'default' | 'outline' | 'pill';
export type ButtonType = 'button' | 'reset' | 'submit';
export type ButtonVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';
export declare class Button extends LitElement {
    #private;
    /** @private */
    static formAssociated: boolean;
    /** @private */
    static styles: CSSResultGroup;
    /** Element internals. */
    readonly internals: ElementInternals;
    /** The original tabIndex before disabled. */
    private originalTabIndex;
    /** The button fill. */
    fill: ButtonFill;
    /** Button size. */
    size: ButtonSize;
    /**
     * The button type. Defaults to `button`, but can be set to `submit` when used in a form.
     * @type {button | reset | submit}
     */
    type: ButtonType;
    /** The button variant. If no variant is specified, it uses the default button style. */
    variant: ButtonVariant;
    connectedCallback(): void;
    formDisabledCallback(disabled: boolean): void;
    render(): TemplateResult;
}
