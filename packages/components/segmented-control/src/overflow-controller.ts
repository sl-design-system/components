import { type ReactiveController, type ReactiveElement } from 'lit';

/**
 * Detects whether the buttons of the segmented control fit in the available space.
 *
 * Expects these elements in the render root of the host: - `.measure ul`: a hidden copy of the
 * buttons at their natural width - `.sizer`: an invisible element with one child per button; it
 * makes the host ask for the width the buttons need, even while the select is shown, so
 * content-sized containers grow again - `.content`: the visible buttons or select; gets the height
 * of the buttons so switching never changes the height of the page (which could toggle a scrollbar
 * and cause an endless loop)
 */
export class OverflowController implements ReactiveController {
  /** Whether the buttons don't fit. */
  overflowing = false;

  #frame?: number;
  #host: ReactiveElement;
  #observer = new ResizeObserver(() => this.#schedule());

  constructor(host: ReactiveElement) {
    this.#host = host;
    host.addController(this);
  }

  hostConnected(): void {
    this.#observer.observe(this.#host);
  }

  hostDisconnected(): void {
    this.#observer.disconnect();

    if (this.#frame !== undefined) {
      cancelAnimationFrame(this.#frame);
      this.#frame = undefined;
    }
  }

  hostUpdated(): void {
    const measure = this.#host.renderRoot.querySelector('.measure ul');

    // The measured width changes when fonts load or the theme changes.
    if (measure) {
      this.#observer.observe(measure);
    }

    this.#schedule();
  }

  #schedule(): void {
    this.#frame ??= requestAnimationFrame(() => {
      this.#frame = undefined;
      this.#update();
    });
  }

  #update(): void {
    const root = this.#host.renderRoot,
      content = root.querySelector<HTMLElement>('.content'),
      measure = root.querySelector<HTMLElement>('.measure ul'),
      sizer = root.querySelector<HTMLElement>('.sizer');

    if (!content || !measure || !sizer?.children.length) {
      return;
    }

    const { height, width } = measure.getBoundingClientRect();

    sizer.style.setProperty('--_segment-size', `${width / sizer.children.length}px`);
    content.style.setProperty('--_content-block-size', `${height}px`);

    // Allow half a pixel of tolerance for sub-pixel rounding.
    const overflowing = width > 0 && width - this.#host.getBoundingClientRect().width > 0.5;

    if (overflowing !== this.overflowing) {
      this.overflowing = overflowing;
      this.#host.requestUpdate();
    }
  }
}
