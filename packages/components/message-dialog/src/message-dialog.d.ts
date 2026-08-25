import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type ButtonFill, type ButtonVariant } from '@sl-design-system/button';
import { type EventEmitter } from '@sl-design-system/shared';
import { type SlCancelEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-message-dialog': MessageDialog;
  }
}
export interface MessageDialogConfig<T = any> {
  title?: string;
  message: string | TemplateResult;
  buttons?: Array<MessageDialogButton<T>>;
  disableCancel?: boolean;
}
export interface MessageDialogButton<T = any> {
  action?(): void;
  autofocus?: boolean;
  fill?: ButtonFill;
  text: string;
  value?: T;
  variant?: ButtonVariant;
}
declare const MessageDialog_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
/**
 * Use this component to show alerts, confirmations, or custom dialogs.
 *
 * This component is meant to be used as a static class. Not as a declarative component. For
 * example:
 *
 * ```js
 * await MessageDialog.alert('Hello, world!');
 * // Dialog has been closed or cancelled at this point
 * ```
 */
export declare class MessageDialog<T = any> extends MessageDialog_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  /**
   * Shows an alert message to the user with an OK button by default.
   *
   * @param message - The message to display.
   * @param title - The title of the dialog.
   */
  static alert(message: string, title?: string): Promise<void>;
  /**
   * Shows a confirmation dialog to the user with OK and Cancel buttons by default.
   *
   * Returns a promise that resolves with `true` if the user clicks OK, `false` if the user clicks
   * Cancel, or `undefined` if the user closes the dialog.
   *
   * @param message - The message to display.
   * @param title - The title of the dialog.
   */
  static confirm(message: string, title?: string): Promise<boolean | undefined>;
  /**
   * Shows a message dialog to the user. Use this method to display custom dialogs with any number
   * of buttons.
   *
   * Returns a promise that resolves with the value of the button that was clicked, or `undefined`
   * if the dialog was closed.
   *
   * @param config - The configuration for the dialog.
   */
  static show<T = any>(config: MessageDialogConfig<T>): Promise<T | undefined>;
  /** @internal Emits when the dialog is cancelled. */
  cancelEvent: EventEmitter<SlCancelEvent>;
  /** The configuration of the message dialog. */
  config?: MessageDialogConfig<T>;
  /** @internal */
  dialog?: HTMLDialogElement;
  render(): TemplateResult;
  /** Show the message dialog as a modal, in the top layer, with a backdrop. */
  showModal(): void;
  /** Close the message dialog. */
  close(): void;
}
export {};
