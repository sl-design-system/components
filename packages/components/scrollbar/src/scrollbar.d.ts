import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-scrollbar': Scrollbar;
  }
}
/**
 * Scrollbar component for custom scrollbars. When in doubt, _always_ use the native scrollbar. This
 * component is intended for use in components that require a custom scrollbar, such as the grid.
 *
 * @csspart track - The track of the scrollbar.
 * @csspart thumb - The thumb of the scrollbar.
 */
export declare class Scrollbar extends LitElement {
  #private;
  /** @internal */
  static styles: CSSResultGroup;
  /**
   * The scroll container; either the DOM id of an element within the same context, or the element
   * itself.
   */
  scroller?: string | HTMLElement;
  /** Set to true if you want the scrollbar to have a vertical orientation. */
  vertical?: boolean;
  disconnectedCallback(): void;
  firstUpdated(changes: PropertyValues<this>): void;
  updated(changes: PropertyValues<this>): void;
  render(): TemplateResult;
  /**
   * Recalculates the size and position of the thumb. A parent element can use this method to force
   * a recalculation of the thumb size and position. This is useful when the contents of the
   * scroller changes, but not the size of the scroller itself.
   */
  updateThumbSize(): void;
}
