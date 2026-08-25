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
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './hint.scss.js';
export class Hint extends LitElement {
  constructor() {
    super(...arguments);
    this.size = 'md';
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
    this.#slot.name = 'hint-text';
    this.prepend(this.#slot);
    if (this.parentElement?.tagName === 'SL-FORM-FIELD') {
      this.slot = 'hint';
    }
  }
  render() {
    return html`<slot></slot>`;
  }
}
__decorateClass([property({ reflect: true })], Hint.prototype, 'size', 2);
//# sourceMappingURL=hint.js.map
