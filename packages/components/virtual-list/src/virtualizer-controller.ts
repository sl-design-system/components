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

  /** The host element. */
  #host: ReactiveControllerHost & HTMLElement;

  /** The options for the virtualizer. */
  #options: VirtualizerControllerOptions<TScrollElement, TItemElement>;

  /** The parent element that scrolls. */
  #scrollElement?: Element;

  /** The virtualizer instance. */
  #virtualizer!: Virtualizer<Element, TItemElement> | Virtualizer<Window, TItemElement>;

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
    const resolvedOptions = { ...this.instance.options, ...options };

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
      const resolvedOptions: VirtualizerOptions<Window, TItemElement> = {
        ...options,
        getScrollElement: () => window,
        observeElementRect: observeWindowRect,
        observeElementOffset: observeWindowOffset,
        scrollToFn: windowScroll,
        initialOffset: () => (typeof document !== 'undefined' ? window.scrollY : 0)
      } as VirtualizerOptions<Window, TItemElement>;

      this.#virtualizer = new Virtualizer(resolvedOptions);
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
