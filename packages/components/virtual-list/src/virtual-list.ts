import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import { styleMap } from 'lit/directives/style-map.js';
import styles from './virtual-list.scss.js';
import { VirtualizerController } from './virtualizer-controller.js';
import { type ScrollToOptions, type VirtualItem } from './virtualizer.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-virtual-list': VirtualList;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type VirtualListItemRenderer<T = any> = (item: T, index: number) => TemplateResult | string;

/**
 * A virtual list component that efficiently renders large lists by only rendering items that are
 * visible in the viewport.
 *
 * It supports scrolling inside an element with `overflow` as well as scrolling on the window. It
 * also supports sticky items, which remain rendered (and pinned to the top) until they have left
 * the viewport.
 *
 * @csspart wrapper - The wrapper element that spans the entire (virtual) size of the list.
 * @csspart item - Each individual item in the list.
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
    getIsSticky: index => this.isSticky?.(this.items[index], index) ?? false,
    overscan: 3,
    startIndex: 0
  });

  /**
   * The estimated size of each item in pixels. This doesn't have to be exact; items are measured
   * once rendered.
   *
   * @default 32
   */
  @property({ type: Number, attribute: 'estimate-size' }) estimateSize?: number;

  /**
   * The gap between items in pixels.
   *
   * @default 0
   */
  @property({ type: Number }) gap?: number;

  /** Predicate that determines whether the item at the given index is sticky. */
  @property({ attribute: false }) isSticky?: (item: T, index: number) => boolean;

  /** The items to render in the list. */
  @property({ attribute: false }) items: T[] = [];

  /**
   * Number of items to render outside the visible area for smoother scrolling.
   *
   * @default 3
   */
  @property({ type: Number }) overscan?: number;

  /** Function to render each item. By default the item is rendered as-is. */
  @property({ attribute: false }) renderItem?: VirtualListItemRenderer<T>;

  /**
   * The index the list should be scrolled to when first rendered.
   *
   * @default 0
   */
  @property({ type: Number, attribute: 'start-index' }) startIndex?: number;

  /** The virtualizer instance. */
  get virtualizer() {
    return this.#virtualizer.virtualizer;
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (
      changes.has('estimateSize') ||
      changes.has('gap') ||
      changes.has('isSticky') ||
      changes.has('items') ||
      changes.has('overscan') ||
      changes.has('startIndex')
    ) {
      this.#virtualizer.updateOptions({
        count: this.items.length,
        estimateSize: () => this.estimateSize ?? 32,
        gap: this.gap ?? 0,
        getIsSticky: index => this.isSticky?.(this.items[index], index) ?? false,
        overscan: this.overscan ?? 3,
        startIndex: this.startIndex ?? 0
      });
    }
  }

  override render(): TemplateResult {
    const virtualizer = this.virtualizer,
      virtualItems = virtualizer.getVirtualItems(),
      scrollMargin = virtualizer.scrollMargin,
      relativeOffset = virtualizer.scrollOffset - scrollMargin;

    return html`
      <div part="wrapper" style="block-size: ${virtualizer.getTotalSize()}px;">
        ${repeat(
          virtualItems,
          virtualItem => virtualItem.key,
          virtualItem => {
            const item = this.items[virtualItem.index],
              translate = this.#getTranslate(virtualItem, virtualItems, scrollMargin, relativeOffset),
              pinned = virtualItem.sticky && translate !== virtualItem.start - scrollMargin;

            return html`
              <div
                part="item${virtualItem.sticky ? ' sticky' : ''}${pinned ? ' pinned' : ''}"
                data-index=${virtualItem.index}
                style=${styleMap({
                  transform: `translateY(${translate}px)`,
                  zIndex: pinned ? '1' : undefined
                })}
                ${ref(this.#measureRef)}>
                ${this.renderItem ? this.renderItem(item, virtualItem.index) : (item as unknown as string)}
              </div>
            `;
          }
        )}
      </div>
    `;
  }

  /**
   * Scroll to the item at the given index.
   *
   * @param index - The index to scroll to.
   * @param options - Scroll options (alignment and behavior).
   */
  scrollToIndex(index: number, options?: ScrollToOptions): void {
    this.virtualizer.scrollToIndex(index, options);
  }

  /**
   * Scroll to the given offset.
   *
   * @param offset - The offset in pixels to scroll to.
   * @param options - Scroll options (alignment and behavior).
   */
  scrollToOffset(offset: number, options?: ScrollToOptions): void {
    this.virtualizer.scrollToOffset(offset, options);
  }

  #measureRef = (element?: Element): void => {
    this.virtualizer.measureElement(element ?? undefined);
  };

  #getTranslate(
    virtualItem: VirtualItem,
    virtualItems: VirtualItem[],
    scrollMargin: number,
    relativeOffset: number
  ): number {
    const baseY = virtualItem.start - scrollMargin;

    if (!virtualItem.sticky || baseY > relativeOffset) {
      return baseY;
    }

    // The item is sticky and would scroll above the viewport, so pin it to the top. Stop pinning
    // it once the next sticky item pushes it out of the viewport.
    let limit = Infinity;
    for (const other of virtualItems) {
      if (other.sticky && other.index > virtualItem.index) {
        limit = other.start - scrollMargin - virtualItem.size;
        break;
      }
    }

    return Math.max(baseY, Math.min(relativeOffset, limit));
  }
}
