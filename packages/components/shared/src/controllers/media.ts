import { type ReactiveController, type ReactiveControllerHost } from 'lit';

/**
 * A controller that listens for media query changes and updates the host element
 * when the media query matches or no longer matches.
 */
export class MediaController implements ReactiveController {
  #host: ReactiveControllerHost & HTMLElement;
  #mediaQueryList: MediaQueryList | null = null;

  constructor(host: ReactiveControllerHost & HTMLElement) {
    this.#host = host;
    this.#host.addController(this);
  }

  hostConnected(): void {
    this.#mediaQueryList?.addEventListener('change', this.#onChange);
  }

  hostDisconnected(): void {
    this.#mediaQueryList?.removeEventListener('change', this.#onChange);
  }

  #onChange = (event: MediaQueryListEvent): void => {
    console.log('Media query changed:', event);

    this.#host.requestUpdate();
  };
}
