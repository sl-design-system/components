import { type FocusTrap, createFocusTrap } from 'focus-trap';
import { type ReactiveController, type ReactiveControllerHost } from 'lit';

export class FocusTrapController implements ReactiveController {
  /** The focus trap instance. */
  #focusTrap?: FocusTrap;

  /** The host element that the controller is attached to. */
  #host: ReactiveControllerHost & HTMLElement;

  constructor(host: ReactiveControllerHost & HTMLElement) {
    this.#host = host;
    this.#host.addController(this);
  }

  hostDisconnected(): void {
    this.deactivate();

    this.#focusTrap = undefined;
  }

  activate(element: HTMLElement): void {
    this.#focusTrap ||= createFocusTrap(this.#host, {
      allowOutsideClick: true,
      clickOutsideDeactivates: false,
      escapeDeactivates: false,
      fallbackFocus: element,
      tabbableOptions: {
        getShadowRoot: true
      }
    });

    this.#focusTrap.activate();
  }

  deactivate(): void {
    this.#focusTrap?.deactivate();
  }
}
