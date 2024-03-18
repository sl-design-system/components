export type SlFocusEvent = CustomEvent<void>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-focus': SlFocusEvent;
  }
}
