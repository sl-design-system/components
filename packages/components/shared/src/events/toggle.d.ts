export type SlToggleEvent<T = any> = CustomEvent<T>;
declare global {
  interface GlobalEventHandlersEventMap {
    'sl-toggle': SlToggleEvent<any>;
  }
}
