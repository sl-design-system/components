import { ElementInternalsMixin } from '@sl-design-system/shared/mixins/element-internals.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './popover.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-popover': Popover;
  }
}

let nextUniqueId = 0;

/** The individual names in an `anchor-name` value. */
const anchorNames = (value?: string): string[] =>
  value && value !== 'none'
    ? value
        .split(',')
        .map(name => name.trim())
        .filter(Boolean)
    : [];

/**
 * A floating overlay that appears on top of other elements.
 *
 * @element sl-popover
 *
 * @slot - Body content for the popover
 *
 * @csspart arrow - The arrow linking the popover to its anchor
 * @csspart container - The container for the slotted content
 * @csspart wrapper - The wrapper around the container and its arrow
 *
 * @cssState anchored-top - Set when the popover ended up above its anchor.
 * @cssState anchored-right - Set when the popover ended up to the right of its anchor.
 * @cssState anchored-bottom - Set when the popover ended up below its anchor.
 * @cssState anchored-left - Set when the popover ended up to the left of its anchor.
 */
export class Popover extends ElementInternalsMixin(LitElement) {
  /** @internal */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Unique to this instance; both the default id and the anchor name are built from it. */
  #uniqueId = nextUniqueId++;

  /** The element the popover is anchored to, when it is open. */
  #anchorElement?: HTMLElement;

  /**
   * The `anchor-name` this popover points at; unique to this popover. It is deliberately not
   * derived from the id, because plenty of valid ids — React's `:r0:`, for one — are not valid
   * custom identifiers.
   */
  #anchorName = `--sl-popover-anchor-${this.#uniqueId}`;

  /** Stylesheet in the light DOM that anchors the arrow to the anchor element. */
  #anchorStyle = document.createElement('style');

  /** Controller for managing event listeners. */
  #eventController = new AbortController();

  /** Controller for the listeners that only run while the popover is open. */
  #openController?: AbortController;

  /** Whether this popover set `aria-describedby` on its anchor, so only that one is removed. */
  #describedAnchor = false;

  /**
   * When the contents of your popover is too long to be read inline this should be set to true so
   * the user can navigate to the popover content themselves. An invoker command relates the two
   * with `aria-details` either way, regardless of this property. Read more about this in the
   * [accessibility
   * documentation](https://sanomalearning.design/categories/components/popover/accessibility/).
   */
  @property({ type: Boolean, attribute: 'no-describedby' }) noDescribedby?: boolean;

  /**
   * @internal The side of the anchor the popover ended up on. Exposed as an `anchored-<side>`
   * custom state, so the offset and the arrow can be styled from CSS.
   */
  placement?: string;

  override connectedCallback(): void {
    super.connectedCallback();

    this.id ||= `sl-popover-${this.#uniqueId}`;

    if (!this.hasAttribute('popover')) {
      this.setAttribute('popover', '');
    }

    /**
     * The arrow is anchored to the anchor element, but it lives in the shadow DOM, where the
     * `anchor-name` of an element in the light DOM cannot be seen. A stylesheet in the light DOM is
     * in the same tree as the anchor, so there the name does resolve. When the popover opens it is
     * filled with a rule pointing the arrow at that name:
     *
     * #sl-popover-0::part(arrow) { position-anchor: --sl-popover-anchor-0; }
     *
     * Both names are unique to this popover, so several popovers on a page do not interfere with
     * each other.
     *
     * This is a workaround until support for `position-anchor: match-parent` is added to browsers.
     */
    if (this.#anchorStyle.parentElement !== this) {
      this.append(this.#anchorStyle);
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
    this.#cleanup();

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    return html`
      <div part="wrapper">
        <div part="container">
          <slot></slot>
        </div>
        <div aria-hidden="true" part="arrow">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M0 20 20 20 10 10Z" paint-order="stroke" />
          </svg>
        </div>
      </div>
    `;
  }

  #onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      /**
       * Prevents the Escape key event from bubbling up, so that pressing 'Escape' inside the
       * popover does not close parent containers (such as dialogs).
       */
      event.stopPropagation();
    }
  };

  #onToggle = (event: ToggleEvent): void => {
    /**
     * Whatever was set up the last time the popover opened is undone first, so reopening it from a
     * different anchor cannot leave the previous one behind.
     */
    this.#cleanup();

    if (event.newState !== 'open') {
      return;
    }

    /**
     * The popover anchors itself to the element that invoked it; opened without one it stays
     * unanchored.
     */
    if (event.source instanceof HTMLElement) {
      this.#anchorElement = event.source;
      this.#linkAnchor(event.source);
    }

    this.#openController = new AbortController();

    const { signal } = this.#openController;

