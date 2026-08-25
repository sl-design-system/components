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
var __privateGet = (obj, member, getter) => (
  __accessCheck(obj, member, 'read from private field'),
  getter ? getter.call(obj) : member.get(obj)
);
var __privateAdd = (obj, member, value) =>
  member.has(obj)
    ? __typeError('Cannot add the same private member more than once')
    : member instanceof WeakSet
      ? member.add(obj)
      : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (
  __accessCheck(obj, member, 'write to private field'),
  setter ? setter.call(obj, value) : member.set(obj, value),
  value
);
var __privateMethod = (obj, member, method) => (
  __accessCheck(obj, member, 'access private method'),
  method
);
var _events,
  _leaveAnimationAbort,
  _media,
  _observer,
  _Dialog_instances,
  onBackdropClick_fn,
  onClick_fn,
  onCommand_fn,
  onClose_fn,
  onCloseClick_fn,
  _onMediaChange,
  onKeydown_fn,
  onScroll_fn,
  listenForLeaveAnimationEnd_fn,
  updateDocumentElement_fn,
  updatePrimaryButtons_fn;
import { localized, msg } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { ButtonBar } from '@sl-design-system/button-bar';
import { Icon } from '@sl-design-system/icon';
import { EventsController, MediaController, event } from '@sl-design-system/shared';
import { LitElement, html, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './dialog.scss.js';
export let Dialog = class extends ScopedElementsMixin(LitElement) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _Dialog_instances);
    // eslint-disable-next-line no-unused-private-class-members
    __privateAdd(
      this,
      _events,
      new EventsController(this, {
        click: __privateMethod(this, _Dialog_instances, onClick_fn),
        command: __privateMethod(this, _Dialog_instances, onCommand_fn),
        keydown: __privateMethod(this, _Dialog_instances, onKeydown_fn)
      })
    );
    /** Abort controller for the leave animation listener. */
    __privateAdd(this, _leaveAnimationAbort);
    /** Responsive behavior utility. */
    __privateAdd(
      this,
      _media,
      new MediaController(this, {
        onChange: event2 => __privateGet(this, _onMediaChange).call(this, event2)
      })
    );
    /** Observe size changes to the dialog. */
    __privateAdd(
      this,
      _observer,
      new ResizeObserver(() => __privateMethod(this, _Dialog_instances, onScroll_fn).call(this))
    );
    this.dialogRole = 'dialog';
    __privateAdd(this, _onMediaChange, ({ previous, current }) => {
      if (!this.dialog?.open) {
        return;
      }
      if (previous === 'mobile') {
        document.documentElement.classList.remove('sl-dialog-enter');
        document.documentElement.classList.add('sl-dialog-leave');
        __privateMethod(this, _Dialog_instances, listenForLeaveAnimationEnd_fn).call(this);
      } else if (current === 'mobile') {
        document.documentElement.classList.remove('sl-dialog-leave');
        document.documentElement.classList.add('sl-dialog-enter');
      }
    });
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-button': Button,
      'sl-button-bar': ButtonBar,
      'sl-icon': Icon
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.inert = true;
  }
  disconnectedCallback() {
    __privateGet(this, _observer).disconnect();
    __privateGet(this, _leaveAnimationAbort)?.abort();
    if (this.dialog?.open) {
      document.documentElement.classList.remove('sl-dialog-enter', 'sl-dialog-leave');
      document.documentElement.style.overflow = '';
    }
    super.disconnectedCallback();
  }
  updated(changes) {
    super.updated(changes);
    __privateMethod(this, _Dialog_instances, updatePrimaryButtons_fn).call(this);
  }
  render() {
    return html`
      <dialog
        @click=${__privateMethod(this, _Dialog_instances, onBackdropClick_fn)}
        @close=${__privateMethod(this, _Dialog_instances, onClose_fn)}
        aria-labelledby="title"
        role=${ifDefined(this.dialogRole === 'dialog' ? void 0 : this.dialogRole)}
        part="dialog">
        <div part="header">${this.renderHeader()}</div>
        <div @scroll=${__privateMethod(this, _Dialog_instances, onScroll_fn)} part="body">
          ${this.renderBody()}
        </div>
        ${__privateGet(this, _media).mobile ? nothing : html`<div part="footer">${this.renderFooter()}</div>`}
      </dialog>
    `;
  }
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
  renderHeader(title = '') {
    return html`
      <slot name="header">
        <div part="titles">
          <slot name="title" id="title">
            <h1>${title}</h1>
          </slot>
          ${
            __privateGet(this, _media).mobile
              ? html`
                  <slot
                    @slotchange=${__privateMethod(this, _Dialog_instances, updatePrimaryButtons_fn)}
                    name="primary-actions">
                    ${this.renderPrimaryActions()}
                  </slot>
                `
              : nothing
          }
        </div>
        ${
          this.closeButton
            ? html`
                <sl-button
                  @click=${__privateMethod(this, _Dialog_instances, onCloseClick_fn)}
                  aria-label=${msg('Close', { id: 'sl.common.close' })}
                  class="sl-close"
                  fill="ghost"
                  variant="default">
                  <sl-icon name="xmark"></sl-icon>
                </sl-button>
              `
            : nothing
        }
      </slot>
    `;
  }
  /**
   * Override this method to customize the body of the dialog.
   *
   * Only use this when extending the `Dialog` class. If you are using the `<sl-dialog>` custom
   * element, use the slots.
   */
  renderBody() {
    return html`
      <slot></slot>
      ${
        __privateGet(this, _media).mobile
          ? html`
              <sl-button-bar part="footer-bar">
                <slot name="secondary-actions">${this.renderSecondaryActions()}</slot>
              </sl-button-bar>
            `
          : nothing
      }
    `;
  }
  /**
   * Override this method to customize the footer of the dialog. If you only want to add action
   * buttons, see the `renderActions` method.
   *
   * Only use this when extending the `Dialog` class. If you are using the `<sl-dialog>` custom
   * element, use the slots.
   */
  renderFooter() {
    return html`
      <slot name="footer">
        <sl-button-bar align="end" part="footer-bar">
          ${__privateGet(this, _media).mobile ? nothing : this.renderActions()}
        </sl-button-bar>
      </slot>
    `;
  }
  /**
   * Override this method to customize the actions in the footer of the dialog.
   *
   * Only use this when extending the `Dialog` class. If you are using the `<sl-dialog>` custom
   * element, use the slots.
   */
  renderActions() {
    return html`
      <slot name="secondary-actions">${this.renderSecondaryActions()}</slot>
      <slot
        @slotchange=${__privateMethod(this, _Dialog_instances, updatePrimaryButtons_fn)}
        name="primary-actions">
        ${this.renderPrimaryActions()}
      </slot>
    `;
  }
  /**
   * Override this method to customize the primary actions in the footer of the dialog.
   *
   * Only use this when extending the `Dialog` class. If you are using the `<sl-dialog>` custom
   * element, use the slots.
   */
  renderPrimaryActions() {
    return nothing;
  }
  /**
   * Override this method to customize the secondary actions in the footer of the dialog.
   *
   * Only use this when extending the `Dialog` class. If you are using the `<sl-dialog>` custom
   * element, use the slots.
   */
  renderSecondaryActions() {
    return nothing;
  }
  /** Show the dialog as a modal, in the top layer, with a backdrop. */
  showModal() {
    if (this.dialog?.open) {
      return;
    }
    __privateMethod(this, _Dialog_instances, updateDocumentElement_fn).call(this, true);
    __privateGet(this, _observer).observe(this.dialog);
    __privateGet(this, _observer).observe(this.body);
    this.inert = false;
    this.dialog?.showModal();
    requestAnimationFrame(() => {
      const focusable = this.querySelector('[autofocus], [tabindex]:not([tabindex="-1"])');
      if (focusable && this.shadowRoot?.activeElement !== focusable) {
        focusable.focus();
      }
    });
  }
  /**
   * Close the dialog.
   *
   * @param returnValue - Optional value to set as the dialog's return value.
   */
  close(returnValue) {
    if (!this.dialog?.open || this.dialog.classList.contains('closing')) {
      return;
    }
    __privateGet(this, _observer).disconnect();
    __privateMethod(this, _Dialog_instances, updateDocumentElement_fn).call(this, false);
    if (CSS.supports('overlay', 'auto')) {
      this.dialog.close(returnValue);
    } else {
      this.dialog.classList.add('closing');
      requestAnimationFrame(() => {
        void Promise.allSettled(
          this.dialog?.getAnimations()?.map(animation => animation.finished) ?? []
        ).then(() => {
          this.dialog?.close(returnValue);
        });
      });
    }
  }
  /**
   * Request the dialog to close. This will fire a `cancel` event on the `<dialog>`, which can be
   * prevented. If not prevented, the dialog will close.
   *
   * @param returnValue - Optional value to set as the dialog's return value.
   */
  requestClose(returnValue) {
    this.dialog?.requestClose(returnValue);
  }
};
_events = new WeakMap();
_leaveAnimationAbort = new WeakMap();
_media = new WeakMap();
_observer = new WeakMap();
_Dialog_instances = new WeakSet();
onBackdropClick_fn = function (event2) {
  if (this.dialog !== event2.composedPath()[0]) {
    return;
  }
  const rect = this.dialog.getBoundingClientRect();
  if (
    !this.disableCancel &&
    (event2.clientY < rect.top ||
      event2.clientY > rect.bottom ||
      event2.clientX < rect.left ||
      event2.clientX > rect.right)
  ) {
    event2.preventDefault();
    event2.stopPropagation();
    this.cancelEvent.emit();
    this.close();
  }
};
onClick_fn = function (event2) {
  const button = event2.composedPath().find(el => el instanceof Button);
  if (button?.hasAttribute('sl-dialog-close')) {
    this.close();
  }
};
onCommand_fn = function (event2) {
  const { command } = event2;
  if (command === '--show-modal') {
    event2.preventDefault();
    this.showModal();
  } else if (command === '--close') {
    event2.preventDefault();
    this.close();
  } else if (command === '--request-close') {
    event2.preventDefault();
    this.requestClose();
  }
};
onClose_fn = async function () {
  if (document.documentElement.classList.contains('sl-dialog-enter')) {
    __privateMethod(this, _Dialog_instances, updateDocumentElement_fn).call(this, false);
  }
  document.documentElement.style.overflow = '';
  this.inert = true;
  await Promise.allSettled(
    this.dialog?.getAnimations({ subtree: true })?.map(animation => animation.finished) ?? []
  );
  this.dialog?.classList.remove('closing');
  this.closeEvent.emit();
};
onCloseClick_fn = function (event2) {
  event2.preventDefault();
  event2.stopPropagation();
  this.close();
};
_onMediaChange = new WeakMap();
onKeydown_fn = function (event2) {
  if (event2.key === 'Escape') {
    event2.preventDefault();
    if (this.disableCancel) {
      event2.stopPropagation();
    } else {
      this.cancelEvent.emit();
      this.close();
    }
  }
};
onScroll_fn = function () {
  const { clientHeight, scrollTop, scrollHeight } = this.body;
  this.renderRoot.querySelector('[part="header"]')?.toggleAttribute('sticky', scrollTop > 0);
  this.renderRoot
    .querySelector('[part="footer"]')
    ?.toggleAttribute('sticky', scrollTop + clientHeight < scrollHeight);
};
listenForLeaveAnimationEnd_fn = function () {
  __privateGet(this, _leaveAnimationAbort)?.abort();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.remove('sl-dialog-leave');
    return;
  }
  const controller = new AbortController();
  __privateSet(this, _leaveAnimationAbort, controller);
  const onLeaveAnimation = event2 => {
    if (event2.animationName === 'sl-dialog-leave') {
      document.documentElement.classList.remove('sl-dialog-leave');
      controller.abort();
    }
  };
  document.body.addEventListener('animationend', onLeaveAnimation, { signal: controller.signal });
  document.body.addEventListener('animationcancel', onLeaveAnimation, {
    signal: controller.signal
  });
};
updateDocumentElement_fn = function (opening) {
  if (opening) {
    document.documentElement.classList.remove('sl-dialog-leave');
    document.documentElement.classList.add('sl-dialog-enter');
    document.documentElement.style.overflow = 'hidden';
  } else {
    document.documentElement.classList.remove('sl-dialog-enter', 'sl-dialog-leave');
    if (__privateGet(this, _media).mobile) {
      document.documentElement.classList.add('sl-dialog-leave');
      __privateMethod(this, _Dialog_instances, listenForLeaveAnimationEnd_fn).call(this);
    }
  }
};
updatePrimaryButtons_fn = function () {
  const buttons =
    this.renderRoot.querySelector('slot[name="primary-actions"]')?.assignedElements({
      flatten: true
    }) ?? [];
  if (buttons.length > 1) {
    buttons.at(0)?.setAttribute('fill', __privateGet(this, _media).mobile ? 'link' : 'outline');
    buttons.at(-1)?.setAttribute('fill', __privateGet(this, _media).mobile ? 'link' : 'solid');
  } else {
    buttons.at(0)?.setAttribute('fill', __privateGet(this, _media).mobile ? 'link' : 'solid');
  }
};
/** @internal */
Dialog.styles = styles;
__decorateClass([query('[part="body"]')], Dialog.prototype, 'body', 2);
__decorateClass([event({ name: 'sl-cancel' })], Dialog.prototype, 'cancelEvent', 2);
__decorateClass(
  [property({ type: Boolean, attribute: 'close-button' })],
  Dialog.prototype,
  'closeButton',
  2
);
__decorateClass([event({ name: 'sl-close' })], Dialog.prototype, 'closeEvent', 2);
__decorateClass([query('dialog')], Dialog.prototype, 'dialog', 2);
__decorateClass([property({ attribute: 'dialog-role' })], Dialog.prototype, 'dialogRole', 2);
__decorateClass(
  [property({ type: Boolean, attribute: 'disable-cancel' })],
  Dialog.prototype,
  'disableCancel',
  2
);
Dialog = __decorateClass([localized()], Dialog);
//# sourceMappingURL=dialog.js.map
