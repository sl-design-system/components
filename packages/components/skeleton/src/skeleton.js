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
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './skeleton.scss.js';
export class Skeleton extends LitElement {
  static {
    /** @internal */
    this.styles = styles;
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('aria-busy', 'true');
  }
}
__decorateClass([property({ reflect: true })], Skeleton.prototype, 'effect', 2);
__decorateClass([property({ reflect: true })], Skeleton.prototype, 'variant', 2);
//# sourceMappingURL=skeleton.js.map
