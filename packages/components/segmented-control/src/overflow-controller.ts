import { type ReactiveController, type ReactiveElement } from 'lit';

/**
 * Detects whether the options of the segmented control fit in the available space.
 *
 * Expects these elements in the render root of the host:
 *
 * - `.list`: the options; measured at their natural width while the host has the `measuring` state
 * - `.content`: the visible options or select; gets the height of the options so switching never
 *   changes the height of the page (which could toggle a scrollbar and cause an endless loop)
 *
 * Sets the `overflowing` custom state on the host when the options don't fit.
 */
export class OverflowController implements ReactiveController {
  /** Whether the options don't fit. */
  overflowing = false;

  #frame?: number;
  #host: ReactiveElement;
  #internals: ElementInternals;
  #observedAncestors = new Set<Element>();
  #observer = new ResizeObserver(() => this.#schedule());

  constructor(host: ReactiveElement, internals: ElementInternals) {
    this.#host = host;
    this.#internals = internals;
    host.addController(this);
  }

  hostConnected(): void {
    this.#observer.observe(this.#host);
    this.#syncAncestorObservations();
  }

  hostDisconnected(): void {
    this.#observer.disconnect();

    if (this.#frame !== undefined) {
      cancelAnimationFrame(this.#frame);
      this.#frame = undefined;
    }
  }

  hostUpdated(): void {
    this.#syncAncestorObservations();

    const list = this.#host.renderRoot.querySelector('.list');

    // The natural size of the options changes when fonts load or the theme changes.
    if (list) {
      this.#observer.observe(list);
    }

    this.#schedule();
  }

  #schedule(): void {
    this.#frame ??= requestAnimationFrame(() => {
      this.#frame = undefined;
      this.#update();
    });
  }

  #syncAncestorObservations(): void {
    const nextAncestors = new Set<Element>();

    for (let ancestor = this.#host.parentElement; ancestor; ancestor = ancestor.parentElement) {
      nextAncestors.add(ancestor);
    }

    for (const ancestor of this.#observedAncestors) {
      if (!nextAncestors.has(ancestor)) {
        this.#observer.unobserve(ancestor);
      }
    }

    for (const ancestor of nextAncestors) {
      if (!this.#observedAncestors.has(ancestor)) {
        this.#observer.observe(ancestor);
      }
    }

    this.#observedAncestors = nextAncestors;
  }

  #update(): void {
    const root = this.#host.renderRoot,
      content = root.querySelector<HTMLElement>('.content'),
      list = root.querySelector<HTMLElement>('.list');

    if (!content || !list) {
      return;
    }

    // The list is intentionally hidden from view while the control is overflowing. Temporarily clear
    // that state before measuring so the width reflects the actual layout instead of the hidden track.
    const wasOverflowing = this.#internals.states.has('overflowing');

    if (wasOverflowing) {
      this.#internals.states.delete('overflowing');
    }

    try {
      // Measure the natural size of the options, even when they are stretched to the full width.
      this.#internals.states.add('measuring');
      const { height, width } = list.getBoundingClientRect();
      this.#internals.states.delete('measuring');

      content.style.setProperty('--_content-block-size', `${height}px`);

      // Allow half a pixel of tolerance for sub-pixel rounding.
      const overflowing = width > 0 && width - this.#host.getBoundingClientRect().width > 0.5;

      if (overflowing !== this.overflowing) {
        this.overflowing = overflowing;
        this.#internals.states[overflowing ? 'add' : 'delete']('overflowing');
        this.#host.requestUpdate();
      }
    } finally {
      if (wasOverflowing && this.overflowing) {
        this.#internals.states.add('overflowing');
      }
    }
  }
}
