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
import { LitElement, ReactiveElement, html } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import styles from './button-bar.scss.js';
export class ButtonBar extends LitElement {
  static {
    /** @internal */
    this.styles = styles;
  }
  /** Element internals. */
  #internals = this.attachInternals();
  /** Observer for slot changes to update button states. */
  #observer = new MutationObserver(() => this.#onMutate());
  disconnectedCallback() {
    this.#observer.disconnect();
    super.disconnectedCallback();
  }
  firstUpdated(changes) {
    super.firstUpdated(changes);
    void this.#onMutate();
  }
  updated(changes) {
    super.updated(changes);
    if (changes.has('fill') || changes.has('size') || changes.has('variant')) {
      this.#updateButtons();
    }
  }
  render() {
    return html`<slot @slotchange=${this.#onSlotChange}></slot>`;
  }
  async #onMutate() {
    const buttons = (this.buttons ?? []).filter(el => el.tagName !== 'STYLE');
    if (buttons.length) {
      this.#internals.states.delete('empty');
      this.#updateButtons();
    } else {
      this.#internals.states.add('empty');
    }
    const icons = await Promise.all(
      buttons.map(async el => {
        if (el instanceof ReactiveElement) {
          await new Promise(resolve => setTimeout(resolve));
        }
        return (
          (el.matches(':state(icon-only)') || el.hasAttribute('icon-only')) &&
          el.getAttribute('fill') === 'ghost'
        );
      })
    );
    const iconOnly = !!icons.length && icons.every(Boolean);
    if (iconOnly) {
      this.#internals.states.add('icon-only');
    } else {
      this.#internals.states.delete('icon-only');
    }
  }
  #onSlotChange(event) {
    this.#observer.disconnect();
    const assigned = new Set(event.target.assignedElements({ flatten: true }));
    assigned.forEach(el => {
      this.#observer.observe(el, { attributes: true });
    });
    void this.#onMutate();
  }
  #updateButtons() {
    this.buttons
      ?.filter(el => el.tagName !== 'STYLE')
      .forEach(element => {
        const button = element;
        if (this.size) {
          button.size = this.size;
        }
        if (this.fill) {
          button.fill = this.fill;
        }
        if (this.variant) {
          button.variant = this.variant;
        }
      });
  }
}
__decorateClass([property({ reflect: true })], ButtonBar.prototype, 'align', 2);
__decorateClass([queryAssignedElements({ flatten: true })], ButtonBar.prototype, 'buttons', 2);
__decorateClass([property()], ButtonBar.prototype, 'fill', 2);
__decorateClass([property({ type: Boolean, reflect: true })], ButtonBar.prototype, 'reverse', 2);
__decorateClass([property()], ButtonBar.prototype, 'size', 2);
__decorateClass([property()], ButtonBar.prototype, 'variant', 2);
//# sourceMappingURL=button-bar.js.map
