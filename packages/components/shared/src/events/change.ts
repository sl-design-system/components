export type SlChangeEvent<T = unknown> = CustomEvent<T>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-change': SlChangeEvent;
  }
}
