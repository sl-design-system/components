import { dispatchModalToggle } from '@sl-design-system/shared';

let patched = false;

/**
 * Wraps `HTMLDialogElement.prototype.showModal` and `close`, so every modal dialog reports itself
 * with an `sl-modal-toggle` event; including dialogs in (closed) shadow roots of third-party
 * components. This patches a global, so it is only done when a stack asks for it with
 * `follow-dialogs="patch"`.
 */
export const patchModalDialogs = (): void => {
  if (patched) {
    return;
  }

  patched = true;

  const { close, showModal } = HTMLDialogElement.prototype;

  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    showModal.call(this);
    dispatchModalToggle(this, this, true);
  };

  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement, returnValue?: string) {
    const wasOpen = this.open;

    close.call(this, returnValue);

    if (wasOpen) {
      dispatchModalToggle(this, this, false);
    }
  };
};
