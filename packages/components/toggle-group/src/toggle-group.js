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
import { RovingTabindexController } from '@sl-design-system/shared';
import { ToggleButton } from '@sl-design-system/toggle-button';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './toggle-group.scss.js';
export class ToggleGroup extends LitElement {
  static {
    /** @internal */
    this.styles = styles;
  }
  get #buttons() {
    return (
      this.renderRoot
        .querySelector('slot')
        ?.assignedElements({ flatten: true })
        .filter(element => element instanceof ToggleButton) ?? []
    );
  }
  /** Manage keyboard navigation between buttons. */
  #rovingTabindexController = new RovingTabindexController(this, {
    focusInIndex: elements => elements.findIndex(el => !el.disabled),
    direction: 'horizontal',
    elements: () => this.#buttons || [],
    isFocusableElement: el => !el.disabled
  });
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'region');
  }
  updated(changes) {
    super.updated(changes);
    if (changes.has('disabled') || changes.has('fill') || changes.has('size')) {
      this.#updateButtonProperties();
    }
  }
  render() {
    return html`<slot @sl-toggle=${this.#onToggle} @slotchange=${this.#onSlotChange}></slot>`;
  }
  #onSlotChange() {
    this.#rovingTabindexController.clearElementCache();
    this.#updateButtonProperties();
  }
  #onToggle(event) {
    if (!this.multiple && event.detail) {
      this.#buttons
        .filter(button => button !== event.target)
        .forEach(button => (button.pressed = false));
    }
  }
  #updateButtonProperties() {
    this.#buttons.forEach(button => {
      if (typeof this.disabled === 'boolean') {
        button.disabled = this.disabled;
      }
      button.fill = this.fill;
      if (this.size) {
        button.size = this.size;
      }
    });
  }
}
__decorateClass([property({ type: Boolean, reflect: true })], ToggleGroup.prototype, 'disabled', 2);
__decorateClass([property({ type: Boolean })], ToggleGroup.prototype, 'multiple', 2);
__decorateClass([property({ reflect: true })], ToggleGroup.prototype, 'size', 2);
__decorateClass([property({ reflect: true })], ToggleGroup.prototype, 'shape', 2);
__decorateClass([property({ reflect: true })], ToggleGroup.prototype, 'fill', 2);
//# sourceMappingURL=toggle-group.js.map
