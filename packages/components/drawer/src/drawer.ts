import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button, type ButtonSize } from '@sl-design-system/button';
import { ButtonBar } from '@sl-design-system/button-bar';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property, query } from 'lit/decorators.js';
import styles from './drawer.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-drawer': Drawer;
  }
}

export type DrawerAttachment = 'right' | 'left' | 'top' | 'bottom';

/**
 * A drawer component for displaying UI at the side of the screen.
 *
 * @cssprop --sl-drawer-max-inline-size - The maximum inline size of the drawer
 * @slot default - Body content for the drawer
 * @slot header - Header content for the drawer
 * @slot title - The title of the drawer
 */
export class Drawer extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-button-bar': ButtonBar
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  @query('dialog') dialog?: HTMLDialogElement;

  /** Disables the ability to close the dialog using the Escape key. */
  @property({ type: Boolean, attribute: 'disable-close' }) disableClose = false;

  /** The side of the screen where the drawer is attached */
  @property({ reflect: true }) attachment: DrawerAttachment = 'right';

  /** The size of the button */
  @property({ attribute: 'close-button-size' }) closeButtonSize: ButtonSize = 'sm';

  override connectedCallback(): void {
    super.connectedCallback();

    this.inert = true;
  }

  override render(): TemplateResult {
    return html`
      <dialog
        @cancel=${this.#onCancel}
        @click=${this.#onClick}
        @close=${this.#onClose}
        aria-labelledby="title"
        part="dialog"
      >
        <div>
          <sl-button-bar>
            <sl-button
              sl-dialog-close
              .size=${this.closeButtonSize}
              tab-index="0"
              aria-label="back to page"
              title="close"
              >x</sl-button
            >
            <slot name="actions"></slot>
          </sl-button-bar>
          <slot name="title" id="title"></slot>
        </div>
        <slot></slot>
      </dialog>
    `;
  }

  showModal(): void {
    this.inert = false;
    this.dialog?.showModal();

    // Disable scrolling while the dialog is open
    document.documentElement.style.overflow = 'hidden';
  }

  close(): void {
    if (this.dialog?.open) {
      this.dialog?.close();
    }
  }

  #onCancel(event: Event): void {
    if (this.disableClose) {
      event.preventDefault();
    }
  }

  #onClick(event: PointerEvent & { target: HTMLElement }): void {
    if (event.target.matches('sl-button[sl-dialog-close]')) {
      this.dialog?.close(event.target.getAttribute('sl-dialog-close') || '');
    } else if (!this.disableClose && this.dialog) {
      const rect = this.dialog.getBoundingClientRect();

      // Check if the user clicked on the backdrop
      if (
        event.clientY < rect.top ||
        event.clientY > rect.bottom ||
        event.clientX < rect.left ||
        event.clientX > rect.right
      ) {
        // If so, close the dialog
        this.dialog.close();
      }
    }
  }

  #onClose(): void {
    // Reenable scrolling after the dialog has closed
    document.documentElement.style.overflow = '';

    this.inert = true;
  }
}
