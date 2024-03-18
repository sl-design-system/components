import { type ReactiveController, type ReactiveControllerHost } from 'lit';

export type EventRegistration = Partial<{
  [name in keyof GlobalEventHandlersEventMap]: (event: GlobalEventHandlersEventMap[name]) => void | Promise<void>;
}>;

export class EventsController implements ReactiveController {
  #events?: EventRegistration;
  #host: ReactiveControllerHost & HTMLElement;
  #listeners: Array<() => void | Promise<void>> = [];

  constructor(host: ReactiveControllerHost & HTMLElement, events?: EventRegistration) {
    this.#host = host;
    this.#host.addController(this);
    this.#events = events;
  }

  hostConnected(): void {
    Object.entries(this.#events ?? {}).forEach(([name, listener]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.listen<any>(this.#host, name, listener);
    });
  }

  hostDisconnected(): void {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/promise-function-async
    this.#listeners.forEach(cb => cb());
    this.#listeners = [];
  }

  listen<K extends keyof WindowEventMap>(
    window: Window,
    type: K,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listener: (this: Window, ev: WindowEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;

  listen<K extends keyof DocumentEventMap>(
    document: Document,
    type: K,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listener: (this: Document, ev: DocumentEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;

  listen<K extends keyof HTMLElementEventMap>(
    element: HTMLElement,
    type: K,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;

  listen<K extends keyof ShadowRootEventMap>(
    element: ShadowRoot,
    type: K,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listener: (this: ShadowRoot, ev: ShadowRootEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;

  listen<K extends keyof MediaQueryListEventMap>(
    element: MediaQueryList,
    type: K,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listener: (this: ShadowRoot, ev: MediaQueryListEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;

  listen<K extends keyof GlobalEventHandlersEventMap>(
    element: Element,
    type: K,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listener: (this: Element, ev: GlobalEventHandlersEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;

  listen(
    element: Window | Document | Element | HTMLElement | ShadowRoot | MediaQueryList,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void {
    const callback = (event: Event): void => {
      if (typeof listener === 'function') {
        listener.call(this.#host, event);
      } else {
        listener.handleEvent.call(this.#host, event);
      }
    };

    element.addEventListener(type, callback, options);
    this.#listeners.push(() => element.removeEventListener(type, callback, options));
  }
}
