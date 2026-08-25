export type SlSelectEvent<T = any> = CustomEvent<T>;
declare global {
  interface GlobalEventHandlersEventMap {
    'sl-select': SlSelectEvent;
  }
}
