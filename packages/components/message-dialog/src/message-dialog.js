var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __typeError = msg2 => {
  throw TypeError(msg2);
};
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if ((decorator = decorators[i]))
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var __accessCheck = (obj, member, msg2) => member.has(obj) || __typeError('Cannot ' + msg2);
var __privateAdd = (obj, member, value) =>
  member.has(obj)
    ? __typeError('Cannot add the same private member more than once')
    : member instanceof WeakSet
      ? member.add(obj)
      : member.set(obj, value);
var __privateMethod = (obj, member, method) => (
  __accessCheck(obj, member, 'access private method'),
  method
);
var _MessageDialog_instances, onButtonClick_fn, onCancel_fn, onClick_fn, onKeydown_fn;
import { localized, msg } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { ButtonBar } from '@sl-design-system/button-bar';
import { Dialog } from '@sl-design-system/dialog';
import { event } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './message-dialog.scss.js';
export let MessageDialog = class extends ScopedElementsMixin(LitElement) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _MessageDialog_instances);
  }
  /** @internal */
  static get scopedElements() {
    return {
      ...Dialog.scopedElements,
      'sl-button': Button,
      'sl-button-bar': ButtonBar
    };
  }
  /**
   * Shows an alert message to the user with an OK button by default.
   *
   * @param message - The message to display.
   * @param title - The title of the dialog.
   */
  static async alert(message, title = msg('Alert', { id: 'sl.messageDialog.alertTitle' })) {
    return await this.show({
      buttons: [
        {
          autofocus: true,
          text: msg('OK', { id: 'sl.messageDialog.okButton' }),
          variant: 'primary'
        }
      ],
      title,
      message
    });
  }
  /**
   * Shows a confirmation dialog to the user with OK and Cancel buttons by default.
   *
   * Returns a promise that resolves with `true` if the user clicks OK, `false` if the user clicks
   * Cancel, or `undefined` if the user closes the dialog.
   *
   * @param message - The message to display.
   * @param title - The title of the dialog.
   */
  static async confirm(message, title = msg('Confirm', { id: 'sl.messageDialog.confirmTitle' })) {
    return await this.show({
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
   * Shows a message dialog to the user. Use this method to display custom dialogs with any number
   * of buttons.
   *
   * Returns a promise that resolves with the value of the button that was clicked, or `undefined`
   * if the dialog was closed.
   *
   * @param config - The configuration for the dialog.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async show(config) {
    return await new Promise(resolve => {
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
      dialog.addEventListener('sl-cancel', () => resolve(void 0));
      document.body.appendChild(dialog);
      void dialog.updateComplete.then(() => dialog.showModal());
    });
  }
  render() {
    const { buttons, message, title } = this.config ?? {};
    return html`
      <dialog
        @cancel=${__privateMethod(this, _MessageDialog_instances, onCancel_fn)}
        @click=${__privateMethod(this, _MessageDialog_instances, onClick_fn)}
        @keydown=${__privateMethod(this, _MessageDialog_instances, onKeydown_fn)}
        aria-labelledby="title"
        role="alertdialog">
        <h1 id="title">${title}</h1>
        <p>${message}</p>
        <sl-button-bar align="end">
          ${buttons?.map(
            button => html`
              <sl-button
                @click=${() => __privateMethod(this, _MessageDialog_instances, onButtonClick_fn).call(this, button)}
                ?autofocus=${button.autofocus}
                fill=${ifDefined(button.fill)}
                variant=${ifDefined(button.variant)}>
                ${button.text}
              </sl-button>
            `
          )}
        </sl-button-bar>
      </dialog>
    `;
  }
  /** Show the message dialog as a modal, in the top layer, with a backdrop. */
  showModal() {
    this.dialog?.showModal();
  }
  /** Close the message dialog. */
  close() {
    this.dialog?.close();
  }
};
_MessageDialog_instances = new WeakSet();
onButtonClick_fn = async function (button) {
  this.dialog?.close();
  await Promise.allSettled(
    this.dialog?.getAnimations({ subtree: true }).map(a => a.finished) ?? []
  );
  button.action?.();
};
onCancel_fn = async function () {
  await new Promise(resolve => setTimeout(resolve));
  await Promise.allSettled(
    this.dialog?.getAnimations({ subtree: true }).map(a => a.finished) ?? []
  );
  this.cancelEvent.emit();
};
onClick_fn = async function (event2) {
  if (this.config?.disableCancel) {
    return;
  }
  const rect = this.dialog.getBoundingClientRect();
  if (
    event2.clientY < rect.top ||
    event2.clientY > rect.bottom ||
    event2.clientX < rect.left ||
    event2.clientX > rect.right
  ) {
    event2.preventDefault();
    event2.stopPropagation();
    this.dialog?.close();
    await Promise.allSettled(
      this.dialog?.getAnimations({ subtree: true }).map(a => a.finished) ?? []
    );
    this.cancelEvent.emit();
  }
};
onKeydown_fn = function (event2) {
  if (event2.key === 'Escape' && this.config?.disableCancel) {
    event2.preventDefault();
    event2.stopPropagation();
  }
};
/** @internal */
MessageDialog.styles = styles;
__decorateClass([event({ name: 'sl-cancel' })], MessageDialog.prototype, 'cancelEvent', 2);
__decorateClass([property({ attribute: false })], MessageDialog.prototype, 'config', 2);
__decorateClass([query('dialog')], MessageDialog.prototype, 'dialog', 2);
MessageDialog = __decorateClass([localized()], MessageDialog);
//# sourceMappingURL=message-dialog.js.map
