import type { TemplateResult } from 'lit-html';
import type { CSSResult, CSSResultGroup } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import type { ButtonBarAlign } from '@sl-design-system/button-bar';
import { ButtonBar } from '@sl-design-system/button-bar';
import { Icon } from '@sl-design-system/icon';
import { Button } from '@sl-design-system/button';
import { breakpoints } from '@sl-design-system/shared';
import { LitElement, adoptStyles, html, nothing, unsafeCSS } from 'lit';
import { property, query } from 'lit/decorators.js';
import styles from './dialog.scss.js';

/**
 * A dialog component for displaying modal UI.
 *
 * @slot action - Area where action buttons are placed
 * @slot default - Body content for the dialog
 * @slot footer - Footer content for the dialog
 * @slot header - Header content for the dialog
 * @slot close - Closing button (placed in header) for the dialog
 * @slot header-buttons - More space for buttons for the dialog's header
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

  /** @private */
  @query('dialog') dialog?: HTMLDialogElement;

  /** Disables the ability to close the dialog using the Escape key. */
  @property({ type: Boolean, attribute: 'disable-close' }) disableClose = false;

  /** Determines whether closing button (default one) should be shown in the top right corner. */
  @property({ type: Boolean, attribute: 'closing-button' }) closingButton?: boolean;

  /** The ARIA role of the dialog. */
  @property() override role: 'dialog' | 'alertdialog' = 'dialog';

  /** Alignment of the action buttons in the dialog footer
   * @type {'start' | 'end'} */
  @property({ reflect: true, attribute: 'buttons-align' }) buttonsAlign: Extract<ButtonBarAlign, 'start' | 'end'> =
    'end';

  override connectedCallback(): void {
    super.connectedCallback();

    this.inert = true;

    this.dialog?.setAttribute('closing', 'false');
  }

  override disconnectedCallback(): void {
    this.dialog?.removeEventListener('animationend', this.#handleAnimationEnd);

    super.disconnectedCallback();
  }

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
        <slot name="header">
          <slot name="titles">
            <slot name="subtitle"></slot>
            <slot name="title"></slot>
          </slot>
          <slot name="header-actions">
            <slot name="header-buttons"></slot>
            ${this.closingButton
              ? html`<slot name="close" @click=${this.#onCloseClick}>
                  <sl-button fill="ghost" variant="default">
                    <sl-icon name="xmark"></sl-icon>
                  </sl-button>
                </slot>`
              : nothing}
          </slot>
        </slot>
        <slot name="body">
          <div class="body-wrapper">
            <slot></slot>
          </div>
        </slot>
        <slot name="footer">
          <sl-button-bar class="footer-buttons" align=${this.buttonsAlign}><slot name="action"></slot></sl-button-bar>
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

    const backdrop: CSSResult = unsafeCSS(
      `::backdrop {
        background-color: ${window.getComputedStyle(document.body).getPropertyValue('--sl-body-surface-overlay')};
        transition: opacity 0.5s ease-in-out, background 0.5s ease-in-out;
      }
    `
    );

    if (this.shadowRoot) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      adoptStyles(this.shadowRoot, [breakpoints, styles, backdrop]);
    }
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

  #handleAnimationEnd = (): void => {
    this.dialog?.setAttribute('closing', 'false');
    this.dialog?.close();
    this.dialog?.removeEventListener('animationend', this.#handleAnimationEnd);
  };

  #onCloseClick(event: PointerEvent & { target: HTMLElement }): void {
    event.preventDefault();
    event.stopPropagation();
    this.dialog?.addEventListener('animationend', this.#handleAnimationEnd);

    requestAnimationFrame(() => {
      this.dialog?.setAttribute('closing', 'true');
    });
  }

  #onClick(event: PointerEvent & { target: HTMLElement }): void {
    if (event.target.matches('sl-button[sl-dialog-close]')) {
      requestAnimationFrame(() => {
        this.dialog?.setAttribute('closing', 'true');
      });

      this.dialog?.addEventListener('animationend', this.#handleAnimationEnd);

      this.dialog?.close(event.target.getAttribute('sl-dialog-close') || '');

      this.dialog?.removeEventListener('animationend', this.#handleAnimationEnd);
    } else if (!this.disableClose && this.dialog) {
      const rect = this.dialog.getBoundingClientRect();

      // Check if the user clicked on the backdrop
      if (
        event.clientY < rect.top ||
        event.clientY > rect.bottom ||
        event.clientX < rect.left ||
        event.clientX > rect.right
      ) {
        requestAnimationFrame(() => {
          this.dialog?.setAttribute('closing', 'true');
        });

        this.dialog?.addEventListener('animationend', this.#handleAnimationEnd);

        this.dialog.close();

        this.dialog?.removeEventListener('animationend', this.#handleAnimationEnd);
      }
    }
  }

  // TODO; function for animation closing event

  #onClose(): void {
    // Reenable scrolling after the dialog has closed
    document.documentElement.style.overflow = '';

    this.inert = true;
  }
}
