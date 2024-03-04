import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button, type ButtonFill, type ButtonVariant } from '@sl-design-system/button';
import { Dialog } from '@sl-design-system/dialog';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './message-dialog.scss.js';

export interface MessageDialogConfig<T = unknown> {
  title?: string;
  subtitle?: string;
  message: string | TemplateResult;
  buttons?: Array<MessageDialogButton<T>>;
  disableCancel?: boolean;
}

export interface MessageDialogButton<T = unknown> {
  action?(): void;
  fill?: ButtonFill;
  text: string;
  value?: T;
  variant?: ButtonVariant;
}

/**
 * A dialog for displaying messages to the user.
 */
@localized()
export class MessageDialog<T = unknown> extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      ...Dialog.scopedElements,
      'sl-button': Button,
      'sl-dialog': Dialog
    };
  }

  /** @private */
  static override styles: CSSResultGroup = styles;

  static async alert(message: string, title = msg('Alert')): Promise<void> {
    return await this.show({
      buttons: [{ text: msg('OK'), variant: 'primary' }],
      title,
      message
    });
  }

  static async confirm(message: string, title = msg('Confirm')): Promise<boolean | undefined> {
    return await this.show<boolean>({
      buttons: [
        { text: msg('Cancel'), value: false },
        { text: msg('OK'), value: true, variant: 'primary' }
      ],
      title,
      message
    });
  }

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

  @property({ attribute: false }) config?: MessageDialogConfig<T>;

  override render(): TemplateResult {
    const { buttons, disableCancel, message, title, subtitle } = this.config ?? {};

    return html`
      <sl-dialog .disableCancel=${disableCancel} dialog-role="alertdialog">
        <div slot="title">${title}</div>
        ${subtitle ? html`<div slot="subtitle">${subtitle}</div>` : nothing}
        <p>${message}</p>
        ${buttons?.map(
          button => html`
            <sl-button
              @click=${() => button.action?.()}
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

  showModal(): void {
    this.renderRoot.querySelector<Dialog>('sl-dialog')?.showModal();
  }

  close(): void {
    this.renderRoot.querySelector<Dialog>('sl-dialog')?.close();
  }
}
