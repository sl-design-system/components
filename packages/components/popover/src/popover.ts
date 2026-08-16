import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './popover.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-popover': Popover;
  }
}

let nextUniqueId = 0;

/**
 * A floating overlay that appears on top of other elements.
 *
 * The popover is positioned using CSS anchor positioning. It anchors itself to the element it is
 * linked to via the `anchor` attribute or the `anchorElement` property, or to the element that
 * invoked it. You can also anchor it entirely from CSS by setting `anchor-name` on the anchor and
 * `position-anchor` on the popover; the component leaves an existing `anchor-name` alone.
 *
 * @slot - Body content for the popover
 *
 * @csspart arrow - The arrow linking the popover to its anchor
 * @csspart container - The container for the popover
 */
export class Popover extends LitElement {
  /** @internal */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Controller for managing event listeners. */
  #eventController = new AbortController();

  /** Controller for the listeners that only run while the popover is open. */
  #openController?: AbortController;

  /**
   * When the contents of your popover is too long to be read inline this should be set to true so
   * the user can navigate to the popover content themselves. `aria-details` is always set,
   * regardless of this property. Read more about this in the [accessibility
   * documentation](https://sanomalearning.design/categories/components/popover/accessibility/).
   */
  @property({ type: Boolean, attribute: 'no-describedby' }) noDescribedby?: boolean;

  override connectedCallback(): void {
    super.connectedCallback();

    this.id ||= `sl-popover-${nextUniqueId++}`;

    if (!this.hasAttribute('popover')) {
      this.setAttribute('popover', '');
    }

    if (this.#eventController.signal.aborted) {
      this.#eventController = new AbortController();
    }

    const { signal } = this.#eventController;

    this.addEventListener('keydown', this.#onKeydown, { signal });
    this.addEventListener('toggle', this.#onToggle, { signal });
  }

  override disconnectedCallback(): void {
    this.#eventController.abort();
    this.#openController?.abort();

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    return html`
      <div part="wrapper">
        <div part="container">
          <slot></slot>
        </div>
        <div aria-hidden="true" part="arrow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xml:space="preserve"
            clip-rule="evenodd"
            viewBox="0 0 20 11">
            <path d="M0 11 20 11 10 1 0 11" paint-order="stroke" />
          </svg>
        </div>
      </div>
    `;
  }

  #onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      // Prevents the Escape key event from bubbling up, so that pressing 'Escape' inside the popover
      // does not close parent containers (such as dialogs).
      event.stopPropagation();
    }
  };

  #onToggle = (event: ToggleEvent): void => {
    const open = event.newState === 'open';

    if (open && event.source && event.source instanceof HTMLElement) {
      this.style.positionAnchor = event.source.style.anchorName ||= `--${this.id}`;
    }

    this.#openController?.abort();

    if (!open) {
      return;
    }

    this.#openController = new AbortController();

    const { signal } = this.#openController;

