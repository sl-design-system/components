import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { ButtonBar } from '@sl-design-system/button-bar';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, breakpoints, event } from '@sl-design-system/shared';
import { FocusTrap, createFocusTrap } from 'focus-trap';
import {
  type CSSResult,
  type CSSResultGroup,
  LitElement,
  type TemplateResult,
  adoptStyles,
  html,
  nothing,
  unsafeCSS
} from 'lit';
import { property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './dialog.scss.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-cancel': SlCancelEvent;
    'sl-close': SlCloseEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-dialog': Dialog;
  }
}

export type SlCancelEvent = CustomEvent<void>;
export type SlCloseEvent = CustomEvent<void>;

/**
 * A dialog component for displaying modal UI.
 *
 * @csspart dialog - The dialog element
 * @csspart header - The dialog header
 * @csspart titles - The container of the title and subtitle
 * @csspart header-bar - The button bar in the header
 * @csspart body - The body of the dialog
 * @csspart footer - The dialog footer
 * @csspart footer-bar - The button bar in the footer
 * @cssprop --sl-dialog-max-inline-size - The maximum width of the dialog
 * @slot actions - Area where action buttons are placed
 * @slot default - Body content for the dialog
 * @slot footer - Footer content for the dialog
 * @slot header - Header content for the dialog
 * @slot header-buttons - More space for buttons for the dialog's header
 * @slot title - The title of the dialog
 * @slot subtitle - The subtitle of the dialog
 */
