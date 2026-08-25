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
import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './option-group-header.scss.js';
export class OptionGroupHeader extends LitElement {
  static {
    /** @internal */
    this.styles = styles;
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('aria-hidden', 'true');
  }
  render() {
    return html`
      ${this.divider ? html`<div class="divider"></div>` : nothing}
      <div class="wrapper">
        <slot></slot>
      </div>
    `;
  }
}
__decorateClass(
  [property({ type: Boolean, reflect: true })],
  OptionGroupHeader.prototype,
  'divider',
  2
);
//# sourceMappingURL=option-group-header.js.map
