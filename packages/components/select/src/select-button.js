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
import { Icon } from '@sl-design-system/icon';
import { EventsController, event } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './select-button.scss.js';
export class SelectButton extends ScopedElementsMixin(LitElement) {
  constructor() {
    super(...arguments);
    // eslint-disable-next-line no-unused-private-class-members
    this.#events = new EventsController(this, { keydown: this.#onKeydown });
    /** @internal */
    this.internals = this.attachInternals();
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-icon': Icon
    };
  }
  static {
    /** @internal */
    this.styles = styles;
  }
  #events;
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'combobox');
    this.setAttribute('slot', 'button');
  }
  updated(changes) {
    super.updated(changes);
    if (changes.has('clearable')) {
      if (this.clearable) {
        this.internals.states.add('clearable');
      } else {
        this.internals.states.delete('clearable');
      }
    }
    if (changes.has('clearFocused')) {
      if (this.clearFocused) {
        this.internals.states.add('clear-focused');
      } else {
        this.internals.states.delete('clear-focused');
      }
    }
    if (changes.has('selected')) {
      if (this.selected) {
        this.internals.states.add('has-selection');
      } else {
        this.internals.states.delete('has-selection');
      }
    }
    if (changes.has('required')) {
      if (this.required) {
        this.setAttribute('aria-required', 'true');
      } else {
        this.removeAttribute('aria-required');
      }
    }
  }
  render() {
    const hasSelected = !!this.selected;
    const inlineSize = this.optionSize ? `${this.optionSize}px` : '100%';
    return html`
      <div
        class="wrapper"
        part=${this.placeholder && !hasSelected ? 'placeholder' : 'selected-option'}
        style="inline-size: ${inlineSize}">
        ${hasSelected ? html`<span part="selected"><slot name="selected-content"></slot></span>` : this.placeholder || '\xA0'}
      </div>
      <span class="status" aria-hidden="true">
        <sl-icon name="chevron-down"></sl-icon>
      </span>
    `;
  }
  #onKeydown(event2) {
    if (
      !this.disabled &&
      this.clearable &&
      this.selected &&
      ['Backspace', 'Delete'].includes(event2.key)
    ) {
      event2.preventDefault();
      event2.stopPropagation();
      this.clearEvent.emit();
    }
  }
}
__decorateClass(
  [property({ type: Boolean, reflect: true })],
  SelectButton.prototype,
  'clearable',
  2
);
__decorateClass(
  [property({ type: Boolean, attribute: false })],
  SelectButton.prototype,
  'clearFocused',
  2
);
__decorateClass([event({ name: 'sl-clear' })], SelectButton.prototype, 'clearEvent', 2);
__decorateClass(
  [property({ type: Boolean, reflect: true })],
  SelectButton.prototype,
  'disabled',
  2
);
__decorateClass([property({ reflect: true })], SelectButton.prototype, 'fill', 2);
__decorateClass(
  [property({ type: Number, attribute: 'option-size' })],
  SelectButton.prototype,
  'optionSize',
  2
);
__decorateClass([property()], SelectButton.prototype, 'placeholder', 2);
__decorateClass([property({ type: Boolean })], SelectButton.prototype, 'required', 2);
__decorateClass([property({ attribute: false })], SelectButton.prototype, 'selected', 2);
__decorateClass([property({ reflect: true })], SelectButton.prototype, 'size', 2);
__decorateClass(
  [property({ type: Boolean, attribute: 'show-valid', reflect: true })],
  SelectButton.prototype,
  'showValid',
  2
);
__decorateClass(
  [property({ reflect: true, attribute: 'show-validity' })],
  SelectButton.prototype,
  'showValidity',
  2
);
//# sourceMappingURL=select-button.js.map
