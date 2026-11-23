import { type ReactiveController, type ReactiveControllerHost } from 'lit';
import { type EditorView } from 'prosemirror-view';

/** Space kept between the caret and the docked toolbar, in px. */
const CARET_MARGIN = 24;

export interface DockedToolbarConfig {
  /** Returns the toolbar element, once rendered. */
  toolbar(): HTMLElement | null;
  /** Returns the ProseMirror view. */
  view(): EditorView | undefined;
  /** Returns the element that scrolls the text, if not the page (such as a full-screen dialog). */
  scroller?(): HTMLElement | null | undefined;
}

/**
 * Docks the formatting toolbar above the on-screen keyboard on touch devices.
 *
 * On a coarse pointer the toolbar is only shown while the editor has focus. It is then positioned
 * at the bottom of the visual viewport, which shrinks when the keyboard opens, and follows it on
 * `resize` and `scroll`. The page scrolls so the caret stays {@link CARET_MARGIN} px above the
 * toolbar. On iOS Safari the layout viewport does not shrink with the keyboard, so `position:
 * fixed; bottom: 0` alone would put the toolbar behind it.
 */
export class DockedToolbarController implements ReactiveController {
  #config: DockedToolbarConfig;
  #coarse = matchMedia('(pointer: coarse)');
  #focused = false;
  #host: ReactiveControllerHost;
  #listening = false;

  #onMediaChange = (): void => this.#host.requestUpdate();

  #onViewportChange = (): void => {
    this.#position();
    this.#keepCaretVisible();
  };

  constructor(host: ReactiveControllerHost, config: DockedToolbarConfig) {
    this.#host = host;
    this.#config = config;
    host.addController(this);
  }

  /** Whether the toolbar is docked above the keyboard right now. */
  get docked(): boolean {
    return this.touch && this.#focused;
  }

  /** Whether the device has a coarse pointer, such as a phone or tablet. */
  get touch(): boolean {
    return this.#coarse.matches;
  }

  /** Whether the browser shows its own bar with a Done button above the keyboard (iOS Safari). */
  get hasSystemKeyboardBar(): boolean {
    const ua = navigator.userAgent;

    // iPadOS Safari reports itself as a Mac, so tell it apart by its touch points.
    return /iP(hone|ad|od)/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  }

  hostConnected(): void {
    this.#coarse.addEventListener('change', this.#onMediaChange);
  }

  hostDisconnected(): void {
    this.#coarse.removeEventListener('change', this.#onMediaChange);
    this.#stopListening();
  }

  hostUpdated(): void {
    if (this.docked) {
      this.#position();
      this.#keepCaretVisible();
    }
  }

  /** Tells the controller whether the editor has focus. */
  setFocused(focused: boolean): void {
    if (focused === this.#focused) {
      return;
    }

    this.#focused = focused;

    if (this.docked) {
      this.#startListening();
    } else {
      this.#stopListening();
    }

    this.#host.requestUpdate();
  }

  #startListening(): void {
    if (this.#listening || !window.visualViewport) {
      return;
    }

    this.#listening = true;
    window.visualViewport.addEventListener('resize', this.#onViewportChange);
    window.visualViewport.addEventListener('scroll', this.#onViewportChange);
  }

  #stopListening(): void {
    if (!this.#listening || !window.visualViewport) {
      return;
    }

    this.#listening = false;
    window.visualViewport.removeEventListener('resize', this.#onViewportChange);
    window.visualViewport.removeEventListener('scroll', this.#onViewportChange);
  }

  /** Puts the toolbar at the bottom of the visible area, right above the keyboard. */
  #position(): void {
    const toolbar = this.#config.toolbar(),
      vv = window.visualViewport;

    if (!toolbar || !vv) {
      return;
    }

    toolbar.style.insetBlockStart = `${vv.offsetTop + vv.height}px`;
    toolbar.style.insetInlineStart = `${vv.offsetLeft}px`;
    toolbar.style.inlineSize = `${vv.width}px`;
  }

  /** Scrolls the page so the caret is visible above the toolbar. */
  #keepCaretVisible(): void {
    const toolbar = this.#config.toolbar(),
      view = this.#config.view(),
      vv = window.visualViewport;

    if (!toolbar || !view?.hasFocus() || !vv) {
      return;
    }

    const caret = view.coordsAtPos(view.state.selection.head),
      top = vv.offsetTop + CARET_MARGIN,
      bottom = vv.offsetTop + vv.height - toolbar.offsetHeight - CARET_MARGIN;

    const scroller = this.#config.scroller?.() ?? window;

    if (caret.bottom > bottom) {
      scroller.scrollBy(0, caret.bottom - bottom);
    } else if (caret.top < top) {
      scroller.scrollBy(0, caret.top - top);
    }
  }
}
