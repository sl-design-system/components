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
import { EventsController } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './field-button.scss.js';
export class FieldButton extends LitElement {
  static {
    /** @internal */
    this.styles = styles;
  }
  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, { keydown: this.#onKeydown });
  connectedCallback() {
    super.connectedCallback();
    this.role = 'button';
  }
  render() {
    return html`<slot></slot>`;
  }
  #onKeydown(event) {
    if (this.disabled) {
      return;
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.click();
    }
  }
}
__decorateClass([property({ type: Boolean, reflect: true })], FieldButton.prototype, 'disabled', 2);
__decorateClass([property({ reflect: true })], FieldButton.prototype, 'size', 2);
//# sourceMappingURL=field-button.js.map
