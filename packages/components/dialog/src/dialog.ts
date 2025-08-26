import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { ButtonBar } from '@sl-design-system/button-bar';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, EventsController, MediaController, event } from '@sl-design-system/shared';
import { type SlCancelEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './dialog.scss.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-close': SlCloseEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-dialog': Dialog;
  }
}

export type SlCloseEvent = CustomEvent<void>;

/**
 * A dialog component for displaying modal UI.
 *
 * @csspart dialog - The dialog element
 * @csspart header - The dialog header
 * @csspart titles - The container for the title
 * @csspart body - The body of the dialog
 * @csspart footer - The dialog footer
 * @csspart footer-bar - The button bar in the footer
 * @slot header - Header content for the dialog
 * @slot title - The title of the dialog
 * @slot footer - Footer content for the dialog
 * @slot primary-actions - Area where action buttons are placed
 * @slot secondary-actions - Area where secondary action buttons are placed
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

  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, { click: this.#onClick, keydown: this.#onKeydown });

  /** Responsive behavior utility. */
  #media = new MediaController(this);

  /** Observe size changes to the dialog. */
  #observer = new ResizeObserver(() => this.#onScroll());

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

    if (this.dialog) {
      this.#observer.observe(this.dialog);
    }
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    this.#updatePrimaryButtons();
    this.#observer.observe(this.dialog!);
  }

  override render(): TemplateResult {
    return html`
      <dialog
        @click=${this.#onBackdropClick}
        @close=${this.#onClose}
        aria-labelledby="title"
        role=${ifDefined(this.dialogRole === 'dialog' ? undefined : this.dialogRole)}
        part="dialog"
      >
        <div part="header">${this.renderHeader()}</div>
        <div @scroll=${this.#onScroll} part="body">${this.renderBody()}</div>
        ${this.#media.mobile ? nothing : html`<div part="footer">${this.renderFooter()}</div>`}
      </dialog>
    `;
  }

  /**
   * Override this method to customize the header of the dialog. If you only
   * want to customize the title, you can use the `title` argument and call
   * `super.renderHeader('My title')` to render the default header.
   *
   * Beware when customizing the header: the `<dialog>` element is labelled by
   * the element with ID `title`. If you override this method, make sure to include
   * an element with ID `title` in the header.
   *
   * Only use this when extending the `Dialog` class. If you are using
   * the `<sl-dialog>` custom element, use the slots.
   */
  renderHeader(title = ''): TemplateResult {
    return html`
      <slot name="header">
        <div part="titles">
          <slot name="title" id="title">${title}</slot>
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
              <sl-button
                @click=${this.#onCloseClick}
                aria-label=${msg('Close', { id: 'sl.common.close' })}
                class="sl-close"
                fill="ghost"
                variant="default"
              >
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
      ${this.#media.mobile
        ? html`
            <sl-button-bar part="footer-bar">
              <slot name="secondary-actions">${this.renderSecondaryActions()}</slot>
            </sl-button-bar>
          `
        : nothing}
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
          ${this.#media.mobile ? nothing : this.renderActions()}
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
    });
  }

  /** Close the dialog. */
  close(): void {
    if (this.dialog?.open) {
      this.dialog?.close();
    }
  }

  #onBackdropClick(event: MouseEvent): void {
    if (this.dialog !== event.composedPath()[0]) {
      return;
    }

    const rect = this.dialog.getBoundingClientRect();

    // Check if the user clicked on the backdrop
    if (
      !this.disableCancel &&
      (event.clientY < rect.top ||
        event.clientY > rect.bottom ||
        event.clientX < rect.left ||
        event.clientX > rect.right)
    ) {
      event.preventDefault();
      event.stopPropagation();

      this.cancelEvent.emit();
      this.close();
    }
  }

  #onClick(event: MouseEvent): void {
    const button = event.composedPath().find((el): el is Button => el instanceof Button);

    if (button?.hasAttribute('sl-dialog-close')) {
      this.close();
    }
  }

  async #onClose(): Promise<void> {
    this.#updateDocumentElement(false);

    this.inert = true;

    // Wait until all animations have finished before emitting the close event
    await Promise.allSettled(this.dialog?.getAnimations({ subtree: true }).map(a => a.finished) ?? []);

    this.closeEvent.emit();
  }

  #onCloseClick(event: PointerEvent & { target: HTMLElement }): void {
    event.preventDefault();
    event.stopPropagation();

    this.close();
  }

  #onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();

      if (this.disableCancel) {
        event.stopPropagation();
      } else {
        this.cancelEvent.emit();
        this.close();
      }
    }
  }

  #onScroll(): void {
    const body = this.renderRoot.querySelector('[part="body"]') as HTMLElement,
      { clientHeight, scrollTop, scrollHeight } = body;

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
