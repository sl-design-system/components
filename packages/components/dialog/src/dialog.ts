import type { TemplateResult } from 'lit-html';
import type { CSSResult, CSSResultGroup } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { localized, msg } from '@lit/localize';
import { ButtonBar } from '@sl-design-system/button-bar';
import { Icon } from '@sl-design-system/icon';
import { Button } from '@sl-design-system/button';
import { type EventEmitter, breakpoints, event } from '@sl-design-system/shared';
import { LitElement, adoptStyles, html, nothing, unsafeCSS } from 'lit';
import { property, query } from 'lit/decorators.js';
import styles from './dialog.scss.js';

/**
 * A dialog component for displaying modal UI.
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

@localized()
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

  /** @private */
  @query('dialog') dialog?: HTMLDialogElement;

  /**
   * Emits when the cancel has been cancelled. This happens when the user closes
   * the dialog using the escape key or clicks on the backdrop.
   */
  @event({ name: 'sl-cancel' }) cancelEvent!: EventEmitter<void>;

  /** Emits when the dialog has been closed. */
  @event({ name: 'sl-close' }) closeEvent!: EventEmitter<void>;

  /** Determines whether a close button should be shown in the top right corner. */
  @property({ type: Boolean, attribute: 'close-button' }) closeButton?: boolean;

  /**
   * Disables the ability to cancel the dialog by pressing the Escape key
   * or clicking on the backdrop.
   */
  @property({ type: Boolean, attribute: 'disable-cancel' }) disableCancel?: boolean;

  /** The ARIA role of the dialog. */
  @property() override role: 'dialog' | 'alertdialog' = 'dialog';

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
        @keydown=${this.#onKeydown}
        .role=${this.role}
        aria-labelledby="title"
        part="dialog"
      >
        <slot name="header">
          <div class="titles" part="titles">
            <slot name="title" id="title"></slot>
            <slot name="subtitle"></slot>
          </div>
          <slot name="header-actions">
            <slot name="header-buttons"></slot>
            ${this.closeButton
              ? html`
                  <slot name="close-button" @click=${this.#onCloseClick}>
                    <sl-button fill="ghost" variant="default" aria-label=${msg('Close')}>
                      <sl-icon name="xmark"></sl-icon>
                    </sl-button>
                  </slot>
                `
              : nothing}
          </slot>
        </slot>
        <slot name="body">
          <div class="body-content" part="body-content">
            <slot></slot>
          </div>
        </slot>
        <slot name="footer">
          <sl-button-bar>
            <slot name="actions"></slot>
          </sl-button-bar>
        </slot>
      </dialog>
    `;
  }

  showModal(): void {
    if (this.dialog?.open) {
      return;
    }

    this.inert = false;
    this.dialog?.showModal();

    // Disable scrolling while the dialog is open
    document.documentElement.style.overflow = 'hidden';

    /**
     * Workaround for the backdrop background: the backdrop doesn't inherit
     * from the :root, so we cannot use tokens for the background-color.
     * This needs to be removed in the future when the bug has been fixed:
     * https://drafts.csswg.org/css-position-4/#backdrop
     */
    const backdrop: CSSResult = unsafeCSS(
      `::backdrop {
        background-color: ${getComputedStyle(document.body).getPropertyValue('--sl-body-surface-overlay')};
      }
    `
    );

    adoptStyles(this.shadowRoot!, [breakpoints, styles, backdrop]);
  }

  close(): void {
    if (this.dialog?.open) {
      this.#closeDialogOnAnimationend();
    }
  }

  #onCancel(event: Event): void {
    if (this.disableCancel) {
      event.preventDefault();
    } else {
      this.cancelEvent.emit();
    }
  }

  #onClick(event: PointerEvent & { target: HTMLElement }): void {
    const rect = this.dialog!.getBoundingClientRect();

    // Check if the user clicked on the sl-dialog-close button or on the backdrop
    if (
      event.target.matches('sl-button[sl-dialog-close]') ||
      (!this.disableCancel &&
        (event.clientY < rect.top ||
          event.clientY > rect.bottom ||
          event.clientX < rect.left ||
          event.clientX > rect.right))
    ) {
      this.#closeDialogOnAnimationend(event.target, true);
    }
  }

  #onClose(): void {
    // Reenable scrolling after the dialog has closed
    document.documentElement.style.overflow = '';

    this.inert = true;
    this.closeEvent.emit();
  }

  #onCloseClick(event: PointerEvent & { target: HTMLElement }): void {
    event.preventDefault();
    event.stopPropagation();

    this.#closeDialogOnAnimationend(event.target as HTMLElement);
  }

  #onKeydown(event: KeyboardEvent & { target: HTMLElement }): void {
    if (event.code === 'Escape' && this.dialog?.open && !this.disableCancel) {
      this.#closeDialogOnAnimationend(event.target, true);
    }
  }

  #closeDialogOnAnimationend(target?: HTMLElement, emitCancelEvent = false): void {
    this.dialog?.addEventListener(
      'animationend',
      () => {
        this.dialog?.removeAttribute('closing');

        if (emitCancelEvent) {
          this.cancelEvent.emit();
        }

        if (target?.matches('sl-button[sl-dialog-close]')) {
          this.dialog?.close(target?.getAttribute('sl-dialog-close') || '');
        } else {
          this.dialog?.close();
        }
      },
      { once: true }
    );

    /**
     * Set the closing attribute, this triggers the closing animation.
     *
     * FIXME: We can replace this using `@starting-style` once this is available in all
     * browsers. See https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style
     */
    requestAnimationFrame(() => this.dialog?.setAttribute('closing', ''));
  }
}
