import type { Constructor } from '../../utils/mixin-types.js';
import type { PropertyValues, ReactiveElement } from 'lit';
import { property } from 'lit/decorators.js';
import { firstFocusableSelector, supportsTopLayer } from '../../utils/css.js';

export interface PopoverInterface {
  showPopover(): void;
  hidePopover(): void;
  popoverOpen: boolean;
  receivesFocus?: 'auto';
}

export function PopoverMixin<T extends Constructor<ReactiveElement>>(
  constructor: T
): T & Constructor<PopoverInterface> {
  class PopoverElement extends constructor {
    @property({ type: Boolean }) open = false;

    @property({ attribute: 'receives-focus' }) receivesFocus?: 'auto';

    public get popoverOpen(): boolean {
      return this._popoverOpen;
    }

    public set popoverOpen(open: boolean) {
      if (open === this.popoverOpen) return;
      this._popoverOpen = open;
      if (!supportsTopLayer) {
        this.toggleAttribute('popover-open', this.popoverOpen);
      }
    }

    _popoverOpen = false;

    override hidePopover(): void {
      if (!this.popoverOpen) {
        return;
      }
      this.popoverOpen = false;
      if (super.hidePopover && this.matches(':open')) {
        super.hidePopover();
        this.open = false;
      } else {
        console.log('will hide');
        this.dispatchEvent(new Event('hide', { bubbles: true, composed: true }));
      }
      let hasElementChildren = false;
      this.shadowRoot
        ?.querySelector('slot')
        ?.assignedElements()
        ?.forEach(element => {
          hasElementChildren = true;
          element.toggleAttribute('open', false);
        });
      this.toggleAttribute('has-element-children', hasElementChildren);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    positionPopover(): void {}

    override showPopover(): void {
      if (this.popoverOpen) {
        return;
      }

      this.popoverOpen = true;

      if (super.showPopover && !this.matches(':open')) {
        super.showPopover();
        this.open = true;
        console.log('listener');
        this.addEventListener(
          'hide',
          () => {
            this.open = false;
          },
          { once: true }
        );
      } else {
        console.log('will show');
        this.dispatchEvent(new Event('show', { bubbles: true, composed: true }));
      }
      let hasElementChildren = false;
      this.shadowRoot
        ?.querySelector('slot')
        ?.assignedElements()
        ?.forEach(element => {
          hasElementChildren = true;
          element.toggleAttribute('open', true);
        });
      this.toggleAttribute('has-element-children', hasElementChildren);
    }

    // override showOverlay = (_event?: Event): void => {
    //   this.showPopover();
    //   this.positionPopover();
    // };

    // override hideOverlay = (_event?: Event): void => {
    //   console.log('ha', _event);
    //   this.hidePopover();
    // };

    override updated(changes: PropertyValues<this>): void {
      super.updated(changes);

      if (changes.has('open') && this.open && this.getAttribute('popover') !== 'manual') {
        requestAnimationFrame(() => {
          const firstFocusable = this.querySelector(firstFocusableSelector) as HTMLElement;
          if (firstFocusable) {
            console.log(firstFocusable);
            firstFocusable.focus();
          }
        });
      }
    }
  }

  return PopoverElement;
}
