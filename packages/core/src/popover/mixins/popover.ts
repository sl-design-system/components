import type { Constructor } from '../../utils/mixin-types.js';
import type { CSSResultGroup, PropertyValues, ReactiveElement } from 'lit';
import { css } from 'lit';
import { property } from 'lit/decorators.js';
import { firstFocusableSelector, supportsTopLayer } from '../../utils/css.js';

export interface PopoverInterface {
  showPopover(): void;
  hidePopover(): void;
  open: boolean;
  popoverOpen: boolean;
  receivesFocus?: 'auto';
}

export const popoverMixinStyles: CSSResultGroup = css`
  @supports selector(:open) {
    :host(:open) {
      display: flex;
      opacity: 1;
      pointer-events: auto;
    }
  }

  @supports not selector(:open) {
    :host([popover-open]) {
      display: flex;
      opacity: 1;
      pointer-events: auto;
    }
  }

  :host {
    background: none;
    border: 0;
    display: flex;
    left: 0px;
    margin: 0;
    opacity: 0;
    overflow: visible;
    padding: 0;
    pointer-events: none;
    position: fixed;
    top: 0px;
  }
`;

export function PopoverMixin<T extends Constructor<ReactiveElement>>(
  constructor: T
): T & Constructor<PopoverInterface> {
  class PopoverElement extends constructor {
    #popoverOpen = false;

    @property({ type: Boolean }) open = false;

    @property({ attribute: 'receives-focus' }) receivesFocus?: 'auto';

    public get popoverOpen(): boolean {
      return this.#popoverOpen;
    }

    public set popoverOpen(open: boolean) {
      if (open === this.popoverOpen) {
        return;
      }

      this.#popoverOpen = open;

      if (!supportsTopLayer) {
        this.toggleAttribute('popover-open', this.popoverOpen);
      }
    }

    override hidePopover(): void {
      console.log('hidePopover', this.popoverOpen);

      if (!this.popoverOpen) {
        return;
      }

      this.popoverOpen = false;

      if (super.hidePopover && this.matches(':open')) {
        super.hidePopover();
        this.open = false;
      } else {
        this.dispatchEvent(new Event('hide', { bubbles: true, composed: true }));
      }

      // let hasElementChildren = false;
      // this.shadowRoot
      //   ?.querySelector('slot')
      //   ?.assignedElements()
      //   ?.forEach(element => {
      //     hasElementChildren = true;
      //     element.toggleAttribute('open', false);
      //   });
      // this.toggleAttribute('has-element-children', hasElementChildren);
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

        this.addEventListener(
          'hide',
          () => {
            this.open = false;
          },
          { once: true }
        );
      } else {
        this.dispatchEvent(new Event('show', { bubbles: true, composed: true }));
      }

      this.positionPopover();

      // let hasElementChildren = false;
      // this.shadowRoot
      //   ?.querySelector('slot')
      //   ?.assignedElements()
      //   ?.forEach(element => {
      //     hasElementChildren = true;
      //     element.toggleAttribute('open', true);
      //   });
      // this.toggleAttribute('has-element-children', hasElementChildren);
    }

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
