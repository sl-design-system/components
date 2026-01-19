import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button, type ButtonFill, type ButtonVariant } from '@sl-design-system/button';
import { ButtonBar } from '@sl-design-system/button-bar';
import { Dialog } from '@sl-design-system/dialog';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type SlCancelEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './message-dialog.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-message-dialog': MessageDialog;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface MessageDialogConfig<T = any> {
  title?: string;
  message: string | TemplateResult;
  buttons?: Array<MessageDialogButton<T>>;
  disableCancel?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface MessageDialogButton<T = any> {
  action?(): void;
  autofocus?: boolean;
  fill?: ButtonFill;
  text: string;
  value?: T;
  variant?: ButtonVariant;
}

/**
 * Use this component to show alerts, confirmations, or custom dialogs.
 *
 * This component is meant to be used as a static class. Not as a declarative component. For example:
 * ```js
 * await MessageDialog.alert('Hello, world!');
 * // Dialog has been closed or cancelled at this point
 * ```
 */
@localized()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class MessageDialog<T = any> extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      ...Dialog.scopedElements,
      'sl-button': Button,
      'sl-button-bar': ButtonBar
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * Shows an alert message to the user with an OK button by default.
   *
   * @param message - The message to display.
   * @param title - The title of the dialog.
   */
  static async alert(message: string, title = msg('Alert', { id: 'sl.messageDialog.alertTitle' })): Promise<void> {
    return await this.show({
      buttons: [{ autofocus: true, text: msg('OK', { id: 'sl.messageDialog.okButton' }), variant: 'primary' }],
      title,
      message
    });
  }

  /**
   * Shows a confirmation dialog to the user with OK and Cancel buttons by default.
   *
   * Returns a promise that resolves with `true` if the user clicks OK, `false` if the user clicks Cancel, or `undefined` if the user closes the dialog.
   *
   * @param message - The message to display.
   * @param title - The title of the dialog.
   */
  static async confirm(
    message: string,
    title = msg('Confirm', { id: 'sl.messageDialog.confirmTitle' })
  ): Promise<boolean | undefined> {
    return await this.show<boolean>({
      buttons: [
        {
          text: msg('Cancel', { id: 'sl.messageDialog.cancelButton' }),
          value: false,
          autofocus: true,
          fill: 'outline',
          variant: 'primary'
        },
        { text: msg('OK', { id: 'sl.messageDialog.okButton' }), value: true, variant: 'primary' }
      ],
      title,
      message
    });
  }

  /**
   * Shows a message dialog to the user. Use this method to display custom dialogs with any number of buttons.
   *
   * Returns a promise that resolves with the value of the button that was clicked, or `undefined` if the dialog was closed.
   *
   * @param config - The configuration for the dialog.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async show<T = any>(config: MessageDialogConfig<T>): Promise<T | undefined> {
    return await new Promise<T | undefined>(resolve => {
      config.buttons = config.buttons?.map(button => {
        const action = button.action;

        button.action = () => {
          action?.();
          resolve(button.value);
        };

        return button;
      });

      const dialog = document.createElement('sl-message-dialog');
      dialog.config = config;
      dialog.addEventListener('sl-cancel', () => resolve(undefined));

      document.body.appendChild(dialog);
      void dialog.updateComplete.then(() => dialog.showModal());
    });
  }

  /** @internal Emits when the dialog is cancelled. */
  @event({ name: 'sl-cancel' }) cancelEvent!: EventEmitter<SlCancelEvent>;

  /** The configuration of the message dialog. */
  @property({ attribute: false }) config?: MessageDialogConfig<T>;

  /** @internal */
  @query('dialog') dialog?: HTMLDialogElement;

  override render(): TemplateResult {
    const { buttons, message, title } = this.config ?? {};

    return html`
      <dialog
        @cancel=${this.#onCancel}
        @click=${this.#onClick}
        @keydown=${this.#onKeydown}
        aria-labelledby="title"
        role="alertdialog"
      >
        <h2 id="title">${title}</h2>
        <p>${message}</p>
        <sl-button-bar align="end">
          ${buttons?.map(
            button => html`
              <sl-button
                @click=${() => this.#onButtonClick(button)}
                ?autofocus=${button.autofocus}
                fill=${ifDefined(button.fill)}
                variant=${ifDefined(button.variant)}
              >
                ${button.text}
              </sl-button>
            `
          )}
        </sl-button-bar>
      </dialog>
    `;
  }

  /** Show the message dialog as a modal, in the top layer, with a backdrop. */
  showModal(): void {
    this.dialog?.showModal();
  }

  /** Close the message dialog. */
  close(): void {
    this.dialog?.close();
  }

  async #onButtonClick(button: MessageDialogButton): Promise<void> {
    this.dialog?.close();

    // Wait until all animations have finished before triggering the action
    await Promise.allSettled(this.dialog?.getAnimations({ subtree: true }).map(a => a.finished) ?? []);

    button.action?.();
  }

  async #onCancel(): Promise<void> {
    // Wait for close animation to start
    await new Promise(resolve => setTimeout(resolve));

    // Wait until all animations have finished before triggering the action
    await Promise.allSettled(this.dialog?.getAnimations({ subtree: true }).map(a => a.finished) ?? []);

    this.cancelEvent.emit();
  }

  async #onClick(event: PointerEvent): Promise<void> {
    if (this.config?.disableCancel) {
      return;
    }

    const rect = this.dialog!.getBoundingClientRect();

    // Check if the user clicked on the backdrop
    if (
      event.clientY < rect.top ||
      event.clientY > rect.bottom ||
      event.clientX < rect.left ||
      event.clientX > rect.right
    ) {
      event.preventDefault();
      event.stopPropagation();

      this.dialog?.close();

      // Wait until all animations have finished before triggering the action
      await Promise.allSettled(this.dialog?.getAnimations({ subtree: true }).map(a => a.finished) ?? []);

      this.cancelEvent.emit();
    }
  }

  #onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.config?.disableCancel) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
