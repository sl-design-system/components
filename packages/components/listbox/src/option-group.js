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
import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { OptionGroupHeader } from './option-group-header.js';
import styles from './option-group.scss.js';
export class OptionGroup extends ScopedElementsMixin(LitElement) {
  /** Watches for `label` attribute updates so we can consume and remove it from the host. */
  #labelObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type !== 'attributes' || mutation.attributeName !== 'label') {
        return;
      }
      const value = this.getAttribute('label');
      if (value !== null) {
        this.label = value;
        this.removeAttribute('label');
      }
    });
  });
  /** @internal */
  static get scopedElements() {
    return {
      'sl-option-group-header': OptionGroupHeader
    };
  }
  static {
    /** @internal */
    this.styles = styles;
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.hasAttribute('label')) {
      this.label = this.getAttribute('label') || void 0;
      this.removeAttribute('label');
    }
    this.#labelObserver.observe(this, { attributes: true, attributeFilter: ['label'] });
    const style = document.createElement('style');
    style.innerHTML = `
      sl-option-group:has(+ sl-option) {
        border-block-end: var(--sl-color-border-plain) solid var(--sl-size-borderWidth-default);
        margin-block-end: var(--sl-size-050);
        padding-block-end: var(--sl-size-050);
      }
    `;
    this.prepend(style);
  }
  disconnectedCallback() {
    this.#labelObserver.disconnect();
    super.disconnectedCallback();
  }
  render() {
    return html`
      <div part="wrapper">
        ${this.label ? html`<sl-option-group-header>${this.label}</sl-option-group-header>` : nothing}
        <slot></slot>
      </div>
    `;
  }
}
__decorateClass([property({ attribute: false })], OptionGroup.prototype, 'label', 2);
//# sourceMappingURL=option-group.js.map
