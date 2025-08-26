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

  interface GlobalEventHandlersEventMap {
    'sl-open': SlOpenEvent;
  }

  // interface GlobalEventHandlersEventMap {
  //   'sl-close-overlay': SlCloseOverlayEvent;
  // }
}

export type SlCloseEvent = CustomEvent<void>;

export type SlOpenEvent = CustomEvent<void>;

// export type SlCloseOverlayEvent = CustomEvent<void>;

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
  #events = new EventsController(this, {
    click: this.#onClick,
    keydown: this.#onKeydown,
    // Listen once at the host for child overlay open/close events; bubbling is sufficient
    'sl-open': this.#onChildOpen,
    'sl-close': this.#onChildClose
  });

  // #mutationObserver?: MutationObserver;

  /** Tracks number of open date-field calendars (overlay components) within the dialog.
   * The dialog should not close when we click the dropdown, when there is any overlay component opened in it.
   * We use sl-open and sl-close events to detect those.*/
  #openCalendars = 0;

  /** Responsive behavior utility. */
  #media = new MediaController(this);

  /**
   * @internal Emits when the dialog has been cancelled. This happens when the
   * user closes the dialog using the escape key or clicks on the backdrop.
   */
  @event({ name: 'sl-cancel', cancelable: true }) cancelEvent!: EventEmitter<SlCancelEvent>;

  /**
   * Determines whether a close button should be shown in the top right corner.
   * @default false
   */
  @property({ type: Boolean, attribute: 'close-button' }) closeButton?: boolean;

  // @event({ name: 'sl-open' }) openEvent!: EventEmitter<SlCloseEvent>;

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
   * Disables the ability to cancel the dialog by pressing the Escape key or clicking on the backdrop.
   * We recommend setting this to true when the dialog contains a form that must be submitted or cancelled,
   * to prevent accidental closing when clicking on the backdrop.
   * @default false
   */
  @property({ type: Boolean, attribute: 'disable-cancel' }) disableCancel?: boolean;

  override connectedCallback(): void {
    super.connectedCallback();

    this.inert = true;

    // this.#events.listen(this.input, 'click', this.#onInputClick);
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    console.log('changes in firstUpdated', changes, this.renderRoot, this.renderRoot.querySelector('dialog'));
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    this.#updatePrimaryButtons();
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
      <slot @slotchange=${this.#onBodySlotChange}></slot>
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
    console.log(
      'should not close the dialog?',
      this.dialog !== event.composedPath()[0],
      event.composedPath,
      event.composedPath()[0]
    );

    if (this.dialog !== event.composedPath()[0]) {
      return;
    }

    const rect = this.dialog.getBoundingClientRect();

    console.log('onBackdropClick', event, event.target, rect, this.#openCalendars);

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

    /*    // debugger;
    //
    // If any date-field calendar (overlay component) is open, block cancel by default
    // if (this.#openCalendars > 0) {
    //   event.preventDefault();
    //   event.stopPropagation();
    //   return;
    // }

    if (this.#openCalendars > 0) {
      console.log(
        'onBackdropClick blocked by open calendar or sth else - other overlay component',
        event,
        event.target,
        rect,
        this.#openCalendars
      );
      // event.preventDefault();
      // event.stopPropagation();
      // return;
    }

    console.log('onBackdropClick after checking #openCalendars value', event, event.target, rect, this.#openCalendars);

    event.preventDefault();
    event.stopPropagation();

    // debugger;

    // Check if the user clicked on the backdrop
    if (
      !this.disableCancel &&
      (event.clientY < rect.top ||
        event.clientY > rect.bottom ||
        event.clientX < rect.left ||
        event.clientX > rect.right) &&
      event.target instanceof HTMLDialogElement
    ) {
      // event.preventDefault();
      // event.stopPropagation();

      // if (this.#openCalendars > 0) {
      //   event.preventDefault();
      //   event.stopPropagation();
      //   return;
      // }

      const notCancelled = this.cancelEvent.emit(undefined, { cancelable: true });
      console.log('onBackdropClick cancel --- notCancelled111', event, event.target, notCancelled);

      console.log('this.#events in backdropclick', this.#events);

      // event.preventDefault();
      // event.stopPropagation();

      if (this.#openCalendars === 0) {
        console.log('onBackdropClick close openCalendars === 0', event, event.target, rect, this.#openCalendars);
        event.preventDefault();
        event.stopPropagation();

        this.cancelEvent.emit();
        this.close();
      }

      // const notCancelled = this.cancelEvent.emit(undefined, { cancelable: true });
      console.log('onBackdropClick cancel --- notCancelled222', event, event.target, notCancelled);

      // event.preventDefault();
      // event.stopPropagation();

      console.log('onBackdropClick close', event, event.target, rect, this.#openCalendars);

      // // Emit cancelable cancel event; only close when not prevented
      // const notCancelled = this.cancelEvent.emit(undefined, { cancelable: true });
      // console.log('onBackdropClick cancel --- notCancelled', event, event.target, notCancelled);
      // if (notCancelled) {
      //   this.close();
      // }
    }*/
  }

  #onBodySlotChange(): void {
    // // // const headerSlots = this.renderRoot.querySelectorAll('slot'),
    // // //   hasContent = Array.from(headerSlots).find(slot =>
    // // //     (slot as HTMLSlotElement)
    // // //       .assignedNodes({ flatten: true })
    // // //       .some(
    // // //         node =>
    // // //           node.textContent?.trim() !== '' ||
    // // //           (node.nodeType === Node.ELEMENT_NODE &&
    // // //             !(node as Element).hasAttribute('slot') &&
    // // //             !(node instanceof HTMLStyleElement))
    // // //       )
    // // //   );
    // //
    // // // const headerSlots = this.renderRoot.querySelectorAll('slot');
    // // // const slottedElements = Array.from(headerSlots).flatMap(slot =>
    // // //   (slot as HTMLSlotElement).assignedElements({ flatten: true })
    // // // );
    // //
    // const headerSlots = this.renderRoot.querySelectorAll('slot');
    // const slottedElements = Array.from(headerSlots).flatMap(slot => slot.assignedElements({ flatten: true }));
    // // const allNestedElements = slottedElements.flatMap(el =>
    // //   el instanceof HTMLElement ? [el, ...Array.from(el.querySelectorAll<HTMLElement>('*'))] : []
    // // );
    //
    // const allNestedElements = slottedElements.flatMap(el =>
    //   el instanceof HTMLElement && el.tagName !== 'SLOT'
    //     ? [el, ...Array.from(el.querySelectorAll<HTMLElement>('*')).filter(child => child.tagName !== 'SLOT')]
    //     : []
    // );
    // //
    // // allNestedElements.forEach(element => {
    // //   this.#events.listen(element, 'sl-open', this.#onChildOpen, { capture: true, once: true });
    // //   this.#events.listen(element, 'sl-close', this.#onChildClose, { capture: true, once: true });
    // // });
    // // console.log('headerSlots on bodyclotchange', headerSlots, slottedElements, allNestedElements, this.renderRoot);
    //
    // let openPopoverCount = 0;
    //
    // let anyPopoverOpen = false;
    //
    // if (this.#mutationObserver) {
    //   this.#mutationObserver.disconnect();
    //   openPopoverCount = 0;
    //   anyPopoverOpen = false;
    // }
    //
    // // const slots = this.renderRoot.querySelectorAll('slot');
    // // const slottedElements = Array.from(slots).flatMap(slot =>
    // //   (slot as HTMLSlotElement).assignedElements({ flatten: true })
    // // );
    // // const allNestedElements = slottedElements.flatMap(el =>
    // //   el instanceof HTMLElement ? [el, ...Array.from(el.querySelectorAll<HTMLElement>('*'))] : []
    // // );
    //
    // console.log('allNestedElements on bodyclotchange', allNestedElements, this.renderRoot);
    // allNestedElements.forEach(element => {
    //   if (isPopoverOpen(element)) {
    //     // Do something if the popover is open
    //     console.log('Popover is open for:', element);
    //   }
    // });
    //
    // // let openPopoverCount = 0;
    // allNestedElements.forEach(element => {
    //   if (isPopoverOpen(element)) {
    //     openPopoverCount++;
    //     console.log('Popover is open for:', element);
    //   }
    // });
    // const anyPopoverOpen2 = openPopoverCount > 0;
    // console.log('Number of open popovers:', openPopoverCount, 'Any open:', anyPopoverOpen2);
    //
    // this.#mutationObserver = new MutationObserver(mutations => {
    //   mutations.forEach(mutation => {
    //     // Handle mutation (e.g., attribute or content change)
    //     console.log('Mutation detected:', mutation, mutation.target as HTMLElement);
    //
    //     if (isPopoverOpen(mutation.target as HTMLElement)) {
    //       console.log('Mutation detected on open popover:', mutation.target);
    //       openPopoverCount++;
    //       console.log('openPopoverCount in mutationObserver', openPopoverCount);
    //     }
    //   });
    //
    //   anyPopoverOpen = mutations.some(element => isPopoverOpen(element.target as HTMLElement));
    //   console.log('Any popover open in mutationObserver:', anyPopoverOpen);
    // });
    //
    // console.log('openPopoverCount', openPopoverCount);
    //
    // allNestedElements.forEach(element => {
    //   this.#mutationObserver?.observe(element, { attributes: true, childList: true, subtree: true });
    //
    //   console.log('Mutation detected:', element);
    //
    //   anyPopoverOpen = allNestedElements.some(element => isPopoverOpen(element));
    //
    //   console.log('Any popover open:', anyPopoverOpen);
    //
    //   if (isPopoverOpen(element)) {
    //     // Do something if the popover is open
    //     console.log('in mutation observer... Popover is open for:', element);
    //   }
    // });
    //
    // console.log('allNestedElements to observe....', allNestedElements);
  }

  #onClick(event: MouseEvent): void {
    const button = event.composedPath().find((el): el is Button => el instanceof Button);

    if (button?.hasAttribute('sl-dialog-close')) {
      console.log('onClick close when sl-dialog-close is set', event, event.target);
      this.close();
    }
  }

  async #onClose(event: MouseEvent): Promise<void> {
    console.log('onClose close', event, event.target, this.#openCalendars); // TODO: why it's invoked when I close select, but not when the date fiel???
    // event.preventDefault();

    // debugger;

    if (this.#openCalendars > 0) {
      // event.preventDefault();
      // event.stopPropagation();
      return;
    }

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

      // If any date-field calendar is open, block cancel by default
      if (this.#openCalendars > 0) {
        event.stopPropagation();
        return;
      }

      if (this.disableCancel) {
        event.stopPropagation();
      } else {
        // Emit cancelable cancel event; only close when not prevented
        const notCancelled = this.cancelEvent.emit(undefined, { cancelable: true });
        if (notCancelled) {
          this.close();
        }
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

  #onChildOpen(event: Event): void {
    console.log('event sl-open', event, event.target);

    // Ignore the dialog's own events
    if (event.target === this || event.target instanceof HTMLDialogElement) {
      console.log('event sl-open ignored', event, event.target);
      event.stopPropagation();
      return;
    }
    console.log('this.#openCalendars before increment', this.#openCalendars, event.target);

    this.#openCalendars++;
    console.log('this.#openCalendars after increment', this.#openCalendars, event.target);

    console.log('event sl-open and this.#openCalendars', event, event.target, this.#openCalendars);
  }

  #onChildClose(event: Event): void {
    console.log('event sl-close-overlay #onChildClose', event, event.target, (event.target as HTMLElement).tagName);

    // Ignore the dialog's own events
    if (event.target === this || event.target instanceof HTMLDialogElement) {
      console.log('event sl-close ignored', event, event.target);
      event.stopPropagation();
      return;
    }
    console.log('this.#openCalendars before decrement', this.#openCalendars, event.target);
    this.#openCalendars = Math.max(0, this.#openCalendars - 1);
    console.log('this.#openCalendars after decrement', this.#openCalendars, event.target);
  }
}
