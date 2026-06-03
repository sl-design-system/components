import { getScrollParent } from '@sl-design-system/shared';

/** The alignment of an item relative to the viewport when scrolling to it. */
export type ScrollAlignment = 'start' | 'center' | 'end' | 'auto';

/** Options for the various scroll methods. */
export interface ScrollToOptions {
  align?: ScrollAlignment;
  behavior?: ScrollBehavior;
}

/** A single virtualized item with its computed position in the list. */
export interface VirtualItem {
  /** A stable key for the item, used for DOM reconciliation. */
  key: number | string;

  /** The index of the item in the list. */
  index: number;

  /** The start offset of the item in pixels (relative to the scroll content). */
  start: number;

  /** The end offset of the item in pixels (relative to the scroll content). */
  end: number;

  /** The size of the item in pixels. */
  size: number;

  /** Whether the item is sticky. */
  sticky: boolean;
}

/** The options for the {@link Virtualizer}. */
export interface VirtualizerOptions {
  /** The total number of items in the list. */
  count: number;

  /** Returns an estimated size for the item at the given index. */
  estimateSize(index: number): number;

  /** The gap between items in pixels. */
  gap?: number;

  /** Returns a stable key for the item at the given index. */
  getItemKey?(index: number): number | string;

  /** Returns whether the item at the given index is sticky. */
  getIsSticky?(index: number): boolean;

  /** Returns the element that should be used as the scroll container. */
  getScrollElement(): Element | Window | null;

  /** Padding at the end of the list in pixels. */
  paddingEnd?: number;

  /** Padding at the start of the list in pixels. */
  paddingStart?: number;

  /** Number of items to render outside the visible area. */
  overscan?: number;

  /** Called whenever the virtualizer state changes and a re-render is needed. */
  onChange?(virtualizer: Virtualizer, sync: boolean): void;

  /** Padding subtracted from the viewport end when aligning a scrolled-to item. */
  scrollPaddingEnd?: number;

  /** Padding subtracted from the viewport start when aligning a scrolled-to item. */
  scrollPaddingStart?: number;

  /** The index the list should be scrolled to when first rendered. */
  startIndex?: number;
}

/** Performs a binary search for the item whose start is nearest to (but not past) `value`. */
const findNearestBinarySearch = (
  low: number,
  high: number,
  getValue: (index: number) => number,
  value: number
): number => {
  while (low <= high) {
    const middle = ((low + high) / 2) | 0,
      currentValue = getValue(middle);

    if (currentValue < value) {
      low = middle + 1;
    } else if (currentValue > value) {
      high = middle - 1;
    } else {
      return middle;
    }
  }

  return low > 0 ? low - 1 : 0;
};

/** Returns true if both numbers are within a single pixel of each other. */
const approxEqual = (a: number, b: number): boolean => Math.abs(a - b) < 1.01;

/**
 * A framework-agnostic virtualizer for vertical lists. It only renders the items that are
 * visible in the viewport (plus an overscan), which makes it possible to render very large
 * lists efficiently.
 *
 * This is a dependency-free implementation; it does not rely on `@tanstack/virtual-core` or
 * `@lit-labs/virtualizer`. The "virtual items" mechanic is modelled after `@tanstack/virtual-core`.
 *
 * It supports:
 * - Scrolling on an element with `overflow` as well as on the window.
 * - Being rendered while initially hidden (it recovers once it becomes visible).
 * - A `startIndex` to scroll to a specific item on first render.
 * - Sticky items that remain rendered until they have left the viewport.
 */
export class Virtualizer {
  /** Cached item elements by key, so we can keep observing them across renders. */
  #elementsCache = new Map<number | string, Element>();

  /** Whether the virtualizer has been mounted. */
  #isMounted = false;

  /** Cache of measured item sizes by key. */
  #itemSizeCache = new Map<number | string, number>();

  /** The computed measurements for every item. */
  #measurements: VirtualItem[] = [];

  /** The lowest index that needs to be (re)measured, or null when nothing is pending. */
  #measurementsDirtyFrom: number | null = 0;

  /** The merged options. */
  #options!: Required<VirtualizerOptions>;

  /** Observes size changes of the rendered item elements. */
  #resizeObserver?: ResizeObserver;

