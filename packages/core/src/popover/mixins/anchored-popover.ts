import type { Constructor } from '../../utils/mixin-types.js';
import type { ReactiveElement } from 'lit';
import type { AnchoredInterface } from './anchored.js';
import type { PopoverInterface } from './popover.js';
import type { Placement } from '../utils/position-anchored-element.js';
import { positionAnchoredElement } from '../utils/position-anchored-element.js';
import { supportsAnchor } from '../../utils/css.js';
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

    placement: Placement = 'bottom';

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

      const offsetOptions = {
        mainAxis: parseFloat(this.getAttribute('main-axis') || '6'),
        crossAxis: parseFloat(this.getAttribute('cross-axis') || '0')
      };

      this.cleanupFloatingUI = positionAnchoredElement(this, this.anchorElement, this.placement, offsetOptions);
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
