import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { ButtonBar } from '@sl-design-system/button-bar';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, FocusTrapController, MediaController, event } from '@sl-design-system/shared';
import {
  type CSSResult,
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
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
  static override styles: CSSResultGroup = styles;

  /** The controller that manages the focus trap within the dialog. */
  #focusTrap = new FocusTrapController(this);

  /** Responsive behavior utility. */
  #media = new MediaController(this);

  /**
   * @internal Emits when the dialog has been cancelled. This happens when the
   * user closes the dialog using the escape key or clicks on the backdrop.
   */
  @event({ name: 'sl-cancel' }) cancelEvent!: EventEmitter<SlCancelEvent>;

  /**
   * Determines whether a close button should be shown in the top right corner.
   * @default false
   */
  @property({ type: Boolean, attribute: 'close-button' }) closeButton?: boolean;

  /** @internal Emits when the dialog has been closed. */
  @event({ name: 'sl-close' }) closeEvent!: EventEmitter<SlCloseEvent>;

  /** @internal */
  @query('dialog') dialog?: HTMLDialogElement;

  /**
   * The role for the dialog element.
   * @default 'dialog'
   */
  @property({ attribute: 'dialog-role' }) dialogRole: 'dialog' | 'alertdialog' = 'dialog';

  /**
   * Disables the ability to cancel the dialog by pressing the Escape key
   * or clicking on the backdrop.
   * @default false
   */
  @property({ type: Boolean, attribute: 'disable-cancel' }) disableCancel?: boolean;

  override connectedCallback(): void {
    super.connectedCallback();

    this.inert = true;
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    this.#updatePrimaryButtons();
  }

  override render(): TemplateResult {
    return html`
      <dialog
        @click=${this.#onClick}
        @close=${this.#onClose}
        @keydown=${this.#onKeydown}
        aria-labelledby="title"
        role=${ifDefined(this.dialogRole === 'dialog' ? undefined : this.dialogRole)}
        part="dialog"
      >
        <div part="header">${this.renderHeader()}</div>
        <div @scroll=${this.#onScroll} part="body">${this.renderBody()}</div>
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
          ${this.#media.mobile ? nothing : html`<slot name="subtitle">${subtitle}</slot>`}
          ${this.#media.mobile
            ? html`
                <slot @slotchange=${this.#updatePrimaryButtons} name="primary-actions">
                  ${this.renderPrimaryActions()}
                </slot>
              `
            : nothing}
        </div>
        ${this.closeButton
          ? html`
              <sl-button @click=${this.#onCloseClick} aria-label=${msg('Close')} fill="ghost" variant="default">
                <sl-icon name="xmark"></sl-icon>
              </sl-button>
            `
          : nothing}
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
    return html`
      <slot></slot>
      ${this.#media.mobile ? html`<slot name="secondary-actions">${this.renderSecondaryActions()}</slot>` : nothing}
    `;
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
        <sl-button-bar align="end" part="footer-bar">
          <slot name="actions">${this.#media.mobile ? nothing : this.renderActions()}</slot>
        </sl-button-bar>
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
    return html`
      <slot name="secondary-actions">${this.renderSecondaryActions()}</slot>
      <slot @slotchange=${this.#updatePrimaryButtons} name="primary-actions">${this.renderPrimaryActions()}</slot>
    `;
  }

  /**
   * Override this method to customize the primary actions in the footer of the dialog.
   *
   * Only use this when extending the `Dialog` class. If you are using
   * the `<sl-dialog>` custom element, use the slots.
   */
  renderPrimaryActions(): TemplateResult | typeof nothing {
    return nothing;
  }

  /**
   * Override this method to customize the secondary actions in the footer of the dialog.
   *
   * Only use this when extending the `Dialog` class. If you are using
   * the `<sl-dialog>` custom element, use the slots.
   */
  renderSecondaryActions(): TemplateResult | typeof nothing {
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

    adoptStyles(this.shadowRoot!, [styles, backdrop]);

    this.#updateDocumentElement(true);

    this.inert = false;
    this.dialog?.showModal();

    // Workaround for broken focus behavior when using <slot> inside <dialog>
    // See https://github.com/whatwg/html/issues/9245
    requestAnimationFrame(() => {
      const focusable = this.querySelector<HTMLElement>('[autofocus], [tabindex]:not([tabindex="-1"])');

      if (focusable && this.shadowRoot?.activeElement !== focusable) {
        focusable.focus();
      }

      if (this.dialog) {
        this.#focusTrap.activate(this.dialog);
      }
    });
  }

  /** Close the dialog. */
  close(): void {
    this.dialog?.close();
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
      this.dialog?.close();
    }
  }

  #onClose(): void {
    this.#updateDocumentElement(false);

    this.#focusTrap.deactivate();

    this.inert = true;
    this.closeEvent.emit();
  }

  #onCloseClick(event: PointerEvent & { target: HTMLElement }): void {
    event.preventDefault();
    event.stopPropagation();

    this.close();
  }

  #onKeydown(event: KeyboardEvent & { target: HTMLElement }): void {
    if (event.key === 'Escape') {
      event.preventDefault();

      if (this.disableCancel) {
        event.stopPropagation();
      } else {
        this.close();
      }
    }
  }

  #onScroll(event: Event & { target: HTMLElement }): void {
    const { clientHeight, scrollTop, scrollHeight } = event.target;

    // Toggle sticky header when scrolling down
    this.renderRoot.querySelector('[part="header"]')?.toggleAttribute('sticky', scrollTop > 0);

    // Toggle sticky footer when not at bottom
    this.renderRoot
      .querySelector('[part="footer"]')
      ?.toggleAttribute('sticky', scrollTop + clientHeight < scrollHeight);
  }

  #updateDocumentElement(opening?: boolean): void {
    if (opening) {
      const width = window.innerWidth,
        bodyMargin = 16;

      const scale = (width - bodyMargin * 2) / width;

      // Set the scale and translate values so that the body has a 16px margin on each side
      document.documentElement.style.setProperty('--sl-dialog-scale', scale.toString());
      document.documentElement.style.setProperty('--sl-dialog-translate', `0 ${bodyMargin}px`);

      // Add class to `<html>` for styling purposes
      document.documentElement.classList.add('sl-dialog-enter');

      // Disable scrolling while the dialog is open
      document.documentElement.style.overflow = 'hidden';
    } else {
      // Reenable scrolling after the dialog has closed
      document.documentElement.style.overflow = '';

      // Remove open class
      document.documentElement.classList.remove('sl-dialog-enter');
    }
  }

  #updatePrimaryButtons(): void {
    const buttons =
      this.renderRoot.querySelector<HTMLSlotElement>('slot[name="primary-actions"]')?.assignedElements({
        flatten: true
      }) ?? [];

    if (buttons.length > 1) {
      buttons.at(0)?.setAttribute('fill', this.#media.mobile ? 'link' : 'outline');
      buttons.at(-1)?.setAttribute('fill', this.#media.mobile ? 'link' : 'solid');
    } else {
      buttons.at(0)?.setAttribute('fill', this.#media.mobile ? 'link' : 'solid');
    }
  }
}
