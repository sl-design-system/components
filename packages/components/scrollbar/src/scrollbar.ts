import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './scrollbar.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-scrollbar': Scrollbar;
  }
}

/**
 * Scrollbar component for custom scrollbars. When in doubt, *always* use
 * the native scrollbar. This component is intended for use in components
 * that require a custom scrollbar, such as the grid.
 *
 * @csspart track - The track of the scrollbar.
 * @csspart thumb - The thumb of the scrollbar.
 */
export class Scrollbar extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The maximum coordinates of the thumb. */
  #max = 0;

  /** Observe size changes to the scroll container. */
  #observer = new ResizeObserver(() => this.updateThumbSize());

  /** The start offset from the pointerdown to the start of the thumb. */
  #offset = 0;

  /** The scroll container we are linked to. */
  #scroller?: Element;

  /** The size of the scroller. */
  #scrollerSize = 0;

  /** The size of the content inside the scroller. */
  #scrollerContentSize = 0;

  /** The start coordinate when pointerdown happens. */
  #start = 0;

  /** The size of the thumb, in pixels. */
  #thumbSize?: number;

  /** The size of the track, in pixels. */
  #trackSize?: number;

  /**
   * The scroll container; either the DOM id of an element within
   * the same context, or the element itself.
   */
  @property() scroller?: string | HTMLElement;

  /** Set to true if you want the scrollbar to have a vertical orientation. */
  @property({ type: Boolean }) vertical?: boolean;

  override disconnectedCallback(): void {
    this.#scroller?.removeEventListener('scroll', this.#onScroll);
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    // Observe the size of the track element, since that influences the position
    // and size of the thumb.
    this.#observer.observe(this.renderRoot.querySelector('[part="track"]')!);
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('scroller')) {
      if (this.scroller) {
        let scroller: Element | null = null;
        if (typeof this.scroller === 'string') {
          scroller = (this.getRootNode() as HTMLElement).querySelector(`#${this.scroller}`);
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
        this.#scroller = undefined;
        this.#observer.disconnect();
      }
    }
  }

  override render(): TemplateResult {
    return html`
      <div @mousedown=${this.#onMouseDown} part="track">
        <div @pointerdown=${this.#onPointerDown} @pointerup=${this.#onPointerUp} part="thumb"></div>
      </div>
    `;
  }

  /**
   * Recalculates the size and position of the thumb. A parent element
   * can use this method to force a recalculation of the thumb size and
   * position. This is useful when the contents of the scroller changes,
   * but not the size of the scroller itself.
   */
  updateThumbSize(): void {
    if (!this.#scroller) {
      return;
    }

    const rect = this.#scroller.getBoundingClientRect(),
      track = this.renderRoot.querySelector('[part="track"]')!;

    this.#scrollerSize = rect[this.vertical ? 'height' : 'width'];
    this.#scrollerContentSize = this.#scroller[this.vertical ? 'scrollHeight' : 'scrollWidth'];
    this.#trackSize = track.getBoundingClientRect()[this.vertical ? 'height' : 'width'];
    this.#thumbSize = Math.round(this.#trackSize * (this.#scrollerSize / this.#scrollerContentSize));
    this.#max = this.#trackSize - this.#thumbSize;

    this.style.setProperty('--sl-thumb-size', this.#thumbSize + 'px');

    // Update the thumb position
    this.#onScroll();
  }

  #onMouseDown(event: PointerEvent & { target: HTMLElement }): void {
    const trackStart = event.target.getBoundingClientRect()[this.vertical ? 'top' : 'left'];

    this.#start = trackStart;
    this.#offset = this.#thumbSize! / -2;

    this.#onPointerMove(event);
  }

  #onPointerDown(event: PointerEvent & { target: HTMLElement }) {
    // Prevent this from bubbling up to the mousedown event handler on the track
    event.preventDefault();
    event.stopPropagation();

    event.target.setPointerCapture(event.pointerId);
    event.target.addEventListener('pointermove', this.#onPointerMove, false);

    const thumbStart = event.target.getBoundingClientRect()[this.vertical ? 'top' : 'left'],
      trackStart = this.renderRoot.querySelector('[part="track"]')!.getBoundingClientRect()[
        this.vertical ? 'top' : 'left'
      ];

    this.#start = this.vertical ? event.clientY : event.clientX;
    this.#offset = thumbStart - trackStart;
  }

  #onPointerMove = (event: PointerEvent) => {
    const delta = (this.vertical ? event.clientY : event.clientX) - this.#start,
      coord = Math.max(0, Math.min(this.#max, this.#offset + delta)),
      amount = (coord / this.#max) * (this.#scrollerContentSize - this.#scrollerSize);

    this.#scroller![this.vertical ? 'scrollTop' : 'scrollLeft'] = amount;
    this.style.setProperty('--sl-thumb-translate', `${coord}px`);
  };

  #onPointerUp(event: PointerEvent & { target: HTMLElement }) {
    event.target.releasePointerCapture(event.pointerId);
    event.target.removeEventListener('pointermove', this.#onPointerMove, false);
  }

  #onScroll = () => {
    const amount = this.#scroller!.scrollLeft / (this.#scrollerContentSize - this.#scrollerSize);

    this.style.setProperty('--sl-thumb-translate', `${amount * this.#max}px`);
  };
}
