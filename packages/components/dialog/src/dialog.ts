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
   * @type {'end' | 'space-between'} */
  @property({ reflect: true }) align: Extract<ButtonBarAlign, 'end' | 'space-between'> = 'end';

  /** When set to true, the button order in the dialog footer is reversed using flex-direction.*/
  @property({ type: Boolean, reflect: true }) reverse = false;

  override connectedCallback(): void {
    super.connectedCallback();

    this.inert = true;

    this.dialog?.setAttribute('closing', 'false');
  }

  override disconnectedCallback(): void {
    this.dialog?.removeEventListener('animationend', event => this.#onAnimationEnd(event));

    super.disconnectedCallback();
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
          <slot name="titles">
            <slot name="subtitle"></slot>
            <slot name="title" id="title"></slot>
          </slot>
          <slot name="header-actions">
            <slot name="header-buttons"></slot>
            ${this.closingButton
              ? html`
                  <slot name="close" @click=${this.#onCloseClick}>
                    <sl-button fill="ghost" variant="default">
                      <sl-icon name="xmark"></sl-icon>
                    </sl-button>
                  </slot>
                `
              : nothing}
          </slot>
        </slot>
        <slot name="body">
          <div class="body-wrapper">
            <slot></slot>
          </div>
        </slot>
        <slot name="footer">
          <sl-button-bar align=${this.align} .reverse=${this.reverse}>
            <slot name="cancel"></slot>
            <slot name="action"></slot>
          </sl-button-bar>
        </slot>
      </dialog>
    `;
  }
  // <sl-button-bar class="footer-buttons" align=${this.buttonsAlign}><slot name="action"></slot></sl-button-bar>

  showModal(): void {
    this.inert = false;
    this.dialog?.showModal();

    // Disable scrolling while the dialog is open
    document.documentElement.style.overflow = 'hidden';

    this.dialog?.setAttribute('closing', 'false');

    /** Workaround for the backdrop background */
    const backdrop: CSSResult = unsafeCSS(
      `::backdrop {
        background-color: ${window.getComputedStyle(document.body).getPropertyValue('--sl-body-surface-overlay')};
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

  #onAnimationEnd = (event: AnimationEvent, target?: HTMLElement): void => {
    if (event.animationName === 'backdrop-hide') {
      this.dialog?.setAttribute('closing', 'false');

      if (target?.matches('sl-button[sl-dialog-close]')) {
        this.dialog?.close(target?.getAttribute('sl-dialog-close') || '');
      } else {
        this.dialog?.close();
      }
      this.dialog?.removeEventListener('animationend', event => this.#onAnimationEnd(event, target));
    }
  };

  #onCloseClick(event: PointerEvent & { target: HTMLElement }): void {
    event.preventDefault();
    event.stopPropagation();

    this.#closeDialogOnAnimationend(event.target as HTMLElement);
  }

  #onClick(event: PointerEvent & { target: HTMLElement }): void {
    if (event.target && this.dialog) {
      const rect = this.dialog.getBoundingClientRect();
      // Check if the user clicked on the sl-dialog-close button or on the backdrop
      if (
        event.target.matches('sl-button[sl-dialog-close]') ||
        (!this.disableClose &&
          (event.clientY < rect.top ||
            event.clientY > rect.bottom ||
            event.clientX < rect.left ||
            event.clientX > rect.right))
      ) {
        this.#closeDialogOnAnimationend(event.target as HTMLElement);
      }
    }
  }

  #onKeydown(event: KeyboardEvent): void {
    if (event.code === 'Escape' && !this.disableClose) {
      this.#closeDialogOnAnimationend(event.target as HTMLElement);
    }
  }

  #closeDialogOnAnimationend(target: HTMLElement): void {
    this.dialog?.addEventListener('animationend', event => this.#onAnimationEnd(event, target));

    requestAnimationFrame(() => {
      this.dialog?.setAttribute('closing', 'true');
    });
  }

  #onClose(): void {
    // Reenable scrolling after the dialog has closed
    document.documentElement.style.overflow = '';

    this.inert = true;
  }
}
