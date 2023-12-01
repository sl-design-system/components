import type { TemplateResult } from 'lit-html';
import type { CSSResultGroup } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { Icon } from '@sl-design-system/icon';
import { Button } from '@sl-design-system/button';
import { breakpoints } from '@sl-design-system/shared';
import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './inline-message.scss.js';

export type InlineMessageStatus = 'info' | 'success' | 'warning' | 'danger';

/**
 * A dialog component for displaying modal UI.
 *
 * @slot default - Title content for the inline message
 * @slot description - slot for additional information and more content for the inline-message
 * TODO: add more info
 *
 * @slot actions - Area where action buttons are placed
 * @slot default - Body content for the dialog
 * @slot footer - Footer content for the dialog
 * @slot header - Header content for the dialog
 * @slot close-button - Closing button (placed in header) for the dialog
 * @slot header-buttons - More space for buttons for the dialog's header
 * @slot title - The title of the dialog
 * @slot subtitle - The subtitle of the dialog
 */
export class InlineMessage extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon
    };
  }

  /** @private */
  static override styles: CSSResultGroup = [breakpoints, styles];

  // /** @private */
  // @query('dialog') dialog?: HTMLDialogElement;

  // /** Disables the ability to close the dialog using the Escape key. */
  // @property({ type: Boolean, attribute: 'disable-close' }) disableClose = false;

  /** Determines whether closing button (default one) should be shown in the top right corner. */
  @property({ type: Boolean, attribute: 'closing-button' }) closingButton = true;

  /** The ARIA role of the dialog. */
  @property() override role: 'dialog' | 'alertdialog' = 'dialog';

  /** The status of the inline message.
   * @type {'info' | 'success' | 'warning' | 'danger'} */
  @property({ reflect: true }) status: InlineMessageStatus = 'info';

  override connectedCallback(): void {
    super.connectedCallback();

    this.inert = true;
  }

  override render(): TemplateResult {
    return html`
      <div class="inline-message-wrapper">
        <!--        <slot>icon</slot>-->
        <slot name="icon" part="icon">
          <sl-icon name="triangle-exclamation-solid" size="md"></sl-icon>
        </slot>
        <slot>message</slot>
        <!--        <slot name="icon" part="icon"></slot>-->
        ${this.closingButton
          ? html`
              <slot name="close-button" @click=${this.#onCloseClick}>
                <sl-button fill="ghost" variant="default">
                  <sl-icon name="xmark"></sl-icon>
                </sl-button>
              </slot>
            `
          : nothing}
        <slot part="message"></slot>
        <slot name="title" part="title" aria-live="polite">
          <slot></slot>
        </slot>
        <slot name="description" part="description"> </slot>
      </div>
    `;
  }

  // showModal(): void {
  //   this.inert = false;
  //   this.dialog?.showModal();
  //
  //   // Disable scrolling while the dialog is open
  //   document.documentElement.style.overflow = 'hidden';
  //
  //   /** Workaround for the backdrop background,
  //    *  the backdrop doesn't inherit from the :root, so we cannot use tokens for the background-color,
  //    *  needs to be removed in the future,
  //    * the bug should be fixed: https://drafts.csswg.org/css-position-4/#backdrop */
  //   const backdrop: CSSResult = unsafeCSS(
  //     `::backdrop {
  //       background-color: ${window.getComputedStyle(document.body).getPropertyValue('--sl-body-surface-overlay')};
  //     }
  //   `
  //   );
  //
  //   if (this.shadowRoot) {
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  //     adoptStyles(this.shadowRoot, [breakpoints, styles, backdrop]);
  //   }
  // }
  //
  // close(): void {
  //   if (this.dialog?.open) {
  //     this.dialog?.close();
  //   }
  // }
  //
  // #onCancel(event: Event): void {
  //   if (this.disableClose) {
  //     event.preventDefault();
  //   }
  // }
  //
  #onCloseClick(event: PointerEvent & { target: HTMLElement }): void {
    event.preventDefault();
    event.stopPropagation();

    this.remove();

    // this.#closeDialogOnAnimationend(event.target as HTMLElement);

    // TODO: emit sl-close
  }
  //
  // #onClick(event: PointerEvent & { target: HTMLElement }): void {
  //   if (event.target && this.dialog) {
  //     const rect = this.dialog.getBoundingClientRect();
  //     // Check if the user clicked on the sl-dialog-close button or on the backdrop
  //     if (
  //       event.target.matches('sl-button[sl-dialog-close]') ||
  //       (!this.disableClose &&
  //         (event.clientY < rect.top ||
  //           event.clientY > rect.bottom ||
  //           event.clientX < rect.left ||
  //           event.clientX > rect.right))
  //     ) {
  //       this.#closeDialogOnAnimationend(event.target as HTMLElement);
  //     }
  //   }
  // }
  //
  // #onKeydown(event: KeyboardEvent): void {
  //   if (event.code === 'Escape' && !this.disableClose) {
  //     this.#closeDialogOnAnimationend(event.target as HTMLElement);
  //   }
  // }
  //
  // #closeDialogOnAnimationend(target: HTMLElement): void {
  //   this.dialog?.addEventListener(
  //     'animationend',
  //     () => {
  //       this.dialog?.removeAttribute('closing');
  //
  //       if (target?.matches('sl-button[sl-dialog-close]')) {
  //         this.dialog?.close(target?.getAttribute('sl-dialog-close') || '');
  //       } else {
  //         this.dialog?.close();
  //       }
  //     },
  //     { once: true }
  //   );
  //
  //   requestAnimationFrame(() => {
  //     this.dialog?.setAttribute('closing', '');
  //   });
  // }
  //
  // #onClose(): void {
  //   // Reenable scrolling after the dialog has closed
  //   document.documentElement.style.overflow = '';
  //
  //   this.inert = true;
  // }
}
