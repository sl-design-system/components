import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import styles from './virtual-list.scss.js';
import { VirtualizerController } from './virtualizer-controller.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-virtual-list': VirtualList;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type VirtualListItemRenderer<T = any> = (item: T, index: number) => TemplateResult;

/**
 * A virtual list component that efficiently renders large lists by only rendering
 * items that are visible in the viewport.
 *
 * @csspart wrapper - The wrapper element that contains the entire virtual list.
 * @csspart container - The container element that holds the virtualized items.
 * @csspart item - Each individual item in the list.
 *
 * @slot - The default slot is not used. Items are rendered via the `renderItem` property.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class VirtualList<T = any> extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The virtualizer controller. */
  #virtualizer = new VirtualizerController(this, {
    count: 0,
    estimateSize: () => this.estimateSize ?? 32,
    gap: 0,
    overscan: 3
  });

  /**
   * The estimated size of each item in pixels. This doesn't have to be exact.
   * @default 32
   */
  @property({ type: Number, attribute: 'estimate-size' }) estimateSize?: number;

  /**
   * The gap between items in pixels.
   * @default 0
   */
  @property({ type: Number }) gap?: number;

  /** The items to render in the list. */
  @property({ attribute: false }) items: T[] = [];

  /**
   * Number of items to render outside the visible area for smoother scrolling.
   * @default 3
   */
  @property({ type: Number }) overscan?: number;

  /** Function to render each item. */
  @property({ attribute: false }) renderItem?: VirtualListItemRenderer<T>;

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('estimateSize') || changes.has('gap') || changes.has('items') || changes.has('overscan')) {
      this.#virtualizer.updateOptions({
        count: this.items.length,
        estimateSize: () => this.estimateSize ?? 32,
        gap: this.gap,
        overscan: this.overscan
      });
    }
  }

  override render(): TemplateResult {
    const virtualizer = this.#virtualizer.instance,
      virtualItems = virtualizer.getVirtualItems();

    return html`
      <div part="wrapper" style="block-size: ${virtualizer.getTotalSize()}px;">
        <div
          part="container"
          style="gap: ${this.gap ?? 0}px; translate: 0px ${(virtualItems[0]?.start ?? 0) -
          (virtualizer.options.scrollMargin ?? 0)}px"
        >
          ${repeat(
            virtualItems,
            virtualItem => virtualItem.key,
            virtualItem => {
              const item = this.items[virtualItem.index];

              return html`
                <div part="item" data-index=${virtualItem.index} ${ref(virtualizer.measureElement)}>
                  ${this.renderItem ? this.renderItem(item, virtualItem.index) : item}
                </div>
              `;
            }
          )}
        </div>
      </div>
    `;
  }

  /**
   * Scroll to a specific index in the list.
   *
   * @param index - The index to scroll to
   * @param options - Scroll options
   */
  scrollToIndex(
    index: number,
    options?: { align?: 'start' | 'center' | 'end' | 'auto'; behavior?: 'auto' | 'smooth' }
  ): void {
    this.#virtualizer.instance.scrollToIndex(index, options);
  }
}
