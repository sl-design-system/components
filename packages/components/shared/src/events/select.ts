export type SlSelectEvent<T = unknown> = CustomEvent<T>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-select': SlSelectEvent;
  }
}
