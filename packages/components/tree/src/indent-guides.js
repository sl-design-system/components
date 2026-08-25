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
import { classMap } from 'lit/directives/class-map.js';
import styles from './indent-guides.scss.js';
export class IndentGuides extends LitElement {
  constructor() {
    super(...arguments);
    this.level = 0;
  }
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
      ${Array.from({ length: this.level }).map(
        (_, index) => html`
          <div
            class=${classMap({
              guide: true,
              first: index === 0,
              last: index === this.level - 1,
              visible: this.levelGuides?.includes(index) ?? false
            })}></div>
        `
      )}
      ${this.selected ? html`<div class="selected"></div>` : nothing}
    `;
  }
}
__decorateClass(
  [property({ type: Boolean, attribute: 'last-node-in-level', reflect: true })],
  IndentGuides.prototype,
  'lastNodeInLevel',
  2
);
__decorateClass([property({ type: Number })], IndentGuides.prototype, 'level', 2);
__decorateClass(
  [property({ type: Array, attribute: 'level-guides' })],
  IndentGuides.prototype,
  'levelGuides',
  2
);
__decorateClass([property({ type: Boolean })], IndentGuides.prototype, 'selected', 2);
__decorateClass([property({ type: Boolean, reflect: true })], IndentGuides.prototype, 'visible', 2);
//# sourceMappingURL=indent-guides.js.map
