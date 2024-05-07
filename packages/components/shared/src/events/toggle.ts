export type SlToggleEvent<T = unknown> = CustomEvent<T>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-toggle': SlToggleEvent;
  }
}
