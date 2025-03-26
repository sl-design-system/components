// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SlChangeEvent<T = any> = CustomEvent<T>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-change': SlChangeEvent;
  }
}
