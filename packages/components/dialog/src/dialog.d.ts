import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type EventEmitter } from '@sl-design-system/shared';
import { type SlCancelEvent } from '@sl-design-system/shared/events.js';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  nothing
} from 'lit';
declare global {
  interface GlobalEventHandlersEventMap {
    command: Event;
    'sl-close': SlCloseEvent;
  }
  interface HTMLElementTagNameMap {
    'sl-dialog': Dialog;
  }
}
export type SlCloseEvent = CustomEvent<void>;
declare const Dialog_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
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
export declare class Dialog extends Dialog_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  /** @internal */
  body?: HTMLElement;
  /**
   * @internal Emits when the dialog has been cancelled. This happens when the
   * user closes the dialog using the escape key or clicks on the backdrop.
   */
  cancelEvent: EventEmitter<SlCancelEvent>;
  /**
   * Determines whether a close button should be shown in the top right corner.
   *
   * @default false
   */
  closeButton?: boolean;
  /** @internal Emits when the dialog has been closed. */
  closeEvent: EventEmitter<SlCloseEvent>;
  /** @internal */
  dialog?: HTMLDialogElement;
  /**
   * The role for the dialog element.
   *
   * @default 'dialog'
   */
  dialogRole: 'dialog' | 'alertdialog';
  /**
   * Disables the ability to cancel the dialog by pressing the Escape key or clicking on the
   * backdrop. We recommend setting this to true when the dialog contains a form that must be
   * submitted or cancelled, to prevent accidental closing when clicking on the backdrop.
   *
   * @default false
   */
  disableCancel?: boolean;
  connectedCallback(): void;
  disconnectedCallback(): void;
  updated(changes: PropertyValues<this>): void;
  render(): TemplateResult;
  /**
   * Override this method to customize the header of the dialog. If you only want to customize the
   * title, you can use the `title` argument and call `super.renderHeader('My title')` to render the
   * default header.
   *
   * Beware when customizing the header: the `<dialog>` element is labelled by the element with ID
   * `title`. If you override this method, make sure to include an element with ID `title` in the
   * header.
   *
   * Only use this when extending the `Dialog` class. If you are using the `<sl-dialog>` custom
   * element, use the slots.
   */
  renderHeader(title?: string): TemplateResult;
  /**
   * Override this method to customize the body of the dialog.
   *
   * Only use this when extending the `Dialog` class. If you are using the `<sl-dialog>` custom
   * element, use the slots.
   */
  renderBody(): TemplateResult;
  /**
   * Override this method to customize the footer of the dialog. If you only want to add action
   * buttons, see the `renderActions` method.
   *
   * Only use this when extending the `Dialog` class. If you are using the `<sl-dialog>` custom
   * element, use the slots.
   */
  renderFooter(): TemplateResult;
  /**
   * Override this method to customize the actions in the footer of the dialog.
   *
   * Only use this when extending the `Dialog` class. If you are using the `<sl-dialog>` custom
   * element, use the slots.
   */
  renderActions(): TemplateResult | typeof nothing;
  /**
   * Override this method to customize the primary actions in the footer of the dialog.
   *
   * Only use this when extending the `Dialog` class. If you are using the `<sl-dialog>` custom
   * element, use the slots.
   */
  renderPrimaryActions(): TemplateResult | typeof nothing;
  /**
   * Override this method to customize the secondary actions in the footer of the dialog.
   *
   * Only use this when extending the `Dialog` class. If you are using the `<sl-dialog>` custom
   * element, use the slots.
   */
  renderSecondaryActions(): TemplateResult | typeof nothing;
  /** Show the dialog as a modal, in the top layer, with a backdrop. */
  showModal(): void;
  /**
   * Close the dialog.
   *
   * @param returnValue - Optional value to set as the dialog's return value.
   */
  close(returnValue?: string): void;
  /**
   * Request the dialog to close. This will fire a `cancel` event on the `<dialog>`, which can be
   * prevented. If not prevented, the dialog will close.
   *
   * @param returnValue - Optional value to set as the dialog's return value.
   */
  requestClose(returnValue?: string): void;
}
export {};
