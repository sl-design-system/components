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
import { FocusGroupController } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import { AccordionItem } from './accordion-item.js';
import styles from './accordion.scss.js';
const _Accordion = class _Accordion extends LitElement {
  constructor() {
    super(...arguments);
    /** Manage the keyboard navigation. */
    this.#focusGroupController = new FocusGroupController(this, {
      elements: () => this.items || [],
      focusInIndex: elements => elements.findIndex(el => !el.disabled),
      isFocusableElement: el => !el.disabled
    });
    this.iconType = _Accordion.iconType;
  }
  static {
    /**
     * This determines the icons used in the accordion. You can change this to `chevron` for all
     * accordions.
     */
    this.iconType = 'plusminus';
  }
  static {
    /** @internal */
    this.styles = styles;
  }
  #focusGroupController;
  updated(changes) {
    super.updated(changes);
    if (changes.has('iconType')) {
      this.items?.forEach(item => (item.iconType = this.iconType ?? _Accordion.iconType));
    }
  }
  render() {
    return html`<slot @slotchange=${this.#onSlotChange} @sl-toggle=${this.#onToggle}></slot>`;
  }
  #onSlotChange() {
    this.items?.forEach(item => (item.iconType = this.iconType ?? _Accordion.iconType));
    this.#focusGroupController.clearElementCache();
  }
  #onToggle(event) {
    if (!this.single || !event.detail) {
      return;
    }
    const item = event.composedPath().find(et => et instanceof AccordionItem);
    this.items?.filter(i => i !== item && i.open).forEach(i => i.toggle());
  }
};
__decorateClass([property({ attribute: 'icon-type' })], _Accordion.prototype, 'iconType', 2);
__decorateClass([queryAssignedElements({ flatten: true })], _Accordion.prototype, 'items', 2);
__decorateClass([property({ type: Boolean, reflect: true })], _Accordion.prototype, 'single', 2);
export let Accordion = _Accordion;
//# sourceMappingURL=accordion.js.map
