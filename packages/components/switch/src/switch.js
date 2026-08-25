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
import { FormControlMixin } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { EventsController, ObserveAttributesMixin, event } from '@sl-design-system/shared';
import { LitElement, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './switch.scss.js';
let nextUniqueId = 0;
export class Switch extends ObserveAttributesMixin(
  FormControlMixin(ScopedElementsMixin(LitElement)),
  ['aria-disabled', 'aria-label', 'aria-labelledby']
) {
  static {
    /** @internal */
    this.formAssociated = true;
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-icon': Icon
    };
  }
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
    focusin: this.#onFocusin,
    focusout: this.#onFocusout,
    keydown: this.#onKeydown
  });
  /** The initial state of the switch. */
  #initialState = false;
  /** The label instance in the light DOM. */
  #label;
  get formValue() {
    return this.checked ? (this.value ?? true) : null;
  }
  set formValue(value) {
    this.checked = value === this.value || (this.value === void 0 && value === true);
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.input) {
      this.input = this.querySelector('input[slot="input"]') || document.createElement('input');
      this.input.slot = 'input';
      this.input.type = 'checkbox';
      this.input.role = 'switch';
      this.#syncInput(this.input);
      if (!this.input.parentElement) {
        this.append(this.input);
      }
      const style = document.createElement('style');
      style.innerHTML = `
        sl-switch:has(input:focus-visible)::part(track) {
          outline-color: var(--sl-color-border-focused);
          transition: 200ms ease-in-out;
          transition-property: background, border-color, color, outline-color;
        }
      `;
      this.append(style);
    }
    this.setFormControlElement(this.input);
    this.#onLabelSlotChange();
  }
  formAssociatedCallback() {
    this.#initialState = this.hasAttribute('checked');
  }
  formResetCallback() {
    this.checked = this.#initialState;
    this.changeEvent.emit(this.formValue);
  }
  firstUpdated(changes) {
    super.firstUpdated(changes);
    this.#onInfotipSlotChange();
    this.updateValidity();
  }
  updated(changes) {
    super.updated(changes);
    const props = ['checked', 'disabled'];
    if (props.some(prop => changes.has(prop))) {
      this.#syncInput(this.input);
    }
    if (changes.has('disabled')) {
      this.updateValidity();
    }
    if (changes.has('value') && this.value !== this.input.value) {
      this.input.value = this.value?.toString() || '';
    }
  }
  render() {
    const icon = this.checked ? this.iconOn || 'check' : this.iconOff || 'xmark',
      size = this.size === 'md' ? 'xs' : 'md';
    return html`
      <slot></slot>
      <slot @slotchange=${() => this.#onLabelSlotChange()} style="display: none"></slot>
      <slot name="infotip" @slotchange=${() => this.#onInfotipSlotChange()}></slot>
      <slot @keydown=${this.#onKeydown} @slotchange=${this.#onInputSlotChange} name="input"></slot>
      <div part="toggle">
        <div part="track">
          <div part="handle">
            ${this.size === 'sm' ? nothing : html`<sl-icon .name=${icon} .size=${size}></sl-icon>`}
          </div>
        </div>
      </div>
    `;
  }
  focus() {
    this.input.focus();
  }
  blur() {
    this.input.blur();
  }
  #onClick(event2) {
    if (this.disabled || (this.infotip && event2.composedPath().includes(this.infotip))) {
      return;
    }
    if (event2.target instanceof HTMLLabelElement) {
      this.input.click();
    }
    event2.stopPropagation();
    this.checked = !this.checked;
    this.input.checked = this.checked;
    this.changeEvent.emit(this.formValue);
    this.updateState({ dirty: true });
    this.updateValidity();
  }
  #onFocusin() {
    this.focusEvent.emit();
  }
  #onFocusout() {
    this.blurEvent.emit();
    this.updateState({ touched: true });
  }
  #onKeydown(event2) {
    if (['Enter', ' '].includes(event2.key)) {
      event2.preventDefault();
      event2.stopPropagation();
      this.#onClick(event2);
    }
  }
  #onInputSlotChange(event2) {
    const elements = event2.target.assignedElements({ flatten: true }),
      input = elements.find(el => el instanceof HTMLInputElement);
    if (input) {
      this.input = input;
      this.#syncInput(this.input);
      this.setFormControlElement(this.input);
    }
  }
  #onLabelSlotChange() {
    const nodes = Array.from(this.childNodes).filter(
      node =>
        node.nodeType === Node.TEXT_NODE ||
        (node.nodeType === Node.ELEMENT_NODE &&
          !node.hasAttribute('slot') &&
          !(node instanceof HTMLStyleElement))
    );
    if (!nodes.length && this.#label) {
      return;
    }
    const label = nodes
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent?.trim())
      .join(' ')
      .trim();
    if (label.length > 0) {
      this.#label ||= document.createElement('label');
      this.#label.htmlFor = this.input.id;
      this.#label.id ||= `sl-switch-label-${nextUniqueId++}`;
      this.#label.setAttribute('aria-hidden', 'true');
      this.#label.slot = '';
      this.#label.append(...nodes);
      this.append(this.#label);
    }
    requestAnimationFrame(() => {
      if (this.input.labels?.length) {
        this.input.setAttribute(
          'aria-labelledby',
          Array.from(this.input.labels)
            .map(label2 => label2.id)
            .join(' ')
        );
      }
      if (this.infotip && !this.infotip.describes) {
        this.infotip.describes = nodes
          .map(node => node.textContent?.trim() || '')
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
      }
    });
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
        this.#onLabelSlotChange();
        this.infotip.describes = this.#label?.textContent?.replace(/\s+/g, ' ').trim() || '';
      }
    }
  }
  #syncInput(input) {
    input.autofocus = this.autofocus;
    input.disabled = !!this.disabled;
    input.id ||= `sl-switch-${nextUniqueId++}`;
    input.role = 'switch';
    input.checked = !!this.checked;
    input.setAttribute('aria-checked', this.checked ? 'true' : 'false');
    this.setAttributesTarget(input);
  }
}
__decorateClass([event({ name: 'sl-blur' })], Switch.prototype, 'blurEvent', 2);
__decorateClass([event({ name: 'sl-change' })], Switch.prototype, 'changeEvent', 2);
__decorateClass([event({ name: 'sl-focus' })], Switch.prototype, 'focusEvent', 2);
__decorateClass([property({ type: Boolean, reflect: true })], Switch.prototype, 'checked', 2);
__decorateClass([property({ type: Boolean, reflect: true })], Switch.prototype, 'disabled', 2);
__decorateClass(
  [property({ reflect: true, attribute: 'icon-off' })],
  Switch.prototype,
  'iconOff',
  2
);
__decorateClass([property({ reflect: true, attribute: 'icon-on' })], Switch.prototype, 'iconOn', 2);
__decorateClass([property({ type: Boolean, reflect: true })], Switch.prototype, 'reverse', 2);
__decorateClass([state()], Switch.prototype, 'infotip', 2);
__decorateClass([property({ reflect: true })], Switch.prototype, 'size', 2);
__decorateClass([property()], Switch.prototype, 'value', 2);
//# sourceMappingURL=switch.js.map
