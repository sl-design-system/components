var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if ((decorator = decorators[i]))
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './tooltip.scss.js';
let nextUniqueId = 0;
const _Tooltip = class _Tooltip extends LitElement {
  constructor() {
    super(...arguments);
    /** Controller for managing event listeners. */
    this.#eventController = new AbortController();
    this.anchors = [];
    this.trigger = 'focus hover';
    this.#onBeforeToggle = event => {
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
    this.#onBlur = () => {
      if (this.#hasTrigger('focus')) {
        this.hidePopover();
      }
    };
    this.#onClick = event => {
      if (this.#hasTrigger('click')) {
        if (this.matches(':popover-open') && event.currentTarget === this.anchor) {
          this.hidePopover();
        } else {
          this.#setActiveAnchor(event.currentTarget);
          this.showPopover();
        }
      } else {
        this.hidePopover();
      }
    };
    this.#onFocus = event => {
      if (this.#hasTrigger('focus')) {
        const anchor = event.currentTarget;
        this.#setActiveAnchor(anchor);
        const focused = event.composedPath().at(0) ?? anchor;
        if (focused instanceof Element && focused.matches(':focus-visible')) {
          this.showPopover();
        }
      }
    };
    this.#onKeydown = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        this.hidePopover();
      }
    };
    this.#onMouseOver = event => {
      if (this.#hasTrigger('hover')) {
        clearTimeout(this.#hoverTimeout);
        const anchor = event.currentTarget;
        this.#hoverTimeout = setTimeout(() => {
          this.#setActiveAnchor(anchor);
          this.showPopover();
        }, _Tooltip.hoverShowDelay);
      }
    };
    this.#onMouseOut = event => {
      if (this.#hasTrigger('hover')) {
        const relatedTarget = event.relatedTarget;
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
        }, _Tooltip.hoverHideDelay);
      }
    };
    this.#onToggle = event => {
      if (event.newState === 'open' && this.anchor) {
        this.#positionHoverBridge(this.anchor);
      }
    };
    this.#onTooltipClick = event => {
      event.stopPropagation();
    };
  }
  static {
    /**
     * The delay in milliseconds before showing the tooltip when the mouse hovers over the anchor
     * element.
     */
    this.hoverShowDelay = 150;
  }
  static {
    /** The delay in milliseconds before hiding the tooltip when the mouse leaves the anchor element. */
    this.hoverHideDelay = 0;
  }
  static {
    /** @internal */
    this.styles = styles;
  }
  #eventController;
  /** Timeout ID for the hover delay. */
  #hoverTimeout;
  connectedCallback() {
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
    if (this.anchors.length && this.for) {
      this.anchors = [];
    } else if (this.for) {
      this.#updateAnchors();
    }
  }
  disconnectedCallback() {
    clearTimeout(this.#hoverTimeout);
    this.#eventController.abort();
    document.removeEventListener('keydown', this.#onKeydown, { capture: true });
    this.anchors.forEach(anchor => this.#removeAriaRelation(anchor, this.type));
    super.disconnectedCallback();
  }
  willUpdate(changes) {
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
  render() {
    return html`
      <slot></slot>
      <div part="hover-bridge"></div>
    `;
  }
  #onBeforeToggle;
  #onBlur;
  #onClick;
  #onFocus;
  #onKeydown;
  #onMouseOver;
  #onMouseOut;
  #onToggle;
  #onTooltipClick;
  #hasTrigger(trigger) {
    return this.trigger.split(' ').includes(trigger);
  }
  #getAriaPropertyFromType(type) {
    return type === 'description' ? 'ariaDescribedByElements' : 'ariaLabelledByElements';
  }
  #addAriaRelation(element, type) {
    const ariaProperty = this.#getAriaPropertyFromType(type);
    const refs = element[ariaProperty] ?? [];
    if (!refs.includes(this)) {
      element[ariaProperty] = [...refs, this];
    }
  }
  #removeAriaRelation(element, type) {
    const ariaProperty = this.#getAriaPropertyFromType(type);
    const refs = element[ariaProperty] ?? [];
    if (!refs.includes(this)) {
      return;
    }
    element[ariaProperty] = refs.filter(ref => ref !== this);
  }
  #positionHoverBridge(anchor) {
    const bridge = this.renderRoot.querySelector('[part="hover-bridge"]');
    if (!bridge) {
      return;
    }
    const a = anchor.getBoundingClientRect(),
      t = this.getBoundingClientRect();
    let left, top, width, height, polygon;
    if (t.bottom <= a.top) {
      left = Math.min(a.left, t.left);
      top = t.bottom;
      width = Math.max(a.right, t.right) - left;
      height = Math.max(0, a.top - t.bottom);
      polygon = `polygon(${t.left - left}px 0, ${t.right - left}px 0, ${a.right - left}px ${height}px, ${a.left - left}px ${height}px)`;
    } else if (t.top >= a.bottom) {
      left = Math.min(a.left, t.left);
      top = a.bottom;
      width = Math.max(a.right, t.right) - left;
      height = Math.max(0, t.top - a.bottom);
      polygon = `polygon(${a.left - left}px 0, ${a.right - left}px 0, ${t.right - left}px ${height}px, ${t.left - left}px ${height}px)`;
    } else if (t.right <= a.left) {
      left = t.right;
      top = Math.min(a.top, t.top);
      width = Math.max(0, a.left - t.right);
      height = Math.max(a.bottom, t.bottom) - top;
      polygon = `polygon(0 ${t.top - top}px, 0 ${t.bottom - top}px, ${width}px ${a.bottom - top}px, ${width}px ${a.top - top}px)`;
    } else if (t.left >= a.right) {
      left = a.right;
      top = Math.min(a.top, t.top);
      width = Math.max(0, t.left - a.right);
      height = Math.max(a.bottom, t.bottom) - top;
      polygon = `polygon(0 ${a.top - top}px, 0 ${a.bottom - top}px, ${width}px ${t.bottom - top}px, ${width}px ${t.top - top}px)`;
    } else {
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
  #cleanupAnchor(anchor, type) {
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
  #setActiveAnchor(anchor) {
    const oldAnchor = this.anchor;
    if (oldAnchor === anchor) {
      return;
    }
    if (oldAnchor?.style.anchorName === `--${this.id}`) {
      oldAnchor.style.anchorName = '';
    }
    if (anchor) {
      const anchorName = anchor.style.anchorName || `--${this.id}`;
      anchor.style.anchorName = anchorName;
      this.style.positionAnchor = anchorName;
    } else {
      this.style.positionAnchor = '';
    }
    this.anchor = anchor;
  }
  #updateAnchors() {
    const rootNode = this.getRootNode(),
      ids = this.for?.split(/\s+/).filter(Boolean) ?? [];
    const newAnchors = rootNode
      ? Array.from(new Set(ids))
          .map(id => rootNode.getElementById(id))
          .filter(anchor => !!anchor)
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
    this.#setActiveAnchor(newAnchors[0]);
  }
};
__decorateClass([state()], _Tooltip.prototype, 'anchors', 2);
__decorateClass([state()], _Tooltip.prototype, 'anchor', 2);
__decorateClass([property({ type: Boolean })], _Tooltip.prototype, 'disabled', 2);
__decorateClass([property()], _Tooltip.prototype, 'for', 2);
__decorateClass([property({ type: Boolean })], _Tooltip.prototype, 'open', 2);
__decorateClass([property()], _Tooltip.prototype, 'trigger', 2);
__decorateClass([property()], _Tooltip.prototype, 'type', 2);
export let Tooltip = _Tooltip;
//# sourceMappingURL=tooltip.js.map
