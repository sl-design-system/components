export type SlClearEvent = CustomEvent<void>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-clear': SlClearEvent;
  }
}