@localized()
export class Dialog extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-button-bar': ButtonBar,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = [breakpoints, styles];

  #focusTrap?: FocusTrap;

  /**
   * Emits when the dialog has been cancelled. This happens when the user closes
   * the dialog using the escape key or clicks on the backdrop.
   * @internal
   */
  @event({ name: 'sl-cancel' }) cancelEvent!: EventEmitter<SlCancelEvent>;

  /** Determines whether a close button should be shown in the top right corner. */
  @property({ type: Boolean, attribute: 'close-button' }) closeButton?: boolean;

  /** @internal Emits when the dialog has been closed. */
  @event({ name: 'sl-close' }) closeEvent!: EventEmitter<SlCloseEvent>;

  /** @internal */
  @query('dialog') dialog?: HTMLDialogElement;

  /** The role for the dialog element. */
  @property({ attribute: 'dialog-role' }) dialogRole: 'dialog' | 'alertdialog' = 'dialog';

  /**
   * Disables the ability to cancel the dialog by pressing the Escape key
   * or clicking on the backdrop.
   */
  @property({ type: Boolean, attribute: 'disable-cancel' }) disableCancel?: boolean;

  override connectedCallback(): void {
    super.connectedCallback();

    this.inert = true;
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.#deactivateFocusTrap();
  }

  override render(): TemplateResult {
    return html`
      <dialog
        @cancel=${this.#onCancel}
        @click=${this.#onClick}
        @close=${this.#onClose}
        @keydown=${this.#onKeydown}
        aria-labelledby="title"
        role=${ifDefined(this.dialogRole === 'dialog' ? undefined : this.dialogRole)}
        part="dialog"
      >
        <div part="header">${this.renderHeader()}</div>
        <div part="body">${this.renderBody()}</div>
        <div part="footer">${this.renderFooter()}</div>
      </dialog>
    `;
  }

  /**
   * Override this method to customize the header of the dialog. If you only
   * want to customize the title, you can use the `title` and `subtitle` arguments
   * and call `super.renderHeader('My title', 'My subtitle')` to render the default
   * header.
   *
   * Beware when customizing the header: the `<dialog>` element is labelled by
   * the element with ID `title`. If you override this method, make sure to include
   * an element with ID `title` in the header.
   *
   * Only use this when extending the `Dialog` class. If you are using
   * the `<sl-dialog>` custom element, use the slots.
   */
  renderHeader(title = '', subtitle = ''): TemplateResult {
    return html`
      <slot name="header">
        <div part="titles">
          <slot name="title" id="title">${title}</slot>
          <slot name="subtitle">${subtitle}</slot>
        </div>
        <slot name="header-actions">
          <sl-button-bar part="header-bar">
            <slot name="header-buttons"></slot>
            ${this.closeButton
              ? html`
                  <sl-button @click=${this.#onCloseClick} fill="ghost" variant="default" aria-label=${msg('Close')}>
                    <sl-icon name="xmark"></sl-icon>
                  </sl-button>
                `
              : nothing}
          </sl-button-bar>
        </slot>
      </slot>
    `;
  }

  /**
   * Override this method to customize the body of the dialog.
   *
   * Only use this when extending the `Dialog` class. If you are using
   * the `<sl-dialog>` custom element, use the slots.
   */
  renderBody(): TemplateResult {
    return html`<slot></slot>`;
  }

  /**
   * Override this method to customize the footer of the dialog. If you only
   * want to add action buttons, see the `renderActions` method.
   *
   * Only use this when extending the `Dialog` class. If you are using
   * the `<sl-dialog>` custom element, use the slots.
   */
  renderFooter(): TemplateResult {
    return html`
      <slot name="footer">
        <sl-button-bar part="footer-bar"><slot name="actions">${this.renderActions()}</slot></sl-button-bar>
      </slot>
    `;
  }

  /**
   * Override this method to customize the actions in the footer of the dialog.
   *
   * Only use this when extending the `Dialog` class. If you are using
   * the `<sl-dialog>` custom element, use the slots.
   */
  renderActions(): TemplateResult | typeof nothing {
    return nothing;
  }

  /** Show the dialog as a modal, in the top layer, with a backdrop. */
  showModal(): void {
    if (this.dialog?.open) {
      return;
    }

    /**
     * Workaround for the backdrop background: the backdrop doesn't inherit
     * from the :root, so we cannot use tokens for the background-color.
     * This needs to be removed in the future when the bug has been fixed:
     * https://drafts.csswg.org/css-position-4/#backdrop
     */
    const backdrop: CSSResult = unsafeCSS(
      `::backdrop {
        background-color: ${getComputedStyle(this).getPropertyValue('--sl-body-surface-overlay')};
      }
    `
    );

    adoptStyles(this.shadowRoot!, [breakpoints, styles, backdrop]);

    // Disable scrolling while the dialog is open
    document.documentElement.style.overflow = 'hidden';

    this.inert = false;
    this.dialog?.showModal();

    // Workaround for broken focus behavior when using <slot> inside <dialog>
    // See https://github.com/whatwg/html/issues/9245
    requestAnimationFrame(() => {
      const focusable = this.querySelector<HTMLElement>('[autofocus], [tabindex]:not([tabindex="-1"])');

      if (focusable && this.shadowRoot?.activeElement !== focusable) {
        focusable.focus();
      }

      this.#activateFocusTrap();
    });
  }

  /** Close the dialog. */
  close(): void {
    if (this.dialog?.open) {
      this.#closeDialogOnAnimationend();
    }
  }

  #activateFocusTrap(): void {
    if (!this.dialog) {
      return;
    }

    if (!this.#focusTrap) {
      this.#focusTrap = createFocusTrap(this.dialog, {
        escapeDeactivates: !this.disableCancel,
        allowOutsideClick: !this.disableCancel,
        fallbackFocus: this.dialog,
        returnFocusOnDeactivate: true,
        tabbableOptions: {
          getShadowRoot: true
        }
      });
    }

    this.#focusTrap.activate();
  }

  #deactivateFocusTrap(): void {
    if (this.#focusTrap) {
      this.#focusTrap.deactivate();
    }
  }

  #onCancel(event: Event & { target: HTMLElement }): void {
    event.preventDefault();

    if (!this.disableCancel) {
      this.#closeDialogOnAnimationend(event.target, true);
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

    this.#deactivateFocusTrap();
  }

  #onCloseClick(event: PointerEvent & { target: HTMLElement }): void {
    event.preventDefault();
    event.stopPropagation();

    this.#closeDialogOnAnimationend(event.target as HTMLElement);
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

    this.#deactivateFocusTrap();

    /**
     * Set the closing attribute, this triggers the closing animation.
     *
     * FIXME: We can replace this using `@starting-style` once this is available in all
     * browsers. See https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style
     */
    requestAnimationFrame(() => this.dialog?.setAttribute('closing', ''));
  }

  #onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();

      if (!this.disableCancel) {
        this.#closeDialogOnAnimationend(event.target as HTMLElement, true);
      }
    }
  }
}
