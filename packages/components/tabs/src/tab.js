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
import { EventsController } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './tab.scss.js';
export class Tab extends LitElement {
  static {
    /** @internal */
    this.styles = styles;
  }
  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, { keydown: this.#onKeydown });
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'tab');
    this.slot ||= 'tabs';
  }
  updated(changes) {
    super.updated(changes);
    if (changes.has('selected')) {
      this.setAttribute('aria-selected', Boolean(this.selected).toString());
    }
  }
  render() {
    return this.href && !this.disabled
      ? html`
          <a href=${this.href} part="outer" role="presentation" tabindex="-1">
            ${this.renderContent()}
          </a>
        `
      : html`<div part="outer">${this.renderContent()}</div>`;
  }
  /** @internal */
  renderContent() {
    return html`
      <div part="inner">
        <slot @slotchange=${this.#onIconSlotChange} name="icon" part="icon"></slot>
        <slot @slotchange=${this.#onSlotChange} part="title"></slot>
        <slot name="badge" part="badge"></slot>
        <slot @slotchange=${this.#onSubtitleSlotChange} name="subtitle" part="subtitle"></slot>
      </div>
    `;
  }
  #onIconSlotChange(event) {
    const hasIcon = event.target.assignedElements({ flatten: true }).length > 0;
    this.toggleAttribute('has-icon', hasIcon);
  }
  #onKeydown(event) {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    } else if (this.href && ['Enter', ' '].includes(event.key)) {
      this.renderRoot.querySelector('a')?.click();
    }
  }
  #onSlotChange(event) {
    const hasTitle = event.target
      .assignedNodes({ flatten: true })
      .some(node => !!node.textContent?.trim());
    this.toggleAttribute('has-title', hasTitle);
  }
  #onSubtitleSlotChange(event) {
    const hasSubtitle = event.target
      .assignedNodes({ flatten: true })
      .some(node => !!node.textContent?.trim());
    this.toggleAttribute('has-subtitle', hasSubtitle);
  }
}
__decorateClass([property({ type: Boolean, reflect: true })], Tab.prototype, 'disabled', 2);
__decorateClass([property()], Tab.prototype, 'href', 2);
__decorateClass([property({ type: Boolean, reflect: true })], Tab.prototype, 'selected', 2);
//# sourceMappingURL=tab.js.map
