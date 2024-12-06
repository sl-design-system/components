// import { type ReactiveController, type ReactiveControllerHost } from 'lit';
// import { type PopoverPosition, type PositionPopoverOptions, isPopoverOpen, positionPopover } from '../popover.js';
// import { type FocusTrap, createFocusTrap } from 'focus-trap';
//
// export type FocusTrapControllerConfig = createOptions;
//
// let nextUniqueId = 0;
//
// export class FocusTrapController implements ReactiveController {
//   #cleanup?: () => void;
//   #config: FocusTrapControllerConfig;
//   #host: ReactiveControllerHost & HTMLElement;
//
//   #onBeforeToggle = (event: Event): void => {
//     const anchorElement = this.#getAnchorElement(),
//       { newState, oldState } = event as ToggleEvent;
//
//     this.#linkAnchorWithPopover(newState === 'open');
//
//     if (anchorElement && newState === 'open' && oldState === 'closed') {
//       this.#cleanup = positionPopover(this.#host, anchorElement, {
//         ...this.#config,
//         arrowElement: this.arrowElement,
//         arrowPadding: this.arrowPadding,
//         maxWidth: this.maxWidth,
//         offset: this.offset,
//         position: this.position
//       });
//     } else if (this.#cleanup) {
//       this.#cleanup();
//       this.#cleanup = undefined;
//     }
//   };
//
//   #onToggle = (event: Event): void => {
//     const { newState, oldState, target } = event as ToggleEvent & { target: HTMLElement };
//
//     /**
//      * Tooltips are working in a little bit different way than popovers,
//      * the workaround was making problems with showing shared tooltip.
//      * */
//     if (this.#host.tagName === 'SL-TOOLTIP') {
//       return;
//     }
//
//     /**too
//      * Workaround to make it working on clicking again (togglePopover method) on the anchor element
//      * in Chrome and Safari there is the same state for new and old - open, when it's already opened
//      * and we want to close it in FF on click runs toggle event twice.
//      */
//     if ((newState === 'closed' && isPopoverOpen(target)) || newState === oldState) {
//       event.stopPropagation();
//
//       this.#host.hidePopover();
//     }
//   };
//
//   /** The arrow pointing from the popover to the anchor element. */
//   arrowElement?: string | HTMLElement;
//
//   /** The padding of the arrow. */
//   arrowPadding?: number;
//
//   /** The offset of the popover to its anchor. */
//   offset?: number;
//
//   /** The max width of the popover. */
//   maxWidth?: number;
//
//   /** The main position of the popover relative to the anchor. */
//   position?: PopoverPosition;
//
//   constructor(host: ReactiveControllerHost & HTMLElement, config: FocusTrapControllerConfig = {}) {
//     this.#config = config;
//     this.#host = host;
//     this.#host.addController(this);
//
//     this.arrowElement = this.#config.arrowElement;
//     this.arrowPadding = this.#config.arrowPadding;
//     this.offset = this.#config.offset;
//     this.maxWidth = this.#config.maxWidth;
//     this.position = this.#config.position;
//   }
//
//   hostConnected(): void {
//     this.#linkAnchorWithPopover();
//
//     this.#host?.addEventListener('beforetoggle', this.#onBeforeToggle);
//     this.#host?.addEventListener('toggle', this.#onToggle);
//   }
//
//   hostDisconnected(): void {
//     this.#host?.removeEventListener('toggle', this.#onToggle);
//     this.#host?.removeEventListener('beforetoggle', this.#onBeforeToggle);
//
//     this.#host.removeAttribute('aria-details');
//     this.#getAnchorElement()?.removeAttribute('aria-expanded');
//     this.#getAnchorElement()?.removeAttribute('popover-opened');
//   }
//
//   #getAnchorElement(): Element | null {
//     let anchorElement = this.#host.anchorElement || null;
//
//     if (!anchorElement && this.#host.hasAttribute('anchor')) {
//       anchorElement = (this.#host.getRootNode() as HTMLElement)?.querySelector(`#${this.#host.getAttribute('anchor')}`);
//     }
//
//     return anchorElement;
//   }
//
//   /**
//    * Normally when using the `popovertarget` attribute with popovers,
//    * the browser will automatically set the `aria-details` attribute on
//    * the anchor element and `aria-expanded` on the trigger. But since we
//    * cannot use the `popovertarget` attribute in combination with custom
//    * elements, we need to set these ourselves.
//    */
//   #linkAnchorWithPopover(expanded = false): void {
//     const anchorElement = this.#getAnchorElement();
//     this.#host.id ||= `sl-popover-${nextUniqueId++}`;
//
//     /**
//      * Tooltips should have different ARIAs than popover
//      * and the anchor element should not get active state when the tooltip is visible -
//      * should have `hover` or `focus` depending on how it was triggered.
//      * */
//     if (this.#host.tagName === 'SL-TOOLTIP') {
//       return;
//     }
//
//     if (anchorElement && !this.#host.hasAttribute('aria-details')) {
//       anchorElement.id ||= `sl-anchor-${nextUniqueId++}`;
//
//       anchorElement?.setAttribute('aria-details', this.#host.id);
//     }
//
//     anchorElement?.setAttribute('aria-expanded', expanded.toString());
//
//     const hasRichContent =
//       Array.from(this.#host.childNodes)
//         .map((n: ChildNode) => n.nodeType)
//         .filter(t => t === 1).length > 0;
//
//     // If the anchor element is a button, we need to set the `popover-opened` attribute
//     // TODO: Figure out whether we want to keep doing this. And if so, perhaps not just
//     // for buttons?
//     if (anchorElement?.tagName === 'SL-BUTTON') {
//       if (expanded) {
//         anchorElement.setAttribute('popover-opened', '');
//         if (!hasRichContent && !this.#host.hasAttribute('no-describedby')) {
//           anchorElement?.setAttribute('aria-describedby', this.#host.id);
//         }
//       } else {
//         anchorElement.removeAttribute('popover-opened');
//         anchorElement?.removeAttribute('aria-describedby');
//       }
//     }
//   }
// }

//import { ReactiveController, ReactiveElement } from 'lit';
import { type FocusTrap, createFocusTrap } from 'focus-trap';

export class FocusTrapController /*implements ReactiveController*/ {
  #host: HTMLElement /* ReactiveElement*/;
  #focusTrap?: FocusTrap;
  #options: unknown; // TODO: element and disableCancel ???

  constructor(host: HTMLElement /*ReactiveElement*/, options: unknown = {}) {
    this.#host = host;
    // this.#host.addController(this);
    this.#options = options;
  }

  // hostConnected(): void {
  //   this.activate();
  // }
  //
  // hostDisconnected(): void {
  //   this.deactivate();
  // }

  activate(): void {
    console.log('host and options', this.#host, this.#options);
    if (!this.#focusTrap) {
      this.#focusTrap = createFocusTrap(this.#host, {
        escapeDeactivates: !this.#options.disableCancel,
        allowOutsideClick: !this.#options.disableCancel,
        fallbackFocus: this.#host,
        returnFocusOnDeactivate: true,
        tabbableOptions: {
          getShadowRoot: true
        }
      });
    }

    this.#focusTrap.activate();
  }

  deactivate(): void {
    if (this.#focusTrap) {
      this.#focusTrap.deactivate();
    }
  }
}
