import type { CSSResultGroup, PropertyValues, ReactiveElement } from 'lit';
import type { Constructor } from '@sl-design-system/shared';
import { firstFocusableSelector, supportsTopLayer } from '@sl-design-system/shared';
import { css } from 'lit';
import { property } from 'lit/decorators.js';

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
    left: 0;
    margin: 0;
    opacity: 0;
    overflow: visible;
    padding: 0;
    pointer-events: none;
    position: fixed;
    top: 0;
  }
`;

export function PopoverMixin<T extends Constructor<ReactiveElement>>(
  constructor: T
): T & Constructor<PopoverInterface> {
  class PopoverElement extends constructor {
    #popoverOpen = false;

    #onDocumentClick = (): void => {
      this.open = false;
    };

    #onDocumentKeydown = (event: KeyboardEvent): void => {
      if (event.defaultPrevented) {
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        this.open = false;
      }
    };

    /** Whether the popover is open or not. */
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

    override disconnectedCallback(): void {
      this.#cleanup();

      super.disconnectedCallback();
    }

    override willUpdate(changes: PropertyValues<this>): void {
      super.willUpdate(changes);

      if (changes.has('open')) {
        if (this.open) {
          this.showPopover();
        } else if (typeof changes.get('open') !== 'undefined') {
          this.hidePopover();
        }
      }
    }

    override updated(changes: PropertyValues<this>): void {
      super.updated(changes);

      if (changes.has('open') && this.open && this.getAttribute('popover') !== 'manual') {
        requestAnimationFrame(() => {
          const firstFocusable = this.querySelector<HTMLElement>(firstFocusableSelector);

          firstFocusable?.focus();
        });
      }
    }

    override showPopover(): void {
      if (this.popoverOpen) {
        return;
      }

      this.popoverOpen = true;

      if (super.showPopover) {
        if (!this.matches(':open')) {
          super.showPopover();
        }

        this.open = true;
      } else {
        this.dispatchEvent(new Event('popovershow', { bubbles: true, composed: true }));
      }

      this.positionPopover();

      void this.#setup();
    }

    override hidePopover(): void {
      if (!this.popoverOpen) {
        return;
      }

      this.popoverOpen = false;

      if (super.hidePopover) {
        if (this.matches(':open')) {
          super.hidePopover();
        }

        this.open = false;
      } else {
        this.dispatchEvent(new Event('popoverhide', { bubbles: true, composed: true }));
      }

      this.#cleanup();
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    positionPopover(): void {}

    /** Setup light dismiss handlers if no top-layer and not a manual popover. */
    async #setup(): Promise<void> {
      if (!supportsTopLayer && this.getAttribute('popover') !== 'manual') {
        await new Promise(resolve => setTimeout(resolve));

        document.documentElement.addEventListener('click', this.#onDocumentClick);
        document.documentElement.addEventListener('keydown', this.#onDocumentKeydown);
      }
    }

    /** Cleanup light dismiss handlers. */
    #cleanup(): void {
      if (!supportsTopLayer && this.getAttribute('popover') !== 'manual') {
        document.documentElement.removeEventListener('click', this.#onDocumentClick);
        document.documentElement.removeEventListener('keydown', this.#onDocumentKeydown);
      }
    }
  }

  return PopoverElement;
}
