import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './popover.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-popover': Popover;
  }
}

let nextUniqueId = 0;

const PLACEMENTS = ['top', 'right', 'bottom', 'left'] as const;

export type PopoverPlacement = (typeof PLACEMENTS)[number];

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
 * @csspart container - The container for the slotted content
 * @csspart wrapper - The wrapper around the container and its arrow
 */
export class Popover extends LitElement {
  /** @internal */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The element the popover is anchored to, when it was opened by one. */
  #anchorElement?: HTMLElement;

  /** The `anchor-name` this popover points at; unique to this popover. */
  #anchorName = '';

  /** Stylesheet in the light DOM that anchors the arrow to the anchor element. */
  #anchorStyle?: HTMLStyleElement;

  /** Controller for managing event listeners. */
  #eventController = new AbortController();

  /** Element internals, for the custom state that reflects the placement. */
  #internals = this.attachInternals();

  /** Controller for the listeners that only run while the popover is open. */
  #openController?: AbortController;

  /**
   * When the contents of your popover is too long to be read inline this should be set to true so
   * the user can navigate to the popover content themselves. `aria-details` is always set,
   * regardless of this property. Read more about this in the [accessibility
   * documentation](https://sanomalearning.design/categories/components/popover/accessibility/).
   */
  @property({ type: Boolean, attribute: 'no-describedby' }) noDescribedby?: boolean;

  /**
   * @internal The side of the anchor the popover ended up on. Exposed as an `anchored-<side>`
   * custom state, so the offset and the arrow can be styled from CSS.
   */
  placement?: PopoverPlacement;

  override connectedCallback(): void {
    super.connectedCallback();

    this.id ||= `sl-popover-${nextUniqueId++}`;
    this.#anchorName = `--popover-anchor-${this.id}`;

    if (!this.hasAttribute('popover')) {
      this.setAttribute('popover', '');
    }

    // The arrow is anchored to the anchor element, but it lives in the shadow DOM, where the
    // `anchor-name` of an element in the light DOM cannot be seen. A stylesheet in the light DOM is
    // in the same tree as the anchor, so there the name does resolve. The rule only ever targets
    // this popover, so several popovers on a page do not interfere with each other.
    // This is a workaround until support for `position-anchor: match-parent` is added to browsers.
    this.#anchorStyle ??= document.createElement('style');
    this.#anchorStyle.textContent = `#${CSS.escape(this.id)}::part(arrow) { position-anchor: ${this.#anchorName}; }`;
    this.append(this.#anchorStyle);

    if (this.#eventController.signal.aborted) {
      this.#eventController = new AbortController();
    }

    const { signal } = this.#eventController;

    this.addEventListener('keydown', this.#onKeydown, { signal });
    this.addEventListener('toggle', this.#onToggle, { signal });
  }

  override disconnectedCallback(): void {
    this.#eventController.abort();
    this.#anchorStyle?.remove();
    this.#cleanup();

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    return html`
      <div part="wrapper">
        <div part="container">
          <slot></slot>
        </div>
        <div aria-hidden="true" part="arrow-wrapper">
          <div part="arrow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M0 20 20 20 10 10Z" paint-order="stroke" />
            </svg>
          </div>
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
    // Whatever was set up the last time the popover opened is undone first, so reopening it from a
    // different anchor cannot leave the previous one behind.
    this.#cleanup();

    if (event.newState !== 'open') {
      return;
    }

    if (event.source instanceof HTMLElement) {
      this.#anchorElement = event.source;
      this.#linkAnchor(event.source);
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
   * Points the popover at its anchor. `anchor-name` takes a comma separated list, so a name set
   * from a stylesheet or by another popover on the same anchor is kept, and this popover adds its
   * own name to it rather than replacing what is there.
   */
  #linkAnchor(anchor: HTMLElement): void {
    const computed = getComputedStyle(anchor).anchorName,
      names = computed && computed !== 'none' ? computed.split(',').map(name => name.trim()) : [];

    if (!names.includes(this.#anchorName)) {
      anchor.style.anchorName = [...names, this.#anchorName].join(', ');
    }

    this.style.positionAnchor = this.#anchorName;
  }

  #cleanup(): void {
    this.#openController?.abort();
    this.#openController = undefined;
    this.#anchorElement = undefined;

    this.#setPlacement(undefined);
    this.style.removeProperty('position-anchor');
  }

  #updatePlacement = (): void => {
    if (!this.#anchorElement || !this.matches(':popover-open')) {
      return;
    }

    const anchor = this.#anchorElement.getBoundingClientRect(),
      popover = this.getBoundingClientRect();

    // The distance between the two boxes on each side, negative when they overlap. When there is
    // not enough room the popover is pushed onto its anchor, so it cannot be assumed to clear it
    // completely; the side it is the furthest onto wins instead. On a tie the order below decides,
    // which keeps the default side for a popover that covers its anchor entirely.
    const distances = {
      bottom: popover.top - anchor.bottom,
      top: anchor.top - popover.bottom,
      left: anchor.left - popover.right,
      right: popover.left - anchor.right
    };

    this.#setPlacement(
      (Object.keys(distances) as Array<keyof typeof distances>).reduce((furthest, side) =>
        distances[side] > distances[furthest] ? side : furthest
      )
    );
  };

  /** Records the placement and reflects it as the only `anchored-<side>` custom state. */
  #setPlacement(placement?: PopoverPlacement): void {
    if (this.placement === placement) {
      return;
    }

    this.placement = placement;

    for (const side of PLACEMENTS) {
      this.#internals.states.delete(`anchored-${side}`);
    }

    if (placement) {
      this.#internals.states.add(`anchored-${placement}`);
    }
  }
}
