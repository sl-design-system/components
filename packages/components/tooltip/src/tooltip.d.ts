import { CSSResultGroup, LitElement, PropertyValues, TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-tooltip': Tooltip;
  }
}
/**
 * A tooltip component that can be used to display additional information about an element when the
 * user hovers over it, focuses it, or clicks it. The tooltip is positioned relative to an anchor
 * element, which can be specified using the `for` attribute. That attribute accepts multiple ids,
 * separated by spaces, so a single tooltip can serve several elements.
 *
 * The tooltip will automatically determine the appropriate ARIA relation to use based on the `type`
 * property. By default, it will use `ariaLabelledByElements`, but if `type` is set to
 * `description`, it will use `ariaDescribedByElements` instead.
 *
 * @element sl-tooltip
 *
 * @slot - The content of the tooltip.
 *
 * @csspart hover-bridge - An invisible element used to extend the hover area of the tooltip.
 */
export declare class Tooltip extends LitElement {
  #private;
  /**
   * The delay in milliseconds before showing the tooltip when the mouse hovers over the anchor
   * element.
   */
  static hoverShowDelay: number;
  /** The delay in milliseconds before hiding the tooltip when the mouse leaves the anchor element. */
  static hoverHideDelay: number;
  /** @internal */
  static styles: CSSResultGroup;
  /** @internal All elements this tooltip belongs to. */
  anchors: HTMLElement[];
  /**
   * @internal The anchor the tooltip is currently positioned against. When `for` references
   *   multiple elements, this is the one that last triggered the tooltip.
   */
  anchor?: HTMLElement | null;
  /**
   * Stops the tooltip from being displayed.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * The id of the element this tooltip is for. Multiple ids can be passed by separating them with a
   * space; the tooltip then belongs to each of those elements.
   */
  for?: string;
  /**
   * Setting this will cause the tooltip to show/hide, regardless of trigger. Do not use this
   * property to check if the tooltip is showing, use `matches(':popover-open')` instead.
   *
   * @default false
   */
  open?: boolean;
  /**
   * Controls how the tooltip is activated. Possible options include `click`, `hover`, `focus`, and
   * `manual`. Multiple options can be passed by separating them with a space. When manual is used,
   * the tooltip must be activated programmatically.
   *
   * @default 'focus hover'
   */
  trigger: string;
  /**
   * The type of tooltip. Used to determine the ARIA relation that should be used.
   *
   * @default 'label'
   */
  type?: 'description' | 'label';
  connectedCallback(): void;
  disconnectedCallback(): void;
  willUpdate(changes: PropertyValues<this>): void;
  render(): TemplateResult;
}
