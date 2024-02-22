import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { type PopoverPosition, type PositionPopoverOptions, isPopoverOpen, positionPopover } from '../popover.js';

export type AnchorControllerConfig = PositionPopoverOptions;

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
          ...this.#config,
          maxWidth: this.maxWidth,
          offset: this.offset,
          position: this.position
        });
      }
    } else if (this.#cleanup) {
      this.#cleanup();
      this.#cleanup = undefined;
    }
  };

  #onToggle = (event: Event): void => {
    const { newState, oldState } = event as ToggleEvent;

    /**
     * Workaround to make it working on clicking again (togglePopover method) on the anchor element
     * in Chrome and Safari there is the same state for new and old - open, when it's already opened
     * and we want to close it in FF on click runs toggle event twice.
     */
    if ((newState === 'closed' && isPopoverOpen(event.target as HTMLElement)) || newState === oldState) {
      event.stopPropagation();

      this.#host.hidePopover();
    }
  };

  /** The offset of the popover to its anchor. */
  offset?: number;

  /** The max width of the popover. */
  maxWidth?: number;

  /** The main position of the popover relative to the anchor. */
  position?: PopoverPosition;

  constructor(host: ReactiveControllerHost & HTMLElement, config: AnchorControllerConfig = {}) {
    this.#config = config;
    this.#host = host;
    this.#host.addController(this);

    this.offset = this.#config.offset;
    this.maxWidth = this.#config.maxWidth;
    this.position = this.#config.position;
  }

  hostConnected(): void {
    this.#host?.addEventListener('beforetoggle', this.#onBeforeToggle);
    this.#host?.addEventListener('toggle', this.#onToggle);
  }

  hostDisconnected(): void {
    this.#host?.removeEventListener('beforetoggle', this.#onBeforeToggle);
    this.#host?.removeEventListener('toggle', this.#onToggle);
  }
}
