import { type ReactiveController, type ReactiveControllerHost } from 'lit';

export type MediaDevice = 'mobile' | 'tablet' | 'desktop' | 'digiboard';

/**
 * A controller that listens for media query changes and updates the host element
 * when the media query matches or no longer matches.
 */
export class MediaController implements ReactiveController {
  #host: ReactiveControllerHost & HTMLElement;
  #mediaQueries: Map<MediaDevice, MediaQueryList> = new Map();

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

  constructor(host: ReactiveControllerHost & HTMLElement) {
    this.#host = host;
    this.#host.addController(this);
  }

  hostConnected(): void {
    this.#setup();
    this.#mediaQueries.forEach(mql => mql.addEventListener('change', this.#onChange));
  }

  hostDisconnected(): void {
    this.#mediaQueries.forEach(mql => mql.removeEventListener('change', this.#onChange));
  }

  #onChange = (): void => {
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
