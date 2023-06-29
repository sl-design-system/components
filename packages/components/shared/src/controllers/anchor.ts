import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { type PopoverPosition, positionPopover } from '../popover.js';

export interface AnchorControllerConfig {
  arrow?: string | Element;
  position?: PopoverPosition;
}

export class AnchorController implements ReactiveController {
  #config: AnchorControllerConfig;
  #host: ReactiveControllerHost & HTMLElement;

  #onBeforeToggle = (): void => {
    const anchorElement =
      this.#host?.anchorElement ??
      (this.#host?.getRootNode() as HTMLElement)?.querySelector(`#${this.#host?.getAttribute('anchor') ?? ''}`);

    if (anchorElement) {
      positionPopover(this.#host, anchorElement, {
        positions: [{ position: this.position ?? this.#config.position ?? 'top' }]
      });
    }
  };

  position?: PopoverPosition;

  constructor(host: ReactiveControllerHost & HTMLElement, config: AnchorControllerConfig = {}) {
    this.#config = config;
    this.#host = host;
    this.#host.addController(this);
  }

  hostConnected(): void {
    this.#host?.addEventListener('beforetoggle', this.#onBeforeToggle);
  }

  hostDisconnected(): void {
    this.#host?.removeEventListener('beforetoggle', this.#onBeforeToggle);
  }
}
