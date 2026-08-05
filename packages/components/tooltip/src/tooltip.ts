import { CSSResultGroup, LitElement, PropertyValues, TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './tooltip.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-tooltip': Tooltip;
  }
}

let nextUniqueId = 0;

/**
 * A tooltip component that can be used to display additional information about an element when the
 * user hovers over it, focuses it, or clicks it. The tooltip is positioned relative to an anchor
 * element, which can be specified using the `for` attribute. That attribute accepts multiple ids,
 * separated by spaces, so a single tooltip can serve several elements.
 *
 * The tooltip will automatically determine the appropriate ARIA relation to use based on the `type`
 * property. By default, it will use `ariaLabelledByElements`, but if `type` is set to
 * `description`, it will use `ariaDescribedByElements` instead.
 *
 * @element sl-tooltip
 *
 * @slot - The content of the tooltip.
 *
 * @csspart hover-bridge - An invisible element used to extend the hover area of the tooltip.
 */
export class Tooltip extends LitElement {
  /**
   * The delay in milliseconds before showing the tooltip when the mouse hovers over the anchor
   * element.
   */
  static hoverShowDelay: number = 150;

  /** The delay in milliseconds before hiding the tooltip when the mouse leaves the anchor element. */
  static hoverHideDelay: number = 0;

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Controller for managing event listeners. */
  #eventController = new AbortController();

  /** Timeout ID for the hover delay. */
  #hoverTimeout?: ReturnType<typeof setTimeout>;

  /** @internal All elements this tooltip belongs to. */
  @state() anchors: HTMLElement[] = [];

  /**
   * @internal The anchor the tooltip is currently positioned against. When `for` references
   *   multiple elements, this is the one that last triggered the tooltip.
   */
  @state() anchor?: HTMLElement | null;

  /**
   * Stops the tooltip from being displayed.
   *
   * @default false
   */
  @property({ type: Boolean }) disabled?: boolean;

  /**
   * The id of the element this tooltip is for. Multiple ids can be passed by separating them with a
   * space; the tooltip then belongs to each of those elements.
   */
  @property() for?: string;

  /**
   * Setting this will cause the tooltip to show/hide, regardless of trigger. Do not use this
   * property to check if the tooltip is showing, use `matches(':popover-open')` instead.
   *
   * @default false
   */
  @property({ type: Boolean }) open?: boolean;

  /**
   * Controls how the tooltip is activated. Possible options include `click`, `hover`, `focus`, and
   * `manual`. Multiple options can be passed by separating them with a space. When manual is used,
   * the tooltip must be activated programmatically.
   *
   * @default 'focus hover'
   */
  @property() trigger = 'focus hover';

  /**
   * The type of tooltip. Used to determine the ARIA relation that should be used.
   *
   * @default 'label'
   */
  @property() type?: 'description' | 'label';

  override connectedCallback() {
    super.connectedCallback();

    this.setAttribute('aria-hidden', 'true');
    this.setAttribute('popover', 'manual');
    this.setAttribute('role', 'tooltip');

    if (!this.id) {
      this.id = `sl-tooltip-${nextUniqueId++}`;
    }

    if (this.#eventController.signal.aborted) {
      this.#eventController = new AbortController();
    }

    const { signal } = this.#eventController;

    this.addEventListener('beforetoggle', this.#onBeforeToggle, { signal });
    this.addEventListener('click', this.#onTooltipClick, { signal });
    this.addEventListener('mouseout', this.#onMouseOut, { signal });
    this.addEventListener('toggle', this.#onToggle, { signal });

    // Re-establish the anchor relationship if the tooltip is moved to a different root
    if (this.anchors.length && this.for) {
      this.anchors = []; // triggers #updateAnchors()
    } else if (this.for) {
      this.#updateAnchors();
    }
  }

  override disconnectedCallback() {
    clearTimeout(this.#hoverTimeout);

    this.#eventController.abort();

    // Remove the event handler in case the tooltip is still open when disconnected
    document.removeEventListener('keydown', this.#onKeydown, { capture: true });

    this.anchors.forEach(anchor => this.#removeAriaRelation(anchor, this.type));

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('anchors') || changes.has('for')) {
      this.#updateAnchors();
    }

    if (changes.has('open')) {
      if (this.open) {
        this.showPopover();
      } else {
        this.hidePopover();
      }
    }

    // Skip this on the first update: `#updateAnchors()` above has already added the relation using
    // the current type, so there is no relation for the previous type to clean up. Checking the
    // previous type is not an alternative, since `undefined` is a valid one; it means `label`, and
    // going from an untyped tooltip to `description` does need the labelling relation cleaned up.
    if (changes.has('type') && this.hasUpdated) {
      this.anchors.forEach(anchor => {
        this.#removeAriaRelation(anchor, changes.get('type'));
        if (!this.disabled) {
          this.#addAriaRelation(anchor, this.type);
        }
      });
    }

    if (changes.has('disabled')) {
      if (this.disabled) {
        this.hidePopover();
      }

      this.anchors.forEach(anchor => {
        if (this.disabled) {
          this.#removeAriaRelation(anchor, this.type);
        } else {
          this.#addAriaRelation(anchor, this.type);
        }
      });
    }
  }

  override render(): TemplateResult {
    return html`
      <slot></slot>
      <div part="hover-bridge"></div>
    `;
  }

  #onBeforeToggle = (event: ToggleEvent): void => {
    if (event.newState === 'open') {
      if (this.disabled) {
        event.preventDefault();
        return;
      }

      document.addEventListener('keydown', this.#onKeydown, { capture: true });
    } else {
      document.removeEventListener('keydown', this.#onKeydown, { capture: true });
    }
  };

  #onBlur = (): void => {
    if (this.#hasTrigger('focus')) {
      this.hidePopover();
    }
  };

  #onClick = (event: Event): void => {
    if (this.#hasTrigger('click')) {
      if (this.matches(':popover-open') && event.currentTarget === this.anchor) {
        this.hidePopover();
      } else {
        this.#setActiveAnchor(event.currentTarget as HTMLElement);
        this.showPopover();
      }
    } else {
      this.hidePopover();
    }
  };

  #onFocus = (event: FocusEvent & { currentTarget: HTMLElement }): void => {
    if (this.#hasTrigger('focus')) {
      this.#setActiveAnchor(event.currentTarget);

      // Only show the tooltip if the focus event was triggered by keyboard navigation.
      // This prevents the tooltip from showing when the element is focused
      // programmatically, such as when closing a dialog.
      if (event.currentTarget.matches(':focus-visible')) {
        this.showPopover();
      }
    }
  };

  #onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();

      this.hidePopover();
    }
  };

  #onMouseOver = (event: MouseEvent): void => {
    if (this.#hasTrigger('hover')) {
      clearTimeout(this.#hoverTimeout);

      const anchor = event.currentTarget as HTMLElement;

      this.#hoverTimeout = setTimeout(() => {
        this.#setActiveAnchor(anchor);
        this.showPopover();
      }, Tooltip.hoverShowDelay);
    }
  };

