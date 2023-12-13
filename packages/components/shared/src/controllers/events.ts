import type { ReactiveController, ReactiveControllerHost } from 'lit';

export type EventRegistration = Partial<{
  [name in keyof GlobalEventHandlersEventMap]: (event: GlobalEventHandlersEventMap[name]) => void;
}>;

export class EventsController implements ReactiveController {
  #events?: EventRegistration;
  #host: ReactiveControllerHost & HTMLElement;
  #listeners: Array<() => void> = [];

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
    this.#listeners.forEach(cb => cb());
    this.#listeners = [];
  }

  listen<K extends keyof GlobalEventHandlersEventMap>(
    host: Node,
    type: K,
    listener: (this: GlobalEventHandlers, ev: GlobalEventHandlersEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  listen(
    host: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void {
    if (host !== document) {
      console.log('listen', host, type, listener, options);
    }

    const callback = (event: Event): void => {
      if (host !== document) {
        console.log('callback', host, this.#host, type, event);
      }

      if (typeof listener === 'function') {
        listener.call(this.#host, event);
      } else {
        listener.handleEvent.call(this.#host, event);
      }
    };

    host.addEventListener(type, callback, options);
    this.#listeners.push(() => host.removeEventListener(type, callback, options));
  }
}
