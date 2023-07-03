import type { ReactiveController, ReactiveControllerHost } from 'lit';

export type EventRegistration = Partial<{
  [name in keyof GlobalEventHandlersEventMap]: (event: GlobalEventHandlersEventMap[name]) => void;
}>;

export class EventsController implements ReactiveController {
  #host: ReactiveControllerHost & HTMLElement;

  #listeners: Array<() => void> = [];

  constructor(host: ReactiveControllerHost & HTMLElement, events?: EventRegistration) {
    this.#host = host;
    this.#host.addController(this);

    if (events) {
      Object.entries(events).forEach(([name, listener]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.listen<any>(host, name, listener);
      });
    }
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

  // FIXME: the types are kind of a mess here
  listen(host: Node, type: string, listener: unknown, options?: boolean | AddEventListenerOptions): void {
    const callback = (event: Event): void => (listener as EventListener).call(this.#host, event);

    host.addEventListener(type, callback, options);
    this.#listeners.push(() => host.removeEventListener(type, callback, options));
  }
}
