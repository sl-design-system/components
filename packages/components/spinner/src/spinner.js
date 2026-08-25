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
import styles from './spinner.scss.js';
export class Spinner extends LitElement {
  static {
    /** @internal */
    this.styles = styles;
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'presentation');
      this.setAttribute('aria-hidden', 'true');
    }
  }
  render() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-24 -24 48 48">
        <g class="slow">
          <g class="fast">
            <g transform="translate(-24, -24)">
              <path
                class="track"
                fill-rule="evenodd"
                d="M24 6C14.059 6 6 14.059 6 24s8.059 18 18 18 18-8.059 18-18S33.941 6 24 6ZM0 24C0 10.745 10.745 0 24 0s24 10.745 24 24-10.745 24-24 24S0 37.255 0 24Z"
                clip-rule="evenodd" />
              <path
                class="fill"
                fill-rule="evenodd"
                d="M24 6C14.059 6 6 14.059 6 24a3 3 0 1 1-6 0C0 10.745 10.745 0 24 0s24 10.745 24 24a3 3 0 1 1-6 0c0-9.941-8.059-18-18-18Z"
                clip-rule="evenodd" />
            </g>
          </g>
        </g>
      </svg>
    `;
  }
}
__decorateClass([property({ reflect: true })], Spinner.prototype, 'size', 2);
//# sourceMappingURL=spinner.js.map
