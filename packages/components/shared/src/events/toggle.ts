export type SlToggleEvent<T = unknown> = CustomEvent<T>;

declare global {
  interface GlobalEventHandlersEventMap {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'sl-toggle': SlToggleEvent<any>;
  }
}
