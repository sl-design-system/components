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

    if (this.#scrollElement === document.documentElement) {
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

    if (this.#scrollElement === document.documentElement) {
      const getOffset = () => {
        const rect = this.#host.getBoundingClientRect();
        return rect.top + window.scrollY;
      };

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

      // Debounced scrollMargin update to prevent excessive recalculations
      const updateScrollMargin = () => {
        const virtualizer = this.#virtualizer as Virtualizer<Window, TItemElement>;

        if (this.#disposed || this.#updateTaskId || typeof virtualizer.options.scrollMargin === 'number') {
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

      // ResizeObserver: detects size changes to the host element or its ancestors.
      // We observe the host and its direct parent to catch layout shifts that
      // might affect the tree's position relative to the viewport.
      const resizeObserver = new ResizeObserver(() => updateScrollMargin());
      resizeObserver.observe(this.#host);

      if (this.#host.parentElement) {
        resizeObserver.observe(this.#host.parentElement);
      }

      // Keep window.resize as fallback for edge cases
      window.addEventListener('resize', updateScrollMargin);

      const originalCleanup = this.instance._didMount();
      this.#cleanup = () => {
        this.#disposed = true;
        if (this.#updateTaskId) {
          cancelAnimationFrame(this.#updateTaskId);
        }
        window.removeEventListener('resize', updateScrollMargin);
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
