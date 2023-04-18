import type { ReactiveController, ReactiveControllerHost } from 'lit';
export type EventRegistration = Partial<{
    [name in keyof GlobalEventHandlersEventMap]: (event: GlobalEventHandlersEventMap[name]) => void;
}>;
export declare class EventsController implements ReactiveController {
    #private;
    constructor(host: ReactiveControllerHost & HTMLElement, events?: EventRegistration);
    hostDisconnected(): void;
    listen<K extends keyof GlobalEventHandlersEventMap>(host: Node, type: K, listener: (this: GlobalEventHandlers, ev: GlobalEventHandlersEventMap[K]) => void, options?: boolean | AddEventListenerOptions): void;
}
