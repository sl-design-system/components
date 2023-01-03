import type { TemplateResult } from 'lit-html';
import type { CSSResultGroup } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { LitElement, html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { ButtonBar } from '../button-bar/index.js';
import styles from './drawer.scss.js';

export type DrawerAttachement = 'right' | 'left' | 'top' | 'bottom';

/**
 * A dialog component for displaying modal UI.
 *
 * @slot action - Area where action buttons are placed
 * @slot default - Body content for the dialog
 * @slot footer - Footer content for the dialog
 * @slot header - Header content for the dialog
 * @slot title - The title of the dialog
 */
export class Drawer extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button-bar': ButtonBar
    };
  }

  /** @private */
  static override styles: CSSResultGroup = styles;

  @query('dialog') dialog?: HTMLDialogElement;

  /** Disables the ability to close the dialog using the Escape key. */
  @property({ type: Boolean, attribute: 'disable-close' }) disableClose = false;

  /** The ARIA role of the dialog. */
  @property() override role: 'dialog' | 'alertdialog' = 'dialog';

  /** The side of the screen where the drawer is attached */
  @property({ reflect: true }) attachment: DrawerAttachement = 'right';

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
        .role=${this.role}
        part="dialog"
      >
        <sl-button sl-dialog-close size="sm">x</sl-button>
        <slot name="header">
          <slot name="title"></slot>
        </slot>
        <slot name="body">
          <slot></slot>
        </slot>
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
    console.log('onClose in drawer');
    // Reenable scrolling after the dialog has closed
    document.documentElement.style.overflow = '';

    this.inert = true;
  }
}
