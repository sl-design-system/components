import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { type PopoverPosition, positionPopover } from '../popover.js';

export interface AnchorControllerConfig {
  arrow?: string | HTMLElement;
  position?: PopoverPosition;
  maxWidth?: number;
}

/**
 * @attr popover-opened -  Can be used for styling anchor element, when popover is opened and the anchor is not a sl-button.
 * For sl-button active state styling is used by default.
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

    if ((event as ToggleEvent).newState === 'open' && (event as ToggleEvent).oldState === 'closed') {
      if (anchorElement) {
        this.#cleanup = positionPopover(host, anchorElement, {
          arrow: this.#config?.arrow,
          position: this.position ?? this.#config.position ?? 'top',
          maxWidth: this.maxWidth ?? this.#config.maxWidth
        });

        if (host.matches('sl-popover')) {
          /** popover-opened can be used for styling anchor element, when popover is opened and the anchor is not a sl-button  */
          (anchorElement as HTMLElement)?.setAttribute('popover-opened', '');
          anchorElement.setAttribute('aria-expanded', 'true');
        }
      }
    } else if (this.#cleanup) {
      this.#cleanup();
      this.#cleanup = undefined;
      if (host.matches('sl-popover')) {
        (anchorElement as HTMLElement)?.removeAttribute('popover-opened');
        anchorElement?.setAttribute('aria-expanded', 'false');
      }
    }
  };

  #onToggle = (event: Event): void => {
    /** workaround to make it working on clicking again (togglePopover method) on the anchor element
     * in Chrome and Safari there is the same state for new and old - open, when it's already opened and we want to close it
     * in FF on click runs toggle event twice */
    if (
      ((event as ToggleEvent).newState === 'closed' && (event.target as HTMLElement).matches(':popover-open')) ||
      (event as ToggleEvent).newState === (event as ToggleEvent).oldState
    ) {
      event.stopPropagation();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (event.target as HTMLElement)?.hidePopover();
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
    const host = this.#host as HTMLElement;

    let anchorElement = host.anchorElement;
    if (!anchorElement && host.hasAttribute('anchor')) {
      anchorElement =
        (host.getRootNode() as HTMLElement)?.querySelector(`#${host.getAttribute('anchor') ?? ''}`) || undefined;
    }

    if (host.matches('sl-popover')) {
      anchorElement?.setAttribute('aria-expanded', 'false');
      anchorElement?.setAttribute('aria-controls', host.id);
    }

    this.#host?.addEventListener('beforetoggle', this.#onBeforeToggle);
    this.#host?.addEventListener('toggle', this.#onToggle);
  }

  hostDisconnected(): void {
    this.#host?.removeEventListener('beforetoggle', this.#onBeforeToggle);
    this.#host?.removeEventListener('toggle', this.#onToggle);
  }
}
