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
import styles from './badge.scss.js';
export class Badge extends LitElement {
  static {
    /** @internal */
    this.styles = styles;
  }
  #mutationObserver = new MutationObserver(() => this.#updateRoundAttribute());
  connectedCallback() {
    super.connectedCallback();
    this.#mutationObserver.observe(this, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.#mutationObserver.disconnect();
  }
  render() {
    return html`<slot @slotchange=${this.#onSlotChange}></slot>`;
  }
  #onSlotChange() {
    this.#updateRoundAttribute();
  }
  #updateRoundAttribute() {
    const slot = this.shadowRoot?.querySelector('slot');
    if (!slot) return;
    const elements = slot.assignedElements({ flatten: true }),
      icon = elements.length === 1 && elements[0].tagName === 'SL-ICON',
      text = slot
        .assignedNodes({ flatten: true })
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent?.trim())
        .join('');
    this.toggleAttribute(
      'round',
      (icon && text === '') ||
        (!icon && text?.length === 1) ||
        (this.size === 'sm' && text?.length > 0)
    );
  }
}
__decorateClass([property({ reflect: true })], Badge.prototype, 'color', 2);
__decorateClass([property({ reflect: true })], Badge.prototype, 'emphasis', 2);
__decorateClass([property({ reflect: true })], Badge.prototype, 'size', 2);
__decorateClass([property({ reflect: true })], Badge.prototype, 'variant', 2);
//# sourceMappingURL=badge.js.map
