// //import { ReactiveController, ReactiveElement } from 'lit';
// import { type FocusTrap, createFocusTrap } from 'focus-trap';
//
// export interface FocusTrapControllerOptions {
//   disableCancel: boolean;
// }
//
// export class FocusTrapController /*implements ReactiveController*/ {
//   #host: HTMLElement /* ReactiveElement*/;
//
//   #focusTrap?: FocusTrap;
//
//   // #options: FocusTrapControllerOptions; // TODO: element and disableCancel ???
//
//   #disableCancel = false;
//
//   arrowElement?: HTMLElement;
//
//   constructor(host: HTMLElement /*ReactiveElement*/, options?: Partial<FocusTrapControllerOptions>) {
//     this.#host = host;
//     // this.#host.addController(this);
//     // this.#options = options;
//     this.#disableCancel = !!options?.disableCancel;
//   }
//
//   // hostConnected(): void {
//   //   this.activate();
//   // }
//   //
//   // hostDisconnected(): void {
//   //   this.deactivate();
//   // }
//
//   activate(): void {
//     console.log('host and options', this.#host, this.#disableCancel /*this.#options*/);
//     if (!this.#focusTrap) {
//       this.#focusTrap = createFocusTrap(this.#host, {
//         escapeDeactivates: !this.#disableCancel, //!this.#options.disableCancel,
//         allowOutsideClick: !this.#disableCancel, //!this.#options.disableCancel, // TODO: sth is not working with disableCancel
//         fallbackFocus: this.#host,
//         returnFocusOnDeactivate: true,
//         tabbableOptions: {
//           getShadowRoot: true
//         }
//       });
//     }
//
//     this.#focusTrap.activate();
//   }
//
//   deactivate(): void {
//     if (this.#focusTrap) {
//       this.#focusTrap.deactivate();
//     }
//   }
// }

import { type FocusTrap, createFocusTrap } from 'focus-trap';
import { ReactiveController, ReactiveControllerHost } from 'lit';

export interface FocusTrapControllerOptions {
  disableCancel: boolean;
}

export class FocusTrapController implements ReactiveController {
  /** The host element that the controller is attached to. */
  #host: /*ReactiveElement;*/ ReactiveControllerHost & HTMLElement; //HTMLElement /* ReactiveElement*/;

  /** Element to trap focus within. */
  #element?: HTMLElement;

  /** The focus trap instance. */
  #focusTrap?: FocusTrap;

  /** Whether the cancel action is disabled. */
  #disableCancel = false;

  constructor(
    host: /*ReactiveElement*/ ReactiveControllerHost & HTMLElement,
    options?: Partial<FocusTrapControllerOptions>
  ) {
    this.#host = host;
    this.#host.addController(this);
    // this.#options = options;
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
    console.log('host and options', element, this.#host, this.#disableCancel /*this.#options*/);
    if (!this.#focusTrap && element) {
      this.#focusTrap = createFocusTrap(element /*this.#host*/, {
        escapeDeactivates: !this.#disableCancel, //!this.#options.disableCancel,
        allowOutsideClick: !this.#disableCancel, //!this.#options.disableCancel, // TODO: sth is not working with disableCancel
        fallbackFocus: element, //this.#host,
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
