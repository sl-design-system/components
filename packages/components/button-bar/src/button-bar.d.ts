import { type ButtonFill, type ButtonSize, type ButtonVariant } from '@sl-design-system/button';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-button-bar': ButtonBar;
  }
}
export type ButtonBarAlign = 'start' | 'center' | 'end' | 'space-between';
/**
 * Groups buttons together in a bar separated by whitespace.
 *
 * ```html
 * <sl-button-bar>
 *   <sl-button>Foo</sl-button>
 *   <sl-button>Bar</sl-button>
 * </sl-button-bar>
 * ```
 *
 * @slot default - Buttons to be grouped in the bar.
 * @cssState icon-only - Set when all buttons in the bar are icon-only.
 * @cssState empty - Set when there are no buttons in the bar.
 */
export declare class ButtonBar extends LitElement {
  #private;
  /** @internal */
  static styles: CSSResultGroup;
  /**
   * The alignment of the buttons within the bar.
   *
   * @default 'start'
   */
  align?: ButtonBarAlign;
  /** @internal The slotted buttons. */
  buttons?: HTMLElement[];
  /**
   * Determines the fill of all buttons in the bar.
   *
   * @default undefined
   */
  fill?: ButtonFill;
  /**
   * When set to true, the button order is reversed.
   *
   * @default false
   */
  reverse?: boolean;
  /**
   * Determines the size of all buttons in the bar.
   *
   * @default undefined
   */
  size?: ButtonSize;
  /**
   * Determines the variant of all buttons in the bar.
   *
   * @default undefined
   */
  variant?: ButtonVariant;
  disconnectedCallback(): void;
  firstUpdated(changes: PropertyValues<this>): void;
  updated(changes: PropertyValues<this>): void;
  render(): TemplateResult;
}
