import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button, type ButtonFill, type ButtonVariant } from '@sl-design-system/button';
import { Dialog } from '@sl-design-system/dialog';
import { FocusTrap } from 'focus-trap';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './message-dialog.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-message-dialog': MessageDialog;
  }
}

export interface MessageDialogConfig<T = unknown> {
  title?: string;
  subtitle?: string;
  message: string | TemplateResult;
  buttons?: Array<MessageDialogButton<T>>;
  disableCancel?: boolean;
}

export interface MessageDialogButton<T = unknown> {
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
export class MessageDialog<T = unknown> extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      ...Dialog.scopedElements,
      'sl-button': Button,
      'sl-dialog': Dialog
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
  static async alert(message: string, title = msg('Alert')): Promise<void> {
    return await this.show({
      buttons: [{ autofocus: true, text: msg('OK'), variant: 'primary' }],
      title,
      message
    });
  }

  /**
   * Shows a confirmation dialog to the user with OK and Cancel buttons by default.
   *
   * @param message - The message to display.
   * @param title - The title of the dialog.
   * @returns A promise that resolves with `true` if the user clicks OK, `false` if the user clicks Cancel, or `undefined` if the user closes the dialog.
   */
  static async confirm(message: string, title = msg('Confirm')): Promise<boolean | undefined> {
    return await this.show<boolean>({
      buttons: [
        { text: msg('Cancel'), value: false, autofocus: true, fill: 'outline', variant: 'primary' },
        { text: msg('OK'), value: true, variant: 'primary' }
      ],
      title,
      message
    });
  }

  /**
   * Shows a message dialog to the user. Use this method to display custom dialogs with any number of buttons.
   *
   * @param config - The configuration for the dialog.
   * @returns A promise that resolves with the value of the button that was clicked, or `undefined` if the dialog was closed.
   */
  static async show<T = unknown>(config: MessageDialogConfig<T>): Promise<T | undefined> {
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
      dialog.addEventListener('sl-close', () => dialog.remove());

      document.body.appendChild(dialog);
      void dialog.updateComplete.then(() => dialog.showModal());
    });
  }

  #focusTrap?: FocusTrap;

  /** The configuration of the message dialog. */
  @property({ attribute: false }) config?: MessageDialogConfig<T>;

  override render(): TemplateResult {
    const { buttons, disableCancel, message, title, subtitle } = this.config ?? {};

    console.log('#focusTrap', this.#focusTrap);

    return html`
      <sl-dialog .disableCancel=${disableCancel} dialog-role="alertdialog">
        <div slot="title">${title}</div>
        ${subtitle ? html`<div slot="subtitle">${subtitle}</div>` : nothing}
        <p>${message}</p>
        ${buttons?.map(
          button => html`
            <sl-button
              @click=${() => button.action?.()}
              ?autofocus=${button.autofocus}
              .fill=${button.fill ?? 'solid'}
              .variant=${button.variant ?? 'default'}
              slot="actions"
              sl-dialog-close
            >
              ${button.text}
            </sl-button>
          `
        )}
      </sl-dialog>
    `;
  }

  /** Show the message dialog as a modal, in the top layer, with a backdrop. */
  showModal(): void {
    this.renderRoot.querySelector<Dialog>('sl-dialog')?.showModal();

    // TODO: implement focus trap here
  }

  /** Close the message dialog. */
  close(): void {
    this.renderRoot.querySelector<Dialog>('sl-dialog')?.close();
  }
}
