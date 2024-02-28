import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { type PopoverPosition, type PositionPopoverOptions, isPopoverOpen, positionPopover } from '../popover.js';

export type AnchorControllerConfig = PositionPopoverOptions;

let nextUniqueId = 0;

export class AnchorController implements ReactiveController {
  #cleanup?: () => void;
  #config: AnchorControllerConfig;
  #host: ReactiveControllerHost & HTMLElement;

  #onBeforeToggle = (event: Event): void => {
    const anchorElement = this.#getAnchorElement(),
      { newState, oldState } = event as ToggleEvent;

    this.#linkAnchorWithPopover(newState === 'open');

    if (anchorElement && newState === 'open' && oldState === 'closed') {
      this.#cleanup = positionPopover(this.#host, anchorElement, {
        ...this.#config,
        maxWidth: this.maxWidth,
        offset: this.offset,
        position: this.position
      });
    } else if (this.#cleanup) {
      this.#cleanup();
      this.#cleanup = undefined;
    }
  };

  #onToggle = (event: Event): void => {
    const { newState, oldState, target } = event as ToggleEvent & { target: HTMLElement };

    /**
     * Workaround to make it working on clicking again (togglePopover method) on the anchor element
     * in Chrome and Safari there is the same state for new and old - open, when it's already opened
     * and we want to close it in FF on click runs toggle event twice.
     */
    if ((newState === 'closed' && isPopoverOpen(target)) || newState === oldState) {
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
    this.#linkAnchorWithPopover();

    this.#host?.addEventListener('beforetoggle', this.#onBeforeToggle);
    this.#host?.addEventListener('toggle', this.#onToggle);
  }

  hostDisconnected(): void {
    this.#host?.removeEventListener('toggle', this.#onToggle);
    this.#host?.removeEventListener('beforetoggle', this.#onBeforeToggle);

    this.#host.removeAttribute('aria-details');
    this.#getAnchorElement()?.removeAttribute('aria-expanded');
  }

  #getAnchorElement(): Element | null {
    let anchorElement = this.#host.anchorElement || null;

    if (!anchorElement && this.#host.hasAttribute('anchor')) {
      anchorElement = (this.#host.getRootNode() as HTMLElement)?.querySelector(`#${this.#host.getAttribute('anchor')}`);
    }

    return anchorElement;
  }

  /**
   * Normally when using the `popovertarget` attribute with popovers,
   * the browser will automatically set the `aria-details` attribute on
   * the anchor element and `aria-expanded` on the trigger. But since we
   * cannot use the `popovertarget` attribute in combination with custom
   * elements, we need to set these ourselves.
   */
  #linkAnchorWithPopover(expanded = false): void {
    const anchorElement = this.#getAnchorElement();

    if (anchorElement && !this.#host.hasAttribute('aria-details')) {
      anchorElement.id ||= `sl-anchor-${nextUniqueId++}`;

      this.#host.setAttribute('aria-details', anchorElement.id);
    }

    anchorElement?.setAttribute('aria-expanded', expanded.toString());
  }
}
