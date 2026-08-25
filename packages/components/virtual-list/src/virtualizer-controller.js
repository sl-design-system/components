import { getScrollParent } from '@sl-design-system/shared';
import {
  Virtualizer,
  elementScroll,
  observeElementOffset,
  observeElementRect,
  observeWindowOffset,
  observeWindowRect,
  windowScroll
} from '@tanstack/virtual-core';
export class VirtualizerController {
  /** Cleanup function to be called when disconnected. */
  #cleanup = () => {};
  /** Whether the controller has been disposed. */
  #disposed = false;
  /** Whether user provided a custom scrollMargin value. */
  #hasCustomScrollMargin = false;
  /** The host element. */
  #host;
  /** The options for the virtualizer. */
  #options;
  /** The parent element that scrolls. */
  #scrollElement;
  /** The virtualizer instance. */
  #virtualizer;
  /** The ID of the pending scrollMargin update task. */
  #updateTaskId;
  /** Get the virtualizer instance. */
  get instance() {
    return this.#virtualizer;
  }
  constructor(host, options) {
    this.#host = host;
    this.#options = options;
    host.addController(this);
  }
  hostConnected() {
    this.#initialize();
  }
  hostUpdate() {
    this.instance?._willUpdate();
  }
  hostDisconnected() {
    this.#cleanup();
  }
  updateOptions(options) {
    if (!this.instance) {
      this.#options = { ...this.#options, ...options };
      return;
    }
    const isWindowScroll =
      this.#scrollElement === document.documentElement || this.#scrollElement === document.body;
    const scrollMarginWasUpdated = Object.prototype.hasOwnProperty.call(options, 'scrollMargin');
    let resolvedOptions = { ...this.instance?.options, ...options };
    if (scrollMarginWasUpdated) {
      this.#hasCustomScrollMargin = options.scrollMargin !== void 0;
      if (!this.#hasCustomScrollMargin) {
        resolvedOptions = {
          ...resolvedOptions,
          scrollMargin: isWindowScroll ? this.#getOffset() : 0
        };
      }
    }
    if (isWindowScroll) {
      this.instance.setOptions(resolvedOptions);
    } else {
      this.instance.setOptions(resolvedOptions);
    }
  }
  #initialize() {
    this.#disposed = false;
    this.#updateTaskId = void 0;
    const options = {
      ...this.#options,
      onChange: (instance, sync) => {
        this.#host.updateComplete.then(() => this.#host.requestUpdate());
        this.#options.onChange?.(instance, sync);
      }
    };
    this.#scrollElement = getScrollParent(this.#host);
    const isWindowScroll =
      this.#scrollElement === document.documentElement || this.#scrollElement === document.body;
    if (isWindowScroll) {
      this.#hasCustomScrollMargin = options.scrollMargin !== void 0;
      const initialScrollMargin = options.scrollMargin ?? this.#getOffset();
      const resolvedOptions = {
        ...options,
        getScrollElement: () => window,
        observeElementRect: observeWindowRect,
        observeElementOffset: observeWindowOffset,
        scrollMargin: initialScrollMargin,
        scrollToFn: windowScroll,
        initialOffset: () => (typeof document !== 'undefined' ? window.scrollY : 0)
      };
      this.#virtualizer = new Virtualizer(resolvedOptions);
      const doUpdateScrollMargin = () => {
        const virtualizer = this.#virtualizer;
        if (this.#disposed || this.#updateTaskId || this.#hasCustomScrollMargin) {
          return;
        }
        this.#updateTaskId = requestAnimationFrame(() => {
          this.#updateTaskId = void 0;
          if (this.#disposed) {
            return;
          }
          const newMargin = this.#getOffset();
          if (Math.abs(newMargin - (virtualizer.options.scrollMargin || 0)) > 1) {
            virtualizer.setOptions({
              ...virtualizer.options,
              scrollMargin: newMargin
            });
          }
        });
      };
      const onResize = () => {
        const virtualizer = this.#virtualizer;
        if (!virtualizer.isScrolling) {
          doUpdateScrollMargin();
        }
      };
      const onWindowResize = () => {
        doUpdateScrollMargin();
      };
      const resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(this.#host);
      if (this.#host.parentElement) {
        resizeObserver.observe(this.#host.parentElement);
      }
      window.addEventListener('resize', onWindowResize);
      const originalCleanup = this.instance._didMount();
      this.#cleanup = () => {
        this.#disposed = true;
        if (this.#updateTaskId) {
          cancelAnimationFrame(this.#updateTaskId);
        }
        window.removeEventListener('resize', onWindowResize);
        resizeObserver.disconnect();
        originalCleanup();
      };
      return;
    } else {
      const resolvedOptions = {
        ...options,
        getScrollElement: () => this.#scrollElement,
        observeElementRect,
        observeElementOffset,
        scrollToFn: elementScroll
      };
      this.#virtualizer = new Virtualizer(resolvedOptions);
    }
    this.#cleanup = this.instance._didMount();
  }
  #getOffset() {
    const rect = this.#host.getBoundingClientRect();
    return rect.top + window.scrollY;
  }
}
//# sourceMappingURL=virtualizer-controller.js.map