  /** The accumulated adjustment applied to keep the scroll position stable. */
  #scrollAdjustments = 0;

  /** The scroll element (an element with overflow or the window). */
  #scrollElement: Element | Window | null = null;

  /** Whether {@link #scrollElement} is the window. */
  #scrollIsWindow = false;

  /** Whether the initial scroll to {@link VirtualizerOptions.startIndex} has been applied. */
  #initialScrollApplied = false;

  /** The current scroll offset in pixels. */
  #scrollOffset = 0;

  /** Whether the user is currently scrolling. */
  #scrolling = false;

  /** Resets the `#scrolling` flag after scrolling stops. */
  #scrollingTimeout?: ReturnType<typeof setTimeout>;

  /**
   * The offset of the list inside the scroll content. For window scrolling this is the distance
   * from the top of the document to the host element; for element scrolling it is 0.
   */
  #scrollMargin = 0;

  /** The size (height) of the viewport in pixels. */
  #viewportSize = 0;

  /** Functions to call to clean up listeners and observers. */
  #unsubscribe: Array<() => void> = [];

  /** The merged options. */
  get options(): Required<VirtualizerOptions> {
    return this.#options;
  }

  /** The current scroll offset of the scroll element. */
  get scrollOffset(): number {
    return this.#scrollOffset;
  }

  /** The offset of the list inside the scroll content (window scrolling only). */
  get scrollMargin(): number {
    return this.#scrollMargin;
  }

  /** Whether the user is currently scrolling. */
  get scrolling(): boolean {
    return this.#scrolling;
  }

  /** The size (height) of the viewport in pixels. */
  get viewportSize(): number {
    return this.#viewportSize;
  }

  constructor(options: VirtualizerOptions) {
    this.setOptions(options);
  }

  /** Update the options and recompute the affected state. */
  setOptions(options: VirtualizerOptions): void {
    const previous = this.#options as Required<VirtualizerOptions> | undefined;

    this.#options = {
      gap: 0,
      getItemKey: (index: number) => index,
      getIsSticky: () => false,
      onChange: () => {},
      overscan: 3,
      paddingEnd: 0,
      paddingStart: 0,
      scrollPaddingEnd: 0,
      scrollPaddingStart: 0,
      startIndex: 0,
      ...previous,
      ...options
    };

    // Anything that affects item positions invalidates the measurements.
    if (
      !previous ||
      previous.count !== this.#options.count ||
      previous.gap !== this.#options.gap ||
      previous.paddingStart !== this.#options.paddingStart ||
      previous.estimateSize !== this.#options.estimateSize
    ) {
      // Drop cached sizes for items that no longer exist.
      if (previous && this.#options.count < previous.count) {
        for (let i = this.#options.count; i < previous.count; i++) {
          this.#itemSizeCache.delete(previous.getItemKey(i));
        }
      }

      this.#measurementsDirtyFrom = 0;
    }

