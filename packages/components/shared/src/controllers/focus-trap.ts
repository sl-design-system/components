import { type FocusTrap, createFocusTrap } from 'focus-trap';
import { type ReactiveController, type ReactiveControllerHost } from 'lit';

export interface FocusTrapControllerOptions {
  disableCancel: boolean;
}

export class FocusTrapController implements ReactiveController {
  /** The host element that the controller is attached to. */
  #host: ReactiveControllerHost & HTMLElement;

  /** Element to trap focus within. */
  #element?: HTMLElement;

  /** The focus trap instance. */
  #focusTrap?: FocusTrap;

  /** Whether the cancel action is disabled. */
  #disableCancel = false;

  constructor(host: ReactiveControllerHost & HTMLElement, options?: Partial<FocusTrapControllerOptions>) {
    this.#host = host;
    this.#host.addController(this);
    this.#disableCancel = !!options?.disableCancel;
  }

  hostConnected(): void {
    if (this.#element) {
      this.activate(this.#element);
    }
  }

  hostDisconnected(): void {
    this.deactivate();
  }

  activate(element: HTMLElement): void {
    if (!this.#focusTrap && element) {
      this.#focusTrap = createFocusTrap(element, {
        escapeDeactivates: !this.#disableCancel,
        allowOutsideClick: !this.#disableCancel,
        fallbackFocus: element,
        returnFocusOnDeactivate: true,
        tabbableOptions: {
          getShadowRoot: true
        }
      });
    }

    this.#focusTrap?.activate();
  }

  deactivate(): void {
    if (this.#focusTrap) {
      this.#focusTrap.deactivate();
    }
  }
}