    // CSS decides which side the popover ends up on, so the only thing left to do in JS is read
    // that back for the arrow. The result changes when the anchor moves in or out of view, which
    // is why this is refreshed on scroll and resize rather than on every frame.
    this.#updatePlacement();
    document.addEventListener('scroll', this.#updatePlacement, {
      capture: true,
      passive: true,
      signal
    });
    window.addEventListener('resize', this.#updatePlacement, { passive: true, signal });
  };

  /**
   * Reads back where the popover ended up, so the arrow can be pointed at the anchor. There is no
   * way to observe the applied `position-try-fallbacks` directly, nor to reference an anchor from
   * inside a shadow root, so this compares the two boxes instead.
   */
  #updatePlacement = (): void => {
    // if (!this.#anchorElement || !this.matches(':popover-open')) {
    //   return;
    // }
    // const anchor = this.#anchorElement.getBoundingClientRect(),
    //   popover = this.getBoundingClientRect();
    // let placement: PopoverPlacement;
    // if (popover.bottom <= anchor.top) {
    //   placement = 'top';
    // } else if (popover.top >= anchor.bottom) {
    //   placement = 'bottom';
    // } else if (popover.right <= anchor.left) {
    //   placement = 'left';
    // } else {
    //   placement = 'right';
    // }
    // // How far along its edge the arrow has to sit to point at the middle of the anchor. The popover
    // // is not always centered on its anchor: an aligned position lines their edges up instead, and
    // // near the edge of the viewport the popover gets pushed back into view.
    // const offset =
    //   placement === 'left' || placement === 'right'
    //     ? anchor.top + anchor.height / 2 - popover.top
    //     : anchor.left + anchor.width / 2 - popover.left;
    // this.setAttribute('actual-placement', placement);
    // this.style.setProperty('--_arrow-offset', `${Math.round(offset)}px`);
  };

  // #findAnchor(): Element | undefined {
  //   if (!this.anchor) {
  //     return undefined;
  //   }

  //   const rootNode = this.getRootNode() as Document | ShadowRoot | null;

  //   return rootNode?.getElementById(this.anchor) ?? undefined;
  // }

  // /**
  //  * Points the popover at its anchor. An existing `anchor-name` is reused, whether it was set in a
  //  * stylesheet or by another popover on the same anchor. It is never cleaned up again: it is inert
  //  * on its own, and removing it would break any other popover still pointing at it.
  //  */
  // #linkAnchor(): void {
  //   const anchor = this.#anchorElement;

  //   if (!(anchor instanceof HTMLElement)) {
  //     return;
  //   }

  //   const existingName = getComputedStyle(anchor).anchorName,
  //     anchorName = existingName && existingName !== 'none' ? existingName : `--${this.id}`;

  //   anchor.style.anchorName = anchorName;
  //   this.style.positionAnchor = anchorName;
  //   this.toggleAttribute('anchored', true);

  //   // Normally when using the `popovertarget` attribute with popovers, the browser will set
  //   // `aria-details` on the anchor element itself. But since that attribute cannot be used in
  //   // combination with custom elements, we need to set it ourselves.
  //   if (!anchor.hasAttribute('aria-details')) {
  //     anchor.setAttribute('aria-details', this.id);
  //   }
  // }

  // #unlinkAnchor(): void {
  //   const anchor = this.#anchorElement;

  //   if (anchor?.getAttribute('aria-details') === this.id) {
  //     anchor.removeAttribute('aria-details');
  //   }

  //   this.#updateAnchorState(false);
  //   this.removeAttribute('anchored');
  //   this.style.positionAnchor = '';
  // }

  // /** Reflects the open state of the popover on its anchor. */
  // #updateAnchorState(expanded: boolean): void {
  //   const anchor = this.#anchorElement;

  //   if (!anchor) {
  //     return;
  //   }

  //   anchor.setAttribute('aria-expanded', expanded.toString());

  //   // TODO: Figure out whether we want to keep doing this. And if so, perhaps not just for buttons?
  //   if (anchor.tagName !== 'SL-BUTTON') {
  //     return;
  //   }

  //   if (expanded) {
  //     const hasRichContent = Array.from(this.childNodes).some(
  //       node => node.nodeType === Node.ELEMENT_NODE
  //     );

  //     anchor.setAttribute('popover-opened', '');

  //     if (!hasRichContent && !this.noDescribedby && !anchor.ariaDescribedByElements?.length) {
  //       anchor.setAttribute('aria-describedby', this.id);
  //     }
  //   } else {
  //     anchor.removeAttribute('popover-opened');

  //     // Only remove aria-describedby if we set it (so it matches our id). Otherwise we might remove
  //     // references set by other components.
  //     if (anchor.getAttribute('aria-describedby') === this.id) {
  //       anchor.removeAttribute('aria-describedby');
  //     }
  //   }
  // }
}
