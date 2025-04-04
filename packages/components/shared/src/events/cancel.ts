export type SlCancelEvent = CustomEvent<void>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-cancel': SlCancelEvent;
  }
}
