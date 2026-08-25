var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __typeError = msg2 => {
  throw TypeError(msg2);
};
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if ((decorator = decorators[i]))
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var __accessCheck = (obj, member, msg2) => member.has(obj) || __typeError('Cannot ' + msg2);
var __privateGet = (obj, member, getter) => (
  __accessCheck(obj, member, 'read from private field'),
  getter ? getter.call(obj) : member.get(obj)
);
var __privateAdd = (obj, member, value) =>
  member.has(obj)
    ? __typeError('Cannot add the same private member more than once')
    : member instanceof WeakSet
      ? member.add(obj)
      : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (
  __accessCheck(obj, member, 'write to private field'),
  setter ? setter.call(obj, value) : member.set(obj, value),
  value
);
var _value;
import { localized, msg, str } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import {
  ObserveAttributesMixin,
  closestElementComposed,
  event,
  getCharacterPluralSuffix
} from '@sl-design-system/shared';
import { LitElement, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { FieldButton } from './field-button.js';
import styles from './text-field.scss.js';
let nextUniqueId = 0;
export let TextField = class extends ObserveAttributesMixin(
  FormControlMixin(ScopedElementsMixin(LitElement)),
  ['aria-disabled', 'aria-label', 'aria-labelledby', 'aria-required']
) {
  constructor() {
    super(...arguments);
    /** The value of the text field. */
    __privateAdd(this, _value, '');
    this.fieldButtons = [];
    this.rawValue = '';
    this.type = 'text';
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-field-button': FieldButton,
      'sl-icon': Icon
    };
  }
  get formattedValue() {
    return this.value?.toString() || '';
  }
  get value() {
    return __privateGet(this, _value);
  }
  set value(value) {
    __privateSet(this, _value, value);
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.input) {
      this.input = this.querySelector('input[slot="input"]') || document.createElement('input');
      this.input.slot = 'input';
      if (!this.input.parentElement) {
        this.append(this.input);
      }
    }
    this.setFormControlElement(this.input);
    if (this.tagName === 'SL-TEXT-FIELD') {
      const style = document.createElement('style');
      style.innerHTML = `
        sl-text-field:has(input:hover):not(:focus-within) {
          --_bg-opacity: var(--sl-opacity-interactive-plain-hover);
        }
      `;
      this.prepend(style);
    }
  }
  firstUpdated(changes) {
    super.firstUpdated(changes);
    requestAnimationFrame(() => {
      const buttons = this.renderRoot.querySelectorAll('sl-field-button');
      if (buttons.length) {
        this.fieldButtons = [...this.fieldButtons, ...buttons];
      }
    });
  }
  updated(changes) {
    super.updated(changes);
    const props = [
      'autocomplete',
      'disabled',
      'inputSize',
      'maxLength',
      'minLength',
      'pattern',
      'placeholder',
      'readonly',
      'required',
      'type'
    ];
    if (props.some(prop => changes.has(prop))) {
      this.updateInputElement(this.input);
    }
    if (changes.has('disabled')) {
      setTimeout(() => this.updateValidity());
    }
    if (changes.has('disabled') || changes.has('fieldButtons') || changes.has('size')) {
      this.fieldButtons.forEach(button => {
        button.size = this.size;
        button.disabled ??= this.disabled;
      });
    }
    if (changes.has('formattedValue') || changes.has('value')) {
      const formattedValue = this.formattedValue;
      if (this.input.value !== formattedValue) {
        this.input.value = formattedValue;
      }
    }
  }
  render() {
    return html`${this.renderPrefix()}${this.renderInputSlot()}${this.renderSuffix()}`;
  }
  /** Renders the prefix slot; can be overridden to customize the prefix. */
  renderPrefix() {
    return html`<slot @slotchange=${this.onPrefixSlotChange} name="prefix"></slot>`;
  }
  /** Render the input slot; separate method so it is composable for child components. */
  renderInputSlot() {
    return html`
      <slot
        @keydown=${this.onKeydown}
        @change=${this.onChange}
        @input=${this.onInput}
        @slotchange=${this.onSlotChange}
        name="input"></slot>
    `;
  }
  /**
   * Renders the suffix slot; can be overridden to customize the suffix. Remember that if you
   * override this method, it will no longer automatically show the valid checkmark when the input
   * is valid.
   */
  renderSuffix() {
    return html`
      <slot @slotchange=${this.onSuffixSlotChange} name="suffix">
        ${this.showValidity === 'valid' ? html`<sl-icon class="valid" name="circle-check-solid"></sl-icon>` : nothing}
      </slot>
    `;
  }
  getLocalizedValidationMessage() {
    if (this.validity.tooShort) {
      const length = this.value?.toString().length || 0;
      return msg(
        str`Please enter at least ${this.minLength} character${getCharacterPluralSuffix(this.minLength ?? 0)} (you currently have ${length} character${getCharacterPluralSuffix(length)}).`,
        { id: 'sl.common.validation.tooShort' }
      );
    }
    return super.getLocalizedValidationMessage();
  }
  /**
   * Method that parses the string input and converts it to a specific value. Override this method
   * if you want to convert the value in a different way. Throw an error if the value is invalid.
   */
  parseValue(value) {
    this.value = value;
  }
  /** @internal */
  focus() {
    this.input.focus();
  }
  /**
   * Handles the blur event when the input field loses focus. Emits a `sl-blur` event if the
   * component had focus and updates the state.
   */
  onBlur() {
    if (this.hasFocusRing) {
      this.hasFocusRing = false;
      this.blurEvent.emit();
      this.updateState({ touched: true });
    }
  }
  /** This method is called when the input changes. */
  onChange() {
    this.changeEvent.emit(this.value);
    this.updateState({ dirty: true });
    this.updateValidity();
  }
  /**
   * Handles the focus event when the input field gains focus. Emits a focus event and updates the
   * focus ring state.
   */
  onFocus() {
    if (!this.hasFocusRing) {
      this.hasFocusRing = true;
      this.focusEvent.emit();
    }
  }
  /** Handles input events to update the raw and parsed values. */
  onInput({ target }) {
    this.rawValue = target.value;
    try {
      this.parseValue(this.rawValue);
      this.changeEvent.emit(this.value);
    } catch {}
    this.updateState({ dirty: true });
    this.updateValidity();
  }
  /**
   * Handles the `keydown` event for the field. Simulates the native behavior of submitting a form
   * when the Enter key is pressed.
   */
  onKeydown(event2) {
    if (!this.disabled && !this.readonly && event2.key === 'Enter') {
      if (this.form) {
        this.form.requestSubmit();
      } else {
        closestElementComposed(this, 'sl-form')?.requestSubmit();
      }
    }
  }
  /**
   * Handles changes to the prefix slot. Detects and adds any `FieldButton` elements assigned to the
   * prefix slot to the `fieldButtons` state for further processing.
   */
  onPrefixSlotChange(event2) {
    const button = event2.target
      .assignedElements({ flatten: true })
      .find(el => el instanceof FieldButton);
    if (button) {
      this.fieldButtons = [...this.fieldButtons, button];
    }
  }
  /**
   * Handles changes to the input slot. Updates the `input` element reference and synchronizes its
   * attributes with the component's properties.
   */
  onSlotChange(event2) {
    const elements = event2.target.assignedElements({ flatten: true }),
      inputs = elements.filter(el => el instanceof HTMLInputElement);
    if (this.input && this.input !== inputs.at(0)) {
      this.input.remove();
    }
    this.input = inputs.at(0);
    this.input.addEventListener('blur', () => this.onBlur());
    this.input.addEventListener('focus', () => this.onFocus());
    this.updateInputElement(this.input);
    this.setFormControlElement(this.input);
  }
  /**
   * Handles changes to the suffix slot. Detects and adds any `FieldButton` elements assigned to the
   * suffix slot to the `fieldButtons` state for further processing.
   */
  onSuffixSlotChange(event2) {
    const button = event2.target
      .assignedElements({ flatten: true })
      .find(el => el instanceof FieldButton);
    if (button) {
      this.fieldButtons = [...this.fieldButtons, button];
    }
  }
  /** @internal Synchronize the input element with the component properties. */
  updateInputElement(input) {
    if (!input) {
      return;
    }
    input.autofocus = this.autofocus;
    input.disabled = !!this.disabled;
    input.id ||= `sl-text-field-${nextUniqueId++}`;
    input.placeholder = this.placeholder ?? '';
    input.readOnly = !!this.readonly;
    input.required = !!this.required;
    this.setAttributesTarget(input);
    input.setAttribute('autocomplete', this.autocomplete || 'off');
    if (input.type !== this.type && input.type === 'text') {
      if (this.type === 'number') {
        console.warn(
          'The "number" type of sl-text-field has been deprecated. Please use sl-number-field instead.'
        );
      }
      input.type = this.type;
    }
    if (typeof this.inputSize === 'number') {
      input.setAttribute('size', this.inputSize.toString());
    } else {
      input.removeAttribute('size');
    }
    if (typeof this.maxLength === 'number') {
      input.setAttribute('maxlength', this.maxLength.toString());
    } else {
      input.removeAttribute('maxlength');
    }
    if (typeof this.minLength === 'number') {
      input.setAttribute('minlength', this.minLength.toString());
    } else {
      input.removeAttribute('minlength');
    }
    if (typeof this.pattern === 'string') {
      input.setAttribute('pattern', this.pattern);
    } else {
      input.removeAttribute('pattern');
    }
    if (typeof this.placeholder === 'string') {
      input.setAttribute('placeholder', this.placeholder);
    } else {
      input.removeAttribute('placeholder');
    }
  }
};
_value = new WeakMap();
/** @internal */
TextField.shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };
/** @internal */
TextField.styles = styles;
__decorateClass([property()], TextField.prototype, 'autocomplete', 2);
__decorateClass([event({ name: 'sl-blur' })], TextField.prototype, 'blurEvent', 2);
__decorateClass([event({ name: 'sl-change' })], TextField.prototype, 'changeEvent', 2);
__decorateClass([property({ type: Boolean, reflect: true })], TextField.prototype, 'disabled', 2);
__decorateClass([event({ name: 'sl-focus' })], TextField.prototype, 'focusEvent', 2);
__decorateClass([state()], TextField.prototype, 'fieldButtons', 2);
__decorateClass([state()], TextField.prototype, 'formattedValue', 1);
__decorateClass(
  [property({ type: Boolean, reflect: true, attribute: 'has-focus-ring' })],
  TextField.prototype,
  'hasFocusRing',
  2
);
__decorateClass(
  [property({ type: Number, attribute: 'input-size', reflect: true })],
  TextField.prototype,
  'inputSize',
  2
);
__decorateClass(
  [property({ type: Number, attribute: 'maxlength' })],
  TextField.prototype,
  'maxLength',
  2
);
__decorateClass(
  [property({ type: Number, attribute: 'minlength' })],
  TextField.prototype,
  'minLength',
  2
);
__decorateClass([property()], TextField.prototype, 'pattern', 2);
__decorateClass([property()], TextField.prototype, 'placeholder', 2);
__decorateClass([state()], TextField.prototype, 'rawValue', 2);
__decorateClass([property({ type: Boolean, reflect: true })], TextField.prototype, 'readonly', 2);
__decorateClass([property({ type: Boolean, reflect: true })], TextField.prototype, 'required', 2);
__decorateClass(
  [property({ type: Boolean, attribute: 'show-valid' })],
  TextField.prototype,
  'showValid',
  2
);
__decorateClass([property({ reflect: true })], TextField.prototype, 'size', 2);
__decorateClass([property()], TextField.prototype, 'type', 2);
__decorateClass([property()], TextField.prototype, 'value', 1);
TextField = __decorateClass([localized()], TextField);
//# sourceMappingURL=text-field.js.map
