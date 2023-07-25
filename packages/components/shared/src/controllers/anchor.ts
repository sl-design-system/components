import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { type PopoverPosition, positionPopover } from '../popover.js';

export interface AnchorControllerConfig {
  arrow?: string | HTMLElement;
  position?: PopoverPosition;
}

export class AnchorController implements ReactiveController {
  #cleanup?: () => void;
  #config: AnchorControllerConfig;
  #host: ReactiveControllerHost & HTMLElement;

  #onBeforeToggle = (event: Event): void => {
    if ((event as ToggleEvent).newState === 'open') {
      const host = this.#host as HTMLElement;

      let anchorElement = host.anchorElement;
      if (!anchorElement && host.hasAttribute('anchor')) {
        anchorElement =
          (host.getRootNode() as HTMLElement)?.querySelector(`#${host.getAttribute('anchor') ?? ''}`) || undefined;
      }

      if (anchorElement) {
        this.#cleanup = positionPopover(host, anchorElement, {
          arrow: this.#config?.arrow,
          position: this.position ?? this.#config.position ?? 'top'
        });
      }
    } else if (this.#cleanup) {
      this.#cleanup();
      this.#cleanup = undefined;
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
