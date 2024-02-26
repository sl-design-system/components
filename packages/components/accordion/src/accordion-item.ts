// TODO: accordion item component
import type { TemplateResult } from 'lit-html';
import type { CSSResultGroup } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { localized } from '@lit/localize';
import { Icon } from '@sl-design-system/icon';
import { Button } from '@sl-design-system/button';
import { type EventEmitter, breakpoints, event } from '@sl-design-system/shared';
// import { EventsController } from '@sl-design-system/shared';
import { faMinus, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { LitElement, html } from 'lit';
import { property, query } from 'lit/decorators.js';
import styles from './accordion-item.scss.js';

Icon.register(faMinus, faPlus); // TODO: use tokens instead

/**
 * An accordion item component.
 *
 * @slot default - ...
 * @part summary - ...
 */

@localized()
export class AccordionItem extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon
    };
  }

  /** @private */
  static override styles: CSSResultGroup = [breakpoints, styles];

  // /** Event controller. */
  // #events = new EventsController(this, {
  //   toggle: this.#onToggle
  //   // click: this.#onClick,
  //   // keydown: this.#onKeydown
  // });

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

  @property() summary!: string; // TODO: only text in the summary? if not add a slot for summary and then this text inside

  /** Emits when the accordion item has been toggled. */
  @event({ name: 'sl-toggle' }) toggleEvent!: EventEmitter<string>;

  // TODO: add aria-expanded?, role button needed as well?

  // TODO: open attribute - same as in details element?

  /** Open... */
  @property({ reflect: true, type: Boolean }) open?: boolean;

  // /** Whether only one accordion item can be opened at once. By default multiple accordion items can be opened. */
  // @property({ type: Boolean, reflect: true }) single?: boolean;

  override connectedCallback(): void {
    super.connectedCallback();

    // this.inert = true;
    // if (this.hasAttribute('disabled')) {
    //   // this.tabIndex = this.disabled ? -1 : 0;
    //   this.setAttribute('tabindex', '-1');
    // }
  }

  // TODO: add disabled to details
  // ?disabled=${this.hasAttribute('disabled')}

  override render(): TemplateResult {
    return html`
      <details
        @toggle=${this.onToggle}
        @click=${this.#onClick}
        ?open=${this.open}
        @animationend=${this.#closeOnAnimationend}
      >
        <summary tabindex=${this.hasAttribute('disabled') ? -1 : 0} part="summary">
          ${this.open
            ? html` <sl-icon name="fas-minus" class="opened"></sl-icon> `
            : html` <sl-icon name="fas-plus"></sl-icon> `}
          <sl-icon name="xmark"></sl-icon> ${this.summary}
        </summary>
        <div class="panel">
          <slot @slotchange=${this.#onSlotChange}></slot>
        </div>
      </details>
    `;
  } // details - open

  // <sl-icon name="fas-plus"></sl-icon>
  //     <sl-icon name="fas-minus"></sl-icon>

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    const assignedNodes = event.target.assignedNodes({ flatten: true });
    console.log(assignedNodes);
    // this.#setIconProperties(assignedNodes);
  }

  onToggle(event: ToggleEvent): void {
    console.log('event on toglle', event, event.target, this.hasAttribute('disabled'));

    this.open = event.newState === 'open';

    // TODO: this.open change on toggle
    // this.requestUpdate();
    // if (this.hasAttribute('disabled')) {
    //   event.preventDefault();
    //   event.stopPropagation();
    //   return;
    // }
    // this.toggleEvent.emit(event.newState);
    // if (this.hasAttribute('disabled')) {
    //   event.preventDefault();
    //   event.stopPropagation();
    // } else if (this.type === 'reset') {
    //   this.internals.form?.reset();
    // } else if (this.type === 'submit') {
    //   this.internals.form?.requestSubmit();
    // }
  }

  #closeOnAnimationend(event: AnimationEvent): void {
    console.log('event closeOnAnimationend', event);
  }

  #onCancel(event: Event & { target: HTMLElement }): void {
    event.preventDefault();

    if (!this.disableCancel) {
      this.#closeDialogOnAnimationend(event.target, true);
    }
  }

  #onClick(event: PointerEvent & { target: HTMLElement }): void {
    if (this.hasAttribute('disabled')) {
      event.preventDefault();
      event.stopPropagation();
      // return;
    }
    // const rect = this.dialog!.getBoundingClientRect();
    //
    // // Check if the user clicked on the sl-dialog-close button or on the backdrop
    // if (
    //   event.target.matches('sl-button[sl-dialog-close]') ||
    //   (!this.disableCancel &&
    //     (event.clientY < rect.top ||
    //       event.clientY > rect.bottom ||
    //       event.clientX < rect.left ||
    //       event.clientX > rect.right))
    // ) {
    //   this.#closeDialogOnAnimationend(event.target, true);
    // }
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
