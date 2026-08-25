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
import { property } from 'lit/decorators.js';
import styles from './scrollbar.scss.js';
export class Scrollbar extends LitElement {
  static {
    /** @internal */
    this.styles = styles;
  }
  /** The maximum coordinates of the thumb. */
  #max = 0;
  /** Observe size changes to the scroll container. */
  #observer = new ResizeObserver(() => this.updateThumbSize());
  /** The start offset from the pointerdown to the start of the thumb. */
  #offset = 0;
  /** The scroll container we are linked to. */
  #scroller;
  /** The size of the scroller. */
  #scrollerSize = 0;
  /** The size of the content inside the scroller. */
  #scrollerContentSize = 0;
  /** The start coordinate when pointerdown happens. */
  #start = 0;
  /** The size of the thumb, in pixels. */
  #thumbSize;
  /** The size of the track, in pixels. */
  #trackSize;
  disconnectedCallback() {
    this.#scroller?.removeEventListener('scroll', this.#onScroll);
    this.#observer.disconnect();
    super.disconnectedCallback();
  }
  firstUpdated(changes) {
    super.firstUpdated(changes);
    this.#observer.observe(this.renderRoot.querySelector('[part="track"]'));
  }
  updated(changes) {
    super.updated(changes);
    if (changes.has('scroller')) {
      if (this.scroller) {
        let scroller = null;
        if (typeof this.scroller === 'string') {
          scroller = this.getRootNode().querySelector(`#${this.scroller}`);
        } else if (this.scroller instanceof HTMLElement) {
          scroller = this.scroller;
        }
        if (scroller) {
          this.#scroller = scroller;
          this.#scroller.addEventListener('scroll', this.#onScroll);
          this.#observer.observe(this.#scroller);
        }
      } else if (this.#scroller) {
        this.#scroller.removeEventListener('scroll', this.#onScroll);
        this.#scroller = void 0;
        this.#observer.disconnect();
      }
    }
  }
  render() {
    return html`
      <div @mousedown=${this.#onMouseDown} part="track">
        <div @pointerdown=${this.#onPointerDown} @pointerup=${this.#onPointerUp} part="thumb"></div>
      </div>
    `;
  }
  /**
   * Recalculates the size and position of the thumb. A parent element can use this method to force
   * a recalculation of the thumb size and position. This is useful when the contents of the
   * scroller changes, but not the size of the scroller itself.
   */
  updateThumbSize() {
    if (!this.#scroller) {
      return;
    }
    const rect = this.#scroller.getBoundingClientRect(),
      track = this.renderRoot.querySelector('[part="track"]');
    this.#scrollerSize = rect[this.vertical ? 'height' : 'width'];
    this.#scrollerContentSize = this.#scroller[this.vertical ? 'scrollHeight' : 'scrollWidth'];
    this.#trackSize = track.getBoundingClientRect()[this.vertical ? 'height' : 'width'];
    this.#thumbSize = Math.round(
      this.#trackSize * (this.#scrollerSize / this.#scrollerContentSize)
    );
    this.#max = this.#trackSize - this.#thumbSize;
    this.style.setProperty('--sl-thumb-size', this.#thumbSize + 'px');
    this.#onScroll();
  }
  #onMouseDown(event) {
    const trackStart = event.target.getBoundingClientRect()[this.vertical ? 'top' : 'left'];
    this.#start = trackStart;
    this.#offset = this.#thumbSize / -2;
    this.#onPointerMove(event);
  }
  #onPointerDown(event) {
    event.preventDefault();
    event.stopPropagation();
    event.target.setPointerCapture(event.pointerId);
    event.target.addEventListener('pointermove', this.#onPointerMove, false);
    const thumbStart = event.target.getBoundingClientRect()[this.vertical ? 'top' : 'left'],
      trackStart = this.renderRoot.querySelector('[part="track"]').getBoundingClientRect()[
        this.vertical ? 'top' : 'left'
      ];
    this.#start = this.vertical ? event.clientY : event.clientX;
    this.#offset = thumbStart - trackStart;
  }
  #onPointerMove = event => {
    const delta = (this.vertical ? event.clientY : event.clientX) - this.#start,
      coord = Math.max(0, Math.min(this.#max, this.#offset + delta)),
      amount = (coord / this.#max) * (this.#scrollerContentSize - this.#scrollerSize);
    this.#scroller[this.vertical ? 'scrollTop' : 'scrollLeft'] = amount;
    this.style.setProperty('--sl-thumb-translate', `${coord}px`);
  };
  #onPointerUp(event) {
    event.target.releasePointerCapture(event.pointerId);
    event.target.removeEventListener('pointermove', this.#onPointerMove, false);
  }
  #onScroll = () => {
    const amount = this.#scroller.scrollLeft / (this.#scrollerContentSize - this.#scrollerSize);
    this.style.setProperty('--sl-thumb-translate', `${amount * this.#max}px`);
  };
}
__decorateClass([property()], Scrollbar.prototype, 'scroller', 2);
__decorateClass([property({ type: Boolean })], Scrollbar.prototype, 'vertical', 2);
//# sourceMappingURL=scrollbar.js.map
