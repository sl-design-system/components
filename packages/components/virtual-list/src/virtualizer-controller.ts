import { type ReactiveController, type ReactiveControllerHost } from 'lit';
import { Virtualizer, type VirtualizerOptions } from './virtualizer.js';

export type VirtualizerControllerOptions = Omit<VirtualizerOptions, 'getScrollElement' | 'onChange'> &
  Partial<Pick<VirtualizerOptions, 'getScrollElement' | 'onChange'>>;

/**
 * A reactive controller that integrates the dependency-free {@link Virtualizer} with Lit's
 * reactive update cycle.
 *
 * The controller mounts the virtualizer when the host connects and cleans it up when the host
 * disconnects. Whenever the virtualizer state changes it schedules a re-render of the host.
 */
export class VirtualizerController implements ReactiveController {
  /** The host element. */
  #host: ReactiveControllerHost & HTMLElement;

  /** The options for the virtualizer. */
  #options: VirtualizerControllerOptions;

  /** The virtualizer instance. */
  #virtualizer: Virtualizer;

  /** The virtualizer instance. */
  get virtualizer(): Virtualizer {
    return this.#virtualizer;
  }

  constructor(host: ReactiveControllerHost & HTMLElement, options: VirtualizerControllerOptions) {
    this.#host = host;
    this.#options = options;
    this.#virtualizer = new Virtualizer(this.#resolveOptions(options));

    host.addController(this);
  }

  hostConnected(): void {
    this.#virtualizer.mount(this.#host);
  }

  hostDisconnected(): void {
    this.#virtualizer.unmount();
  }

  /** Update the virtualizer options. */
  updateOptions(options: Partial<VirtualizerControllerOptions>): void {
    this.#options = { ...this.#options, ...options };

    this.#virtualizer.setOptions(this.#resolveOptions(this.#options));
  }

  #resolveOptions(options: VirtualizerControllerOptions): VirtualizerOptions {
    return {
      getScrollElement: () => null,
      ...options,
      onChange: (virtualizer, sync) => {
        this.#host.requestUpdate();
        options.onChange?.(virtualizer, sync);
      }
    };
  }
}
