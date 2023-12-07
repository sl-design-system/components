import type { TemplateResult } from 'lit-html';
import type { CSSResultGroup } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { Icon } from '@sl-design-system/icon';
import { Button } from '@sl-design-system/button';
import type { EventEmitter } from '@sl-design-system/shared';
import { breakpoints, event } from '@sl-design-system/shared';
import { LitElement, html, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import styles from './inline-message.scss.js';

export type InlineMessageStatus = 'info' | 'success' | 'warning' | 'danger';

const iconName = (status: InlineMessageStatus): string => {
  switch (status) {
    case 'info':
      return 'info';
    case 'success':
      return 'circle-check-solid';
    case 'warning':
      return 'triangle-exclamation-solid';
    case 'danger':
      return 'triangle-exclamation-solid';
    default:
      return 'info';
  }
};

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
  // TODO: extends lit element or scoped???
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

  /** Emits when the inline message is closing. */
  @event({ name: 'sl-close' }) closeEvent!: EventEmitter<void>;

  /** @private */
  @query('div') wrapper?: HTMLDivElement;

  /** Determines whether closing button (default one) should be shown in the top right corner. */
  @property({ type: Boolean, attribute: 'closing-button' }) closingButton = true; // TODO: or dismissable?

  /** Determines whether the icon should be shown on the left side of the component. */
  @property({ type: Boolean, attribute: 'no-icon' }) noIcon?: boolean;

  // /** The ARIA role of the dialog. */
  // @property() override role: 'dialog' | 'alertdialog' = 'dialog';

  /** The status of the inline message.
   * @type {'info' | 'success' | 'warning' | 'danger'} */
  @property({ reflect: true }) status: InlineMessageStatus = 'info';

  // /** Determines whether closing button (default one) should be shown in the top right corner. */
  // @property({ type: Boolean, reflect: true }) open?: boolean;

  constructor() {
    super();

    requestAnimationFrame(() => {
      this.setAttribute('open', '');
    });
    // this.setAttribute('open', '');
  }

  override connectedCallback(): void {
    super.connectedCallback();

    // this.inert = true;
  }

  override render(): TemplateResult {
    return html`
      <div class="inline-message-wrapper" open>
        <div class="content">
          ${this.noIcon
            ? nothing
            : html`
                <slot name="icon" part="icon">
                  <sl-icon name=${iconName(this.status)} size="md"></sl-icon>
                </slot>
              `}
          <!--<slot name="icon" part="icon">
            <sl-icon name=${iconName(this.status)} size="md"></sl-icon>
          </slot>-->
          <!--        <slot name="icon" part="icon"></slot>-->
          <div class="content-details">
            <slot name="title" part="title" aria-live="polite">
              <slot></slot>
            </slot>
            <slot name="description" part="description"> </slot>
            <slot name="details" part="details"> </slot>
          </div>
        </div>
        ${this.closingButton
          ? html`
              <slot name="close-button" @click=${this.onClose}>
                <sl-button fill="ghost" variant="default" size="sm" aria-label="close the inline message">
                  <sl-icon name="xmark"></sl-icon>
                </sl-button>
              </slot>
            `
          : nothing}
      </div>
    `;
  } // TODO: aria label with translation (${msg('optional')})

  //   #renderIcon(status): string  {
  //     switch
  // }

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
  //TODO: show method
  onClose(/*event: PointerEvent & { target: HTMLElement }*/): void {
    //console.log('event on click', event);
    // event.preventDefault();
    // event.stopPropagation();

    const wrapper = this.querySelector<HTMLDivElement>('.inline-message-wrapper');
    console.log('wrapper', wrapper, this.wrapper);

    // this.wrapper?.removeAttribute('open');
    //
    // this.wrapper?.setAttribute('close', '');
    //
    // requestAnimationFrame(() => {
    //   this.remove();
    // });

    // this.wrapper?.removeAttribute('close');

    //this.closeEvent.emit();

    this.wrapper?.removeAttribute('open');

    this.#closeOnAnimationend();

    // this.remove();
    // this.emit('sl-removed');
    // TODO: append to add/show?

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

  #closeOnAnimationend(): void {
    console.log('closeOnAnimationend', this.wrapper);
    this.wrapper?.addEventListener(
      'animationend',
      () => {
        this.wrapper?.removeAttribute('open');

        this.remove(); // TODO: emit sl-close event or sth similar?
      },
      { once: true }
    );

    requestAnimationFrame(() => {
      this.wrapper?.setAttribute('close', '');
    });
  }
}
