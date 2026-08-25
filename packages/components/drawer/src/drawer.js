var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if ((decorator = decorators[i]))
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { ButtonBar } from '@sl-design-system/button-bar';
import { LitElement, html } from 'lit';
import { property, query } from 'lit/decorators.js';
import styles from './drawer.scss.js';
export class Drawer extends ScopedElementsMixin(LitElement) {
  constructor() {
    super(...arguments);
    this.disableClose = false;
    this.attachment = 'right';
    this.closeButtonSize = 'sm';
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-button': Button,
      'sl-button-bar': ButtonBar
    };
  }
  static {
    /** @internal */
    this.styles = styles;
  }
  connectedCallback() {
    super.connectedCallback();
    this.inert = true;
  }
  render() {
    return html`
      <dialog
        @cancel=${this.#onCancel}
        @click=${this.#onClick}
        @close=${this.#onClose}
        aria-labelledby="title"
        part="dialog">
        <div>
          <sl-button-bar>
            <sl-button
              sl-dialog-close
              .size=${this.closeButtonSize}
              tab-index="0"
              aria-label="back to page"
              title="close"
              >x</sl-button
            >
            <slot name="actions"></slot>
          </sl-button-bar>
          <slot name="title" id="title"></slot>
        </div>
        <slot></slot>
      </dialog>
    `;
  }
  showModal() {
    this.inert = false;
    this.dialog?.showModal();
    document.documentElement.style.overflow = 'hidden';
  }
  close() {
    if (this.dialog?.open) {
      this.dialog?.close();
    }
  }
  #onCancel(event) {
    if (this.disableClose) {
      event.preventDefault();
    }
  }
  #onClick(event) {
    if (event.target.matches('sl-button[sl-dialog-close]')) {
      this.dialog?.close(event.target.getAttribute('sl-dialog-close') || '');
    } else if (!this.disableClose && this.dialog) {
      const rect = this.dialog.getBoundingClientRect();
      if (
        event.clientY < rect.top ||
        event.clientY > rect.bottom ||
        event.clientX < rect.left ||
        event.clientX > rect.right
      ) {
        this.dialog.close();
      }
    }
  }
  #onClose() {
    document.documentElement.style.overflow = '';
    this.inert = true;
  }
}
__decorateClass([query('dialog')], Drawer.prototype, 'dialog', 2);
__decorateClass(
  [property({ type: Boolean, attribute: 'disable-close' })],
  Drawer.prototype,
  'disableClose',
  2
);
__decorateClass([property({ reflect: true })], Drawer.prototype, 'attachment', 2);
__decorateClass(
  [property({ attribute: 'close-button-size' })],
  Drawer.prototype,
  'closeButtonSize',
  2
);
//# sourceMappingURL=drawer.js.map
