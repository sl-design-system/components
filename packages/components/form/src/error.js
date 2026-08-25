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
import { Icon } from '@sl-design-system/icon';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './error.scss.js';
export class Error extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements() {
    return {
      'sl-icon': Icon
    };
  }
  static {
    /** @internal */
    this.styles = styles;
  }
  /** The light DOM slot. */
  #slot;
  connectedCallback() {
    super.connectedCallback();
    this.#slot ??= document.createElement('slot');
    this.#slot.name = 'error-text';
    this.prepend(this.#slot);
    if (this.parentElement?.tagName === 'SL-FORM-FIELD') {
      this.slot = 'error';
    }
  }
  render() {
    return html`
      <sl-icon name="triangle-exclamation-solid"></sl-icon>
      <slot></slot>
    `;
  }
}
__decorateClass([property()], Error.prototype, 'for', 2);
//# sourceMappingURL=error.js.map
