import type { ReactiveController, ReactiveControllerHost } from 'lit';

export class EventsController implements ReactiveController {
  #host: ReactiveControllerHost & HTMLElement;

  #listeners: Array<() => void> = [];

  constructor(
    host: ReactiveControllerHost & HTMLElement,
    events?: { [name: string]: EventListenerOrEventListenerObject }
  ) {
    this.#host = host;
    this.#host.addController(this);

    if (events) {
      Object.entries(events).forEach(([name, listener]) => {
        this.listen(host, name, listener);
      });
    }
  }

  hostDisconnected(): void {
    this.#listeners.forEach(cb => cb());
    this.#listeners = [];
  }

  listen(
    host: Node,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;

  listen<K extends keyof GlobalEventHandlersEventMap>(
    host: Node,
    type: K,
    listener: (this: GlobalEventHandlers, ev: GlobalEventHandlersEventMap[K]) => unknown,
    options?: boolean | AddEventListenerOptions
  ): void;

  // FIXME: the types are kind of a mess here
  listen(host: Node, type: string, listener: unknown, options?: boolean | AddEventListenerOptions): void {
    host.addEventListener(type, (event: Event) => (listener as EventListener).call(this.#host, event), options);
    this.#listeners.push(() => host.removeEventListener(type, listener as EventListenerObject, options));
  }
}
