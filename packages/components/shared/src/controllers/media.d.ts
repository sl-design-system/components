import { type ReactiveController, type ReactiveControllerHost } from 'lit';
export type MediaDevice = 'mobile' | 'tablet' | 'desktop' | 'digiboard';
export interface MediaChangeEvent {
  /** Previous device before the change. */
  previous: MediaDevice;
  /** Current device after the change. */
  current: MediaDevice;
}
export type MediaControllerConfig = {
  /** Callback that fires when the viewport crosses a breakpoint. */
  onChange?(event: MediaChangeEvent): void;
};
/**
 * A controller that listens for media query changes and updates the host element when the media
 * query matches or no longer matches.
 */
export declare class MediaController implements ReactiveController {
  #private;
  /** Whether the current device is a mobile device. */
  get mobile(): boolean;
  /** Whether the current device is a tablet device. */
  get tablet(): boolean;
  /** Whether the current device is a desktop device. */
  get desktop(): boolean;
  /** Whether the current device is a digiboard device. */
  get digiboard(): boolean;
  /** Current device based on the active media query. */
  get device(): MediaDevice;
  constructor(host: ReactiveControllerHost & HTMLElement, config?: MediaControllerConfig);
  hostConnected(): void;
  hostDisconnected(): void;
}
