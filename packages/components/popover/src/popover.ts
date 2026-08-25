import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './popover.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-popover': Popover;
  }
}

let nextUniqueId = 0;

const PLACEMENTS = ['top', 'right', 'bottom', 'left'] as const;

export type PopoverPlacement = (typeof PLACEMENTS)[number];

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
 * The popover is positioned using CSS anchor positioning. It anchors itself to the element that
 * invoked it, either through the [Invoker Commands
 * API](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API) or through the
 * `source` passed to `showPopover()` or `togglePopover()`. You can also anchor it entirely from CSS
 * by setting `anchor-name` on the anchor and `position-anchor` on the popover; the component leaves
 * an existing `anchor-name` alone.
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

  /** Unique to this instance; both the default id and the anchor name are derived from it. */
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
  #anchorStyle?: HTMLStyleElement;

  /** The attributes this popover set on its anchor, so only those are removed again. */
  #ariaAttributes: string[] = [];

  /** The names copied onto the anchor from its computed `anchor-name`. */
  #copiedAnchorNames: string[] = [];

  /** Controller for managing event listeners. */
  #eventController = new AbortController();

  /** Element internals, for the custom state that reflects the placement. */
  #internals = this.attachInternals();

  /** The anchor this popover wrote its own `anchor-name` onto. */
  #linkedAnchor?: HTMLElement;

  /** Controller for the listeners that only run while the popover is open. */
  #openController?: AbortController;

  /** The inline `anchor-name` of the anchor before this popover added its own name. */
  #previousAnchorName?: string;

  /** The inline `position-anchor` of the popover before it pointed itself at its anchor. */
  #previousPositionAnchor?: string;

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

    this.id ||= `sl-popover-${this.#uniqueId}`;

    if (!this.hasAttribute('popover')) {
      this.setAttribute('popover', '');
    }

    // The arrow is anchored to the anchor element, but it lives in the shadow DOM, where the
    // `anchor-name` of an element in the light DOM cannot be seen. A stylesheet in the light DOM is
    // in the same tree as the anchor, so there the name does resolve. The rule is filled in when
    // the popover opens and only ever targets this popover, so several popovers on a page do not
    // interfere with each other.
    // This is a workaround until support for `position-anchor: match-parent` is added to browsers.
    this.#anchorStyle ??= document.createElement('style');
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
      // The popover anchors itself to the element that invoked it.
      this.#anchorElement = event.source;
      this.#linkAnchor(event.source);
      this.#linkArrow(this.#anchorName);
      this.#linkAria(event.source);
    } else {
      // Without an invoker the anchor can still have been set up from CSS. The name the popover
      // points at resolves in the light DOM, so the arrow can use it as it is; the element behind
      // it is looked up as well, because the placement is measured against its box.
      const name = getComputedStyle(this).positionAnchor as string | undefined;

      if (name?.startsWith('--')) {
        this.#anchorElement = this.#findAnchor(name);
        this.#linkArrow(name);
      }
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
   * Looks up the element an `anchor-name` resolves to. Anchor names are not exposed to JavaScript,
   * so every element in the same tree is checked and the last match in tree order wins, which is
   * how the browser resolves a duplicate name. This only runs when the popover is opened without an
   * invoker and the anchor was set up from CSS.
   */
  #findAnchor(name: string): HTMLElement | undefined {
    const root = this.getRootNode() as Document | ShadowRoot;

    let anchor: HTMLElement | undefined;

    for (const element of root.querySelectorAll<HTMLElement>('*')) {
      if (element !== this && anchorNames(getComputedStyle(element).anchorName).includes(name)) {
        anchor = element;
      }
    }

    return anchor;
  }

  /**
   * Points the popover at its anchor. `anchor-name` takes a comma separated list, so a name set
   * from a stylesheet or by another popover on the same anchor is kept, and this popover adds its
   * own name to it rather than replacing what is there.
   */
  #linkAnchor(anchor: HTMLElement): void {
    const names = anchorNames(getComputedStyle(anchor).anchorName);

    // Recorded even when the name is somehow already there, so it can always be taken off again.
    this.#linkedAnchor = anchor;

    if (!names.includes(this.#anchorName)) {
      // What was set inline is put back when the popover closes, so a name that came from a
      // stylesheet is not left behind inline, where a later class or theme change could no longer
      // update it.
      this.#copiedAnchorNames = names;
      this.#previousAnchorName = anchor.style.anchorName;

      anchor.style.anchorName = [...names, this.#anchorName].join(', ');
    }

    this.#previousPositionAnchor = this.style.positionAnchor;
    this.style.positionAnchor = this.#anchorName;
  }

  /** Points the arrow in the shadow root at the same anchor as the popover itself. */
  #linkArrow(name: string): void {
    if (this.#anchorStyle) {
      this.#anchorStyle.textContent = `#${CSS.escape(this.id)}::part(arrow) { position-anchor: ${name}; }`;
    }
  }

  /**
   * Relates the invoker to the popover, the way the browser does for a native popover invoker.
   * Attributes the author set themselves are left alone, and only the ones set here are removed
   * again when the popover closes.
   */
  #linkAria(anchor: HTMLElement): void {
    if (!anchor.hasAttribute('aria-details')) {
      anchor.setAttribute('aria-details', this.id);
      this.#ariaAttributes.push('aria-details');
    }

    // Content that is more than a bit of text is not read out as a description; the user navigates
    // to the popover to read it instead. The stylesheet that anchors the arrow does not count.
    const hasRichContent = Array.from(this.childNodes).some(
      node => node.nodeType === Node.ELEMENT_NODE && node !== this.#anchorStyle
    );

    if (
      !this.noDescribedby &&
      !hasRichContent &&
      !anchor.hasAttribute('aria-describedby') &&
      !anchor.ariaDescribedByElements?.length
    ) {
      anchor.setAttribute('aria-describedby', this.id);
      this.#ariaAttributes.push('aria-describedby');
    }
  }

  /**
   * Takes this popover's name back off its anchor, keeping any other name it has. Without this the
   * name would stay behind on every element the popover was ever opened from, and since the browser
   * resolves a duplicate `anchor-name` to the last one in tree order, reopening the popover from an
   * earlier element would leave it anchored to the previous one.
   */
  #unlinkAnchor(): void {
    if (!this.#linkedAnchor) {
      return;
    }

    const names = anchorNames(this.#linkedAnchor.style.anchorName).filter(
      name => name !== this.#anchorName
    );

    // Only when nothing but the names copied from the computed style is left can the inline
    // declaration go back the way it was; another popover may have added its own name in the
    // meantime, and that one has to stay.
    const isUntouched =
      names.length === this.#copiedAnchorNames.length &&
      names.every(name => this.#copiedAnchorNames.includes(name));

    const value = isUntouched ? this.#previousAnchorName : names.join(', ');

    if (value) {
      this.#linkedAnchor.style.anchorName = value;
    } else {
      this.#linkedAnchor.style.removeProperty('anchor-name');
    }
  }

  /** Removes the ARIA attributes this popover set on its anchor. */
  #unlinkAria(): void {
    for (const attribute of this.#ariaAttributes) {
      this.#anchorElement?.removeAttribute(attribute);
    }

    this.#ariaAttributes = [];
  }

  #cleanup(): void {
    this.#openController?.abort();
    this.#openController = undefined;

    this.#unlinkAria();
    this.#unlinkAnchor();

    this.#anchorElement = undefined;
    this.#copiedAnchorNames = [];
    this.#linkedAnchor = undefined;
    this.#previousAnchorName = undefined;

    if (this.#anchorStyle) {
      this.#anchorStyle.textContent = '';
    }

    // Only what this popover set is undone; a `position-anchor` the author wrote inline stays.
    if (this.#previousPositionAnchor !== undefined) {
      if (this.#previousPositionAnchor) {
        this.style.positionAnchor = this.#previousPositionAnchor;
      } else {
        this.style.removeProperty('position-anchor');
      }

      this.#previousPositionAnchor = undefined;
    }

    this.#setPlacement(undefined);
  }

  #updatePlacement = (): void => {
    if (!this.#anchorElement || !this.matches(':popover-open')) {
      return;
    }

    // Reflecting the placement changes the margin on the side facing the anchor, which near a
    // viewport edge can be enough for the browser to pick a different fallback. Measuring again
    // until the side stops changing keeps `placement`, the custom state and the arrow describing
    // the side the popover actually ended up on.
    for (let i = 0; i < 3; i++) {
      const placement = this.#measurePlacement(this.#anchorElement);

      if (placement === this.placement) {
        break;
      }

      this.#setPlacement(placement);
    }
  };

  /** Reads back which side of the anchor the browser put the popover on. */
  #measurePlacement(anchorElement: HTMLElement): PopoverPlacement {
    const anchor = anchorElement.getBoundingClientRect(),
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

    return (Object.keys(distances) as Array<keyof typeof distances>).reduce((furthest, side) =>
      distances[side] > distances[furthest] ? side : furthest
    );
  }

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
