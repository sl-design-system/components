// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SlSelectEvent<T = any> = CustomEvent<T>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-select': SlSelectEvent;
  }
}
