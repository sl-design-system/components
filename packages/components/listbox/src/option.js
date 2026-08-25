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
import styles from './option.scss.js';
export class Option extends ScopedElementsMixin(LitElement) {
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
  /** The value of the option. */
  #value;
  /** Whether this option is disabled. */
  #disabled;
  get disabled() {
    return this.#disabled;
  }
  set disabled(disabled) {
    const oldDisabled = this.#disabled;
    this.#disabled = disabled;
    this.#syncAriaDisabled();
    this.requestUpdate('disabled', oldDisabled);
  }
  /** @internal */
  get textContent() {
    return this.#getSlottedTextContent();
  }
  /** @internal */
  set textContent(textContent) {
    super.textContent = textContent;
  }
  get value() {
    return this.#value ?? this.textContent;
  }
  set value(value) {
    this.#value = value;
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'option');
    this.#syncAriaDisabled();
  }
  render() {
    return html`
      <div part="container">
        <sl-icon name="check"></sl-icon>
        <div part="wrapper">
          <slot></slot>
        </div>
      </div>
    `;
  }
  #getSlottedTextContent() {
    if (!this.shadowRoot) {
      return '';
    }
    const nodes =
      this.shadowRoot.querySelector('slot')?.assignedNodes({ flatten: true }) ??
      Array.from(this.childNodes);
    return nodes
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent)
      .join('');
  }
  #syncAriaDisabled() {
    if (this.disabled) {
      this.setAttribute('aria-disabled', 'true');
    } else {
      this.removeAttribute('aria-disabled');
    }
  }
}
__decorateClass([property({ type: Boolean, reflect: true })], Option.prototype, 'disabled', 1);
__decorateClass([property({ reflect: true })], Option.prototype, 'emphasis', 2);
__decorateClass([property({ type: Boolean, reflect: true })], Option.prototype, 'selected', 2);
__decorateClass([property()], Option.prototype, 'value', 1);
//# sourceMappingURL=option.js.map