  #onMouseOut = (event: MouseEvent): void => {
    if (this.#hasTrigger('hover')) {
      // Don't hide the popover if the pointer moved to one of the anchors or the popover itself
      // (including the hover bridge). Uses relatedTarget instead of :hover, since :hover
      // reflects the real pointer position, which is unreliable with synthetic events.
      const relatedTarget = event.relatedTarget as Node | null;
      if (
        relatedTarget &&
        (this.contains(relatedTarget) ||
          this.anchors.some(anchor => anchor.contains(relatedTarget)))
      ) {
        return;
      }

      clearTimeout(this.#hoverTimeout);

      this.#hoverTimeout = setTimeout(() => {
        this.hidePopover();
      }, Tooltip.hoverHideDelay);
    }
  };

  #onToggle = (event: ToggleEvent): void => {
    if (event.newState === 'open' && this.anchor) {
      this.#positionHoverBridge(this.anchor);
    }
  };

  #onTooltipClick = (event: Event): void => {
    // Tooltips are often rendered in the shadow root of the component they belong to, as a sibling
    // of the anchor. A click on the tooltip would then be retargeted to the host, making it
    // indistinguishable from a click on the component itself; that would trigger the menu of an
    // sl-menu-button, for example. The tooltip is not interactive, so swallow the click.
    event.stopPropagation();
  };

  #hasTrigger(trigger: string): boolean {
    return this.trigger.split(' ').includes(trigger);
  }

  #getAriaPropertyFromType(
    type?: 'description' | 'label'
  ): 'ariaDescribedByElements' | 'ariaLabelledByElements' {
    return type === 'description' ? 'ariaDescribedByElements' : 'ariaLabelledByElements';
  }

  #addAriaRelation(element: Element, type?: 'description' | 'label'): void {
    const ariaProperty = this.#getAriaPropertyFromType(type);

    const refs = element[ariaProperty] ?? [];
    if (!refs.includes(this)) {
      element[ariaProperty] = [...refs, this];
    }
  }

  #removeAriaRelation(element: Element, type?: 'description' | 'label'): void {
    const ariaProperty = this.#getAriaPropertyFromType(type);

    const refs = element[ariaProperty] ?? [];
    if (!refs.includes(this)) {
      // Nothing of ours to remove. Bail out instead of assigning, because assigning an (empty)
      // array reflects an empty attribute on the element, wiping out any `aria-labelledby` or
      // `aria-describedby` the element manages itself.
      return;
    }

    element[ariaProperty] = refs.filter((ref: Element) => ref !== this);
  }

  #positionHoverBridge(anchor: Element): void {
    const bridge = this.renderRoot.querySelector<HTMLElement>('[part="hover-bridge"]');
    if (!bridge) {
      return;
    }

    const a = anchor.getBoundingClientRect(),
      t = this.getBoundingClientRect();

    // Determine on which side of the anchor the tooltip ended up (after CSS anchor positioning
    // and any position-try fallbacks). We then build a trapezoid whose parallel edges align with
    // the touching edges of the anchor and the tooltip, so the user can move the pointer between
    // the two without crossing an unhovered area.
    let left: number, top: number, width: number, height: number, polygon: string;

    if (t.bottom <= a.top) {
      // Tooltip above anchor
      left = Math.min(a.left, t.left);
      top = t.bottom;
      width = Math.max(a.right, t.right) - left;
      height = Math.max(0, a.top - t.bottom);
      polygon =
        `polygon(${t.left - left}px 0, ${t.right - left}px 0, ` +
        `${a.right - left}px ${height}px, ${a.left - left}px ${height}px)`;
    } else if (t.top >= a.bottom) {
      // Tooltip below anchor
      left = Math.min(a.left, t.left);
      top = a.bottom;
      width = Math.max(a.right, t.right) - left;
      height = Math.max(0, t.top - a.bottom);
      polygon =
        `polygon(${a.left - left}px 0, ${a.right - left}px 0, ` +
        `${t.right - left}px ${height}px, ${t.left - left}px ${height}px)`;
    } else if (t.right <= a.left) {
      // Tooltip left of anchor
      left = t.right;
      top = Math.min(a.top, t.top);
      width = Math.max(0, a.left - t.right);
      height = Math.max(a.bottom, t.bottom) - top;
      polygon =
        `polygon(0 ${t.top - top}px, 0 ${t.bottom - top}px, ` +
        `${width}px ${a.bottom - top}px, ${width}px ${a.top - top}px)`;
    } else if (t.left >= a.right) {
      // Tooltip right of anchor
      left = a.right;
      top = Math.min(a.top, t.top);
      width = Math.max(0, t.left - a.right);
      height = Math.max(a.bottom, t.bottom) - top;
      polygon =
        `polygon(0 ${a.top - top}px, 0 ${a.bottom - top}px, ` +
        `${width}px ${t.bottom - top}px, ${width}px ${t.top - top}px)`;
    } else {
      // Tooltip and anchor overlap; no bridge needed.
      bridge.style.display = 'none';
      return;
    }

    bridge.style.left = `${left}px`;
    bridge.style.top = `${top}px`;
    bridge.style.width = `${width}px`;
    bridge.style.height = `${height}px`;
    bridge.style.clipPath = polygon;
    bridge.style.display = '';
  }

  #cleanupAnchor(anchor: HTMLElement, type: 'description' | 'label' | undefined): void {
    this.#removeAriaRelation(anchor, type);

    anchor.removeEventListener('blur', this.#onBlur, { capture: true });
    anchor.removeEventListener('click', this.#onClick);
    anchor.removeEventListener('focus', this.#onFocus, { capture: true });
    anchor.removeEventListener('mouseover', this.#onMouseOver);
    anchor.removeEventListener('mouseout', this.#onMouseOut);
  }

  /**
   * Positions the tooltip against the given anchor. Only the active anchor carries the anchor name,
   * so it can move from one anchor to the next without the CSS becoming ambiguous.
   */
  #setActiveAnchor(anchor?: HTMLElement | null): void {
    const oldAnchor = this.anchor;
    if (oldAnchor === anchor) {
      return;
    }

    // Only clear the anchorName if it was set by us.
    if (oldAnchor?.style.anchorName === `--${this.id}`) {
      oldAnchor.style.anchorName = '';
    }

    if (anchor) {
      // Do not overwrite an existing anchor name, as it might be used for something else.
      const anchorName = anchor.style.anchorName || `--${this.id}`;

      anchor.style.anchorName = anchorName;
      this.style.positionAnchor = anchorName;
    } else {
      this.style.positionAnchor = '';
    }

    this.anchor = anchor;
  }

  #updateAnchors(): void {
    const rootNode = this.getRootNode() as Document | ShadowRoot | null,
      ids = this.for?.split(/\s+/).filter(Boolean) ?? [];

    const newAnchors = rootNode
      ? Array.from(new Set(ids))
          .map(id => rootNode.getElementById(id))
          .filter((anchor): anchor is HTMLElement => !!anchor)
      : [];

    const oldAnchors = this.anchors;
    if (
      newAnchors.length === oldAnchors.length &&
      newAnchors.every((anchor, index) => anchor === oldAnchors[index])
    ) {
      return;
    }

    oldAnchors.forEach(anchor => this.#cleanupAnchor(anchor, this.type));

    const { signal } = this.#eventController;

    newAnchors.forEach(anchor => {
      this.#addAriaRelation(anchor, this.type);

      anchor.addEventListener('blur', this.#onBlur, { capture: true, signal });
      anchor.addEventListener('click', this.#onClick, { signal });
      anchor.addEventListener('focus', this.#onFocus, { capture: true, signal });
      anchor.addEventListener('mouseover', this.#onMouseOver, { signal });
      anchor.addEventListener('mouseout', this.#onMouseOut, { signal });
    });

    this.anchors = newAnchors;

    // Until a trigger picks one, the tooltip is positioned against the first anchor.
    this.#setActiveAnchor(newAnchors[0]);
  }
}
