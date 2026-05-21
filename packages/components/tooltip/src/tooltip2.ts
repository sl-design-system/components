import { CSSResultGroup, LitElement, PropertyValues, TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './tooltip2.scss.js';

let nextUniqueId = 0;

const SHOW_DELAY = 150,
  HIDE_DELAY = 0;

/**
 * A tooltip component that can be used to display additional information about an element when the
 * user hovers over it, focuses it, or clicks it. The tooltip is positioned relative to an anchor
 * element, which can be specified using the `for` attribute.
 *
 * The tooltip will automatically determine the appropriate ARIA relation to use based on the `type`
 * property. By default, it will use `ariaLabelledByElements`, but if `type` is set to
 * `description`, it will use `ariaDescribedByElements` instead.
 *
 * @element sl-tooltip2
 *
 * @slot - The content of the tooltip.
 *
 * @csspart arrow - The arrow element that points to the anchor.
 * @csspart safe-triangle - An invisible element used to extend the hover area of the tooltip.
 */
export class Tooltip2 extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Controller for managing event listeners. */
  #eventController = new AbortController();

  /** Timeout ID for the hover delay. */
  #hoverTimeout?: ReturnType<typeof setTimeout>;

  /** @internal The element this tooltip is anchored to. */
  @state() anchor?: HTMLElement | null;

  /**
   * Stops the tooltip from being displayed.
   *
   * @default false
   */
  @property({ type: Boolean }) disabled?: boolean;

  /** The ID of the element this tooltip is for. */
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
    this.addEventListener('mouseout', this.#onMouseOut, { signal });
    this.addEventListener('toggle', this.#onToggle, { signal });

    // Re-establish the anchor relationship if the tooltip is moved to a different root
    if (this.anchor && this.for) {
      this.anchor = undefined; // triggers #updateAnchor()
    } else if (this.for) {
      this.#updateAnchor();
    }
  }

  override disconnectedCallback() {
    clearTimeout(this.#hoverTimeout);

    this.#eventController.abort();

    // Remove the event handler in case the tooltip is still open when disconnected
    document.removeEventListener('keydown', this.#onKeydown);

    if (this.anchor) {
      this.#removeAriaRelation(this.anchor);
    }

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('anchor') || changes.has('for')) {
      this.#updateAnchor();
    }

    if (changes.has('disabled') && this.disabled) {
      this.hidePopover();
    }

    if (changes.has('open')) {
      if (this.open) {
        this.showPopover();
      } else {
        this.hidePopover();
      }
    }
  }

  override render(): TemplateResult {
    return html`
      <slot></slot>
      <div part="arrow"></div>
      <div part="hover-extender"></div>
    `;
  }

  #onBeforeToggle = (event: ToggleEvent): void => {
    if (event.newState === 'open') {
      if (this.disabled) {
        event.preventDefault();
        return;
      }

      document.addEventListener('keydown', this.#onKeydown);
    } else {
      document.removeEventListener('keydown', this.#onKeydown);
    }
  };

  #onBlur = (): void => {
    if (this.#hasTrigger('focus')) {
      this.hidePopover();
    }
  };

  #onClick = (): void => {
    if (this.#hasTrigger('click')) {
      if (this.matches(':popover-open')) {
        this.hidePopover();
      } else {
        this.showPopover();
      }
    } else {
      this.hidePopover();
    }
  };

  #onFocus = (event: Event): void => {
    console.log('onFocus', event.target);
    if (this.#hasTrigger('focus')) {
      this.showPopover();
    }
  };

  #onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.hidePopover();
    }
  };

  #onMouseOver = (): void => {
    if (this.#hasTrigger('hover')) {
      clearTimeout(this.#hoverTimeout);

      this.#hoverTimeout = setTimeout(() => {
        this.showPopover();
      }, SHOW_DELAY);
    }
  };

  #onMouseOut = (): void => {
    if (this.#hasTrigger('hover')) {
      // Don't hide the popover if either the anchor or the popover itself is still hovered
      const anchorHovered = Boolean(this.anchor?.matches(':hover')),
        tooltipHovered = this.matches(':hover');
      if (anchorHovered || tooltipHovered) {
        return;
      }

      clearTimeout(this.#hoverTimeout);

      if (!(anchorHovered || tooltipHovered)) {
        this.#hoverTimeout = setTimeout(() => {
          this.hidePopover();
        }, HIDE_DELAY);
      }
    }
  };

  #onToggle = (event: ToggleEvent): void => {
    if (event.newState === 'open' && this.anchor) {
      this.#positionHoverExtender(this.anchor);
    }
  };

  #hasTrigger(trigger: string): boolean {
    return this.trigger.split(' ').includes(trigger);
  }

  #getAriaPropertyFromType(
    type?: 'description' | 'label'
  ): 'ariaDescribedByElements' | 'ariaLabelledByElements' {
    return type === 'description' ? 'ariaDescribedByElements' : 'ariaLabelledByElements';
  }

  #addAriaRelation(element: Element): void {
    const ariaProperty = this.#getAriaPropertyFromType(this.type);

    const refs = element[ariaProperty] ?? [];
    if (!refs.includes(this)) {
      element[ariaProperty] = [...refs, this];
    }
  }

  #removeAriaRelation(element: Element): void {
    const ariaProperty = this.#getAriaPropertyFromType(this.type);

    const refs = element[ariaProperty] ?? [];
    element[ariaProperty] = refs.filter((ref: Element) => ref !== this);
  }

  #positionHoverExtender(anchor: Element): void {
    const extender = this.renderRoot.querySelector<HTMLElement>('[part="hover-extender"]');
    if (!extender) {
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
      extender.style.display = 'none';
      return;
    }

    extender.style.display = 'block';
    extender.style.position = 'fixed';
    extender.style.left = `${left}px`;
    extender.style.top = `${top}px`;
    extender.style.width = `${width}px`;
    extender.style.height = `${height}px`;
    extender.style.clipPath = polygon;
  }

  #updateAnchor(): void {
    if (!this.for) {
      this.anchor = undefined;
      return;
    }

    const rootNode = this.getRootNode() as Document | ShadowRoot | null;
    if (!rootNode) {
      this.anchor = undefined;
      return;
    }

    const newAnchor = this.for ? rootNode.getElementById(this.for) : null,
      oldAnchor = this.anchor;
    if (newAnchor === oldAnchor) {
      return;
    }

    const { signal } = this.#eventController;

    if (newAnchor) {
      this.#addAriaRelation(newAnchor);

      newAnchor.addEventListener('blur', this.#onBlur, { capture: true, signal });
      newAnchor.addEventListener('click', this.#onClick, { signal });
      newAnchor.addEventListener('focus', this.#onFocus, { capture: true, signal });
      newAnchor.addEventListener('mouseover', this.#onMouseOver, { signal });
      newAnchor.addEventListener('mouseout', this.#onMouseOut, { signal });

      const newAnchorName = newAnchor.style.anchorName || `--${this.id}`;

      newAnchor.style.anchorName = newAnchorName;
      this.style.positionAnchor = newAnchorName;
    }

    if (oldAnchor) {
      this.#removeAriaRelation(oldAnchor);

      oldAnchor.removeEventListener('blur', this.#onBlur, { capture: true });
      oldAnchor.removeEventListener('click', this.#onClick);
      oldAnchor.removeEventListener('focus', this.#onFocus, { capture: true });
      oldAnchor.removeEventListener('mouseover', this.#onMouseOver);
      oldAnchor.removeEventListener('mouseout', this.#onMouseOut);
      oldAnchor.style.anchorName = '';
      this.style.positionAnchor = '';
    }

    this.anchor = newAnchor;
  }
}
