declare global {
  interface GlobalEventHandlersEventMap {
    'sl-modal-toggle': SlModalToggleEvent;
  }
}

/**
 * Emitted when a modal dialog opens or closes. There is no event for changes to the top layer, and
 * `toggle` events of dialogs inside shadow roots don't reach the document; components with a modal
 * dialog in their shadow root dispatch this event instead, so others (like the notification stack)
 * can follow it into the top layer.
 */
export type SlModalToggleEvent = CustomEvent<{ dialog: HTMLDialogElement; open: boolean }>;

/**
 * Lets the document know a modal dialog has opened or closed. The event is composed, so it crosses
 * shadow boundaries; `detail.dialog` is the native dialog element.
 *
 * @param target The element to dispatch the event from, usually the host of the dialog.
 * @param dialog The native dialog element.
 * @param open Whether the dialog opened or closed.
 */
export const dispatchModalToggle = (
  target: EventTarget,
  dialog: HTMLDialogElement,
  open: boolean
): void => {
  target.dispatchEvent(
    new CustomEvent('sl-modal-toggle', { bubbles: true, composed: true, detail: { dialog, open } })
  );
};
