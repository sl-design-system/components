// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SlToggleEvent<T = any> = CustomEvent<T>;

declare global {
  interface GlobalEventHandlersEventMap {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'sl-toggle': SlToggleEvent<any>;
  }
}
