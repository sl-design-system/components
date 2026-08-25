import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { AccordionItem } from './accordion-item.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-accordion': Accordion;
  }
}
export type AccordionIconType = 'chevron' | 'plusminus';
/**
 * An accordion component that can contain accordion-items
 *
 * ```html
 * <sl-accordion>...</sl-accordion>
 * ```
 *
 * @slot default - The place for multiple `<sl-accordion-item>`
 */
export declare class Accordion extends LitElement {
  #private;
  /**
   * This determines the icons used in the accordion. You can change this to `chevron` for all
   * accordions.
   */
  static iconType: AccordionIconType;
  /** @internal */
  static styles: CSSResultGroup;
  /**
   * The icon type used in the accordion. Use this to only change the icon type for this accordion.
   * Alternatively, you can set `Accordion.iconType` to change the default for all accordions.
   */
  iconType?: AccordionIconType;
  /** The slotted accordion items. */
  items?: AccordionItem[];
  /**
   * Whether only one accordion item can be opened at once. By default, multiple accordion items can
   * be opened.
   */
  single?: boolean;
  updated(changes: PropertyValues<this>): void;
  render(): TemplateResult;
}
