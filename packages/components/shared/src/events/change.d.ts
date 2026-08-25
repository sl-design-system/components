export type SlChangeEvent<T = any> = CustomEvent<T>;
declare global {
  interface GlobalEventHandlersEventMap {
    'sl-change': SlChangeEvent;
  }
}
