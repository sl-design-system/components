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
import { property, query, state } from 'lit/decorators.js';
import styles from './radio.scss.js';
export class Radio extends LitElement {
  static {
    /** @internal */
    this.shadowRootOptions = {
      ...LitElement.shadowRootOptions,
      delegatesFocus: true
    };
  }
  static {
    /** @internal */
    this.styles = styles;
  }
  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, {
    click: this.#onClick,
    keydown: this.#onKeydown
  });
  #tabIndex = 0;
  get tabIndex() {
    return this.#tabIndex;
  }
  set tabIndex(value) {
    const oldValue = this.#tabIndex;
    this.#tabIndex = value;
    if (this.wrapper && oldValue !== value) {
      this.wrapper.tabIndex = value;
    }
    this.setAttribute('tabindex', value.toString());
  }
  connectedCallback() {
    super.connectedCallback();
    this.checked ??= false;
    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = this.disabled ? -1 : 0;
    } else {
      this.#tabIndex = parseInt(this.getAttribute('tabindex') || '0', 10);
    }
  }
  updated(changes) {
    super.updated(changes);
    if (this.wrapper) {
      if (changes.has('checked')) {
        this.wrapper.setAttribute('aria-checked', Boolean(this.checked).toString());
      }
      if (changes.has('disabled')) {
        this.tabIndex = this.disabled ? -1 : 0;
      }
      this.wrapper.tabIndex = this.tabIndex;
    }
  }
  render() {
    return html`
      <div
        part="wrapper"
        role="radio"
        aria-checked=${Boolean(this.checked)}
        aria-disabled=${this.disabled ? 'true' : 'false'}>
        <div part="box">
          ${
            this.checked
              ? html`
                  <svg version="1.1" aria-hidden="true" part="svg" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="6"></circle>
                  </svg>
                `
              : html`<svg version="1.1" aria-hidden="true" part="svg" viewBox="0 0 24 24"></svg>`
          }
        </div>
        <span part="label">
          <slot @slotchange=${() => this.#onLabelSlotChange()}></slot>
        </span>
      </div>
      <slot name="infotip" @slotchange=${() => this.#onInfotipSlotChange()}></slot>
    `;
  }
  firstUpdated() {
    this.#onLabelSlotChange();
    this.#onInfotipSlotChange();
  }
  focus() {
    this.wrapper?.focus();
  }
  blur() {
    this.wrapper?.blur();
  }
  #onClick(event) {
    if (this.disabled || (this.infotip && event.composedPath().includes(this.infotip))) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.checked = true;
  }
  #onKeydown(event) {
    if (['Enter', ' '].includes(event.key)) {
      this.#onClick(event);
    }
  }
  #labelText() {
    const slot = this.shadowRoot?.querySelector('slot:not([name])'),
      nodes = slot?.assignedNodes({ flatten: true }) || [];
    return nodes
      .map(node => node.textContent?.trim() || '')
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  #onLabelSlotChange() {
    if (this.infotip && !this.infotip.describes) {
      this.infotip.describes = this.#labelText();
    }
  }
  #onInfotipSlotChange() {
    const slot = this.shadowRoot?.querySelector('slot[name="infotip"]'),
      assignedElements = slot?.assignedElements({ flatten: true }) || [];
    this.infotip =
      assignedElements.find(el => el instanceof HTMLElement && el.tagName === 'SL-INFOTIP') ||
      void 0;
    if (this.infotip) {
      this.infotip.setAttribute('size', 'sm');
      if (!this.infotip.describes) {
        this.infotip.describes = this.#labelText();
      }
    }
  }
}
__decorateClass([property({ type: Boolean, reflect: true })], Radio.prototype, 'checked', 2);
__decorateClass([property({ type: Boolean, reflect: true })], Radio.prototype, 'disabled', 2);
__decorateClass(
  [property({ attribute: 'show-validity', reflect: true })],
  Radio.prototype,
  'showValidity',
  2
);
__decorateClass([state()], Radio.prototype, 'infotip', 2);
__decorateClass([query('[part="wrapper"]')], Radio.prototype, 'wrapper', 2);
__decorateClass([property({ reflect: true })], Radio.prototype, 'size', 2);
__decorateClass([property()], Radio.prototype, 'value', 2);
//# sourceMappingURL=radio.js.map
