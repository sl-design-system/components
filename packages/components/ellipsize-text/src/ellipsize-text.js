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
import { Tooltip } from '@sl-design-system/tooltip';
import { LitElement, html, nothing } from 'lit';
import { state } from 'lit/decorators.js';
import styles from './ellipsize-text.scss.js';
export class EllipsizeText extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements() {
    return {
      'sl-tooltip': Tooltip
    };
  }
  static {
    /** @internal */
    this.styles = styles;
  }
  /** Observe size changes. */
  #observer = new ResizeObserver(() => this.#onResize());
  connectedCallback() {
    super.connectedCallback();
    this.#observer.observe(this);
  }
  disconnectedCallback() {
    this.#observer.disconnect();
    super.disconnectedCallback();
  }
  render() {
    return html`
      <slot id="slot"></slot>
      ${this.tooltip ? html`<sl-tooltip for="slot" type="description">${this.textContent?.trim()}</sl-tooltip>` : nothing}
    `;
  }
  #onResize() {
    const slot = this.renderRoot.querySelector('slot');
    this.tooltip = !!slot && slot.offsetWidth < slot.scrollWidth;
  }
}
__decorateClass([state()], EllipsizeText.prototype, 'tooltip', 2);
//# sourceMappingURL=ellipsize-text.js.map
