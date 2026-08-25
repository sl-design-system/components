import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-virtual-list': VirtualList;
  }
}
export type VirtualListItemRenderer<T = any> = (item: T, index: number) => Element | TemplateResult;
/**
 * A virtual list component that efficiently renders large lists by only rendering items that are
 * visible in the viewport.
 *
 * @csspart wrapper - The wrapper element that contains the entire virtual list.
 * @csspart container - The container element that holds the virtualized items.
 * @csspart item - Each individual item in the list.
 *
 * @slot - The default slot is not used. Items are rendered via the `renderItem` property.
 */
export declare class VirtualList<T = any> extends LitElement {
  #private;
  /** @internal */
  static styles: CSSResultGroup;
  /**
   * The estimated size of each item in pixels. This doesn't have to be exact.
   *
   * @default 32
   */
  estimateSize?: number;
  /**
   * The gap between items in pixels.
   *
   * @default 0
   */
  gap?: number;
  /** The items to render in the list. */
  items: T[];
  /**
   * Number of items to render outside the visible area for smoother scrolling.
   *
   * @default 3
   */
  overscan?: number;
  /**
   * The margin in pixels to apply when scrolling an item into view. This can be used to account for
   * fixed headers or other UI elements that might obscure the item.
   *
   * @default 0
   */
  scrollMargin?: number;
  /** Function to render each item. */
  renderItem?: VirtualListItemRenderer<T>;
  /**
   * @internal Renders virtualized items in light DOM for assistive technology workarounds.
   * Must be set before the component is connected; changing it afterwards has no effect.
   */
  renderInLightDom: boolean;
  connectedCallback(): void;
  createRenderRoot(): HTMLElement | DocumentFragment;
  willUpdate(changes: PropertyValues<this>): void;
  render(): TemplateResult;
  /**
   * Scroll to a specific index in the list.
   *
   * @param index - The index to scroll to
   * @param options - Scroll options
   */
  scrollToIndex(
    index: number,
    options?: {
      align?: 'start' | 'center' | 'end' | 'auto';
      behavior?: 'auto' | 'smooth';
    }
  ): void;
  /**
   * Triggers a re-measure of item sizes and positions. Useful when a list transitions from hidden
   * to visible.
   */
  requestLayout(): Promise<void>;
}
