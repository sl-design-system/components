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
import styles from './menu-item-group.scss.js';
import { MenuItem } from './menu-item.js';
export class MenuItemGroup extends LitElement {
  static {
    /** @internal */
    this.styles = styles;
  }
  /** The slotted menu items. */
  #menuItems = [];
  connectedCallback() {
    super.connectedCallback();
    this.role = 'group';
    this.#updateAriaLabel();
  }
  update(changes) {
    super.update(changes);
    if (changes.has('heading')) {
      this.#updateAriaLabel();
    }
  }
  render() {
    return html`
      <div part="wrapper">
        <slot name="header" @slotchange=${this.#onHeaderSlotchange}
          >${this.heading ? html`<div class="heading" aria-hidden="true">${this.heading}</div>` : nothing}</slot
        >
        <slot @slotchange=${this.#onSlotchange} @sl-select=${this.#onSelect}></slot>
      </div>
    `;
  }
  #updateAriaLabel() {
    const slottedHeader = this.querySelector('[slot="header"]');
    const headerText = slottedHeader?.textContent?.trim();
    if (headerText) {
      this.setAttribute('aria-label', headerText);
    } else if (this.heading) {
      this.setAttribute('aria-label', this.heading);
    } else {
      this.removeAttribute('aria-label');
    }
  }
  #onHeaderSlotchange() {
    this.#updateAriaLabel();
  }
  #onSelect(event) {
    if (!this.selects) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (this.selects === 'single') {
      this.#menuItems.forEach(item => {
        if (item !== event.target) {
          item.selected = false;
        }
      });
    }
  }
  #onSlotchange(event) {
    this.#menuItems = event.target
      .assignedElements({ flatten: true })
      .filter(element => element instanceof MenuItem);
  }
}
__decorateClass([property()], MenuItemGroup.prototype, 'heading', 2);
__decorateClass([property()], MenuItemGroup.prototype, 'selects', 2);
//# sourceMappingURL=menu-item-group.js.map
