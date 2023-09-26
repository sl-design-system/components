import type { TemplateResult } from 'lit-html';
import type { CSSResultGroup } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import type { ButtonBarAlign } from '@sl-design-system/button-bar';
import { ButtonBar } from '@sl-design-system/button-bar';
import { Icon } from '@sl-design-system/icon';
import { Button } from '@sl-design-system/button';
import { breakpoints } from '@sl-design-system/shared';
import { LitElement, html, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import styles from './dialog.scss.js';

export type DialogSize = 'sm' | 'md' | 'lg'; // TODO: also xs?

/**
 * A dialog component for displaying modal UI.
 *
 * @slot action - Area where action buttons are placed
 * @slot default - Body content for the dialog
 * @slot footer - Footer content for the dialog
 * @slot header - Header content for the dialog
 * @slot title - The title of the dialog
 * @slot subtitle - The subtitle of the dialog
 */
export class Dialog extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-button-bar': ButtonBar,
      'sl-icon': Icon
    };
  }

  /** @private */
  static override styles: CSSResultGroup = [breakpoints, styles];

  @query('dialog') dialog?: HTMLDialogElement;

  /** The size of the dialog
   * @type {'sm' | 'md' | 'lg'} */ // TODO: also xs size?
  @property({ reflect: true }) size?: DialogSize = 'md';

  /** Disables the ability to close the dialog using the Escape key. */
  @property({ type: Boolean, attribute: 'disable-close' }) disableClose = false;

  /** Determines whether closing button should be shown in the top right corner. */
  @property({ type: Boolean, attribute: 'closing-button' }) closingButton?: boolean;

  /** The ARIA role of the dialog. */
  @property() override role: 'dialog' | 'alertdialog' = 'dialog';

  @property({ reflect: true }) buttonsAlign: ButtonBarAlign = 'end';

  override connectedCallback(): void {
    super.connectedCallback();

    this.inert = true;

    this.dialog?.setAttribute('closing', 'false');

    console.log('computed style', window.getComputedStyle(this).getPropertyValue('--sl-body-surface-overlay'));
  }

  // TODO: option with no close button

  // TODO: add aria

  override render(): TemplateResult {
    return html`
      <dialog
        @cancel=${this.#onCancel}
        @click=${this.#onClick}
        @close=${this.#onClose}
        .role=${this.role}
        part="dialog"
      >
        <!--<sl-button-bar align="end"><sl-button fill="outline" size="md" sl-dialog-close>Close</sl-button></sl-button-bar>-->
        <slot name="header">
          <slot name="titles">
            <slot name="subtitle"></slot>
            <slot name="title"></slot>
          </slot>
          <slot name="close" @click=${this.#onCloseClick}>
            <!--            <sl-button fill="ghost" variant="default">
              <sl-icon name="xmark"></sl-icon>
            </sl-button>-->
            ${this.closingButton
              ? html`<sl-button fill="ghost" variant="default">
                  <sl-icon name="xmark"></sl-icon>
                </sl-button>`
              : nothing}
          </slot>
        </slot>
        <!--<sl-button fill="outline" size="md">Close</sl-button>-->
        <slot name="body">
          <slot></slot>
        </slot>
        <slot name="footer">
          <sl-button-bar class="footer-buttons" .align=${this.buttonsAlign}><slot name="action"></slot></sl-button-bar>
        </slot>
      </dialog>
    `;
  }

  showModal(): void {
    this.inert = false;
    this.dialog?.showModal();

    // Disable scrolling while the dialog is open
    document.documentElement.style.overflow = 'hidden';

    this.dialog?.setAttribute('closing', 'false');

    console.log('computed style', window.getComputedStyle(this).getPropertyValue('--sl-body-surface-overlay')); // this one works?

    // document.documentElement.style.background = window.getComputedStyle(this).getPropertyValue('--sl-body-surface-overlay');
    //(this.dialog as HTMLElement).style.background = window.getComputedStyle(this).getPropertyValue('--sl-body-surface-overlay');
    (this.dialog as HTMLElement).style.setProperty(
      '--backdrop-background',
      window.getComputedStyle(this).getPropertyValue('--sl-body-surface-overlay')
    );
    (this.dialog as HTMLElement).style.setProperty('--backdrop-background', '#A4CDFF');
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

  #onCloseClick(event: PointerEvent & { target: HTMLElement }): void {
    event.preventDefault();
    event.stopPropagation();
    this.dialog?.setAttribute('closing', 'true');
    this.dialog?.close(event.target.getAttribute('sl-dialog-close') || '');
  }

  #onClick(event: PointerEvent & { target: HTMLElement }): void {
    // event.preventDefault();
    console.log('111 onclick event target', event.target, event.target.matches('sl-button[sl-dialog-close]'));

    if (event.target.matches('sl-button[sl-dialog-close]')) {
      console.log('onclick event target', event.target, event.target.matches('sl-button[sl-dialog-close]'));
      this.dialog?.setAttribute('closing', 'true');
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
        this.dialog?.setAttribute('closing', 'true');
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
