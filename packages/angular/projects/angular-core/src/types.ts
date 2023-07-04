export {};

declare global {
  // Declare this here: this is defined in typescript >= 5.2, but we're still using
  // 4.9.5 in the angular workspace.
  interface ToggleEvent extends Event {
    readonly newState: string;
    readonly oldState: string;
  }
}