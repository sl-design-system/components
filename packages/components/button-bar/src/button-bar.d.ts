import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement } from 'lit';
export type ButtonBarAlign = 'start' | 'center' | 'end' | 'space-between';
/**
 * Groups buttons together in a bar separated by whitespace.
 *
 * ```html
 * <dna-button-bar>
 *   <dna-button>Foo</dna-button>
 *   <dna-button>Bar</dna-button>
 * </dna-button-bar>
 * ```
 *
 * @slot default - Buttons to be grouped in the bar
 */
export declare class ButtonBar extends LitElement {
    #private;
    /** @private */
    static styles: CSSResultGroup;
    /**
     * How the buttons are aligned with the bar.
     * @type {start | center | end | 'space-between'}
     */
    align: ButtonBarAlign;
    /** Whether the bar only contains icon-only buttons. */
    iconOnly?: boolean;
    /** If set, the button order is reversed. */
    reverse: boolean;
    render(): TemplateResult;
}
