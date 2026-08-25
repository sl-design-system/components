import { isPopoverOpen, positionPopover } from '../popover.js';
let nextUniqueId = 0;
export class AnchorController {
  #cleanup;
  #config;
  #host;
  #position(anchorElement) {
    if (this.#cleanup) {
      this.#cleanup();
      this.#cleanup = void 0;
    }
    this.#cleanup = positionPopover(this.#host, anchorElement, {
      ...this.#config,
      arrowElement: this.arrowElement,
      arrowPadding: this.arrowPadding,
      maxWidth: this.maxWidth,
      offset: this.offset,
      position: this.position
    });
  }
  #onBeforeToggle = event => {
    const anchorElement = this.#getAnchorElement(),
      { newState, oldState } = event;
    this.#linkAnchorWithPopover(newState === 'open');
    if (anchorElement && newState === 'open' && oldState === 'closed') {
      this.#position(anchorElement);
    } else if (this.#cleanup) {
      this.#cleanup();
      this.#cleanup = void 0;
    }
  };
  #onKeydown(event) {
    if (event.key === 'Escape') {
      event.stopPropagation();
    }
  }
  #onToggle = event => {
    const { newState, oldState, target } = event;
    if (this.#host.tagName === 'SL-TOOLTIP') {
      return;
    }
    if ((newState === 'closed' && isPopoverOpen(target)) || newState === oldState) {
      event.stopPropagation();
      this.#host.hidePopover();
    }
  };
  constructor(host, config = {}) {
    this.#config = config;
    this.#host = host;
    this.#host.addController(this);
    this.arrowElement = this.#config.arrowElement;
    this.arrowPadding = this.#config.arrowPadding;
    this.offset = this.#config.offset;
    this.maxWidth = this.#config.maxWidth;
    this.position = this.#config.position;
  }
  hostConnected() {
    this.#linkAnchorWithPopover();
    this.#host?.addEventListener('beforetoggle', this.#onBeforeToggle);
    this.#host?.addEventListener('toggle', this.#onToggle);
    const anchor = this.#getAnchorElement();
    if (anchor instanceof HTMLElement) {
      anchor.addEventListener('keydown', this.#onKeydown);
    }
  }
  hostDisconnected() {
    this.#host?.removeEventListener('toggle', this.#onToggle);
    this.#host?.removeEventListener('beforetoggle', this.#onBeforeToggle);
    const anchor = this.#getAnchorElement();
    if (anchor instanceof HTMLElement) {
      anchor.removeEventListener('keydown', this.#onKeydown);
      anchor.removeAttribute('aria-expanded');
      anchor.removeAttribute('popover-opened');
    }
    this.#host.removeAttribute('aria-details');
  }
  updatePosition() {
    const anchorElement = this.#getAnchorElement();
    if (!anchorElement || !isPopoverOpen(this.#host)) {
      return;
    }
    this.#position(anchorElement);
  }
  #getAnchorElement() {
    let anchorElement = this.#host.anchorElement || null;
    if (!anchorElement && this.#host.hasAttribute('anchor')) {
      anchorElement = this.#host
        .getRootNode()
        ?.querySelector(`#${this.#host.getAttribute('anchor')}`);
    }
    return anchorElement;
  }
  /**
   * Normally when using the `popovertarget` attribute with popovers, the browser will automatically
   * set the `aria-details` attribute on the anchor element and `aria-expanded` on the trigger. But
   * since we cannot use the `popovertarget` attribute in combination with custom elements, we need
   * to set these ourselves.
   */
  #linkAnchorWithPopover(expanded = false) {
    const anchorElement = this.#getAnchorElement();
    this.#host.id ||= `sl-popover-${nextUniqueId++}`;
    if (this.#host.tagName === 'SL-TOOLTIP') {
      return;
    }
    if (anchorElement && !this.#host.hasAttribute('aria-details')) {
      anchorElement.id ||= `sl-anchor-${nextUniqueId++}`;
      anchorElement?.setAttribute('aria-details', this.#host.id);
    }
    anchorElement?.setAttribute('aria-expanded', expanded.toString());
    const hasRichContent =
      Array.from(this.#host.childNodes)
        .map(n => n.nodeType)
        .filter(t => t === 1).length > 0;
    if (anchorElement?.tagName === 'SL-BUTTON') {
      if (expanded) {
        anchorElement.setAttribute('popover-opened', '');
        if (
          !hasRichContent &&
          !this.#host.hasAttribute('no-describedby') &&
          !anchorElement?.ariaDescribedByElements?.length
        ) {
          anchorElement?.setAttribute('aria-describedby', this.#host.id);
        }
      } else {
        anchorElement.removeAttribute('popover-opened');
        if (anchorElement?.getAttribute('aria-describedby') === this.#host.id) {
          anchorElement?.removeAttribute('aria-describedby');
        }
      }
    }
  }
}
//# sourceMappingURL=anchor.js.map