    /**
     * CSS decides which side the popover ends up on, so the only thing left to do in JS is read
     * that back for the arrow. The result changes when the anchor moves in or out of view, which is
     * why this is refreshed on scroll and resize rather than on every frame.
     */
    this.#updatePlacement();
    document.addEventListener('scroll', this.#updatePlacement, {
      capture: true,
      passive: true,
      signal
    });
    window.addEventListener('resize', this.#updatePlacement, { passive: true, signal });
  };

  /**
   * Points the popover, its arrow and the accessibility tree at the element that invoked it.
   * `anchor-name` is a list, so a name that is already there — from a stylesheet, or from another
   * popover on the same anchor — is kept and this popover's name is appended to it.
   */
  #linkAnchor(anchor: HTMLElement): void {
    const names = anchorNames(getComputedStyle(anchor).anchorName);

    anchor.style.anchorName = [...names, this.#anchorName].join(', ');
    this.style.positionAnchor = this.#anchorName;
    this.#anchorStyle.textContent = `#${CSS.escape(this.id)}::part(arrow) { position-anchor: ${this.#anchorName}; }`;

    /**
     * Content that is more than a bit of text is not read out as a description; the user navigates
     * to the popover to read it instead. The stylesheet that anchors the arrow does not count.
     */
    const isPlainText = !Array.from(this.childNodes).some(
      node => node.nodeType === Node.ELEMENT_NODE && node !== this.#anchorStyle
    );

    /**
     * `aria-details` is not set here: an invoker command gives the button that implicitly. Whether
     * the description was set is remembered, because an element that forwards ARIA into its shadow
     * DOM — `sl-button` does — moves the attribute off the anchor, so it cannot be read back.
     */
    this.#describedAnchor =
      isPlainText &&
      !this.noDescribedby &&
      !anchor.hasAttribute('aria-describedby') &&
      !anchor.ariaDescribedByElements?.length;

    if (this.#describedAnchor) {
      anchor.setAttribute('aria-describedby', this.id);
    }
  }

  #cleanup(): void {
    this.#openController?.abort();
    this.#openController = undefined;

    if (this.#anchorElement) {
      /**
       * Take this popover's name back off its anchor, or reopening it from an earlier element would
       * leave it anchored to the previous one. `anchor-name` is a list that may also hold a name
       * from a stylesheet or from another popover, so the inline declaration is dropped first and
       * only the names that do not come back from CSS are written inline again.
       */
      if (this.#anchorElement.style.anchorName.includes(this.#anchorName)) {
        const names = anchorNames(this.#anchorElement.style.anchorName).filter(
          name => name !== this.#anchorName
        );

        this.#anchorElement.style.removeProperty('anchor-name');

        const stylesheet = anchorNames(getComputedStyle(this.#anchorElement).anchorName),
          inline = names.filter(name => !stylesheet.includes(name));

        if (inline.length) {
          this.#anchorElement.style.anchorName = inline.join(', ');
        }
      }

      if (this.#describedAnchor) {
        this.#anchorElement.removeAttribute('aria-describedby');
      }
    }

    // Only what this popover set is removed; a `position-anchor` the author wrote inline stays.
    if (this.style.positionAnchor === this.#anchorName) {
      this.style.removeProperty('position-anchor');
    }

    this.#anchorElement = undefined;
    this.#describedAnchor = false;

    this.#setPlacement(undefined);
  }

  #updatePlacement = (): void => {
    if (!this.#anchorElement || !this.matches(':popover-open')) {
      return;
    }

    /**
     * Reflecting the placement changes the margin on the side facing the anchor, which near a
     * viewport edge can be enough for the browser to pick a different fallback. So the side is
     * measured, applied, and measured once more to confirm it stuck.
     */
    for (let i = 0; i < 2; i++) {
      const anchor = this.#anchorElement.getBoundingClientRect(),
        popover = this.getBoundingClientRect();

      /**
       * The distance between the two boxes on each side, negative when they overlap. When there is
       * not enough room the popover is pushed onto its anchor, so it cannot be assumed to clear it
       * completely; the side it is the furthest onto wins instead. On a tie the order below
       * decides, which keeps the default side for a popover that covers its anchor entirely.
       */
      const distances: Record<string, number> = {
        bottom: popover.top - anchor.bottom,
        top: anchor.top - popover.bottom,
        left: anchor.left - popover.right,
        right: popover.left - anchor.right
      };

      const placement = Object.keys(distances).reduce((furthest, side) =>
        distances[side] > distances[furthest] ? side : furthest
      );

      if (placement === this.placement) {
        break;
      }

      this.#setPlacement(placement);
    }
  };

  /** Records the placement and reflects it as the only `anchored-<side>` custom state. */
  #setPlacement(placement?: string): void {
    if (this.placement === placement) {
      return;
    }

    this.placement = placement;

    for (const side of ['top', 'right', 'bottom', 'left']) {
      this.elementInternals.states.delete(`anchored-${side}`);
    }

    if (placement) {
      this.elementInternals.states.add(`anchored-${placement}`);
    }
  }
}
