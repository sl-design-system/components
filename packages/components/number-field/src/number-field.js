var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getProtoOf = Object.getPrototypeOf;
var __reflectGet = Reflect.get;
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
var __privateMethod = (obj, member, method) => (
  __accessCheck(obj, member, 'access private method'),
  method
);
var __superGet = (cls, obj, key) => __reflectGet(__getProtoOf(cls), key, obj);
var _parser,
  _value,
  _valueAsNumber,
  _hasInternalCustomError,
  _NumberField_instances,
  setInternalCustomValidity_fn,
  isButtonDisabled_fn;
import { localized, msg, str } from '@lit/localize';
import { format } from '@sl-design-system/format-number/format.js';
import { LocaleMixin } from '@sl-design-system/shared/mixins.js';
import { TextField } from '@sl-design-system/text-field';
import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './number-field.scss.js';
import { NumberParser } from './number-parser.js';
export let NumberField = class extends LocaleMixin(TextField) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _NumberField_instances);
    /** Parser used for user input. */
    __privateAdd(this, _parser, new NumberParser(this.locale));
    /** The string value. */
    __privateAdd(this, _value);
    /** The number value. */
    __privateAdd(this, _valueAsNumber);
    /** Tracks whether the current custom error was set by internal number validation. */
    __privateAdd(this, _hasInternalCustomError, false);
    this.type = 'text';
  }
  get formattedValue() {
    if (typeof this.valueAsNumber === 'number' && !Number.isNaN(this.valueAsNumber)) {
      if (this.formatOptions?.style === 'percent') {
        const percentageValue = this.valueAsNumber * 0.01;
        return format(percentageValue, this.locale, this.formatOptions);
      }
      return format(this.valueAsNumber, this.locale, this.formatOptions);
    } else {
      return this.rawValue ?? this.valueAsNumber;
    }
  }
  get formValue() {
    return super.formValue;
  }
  set formValue(value) {
    if (typeof value === 'number' && !Number.isNaN(value)) {
      this.valueAsNumber = value;
    } else {
      super.formValue = value;
    }
  }
  get value() {
    return __privateGet(this, _value);
  }
  set value(value) {
    __privateSet(this, _value, value);
    __privateSet(this, _valueAsNumber, value ? __privateGet(this, _parser).parse(value) : void 0);
  }
  get valueAsNumber() {
    return __privateGet(this, _valueAsNumber);
  }
  set valueAsNumber(value) {
    __privateSet(this, _valueAsNumber, value);
    if (__privateGet(this, _value) !== value?.toString()) {
      __privateSet(this, _value, value?.toString());
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.input.setAttribute('inputmode', this.inputMode || 'numeric');
    const style = document.createElement('style');
    style.innerHTML = `
      sl-number-field:has(input:hover):not(:focus-within) {
        --_bg-opacity: var(--sl-opacity-interactive-plain-hover);
      }
    `;
    this.prepend(style);
  }
  willUpdate(changes) {
    super.willUpdate(changes);
    if (changes.has('formatOptions') || changes.has('locale')) {
      __privateSet(this, _parser, new NumberParser(this.locale, this.formatOptions));
      this.requestUpdate('formattedValue');
    }
    if (changes.has('value') || changes.has('valueAsNumber')) {
      this.requestUpdate('formattedValue');
      this.updateValidity();
    }
    if (changes.has('min') || changes.has('max')) {
      this.updateValidity();
    }
  }
  /**
   * Renders the prefix slot content with step down button when step buttons are at edges.
   *
   * Remember that if you override this method, the step down button will no longer be rendered
   * automatically when `stepButtons` is set to 'edges'. You will need to implement your own button
   * logic if needed.
   */
  renderPrefix() {
    return this.stepButtons === 'edges'
      ? html`
          <sl-field-button
            @click=${() => this.stepDown()}
            ?disabled=${__privateMethod(this, _NumberField_instances, isButtonDisabled_fn).call(this, 'down')}
            aria-label=${msg('Step down', { id: 'sl.numberField.stepDown' })}
            class="minus">
            <sl-icon name="minus" size="md"></sl-icon>
          </sl-field-button>
        `
      : nothing;
  }
  /**
   * Renders the suffix slot content with step buttons.
   *
   * Remember that if you override this method, the step buttons will no longer be rendered
   * automatically. You will need to implement your own button logic if needed.
   */
  renderSuffix() {
    return this.stepButtons
      ? this.stepButtons === 'end'
        ? html`
            <div class="step-buttons">
              <sl-field-button
                @click=${() => this.stepDown()}
                ?disabled=${__privateMethod(this, _NumberField_instances, isButtonDisabled_fn).call(this, 'down')}
                aria-label=${msg('Step down', { id: 'sl.numberField.stepDown' })}
                class="minus">
                <sl-icon name="minus" size="md"></sl-icon>
              </sl-field-button>
              <sl-field-button
                @click=${() => this.stepUp()}
                ?disabled=${__privateMethod(this, _NumberField_instances, isButtonDisabled_fn).call(this, 'up')}
                aria-label=${msg('Step up', { id: 'sl.numberField.stepUp' })}
                class="plus">
                <sl-icon name="plus" size="md"></sl-icon>
              </sl-field-button>
            </div>
          `
        : html`
            <sl-field-button
              @click=${() => this.stepUp()}
              ?disabled=${__privateMethod(this, _NumberField_instances, isButtonDisabled_fn).call(this, 'up')}
              aria-label=${msg('Step up', { id: 'sl.numberField.stepUp' })}
              class="plus">
              <sl-icon name="plus" size="md"></sl-icon>
            </sl-field-button>
          `
      : nothing;
  }
  /** Decreases the current value by the `step` amount. */
  stepDown(decrement = this.step ?? 1) {
    const value = this.valueAsNumber || 0;
    __privateSet(
      this,
      _valueAsNumber,
      Math.min(Math.max(value - decrement, this.min ?? -Infinity), this.max ?? Infinity)
    );
    __privateSet(this, _value, __privateGet(this, _valueAsNumber).toString());
    this.requestUpdate('formattedValue');
    this.onChange();
  }
  /** Increases the current value by the `step` amount. */
  stepUp(increment = this.step ?? 1) {
    const value = this.valueAsNumber || 0;
    __privateSet(
      this,
      _valueAsNumber,
      Math.min(Math.max(value + increment, this.min ?? -Infinity), this.max ?? Infinity)
    );
    __privateSet(this, _value, __privateGet(this, _valueAsNumber).toString());
    this.requestUpdate('formattedValue');
    this.onChange();
  }
  /** @internal Bypass the setter's, so the formatted value isn't updated. */
  parseValue(value) {
    __privateSet(this, _value, value);
    __privateSet(this, _valueAsNumber, value ? __privateGet(this, _parser).parse(value) : void 0);
  }
  /** @internal Update the formatted value on blur. */
  onBlur() {
    this.requestUpdate('formattedValue');
    super.onBlur();
  }
  /** @internal */
  onKeydown(event) {
    if (this.disabled || this.readonly) {
      return;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.stepUp();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.stepDown();
    } else {
      super.onKeydown(event);
    }
  }
  setCustomValidity(message) {
    __privateSet(this, _hasInternalCustomError, false);
    super.setCustomValidity(message);
  }
  /** @internal Implement custom number validity checks. */
  updateInternalValidity() {
    if (this.validity.customError && !__privateGet(this, _hasInternalCustomError)) {
      return;
    }
    if (Number.isNaN(this.valueAsNumber)) {
      __privateMethod(this, _NumberField_instances, setInternalCustomValidity_fn).call(
        this,
        msg('Please enter a valid number.', { id: 'sl.numberField.validation.invalidNumber' })
      );
    } else if (
      typeof this.valueAsNumber === 'number' &&
      this.valueAsNumber > (this.max ?? Infinity)
    ) {
      __privateMethod(this, _NumberField_instances, setInternalCustomValidity_fn).call(
        this,
        msg(str`The value must be less than or equal to ${this.max}.`, {
          id: 'sl.numberField.validation.exceedsMaximum'
        })
      );
    } else if (
      typeof this.valueAsNumber === 'number' &&
      this.valueAsNumber < (this.min ?? -Infinity)
    ) {
      __privateMethod(this, _NumberField_instances, setInternalCustomValidity_fn).call(
        this,
        msg(str`The value must be greater than or equal to ${this.min}.`, {
          id: 'sl.numberField.validation.belowMinimum'
        })
      );
    } else {
      __privateMethod(this, _NumberField_instances, setInternalCustomValidity_fn).call(this, '');
    }
  }
};
_parser = new WeakMap();
_value = new WeakMap();
_valueAsNumber = new WeakMap();
_hasInternalCustomError = new WeakMap();
_NumberField_instances = new WeakSet();
setInternalCustomValidity_fn = function (message) {
  __privateSet(this, _hasInternalCustomError, message !== '');
  __superGet(NumberField.prototype, this, 'setCustomValidity').call(this, message);
};
isButtonDisabled_fn = function (button) {
  if (button === 'up') {
    return (
      this.disabled ||
      this.readonly ||
      (this.max !== void 0 && this.valueAsNumber !== void 0 && this.max === this.valueAsNumber)
    );
  } else if (button === 'down') {
    return (
      this.disabled ||
      this.readonly ||
      (this.min !== void 0 && this.valueAsNumber !== void 0 && this.min === this.valueAsNumber)
    );
  } else {
    return false;
  }
};
/** @internal */
NumberField.styles = [TextField.styles, styles];
__decorateClass([property({ type: Boolean, reflect: true })], NumberField.prototype, 'disabled', 2);
__decorateClass(
  [property({ type: Object, attribute: 'format-options' })],
  NumberField.prototype,
  'formatOptions',
  2
);
__decorateClass([property({ type: Number })], NumberField.prototype, 'max', 2);
__decorateClass([property({ type: Number })], NumberField.prototype, 'min', 2);
__decorateClass([property({ type: Boolean, reflect: true })], NumberField.prototype, 'required', 2);
__decorateClass([property({ type: Number })], NumberField.prototype, 'step', 2);
__decorateClass(
  [property({ reflect: true, attribute: 'step-buttons' })],
  NumberField.prototype,
  'stepButtons',
  2
);
__decorateClass([property({ attribute: false })], NumberField.prototype, 'type', 2);
__decorateClass([property()], NumberField.prototype, 'value', 1);
__decorateClass([property({ type: Number })], NumberField.prototype, 'valueAsNumber', 1);
NumberField = __decorateClass([localized()], NumberField);
//# sourceMappingURL=number-field.js.map
