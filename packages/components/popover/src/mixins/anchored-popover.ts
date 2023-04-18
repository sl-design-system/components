import type { ReactiveElement } from 'lit';
import type { AnchoredInterface } from './anchored.js';
import type { PopoverInterface } from './popover.js';
import type { Placement, PositionAnchoredElementOptions } from '../utils/position-anchored-element.js';
import type { Constructor } from '@sl-design-system/shared';
import { supportsAnchor } from '@sl-design-system/shared';
import { flipPlacement, positionAnchoredElement } from '../utils/position-anchored-element.js';
import { PopoverMixin } from './popover.js';
import { AnchoredMixin } from './anchored.js';

export function AnchoredPopoverMixin<T extends Constructor<ReactiveElement>>(
  constructor: T
): T & Constructor<AnchoredInterface & PopoverInterface> {
  class AnchoredPopupElement extends AnchoredMixin(PopoverMixin(constructor)) {
    #onPopoverHide = (): void => {
      this.hidePopover();
      this.cleanupPopover();
    };

    /** The arrow pointing to the anchor element. */
    arrow?: HTMLElement;

    /** The placement of the popover relative to the anchor element. */
    placement: Placement = 'bottom';

    /** Cleanup callback for floating-ui. */
    cleanupFloatingUI?: () => void;

    override connectedCallback(): void {
      super.connectedCallback();

      this.addEventListener('popoverhide', this.#onPopoverHide);
    }

    override disconnectedCallback(): void {
      this.removeEventListener('popoverhide', this.#onPopoverHide);

      super.disconnectedCallback();
    }

    positionPopover(): void {
      if (supportsAnchor || !this.anchorElement) {
        return;
      }

      const offset: [number, number] = [
        parseFloat(this.getAttribute('cross-axis') || '0'),
        parseFloat(this.getAttribute('main-axis') || '12')
      ];

      const options: PositionAnchoredElementOptions = {
        arrow: this.arrow,
        positions: [
          { placement: this.placement, offset },
          { placement: flipPlacement(this.placement), offset }
        ],
        // TODO: get this from the theme somehow
        viewportMargin: 8
      };

      this.cleanupFloatingUI = positionAnchoredElement(this, this.anchorElement, options);
    }

    cleanupPopover(): void {
      if (this.cleanupFloatingUI) {
        this.cleanupFloatingUI();
        delete this.cleanupFloatingUI;
      }
    }
  }

  return AnchoredPopupElement;
}
