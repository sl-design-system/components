import { type PopoverPosition } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-popover': Popover;
  }
}
/**
 * A floating overlay that appears on top of other elements.
 *
 * @csspart arrow - The arrow linking the popover to its anchor
 * @csspart container - The container for the popover
 * @slot default - Body content for the popover
 */
export declare class Popover extends LitElement {
  #private;
  /** @internal The default padding of the arrow. */
  static arrowPadding: number;
  /** @internal The default offset of the popover to its anchor. */
  static offset: number;
  /** @internal */
  static shadowRootOptions: {
    delegatesFocus: boolean;
    clonable?: boolean;
    customElementRegistry?: CustomElementRegistry | null;
    mode: ShadowRootMode;
    serializable?: boolean;
    slotAssignment?: SlotAssignmentMode;
    customElements?: CustomElementRegistry;
    registry?: CustomElementRegistry;
  };
  /** @internal */
  static styles: CSSResultGroup;
  /** @internal The default margin between the tooltip and the viewport. */
  static viewportMargin: number;
  /**
   * The position of popover relative to its anchor.
   *
   * @default bottom
   */
  position?: PopoverPosition;
  /**
   * When the contents of your popover is too long to be read inline this should be set to true so
   * the user can navigate to the popover content themselves. `aria-details` is always set,
   * regardless of this property. Read more about this in the [accessibility
   * documentation](https://sanomalearning.design/categories/components/popover/accessibility/).
   */
  noDescribedby?: boolean;
  connectedCallback(): void;
  willUpdate(changes: PropertyValues<this>): void;
  render(): TemplateResult;
}
