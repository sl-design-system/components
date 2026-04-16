import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button, type ButtonSize } from '@sl-design-system/button';
import { ButtonBar } from '@sl-design-system/button-bar';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type SlCancelEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property, query } from 'lit/decorators.js';
import styles from './drawer.scss.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-close': SlCloseEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-drawer': Drawer;
  }
}

export type SlCloseEvent = CustomEvent<void>;

export type DrawerAttachment = 'right' | 'left' | 'top' | 'bottom';

/**
 * A drawer component for displaying UI at the side of the screen.
 *
 * @customElement sl-drawer
 *
 * @csspart dialog - The dialog element
 * @csspart header - The drawer header
 * @csspart body - The body of the drawer
 * @cssprop --sl-drawer-inline-size - The inline size of the drawer when attached to the left or right
 * @cssprop --sl-drawer-block-size - The block size of the drawer when attached to the top or bottom
 * @slot default - Body content for the drawer
 * @slot header - Header content; overrides the default header layout
 * @slot title - The title of the drawer
 * @slot actions - Additional actions rendered next to the close button
 */
export class Drawer extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-button-bar': ButtonBar,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;


  /** The side of the screen the drawer is attached to. */
  @property({ reflect: true }) attachment: DrawerAttachment = 'right';

  /**
   * @internal Emits when the drawer has been cancelled. This happens when the
   * user presses Escape or clicks on the backdrop.
   */
  @event({ name: 'sl-cancel' }) cancelEvent!: EventEmitter<SlCancelEvent>;

  /** @internal Emits when the drawer has been closed. */
  @event({ name: 'sl-close' }) closeEvent!: EventEmitter<SlCloseEvent>;

  /** The size of the close button. */
  @property({ attribute: 'close-button-size' }) closeButtonSize: ButtonSize = 'sm';

  /** @internal */
  @query('dialog') dialog?: HTMLDialogElement;

  /**
   * Disables the ability to cancel the drawer by pressing the Escape key or
   * clicking on the backdrop.
   * @default false
   */
  @property({ type: Boolean, attribute: 'disable-close' }) disableClose = false;

  override connectedCallback(): void {
    super.connectedCallback();

    this.inert = true;
  }

  override disconnectedCallback(): void {
    if (this.dialog?.open) {
      document.documentElement.style.overflow = '';
    }

    super.disconnectedCallback();
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
        <div part="header">
          <slot name="header">
            <slot name="title" id="title"></slot>
            <sl-button-bar>
              <slot name="actions"></slot>
              <sl-button
                @click=${this.#onCloseClick}
                .size=${this.closeButtonSize}
                aria-label="Close"
                class="sl-close"
                fill="ghost"
                variant="default"
              >
                <sl-icon name="xmark"></sl-icon>
              </sl-button>
            </sl-button-bar>
          </slot>
        </div>
        <div part="body">
          <slot></slot>
        </div>
      </dialog>
    `;
  }

  /** Show the drawer as a modal, in the top layer, with a backdrop. */
  showModal(): void {
    if (this.dialog?.open) {
      return;
    }

    this.inert = false;
    this.dialog?.showModal();

    // Disable scrolling while the drawer is open
    document.documentElement.style.overflow = 'hidden';
  }

  /** Show the drawer without a backdrop (non-modal). */
  show(): void {
    if (this.dialog?.open) {
      return;
    }

    this.inert = false;
    this.dialog?.show();
  }

  /**
   * Close the drawer.
   * @param returnValue - Optional value to set as the dialog's return value.
   */
  close(returnValue?: string): void {
    if (this.dialog?.open) {
      this.dialog.close(returnValue);
    }
  }

  #onCancel(event: Event): void {
    if (this.disableClose) {
      event.preventDefault();
      return;
    }

    this.cancelEvent.emit();
  }

  #onClick(event: PointerEvent): void {
    const button = event.composedPath().find((el): el is Button => el instanceof Button);

    if (button?.hasAttribute('sl-dialog-close')) {
      this.close(button.getAttribute('sl-dialog-close') || undefined);
      return;
    }

    if (this.disableClose || !this.dialog) {
      return;
    }

    // Only react to clicks that originate from the dialog itself (the backdrop).
    if (event.composedPath()[0] !== this.dialog) {
      return;
    }

    const rect = this.dialog.getBoundingClientRect();

    // Check if the user clicked on the backdrop
    if (
      event.clientY < rect.top ||
      event.clientY > rect.bottom ||
      event.clientX < rect.left ||
      event.clientX > rect.right
    ) {
      event.preventDefault();
      event.stopPropagation();

      this.cancelEvent.emit();
      this.close();
    }
  }

  #onCloseClick(event: PointerEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.close();
  }

  #onClose(): void {
    // Reenable scrolling after the dialog has closed
    document.documentElement.style.overflow = '';

    this.inert = true;

    this.closeEvent.emit();
  }

}