    // The start index and count may only be known after mount, so try to apply the initial
    // scroll here too. It is a no-op once it has run or when there is nothing to scroll to.
    this.#applyInitialScroll();
  }

  /** Mount the virtualizer: resolve the scroll element and start observing it. */
  mount(host: Element): void {
    this.#scrollElement = this.#options.getScrollElement() ?? getScrollParent(host);
    this.#scrollIsWindow =
      this.#scrollElement === document.documentElement ||
      this.#scrollElement === document.body ||
      this.#scrollElement === window;

    this.#updateScrollMargin(host);

    // Set the initial scroll offset so the correct items render on the first frame.
    if ((this.#options.startIndex ?? 0) > 0 && this.#options.count > 0) {
      const [offset] = this.#getOffsetForIndex(this.#options.startIndex, 'start');

      this.#scrollOffset = offset;
    } else {
      this.#scrollOffset = this.#readScrollOffset();
    }

    this.#measureViewport();
    this.#observeScrollElement();
    this.#observeVisibility(host);

    this.#isMounted = true;

    // Apply the initial scroll position to the actual scroll element.
    this.#applyInitialScroll();

    this.#notify(false);
  }

  /**
   * Scroll to {@link VirtualizerOptions.startIndex} once, as soon as it becomes possible. The
   * start index and item count are often only known after the host's first update, which runs
   * after the controller has already mounted, so this may run from {@link setOptions} instead of
   * {@link mount}.
   */
  #applyInitialScroll(): void {
    if (this.#initialScrollApplied || !this.#isMounted) {
      return;
    }

    const startIndex = this.#options.startIndex ?? 0;
    if (startIndex <= 0 || this.#options.count <= 0) {
      return;
    }

    const [offset] = this.#getOffsetForIndex(startIndex, 'start');

    this.#scrollOffset = offset;
    this.#initialScrollApplied = true;

    // Apply the actual scroll after the host has rendered, so the scroll content is tall enough
    // for the scroll position to stick.
    requestAnimationFrame(() => {
      const [target] = this.#getOffsetForIndex(startIndex, 'start');

      this.#scrollOffset = target;
      this.#applyScroll(target, undefined);
      this.#notify(false);
    });
  }

  /** Unmount the virtualizer and clean up all listeners and observers. */
  unmount(): void {
    this.#isMounted = false;

    this.#unsubscribe.forEach(unsubscribe => unsubscribe());
    this.#unsubscribe = [];

    this.#resizeObserver?.disconnect();
    this.#resizeObserver = undefined;
    this.#elementsCache.clear();

    if (this.#scrollingTimeout) {
      clearTimeout(this.#scrollingTimeout);
      this.#scrollingTimeout = undefined;
    }

    this.#scrollElement = null;
  }

  /** Returns the total size of the list in pixels. */
  getTotalSize(): number {
    const measurements = this.#getMeasurements(),
      end = measurements.length > 0 ? measurements[measurements.length - 1].end : this.#options.paddingStart;

    return Math.max(end - this.#scrollMargin + this.#options.paddingEnd, 0);
  }

  /** Returns the virtual items that should currently be rendered. */
  getVirtualItems(): VirtualItem[] {
    const measurements = this.#getMeasurements();
    if (measurements.length === 0) {
      return [];
    }

    const range = this.#calculateRange(measurements);
    if (!range) {
      return [];
    }

    const { count, getIsSticky, overscan } = this.#options,
      start = Math.max(range.startIndex - overscan, 0),
      end = Math.min(range.endIndex + overscan, count - 1),
      indexes = new Set<number>();

    for (let i = start; i <= end; i++) {
      indexes.add(i);
    }

    // Keep the most recent sticky item above the viewport rendered, so it can be pinned to the
    // top. Also keep any sticky items inside the range (already added above).
    if (getIsSticky) {
      for (let i = start - 1; i >= 0; i--) {
        if (getIsSticky(i)) {
          indexes.add(i);
          break;
        }
      }
    }

    return Array.from(indexes)
      .sort((a, b) => a - b)
      .map(index => measurements[index]);
  }

  /** Returns the virtual item nearest to the given offset. */
  getVirtualItemForOffset(offset: number): VirtualItem | undefined {
    const measurements = this.#getMeasurements();
    if (measurements.length === 0) {
      return undefined;
    }

    return measurements[
      findNearestBinarySearch(0, measurements.length - 1, index => measurements[index].start, offset)
    ];
  }

  /** Scroll the list to the item at the given index. */
  scrollToIndex(index: number, { align = 'auto', behavior }: ScrollToOptions = {}): void {
    index = Math.max(0, Math.min(index, this.#options.count - 1));

    let attempts = 0;
    const maxAttempts = 10;

    const tryScroll = (currentAlign: ScrollAlignment): void => {
      const [offset, resolvedAlign] = this.#getOffsetForIndex(index, currentAlign);

      this.#applyScroll(offset, behavior);

      // Item sizes may differ from the estimate once rendered, so retry until the target
      // offset stabilizes.
      requestAnimationFrame(() => {
        if (!this.#isMounted) {
          return;
        }

        const [afterOffset] = this.#getOffsetForIndex(index, resolvedAlign);

        if (!approxEqual(afterOffset, this.#readScrollOffset()) && attempts < maxAttempts) {
          attempts++;
          requestAnimationFrame(() => tryScroll(resolvedAlign));
        }
      });
    };

    tryScroll(align);
  }

  /** Scroll the list to the given offset. */
  scrollToOffset(offset: number, { align = 'start', behavior }: ScrollToOptions = {}): void {
    this.#applyScroll(this.#getOffsetForAlignment(offset, align), behavior);
  }

  /**
   * Measure the given item element. Used as a ref callback on the rendered items. Re-measures
   * the element and adjusts the scroll position if an item above the viewport changed size.
   */
  measureElement = (element: Element | undefined): void => {
    if (!element) {
      return;
    }

    const index = this.#indexFromElement(element);
    if (index === -1) {
      return;
    }

    const item = this.#measurements[index];
    if (!item) {
      return;
    }

    const previous = this.#elementsCache.get(item.key);
    if (previous !== element) {
      if (previous) {
        this.#resizeObserver?.unobserve(previous);
      }

      this.#resizeObserver?.observe(element);
      this.#elementsCache.set(item.key, element);
    }

    if (element.isConnected) {
      this.#resizeItem(index, (element as HTMLElement).offsetHeight);
    }
  };

  /** Recalculate the scroll margin and remeasure the viewport (e.g. after a layout change). */
  remeasure(host: Element): void {
    this.#updateScrollMargin(host);
    this.#measureViewport();
    this.#notify(false);
  }

  #applyScroll(offset: number, behavior: ScrollBehavior | undefined): void {
    if (!this.#scrollElement) {
      return;
    }

    if (this.#scrollIsWindow) {
      window.scrollTo({ top: offset, behavior });
    } else {
      (this.#scrollElement as Element).scrollTo({ top: offset, behavior });
    }
  }

  #calculateRange(measurements: VirtualItem[]): { startIndex: number; endIndex: number } | null {
    const outerSize = this.#viewportSize;
    if (outerSize <= 0 || measurements.length === 0) {
      return null;
    }

    const lastIndex = measurements.length - 1,
      scrollOffset = this.#scrollOffset + this.#scrollAdjustments,
      startIndex = findNearestBinarySearch(0, lastIndex, index => measurements[index].start, scrollOffset);

    let endIndex = startIndex;

    while (endIndex < lastIndex && measurements[endIndex].end < scrollOffset + outerSize) {
      endIndex++;
    }

    return { startIndex, endIndex };
  }

  #getMeasurements(): VirtualItem[] {
    if (this.#measurementsDirtyFrom === null) {
      return this.#measurements;
    }

    const { count, estimateSize, gap, getItemKey, getIsSticky, paddingStart } = this.#options,
      min = this.#measurementsDirtyFrom,
      measurements = this.#measurements.slice(0, min);

    for (let i = min; i < count; i++) {
      const key = getItemKey(i),
        previous = measurements[i - 1],
        start = previous ? previous.end + gap : paddingStart + this.#scrollMargin,
        measuredSize = this.#itemSizeCache.get(key),
        size = typeof measuredSize === 'number' ? measuredSize : estimateSize(i);

      measurements[i] = {
        key,
        index: i,
        start,
        end: start + size,
        size,
        sticky: getIsSticky(i)
      };
    }

    measurements.length = count;

    this.#measurements = measurements;
    this.#measurementsDirtyFrom = null;

    return measurements;
  }

  #getOffsetForAlignment(toOffset: number, align: ScrollAlignment, itemSize = 0): number {
    const size = this.#viewportSize;

    if (align === 'auto') {
      align = toOffset >= this.#scrollOffset + size ? 'end' : 'start';
    }

    if (align === 'center') {
      toOffset += (itemSize - size) / 2;
    } else if (align === 'end') {
      toOffset -= size;
    }

    const maxOffset = this.getTotalSize() + this.#scrollMargin - size;

    return Math.max(Math.min(maxOffset, toOffset), 0);
  }

  #getOffsetForIndex(index: number, align: ScrollAlignment): readonly [number, ScrollAlignment] {
    index = Math.max(0, Math.min(index, this.#options.count - 1));

    const item = this.#getMeasurements()[index];
    if (!item) {
      return [this.#scrollOffset, align] as const;
    }

    const size = this.#viewportSize,
      { scrollPaddingEnd, scrollPaddingStart } = this.#options;

    if (align === 'auto') {
      if (item.end >= this.#scrollOffset + size - scrollPaddingEnd) {
        align = 'end';
      } else if (item.start <= this.#scrollOffset + scrollPaddingStart) {
        align = 'start';
      } else {
        return [this.#scrollOffset, align] as const;
      }
    }

    const toOffset = align === 'end' ? item.end + scrollPaddingEnd : item.start - scrollPaddingStart;

    return [this.#getOffsetForAlignment(toOffset, align, item.size), align] as const;
  }

  #indexFromElement(element: Element): number {
    const index = element.getAttribute('data-index');

    return index ? parseInt(index, 10) : -1;
  }

  #measureViewport(): void {
    if (!this.#scrollElement) {
      this.#viewportSize = 0;
      return;
    }

    this.#viewportSize = this.#scrollIsWindow
      ? window.innerHeight
      : (this.#scrollElement as Element).clientHeight;
  }

  #notify(sync: boolean): void {
    this.#options.onChange(this, sync);
  }

  #observeScrollElement(): void {
    if (!this.#scrollElement) {
      return;
    }

    const onScroll = (): void => {
      this.#scrollAdjustments = 0;
      this.#scrollOffset = this.#readScrollOffset();
      this.#scrolling = true;

      if (this.#scrollingTimeout) {
        clearTimeout(this.#scrollingTimeout);
      }

      this.#scrollingTimeout = setTimeout(() => {
        this.#scrolling = false;
        this.#notify(false);
      }, 150);

      this.#notify(true);
    };

    const target: EventTarget = this.#scrollIsWindow ? window : this.#scrollElement;
    target.addEventListener('scroll', onScroll, { passive: true });
    this.#unsubscribe.push(() => target.removeEventListener('scroll', onScroll));

    const onResize = (): void => {
      this.#measureViewport();
      this.#notify(false);
    };

    if (this.#scrollIsWindow) {
      window.addEventListener('resize', onResize);
      this.#unsubscribe.push(() => window.removeEventListener('resize', onResize));
    } else {
      const resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(this.#scrollElement as Element);
      this.#unsubscribe.push(() => resizeObserver.disconnect());
    }

    this.#resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => this.measureElement(entry.target));
    });
  }

  #observeVisibility(host: Element): void {
    // When the host is initially hidden (or its position changes) the viewport size and scroll
    // margin need to be recomputed once it becomes visible.
    const resizeObserver = new ResizeObserver(() => {
      const previousMargin = this.#scrollMargin;

      this.#updateScrollMargin(host);
      this.#measureViewport();

      if (previousMargin !== this.#scrollMargin) {
        this.#measurementsDirtyFrom = 0;
      }

      this.#notify(false);
    });

    resizeObserver.observe(host);
    if (host.parentElement) {
      resizeObserver.observe(host.parentElement);
    }

    this.#unsubscribe.push(() => resizeObserver.disconnect());
  }

  #readScrollOffset(): number {
    if (!this.#scrollElement) {
      return 0;
    }

    return this.#scrollIsWindow ? window.scrollY : (this.#scrollElement as Element).scrollTop;
  }

  #resizeItem(index: number, size: number): void {
    const item = this.#measurements[index];
    if (!item) {
      return;
    }

    const cachedSize = this.#itemSizeCache.get(item.key) ?? item.size,
      delta = size - cachedSize;

    if (delta === 0) {
      return;
    }

    // Keep the scroll position stable when an item above the current offset changes size.
    if (item.start < this.#scrollOffset + this.#scrollAdjustments) {
      this.#scrollAdjustments += delta;
      this.#applyScroll(this.#scrollOffset + this.#scrollAdjustments, undefined);
    }

    this.#itemSizeCache.set(item.key, size);
    this.#measurementsDirtyFrom =
      this.#measurementsDirtyFrom === null ? index : Math.min(this.#measurementsDirtyFrom, index);

    this.#notify(false);
  }

  #updateScrollMargin(host: Element): void {
    if (this.#scrollIsWindow) {
      const margin = host.getBoundingClientRect().top + window.scrollY;

      if (margin !== this.#scrollMargin) {
        this.#scrollMargin = margin;
        this.#measurementsDirtyFrom = 0;
      }
    } else {
      this.#scrollMargin = 0;
    }
  }
}
