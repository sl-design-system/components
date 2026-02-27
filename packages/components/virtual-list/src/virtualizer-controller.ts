import { getScrollParent } from '@sl-design-system/shared';
import {
  Virtualizer,
  type VirtualizerOptions,
  elementScroll,
  observeElementOffset,
  observeElementRect,
  observeWindowOffset,
  observeWindowRect,
  windowScroll
} from '@tanstack/virtual-core';
import { type ReactiveController, type ReactiveControllerHost } from 'lit';

export type VirtualizerControllerOptions<TScrollElement extends Element | Window, TItemElement extends Element> = Omit<
  VirtualizerOptions<TScrollElement, TItemElement>,
  'getScrollElement' | 'observeElementRect' | 'observeElementOffset' | 'scrollToFn'
>;

/**
 * A reactive controller that manages virtualization using @tanstack/virtual-core.
 * This controller integrates TanStack Virtual with Lit's reactive update cycle.
 */
export class VirtualizerController<TScrollElement extends Element | Window, TItemElement extends Element>
  implements ReactiveController
{
  /** Cleanup function to be called when disconnected. */
  #cleanup: () => void = () => {};

  /** Whether the controller has been disposed. */
  #disposed = false;

  /** Whether user provided a custom scrollMargin value. */
  #hasCustomScrollMargin = false;

  /** The host element. */
  #host: ReactiveControllerHost & HTMLElement;

  /** The options for the virtualizer. */
  #options: VirtualizerControllerOptions<TScrollElement, TItemElement>;

  /** The parent element that scrolls. */
  #scrollElement?: Element;

  /** The virtualizer instance. */
  #virtualizer!: Virtualizer<Element, TItemElement> | Virtualizer<Window, TItemElement>;

  /** The ID of the pending scrollMargin update task. */
  #updateTaskId?: number;

  /** Get the virtualizer instance. */
  get instance(): Virtualizer<Element, TItemElement> | Virtualizer<Window, TItemElement> {
    return this.#virtualizer;
  }

  constructor(
    host: ReactiveControllerHost & HTMLElement,
    options: VirtualizerControllerOptions<TScrollElement, TItemElement>
  ) {
    this.#host = host;
    this.#options = options;

    host.addController(this);
  }

  hostConnected(): void {
    // Reinitialize on every connect to pick up correct scroll parent.
    // This handles the case where element was moved in DOM between connects.
    this.#initialize();
  }

  hostUpdate(): void {
    this.instance?._willUpdate();
  }

  hostDisconnected(): void {
    this.#cleanup();
  }

  updateOptions(options: Partial<VirtualizerControllerOptions<TScrollElement, TItemElement>>): void {
    if (!this.instance) {
      this.#options = { ...this.#options, ...options };
      return;
    }

    const resolvedOptions = { ...this.instance?.options, ...options };

    // Check if we're using window scrolling (scroll parent is document.documentElement or document.body)
    const isWindowScroll = this.#scrollElement === document.documentElement || this.#scrollElement === document.body;

    if (isWindowScroll) {
      (this.instance as Virtualizer<Window, TItemElement>).setOptions(
        resolvedOptions as VirtualizerOptions<Window, TItemElement>
      );
    } else {
      (this.instance as Virtualizer<Element, TItemElement>).setOptions(
        resolvedOptions as VirtualizerOptions<Element, TItemElement>
      );
    }
  }

  #initialize(): void {
    this.#disposed = false;
    this.#updateTaskId = undefined;

    const options = {
      ...this.#options,
      onChange: (instance: Virtualizer<Element, TItemElement> | Virtualizer<Window, TItemElement>, sync: boolean) => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.#host.updateComplete.then(() => this.#host.requestUpdate());
        this.#options.onChange?.(instance as unknown as Virtualizer<TScrollElement, TItemElement>, sync);
      }
    };

    this.#scrollElement = getScrollParent(this.#host);

    // Check if we're using window scrolling (scroll parent is document.documentElement or document.body)
    const isWindowScroll = this.#scrollElement === document.documentElement || this.#scrollElement === document.body;

    if (isWindowScroll) {
      const getOffset = () => {
        const rect = this.#host.getBoundingClientRect();
        return rect.top + window.scrollY;
      };

      // Track if user explicitly provided scrollMargin
      this.#hasCustomScrollMargin = options.scrollMargin !== undefined;
      const initialScrollMargin = options.scrollMargin ?? getOffset();

      const resolvedOptions: VirtualizerOptions<Window, TItemElement> = {
        ...options,
        getScrollElement: () => window,
        observeElementRect: observeWindowRect,
        observeElementOffset: observeWindowOffset,
        scrollMargin: initialScrollMargin,
        scrollToFn: windowScroll,
        initialOffset: () => (typeof document !== 'undefined' ? window.scrollY : 0)
      } as VirtualizerOptions<Window, TItemElement>;

      this.#virtualizer = new Virtualizer(resolvedOptions);

      // Core scrollMargin update logic
      const doUpdateScrollMargin = () => {
        const virtualizer = this.#virtualizer as Virtualizer<Window, TItemElement>;

        // Skip if disposed, already pending update, or user provided custom scrollMargin
        if (this.#disposed || this.#updateTaskId || this.#hasCustomScrollMargin) {
          return;
        }

        this.#updateTaskId = requestAnimationFrame(() => {
          this.#updateTaskId = undefined;

          if (this.#disposed) {
            return;
          }

          const newMargin = getOffset();
          if (Math.abs(newMargin - (virtualizer.options.scrollMargin || 0)) > 1) {
            virtualizer.setOptions({
              ...virtualizer.options,
              scrollMargin: newMargin
            });
          }
        });
      };

      // ResizeObserver handler - skips during scroll to prevent mobile jumping
      const onResize = () => {
        const virtualizer = this.#virtualizer as Virtualizer<Window, TItemElement>;
        if (!virtualizer.isScrolling) {
          doUpdateScrollMargin();
        }
      };

      // Window resize handler - always updates (for devtools/layout changes)
      const onWindowResize = () => {
        doUpdateScrollMargin();
      };

      // ResizeObserver to detect layout changes that affect element position
      const resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(this.#host);

      if (this.#host.parentElement) {
        resizeObserver.observe(this.#host.parentElement);
      }

      // Window resize always triggers update
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
      const resolvedOptions: VirtualizerOptions<Element, TItemElement> = {
        ...options,
        getScrollElement: () => this.#scrollElement,
        observeElementRect: observeElementRect,
        observeElementOffset: observeElementOffset,
        scrollToFn: elementScroll
      } as VirtualizerOptions<Element, TItemElement>;

      this.#virtualizer = new Virtualizer(resolvedOptions);
    }

    this.#cleanup = this.instance._didMount();
  }
}
