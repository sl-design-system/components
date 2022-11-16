import type { ReactiveController, ReactiveControllerHost } from 'lit';

export class EventsController implements ReactiveController {
  #listeners: Array<() => void> = [];

  constructor(host: ReactiveControllerHost) {
    host.addController(this);
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

  listen(host: Node, type: string, listener: unknown, options?: boolean | AddEventListenerOptions): void {
    host.addEventListener(type, listener as EventListenerObject, options);
    this.#listeners.push(() => host.removeEventListener(type, listener as EventListenerObject, options));
  }
}
