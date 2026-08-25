import { type ReactiveController, type ReactiveControllerHost } from 'lit';
export type EventRegistration = Partial<{
  [name in keyof GlobalEventHandlersEventMap]:
    | ((event: GlobalEventHandlersEventMap[name]) => void | Promise<void>)
    | {
        handler(event: GlobalEventHandlersEventMap[name]): void | Promise<void>;
        options?: boolean | AddEventListenerOptions;
      };
}>;
export declare class EventsController implements ReactiveController {
  #private;
  constructor(host: ReactiveControllerHost & HTMLElement, events?: EventRegistration);
  hostConnected(): void;
  hostDisconnected(): void;
  listen<K extends keyof WindowEventMap>(
    window: Window,
    type: K,
    listener: (this: Window, ev: WindowEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  listen<K extends keyof DocumentEventMap>(
    document: Document,
    type: K,
    listener: (this: Document, ev: DocumentEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  listen<K extends keyof HTMLElementEventMap>(
    element: HTMLElement,
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  listen<K extends keyof ShadowRootEventMap>(
    element: ShadowRoot,
    type: K,
    listener: (this: ShadowRoot, ev: ShadowRootEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  listen<K extends keyof MediaQueryListEventMap>(
    element: MediaQueryList,
    type: K,
    listener: (this: ShadowRoot, ev: MediaQueryListEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  listen<K extends keyof GlobalEventHandlersEventMap>(
    element: Element,
    type: K,
    listener: (this: Element, ev: GlobalEventHandlersEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
}
