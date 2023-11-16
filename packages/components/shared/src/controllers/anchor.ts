import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { type PopoverPosition, positionPopover } from '../popover.js';

export interface AnchorControllerConfig {
  arrow?: string | HTMLElement;
  position?: PopoverPosition;
  maxWidth?: number;
}

/**
 * @attr popover-opened -  Can be used for styling anchor element, when popover is opened and the anchor is not a sl-button.
 * For sl-button active state styling is used.
 */

export class AnchorController implements ReactiveController {
  #cleanup?: () => void;
  #config: AnchorControllerConfig;
  #host: ReactiveControllerHost & HTMLElement;

  #onBeforeToggle = (event: Event): void => {
    const host = this.#host as HTMLElement;
    let anchorElement = host.anchorElement;
    if (!anchorElement && host.hasAttribute('anchor')) {
      anchorElement =
        (host.getRootNode() as HTMLElement)?.querySelector(`#${host.getAttribute('anchor') ?? ''}`) || undefined;
    }
    if ((event as ToggleEvent).newState === 'open') {
      // const host = this.#host as HTMLElement;

      // let anchorElement = host.anchorElement;
      // if (!anchorElement && host.hasAttribute('anchor')) {
      //   anchorElement =
      //     (host.getRootNode() as HTMLElement)?.querySelector(`#${host.getAttribute('anchor') ?? ''}`) || undefined;
      // }

      console.log('anchor and host', anchorElement, host, host.matches('sl-popover'));

      // (anchorElement as HTMLElement)?.toggleAttribute('popover-open');

      if (anchorElement) {
        this.#cleanup = positionPopover(host, anchorElement, {
          arrow: this.#config?.arrow,
          position: this.position ?? this.#config.position ?? 'top',
          maxWidth: this.maxWidth ?? this.#config.maxWidth
        });
        // host.getAttribute('sl-popover')
        if (host.matches('sl-popover')) {
          /** popover-opened can be used for styling anchor element, when popover is opened and the anchor is not a sl-button  */
          (anchorElement as HTMLElement)?.setAttribute('popover-opened', '');
        }
      }
    } else if (this.#cleanup) {
      this.#cleanup();
      this.#cleanup = undefined;
      if (host.matches('sl-popover')) {
        (anchorElement as HTMLElement)?.removeAttribute('popover-opened');
      }
    }
  };

  position?: PopoverPosition;

  maxWidth?: number;

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
