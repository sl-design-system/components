export type SlBlurEvent = CustomEvent<void>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-blur': SlBlurEvent;
  }
}
