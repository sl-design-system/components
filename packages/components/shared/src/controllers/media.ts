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
 * A controller that listens for media query changes and updates the host element
 * when the media query matches or no longer matches.
 */
export class MediaController implements ReactiveController {
  #config?: MediaControllerConfig;
  #host: ReactiveControllerHost & HTMLElement;
  #mediaQueries: Map<MediaDevice, MediaQueryList> = new Map();
  #previousDevice?: MediaDevice;

  /** Whether the current device is a mobile device. */
  get mobile(): boolean {
    return this.#mediaQueries.get('mobile')?.matches ?? false;
  }

  /** Whether the current device is a tablet device. */
  get tablet(): boolean {
    return this.#mediaQueries.get('tablet')?.matches ?? false;
  }

  /** Whether the current device is a desktop device. */
  get desktop(): boolean {
    return this.#mediaQueries.get('desktop')?.matches ?? false;
  }

  /** Whether the current device is a digiboard device. */
  get digiboard(): boolean {
    return this.#mediaQueries.get('digiboard')?.matches ?? false;
  }

  /** Current device based on the active media query. */
  get device(): MediaDevice {
    return [...this.#mediaQueries.entries()].find(([, mql]) => mql.matches)?.[0] ?? 'desktop';
  }

  /** Previous device before the last media query change. */
  get previousDevice(): MediaDevice | undefined {
    return this.#previousDevice;
  }

  constructor(host: ReactiveControllerHost & HTMLElement, config?: MediaControllerConfig) {
    this.#config = config;
    this.#host = host;
    this.#host.addController(this);
  }

  hostConnected(): void {
    this.#setup();
    this.#previousDevice = this.device;
    this.#mediaQueries.forEach(mql => mql.addEventListener('change', this.#onChange));
  }

  hostDisconnected(): void {
    this.#mediaQueries.forEach(mql => mql.removeEventListener('change', this.#onChange));
  }

  #onChange = (): void => {
    const current = this.device;

    if (this.#previousDevice !== undefined && this.#previousDevice !== current) {
      const previous = this.#previousDevice;
      this.#previousDevice = current;

      this.#config?.onChange?.({ previous, current });
    }

    this.#host.requestUpdate();
  };

  #setup(): void {
    if (this.#mediaQueries.size > 0) {
      return;
    }

    this.#mediaQueries.set('mobile', window.matchMedia('(width <= 600px)'));
    this.#mediaQueries.set('tablet', window.matchMedia('(width > 600px) and (width <= 900px)'));
    this.#mediaQueries.set('desktop', window.matchMedia('(width > 900px) and (width <= 1200px)'));
    this.#mediaQueries.set('digiboard', window.matchMedia('(width > 1200px)'));
  }
}
