import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './scrollbar.scss.js';

export class Scrollbar extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The maximum coordinates of the thumb. */
  #max = 0;

  /** Observe size changes to the scroll container. */
  #observer = new ResizeObserver(entries => this.#onResize(entries[0]));

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
  @property() scroller?: string | Element;

  /** Set to true if you want the scrollbar to have a vertical orientation. */
  @property({ type: Boolean }) vertical?: boolean;

  override disconnectedCallback(): void {
    this.#scroller?.removeEventListener('scroll', this.#onScroll);
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('scroller')) {
      if (this.scroller) {
        let scroller: Element | null = null;
        if (typeof this.scroller === 'string') {
          scroller = (this.getRootNode() as HTMLElement).querySelector(`#${this.scroller}`);
        } else if (this.scroller instanceof Element) {
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
      <div part="track">
        <div @pointerdown=${this.#onPointerDown} @pointerup=${this.#onPointerUp} part="thumb"></div>
      </div>
    `;
  }

  #onPointerDown(event: PointerEvent & { target: HTMLElement }) {
    event.target.setPointerCapture(event.pointerId);
    event.target.addEventListener('pointermove', this.#onPointerMove, false);

    const thumbRect = event.target.getBoundingClientRect(),
      trackRect = this.renderRoot.querySelector('[part="track"]')!.getBoundingClientRect();

    this.#start = this.vertical ? event.clientY : event.clientX;
    this.#offset = thumbRect[this.vertical ? 'top' : 'left'] - trackRect[this.vertical ? 'top' : 'left'];
    this.#max = this.#trackSize! - this.#offset - this.#thumbSize!;
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

  #onResize(entry: ResizeObserverEntry) {
    const track = this.renderRoot.querySelector('[part="track"]')!;

    this.#scrollerSize = entry.contentRect[this.vertical ? 'height' : 'width'];
    this.#scrollerContentSize = entry.target[this.vertical ? 'scrollHeight' : 'scrollWidth'];
    this.#trackSize = track.getBoundingClientRect()[this.vertical ? 'height' : 'width'];
    this.#thumbSize = this.#trackSize * (this.#scrollerSize / this.#scrollerContentSize);

    this.style.setProperty('--sl-thumb-size', this.#thumbSize + 'px');

    // Update the thumb position
    this.#onScroll();
  }

  #onScroll = () => {
    const amount = this.#scroller!.scrollLeft / (this.#scrollerContentSize - this.#scrollerSize);

    this.style.setProperty('--sl-thumb-translate', `${amount * (this.#trackSize! - this.#thumbSize!)}px`);
  };
}
