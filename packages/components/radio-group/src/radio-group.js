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
var __privateMethod = (obj, member, method) => (
  __accessCheck(obj, member, 'access private method'),
  method
);
var _events,
  _initialState,
  _observer,
  _rovingTabindexController,
  _RadioGroup_instances,
  onClick_fn,
  onFocusin_fn,
  onFocusout_fn,
  onSlotchange_fn,
  setSelectedOption_fn,
  updateValueAndValidity_fn,
  focusableOptions_fn,
  isRadioElement_fn;
import { LOCALE_STATUS_EVENT, localized, msg } from '@lit/localize';
import { FormControlMixin } from '@sl-design-system/form';
import { EventsController, RovingTabindexController, event } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import styles from './radio-group.scss.js';
const OBSERVER_OPTIONS = {
  attributeFilter: ['checked'],
  attributeOldValue: true,
  subtree: true
};
export let RadioGroup = class extends FormControlMixin(LitElement) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _RadioGroup_instances);
    /** Events controller. */
    __privateAdd(
      this,
      _events,
      new EventsController(this, {
        click: __privateMethod(this, _RadioGroup_instances, onClick_fn),
        focusin: __privateMethod(this, _RadioGroup_instances, onFocusin_fn),
        focusout: __privateMethod(this, _RadioGroup_instances, onFocusout_fn)
      })
    );
    /** The initial state when the form was associated with the radio group. Used to reset the group. */
    __privateAdd(this, _initialState);
    /** When an option is checked, update the state. */
    __privateAdd(
      this,
      _observer,
      new MutationObserver(mutations => {
        const { target } =
          mutations.find(m => m.attributeName === 'checked' && m.oldValue === null) || {};
        __privateGet(this, _observer).disconnect();
        __privateMethod(this, _RadioGroup_instances, setSelectedOption_fn).call(this, target);
        __privateGet(this, _observer).observe(this, OBSERVER_OPTIONS);
      })
    );
    /** Manage the keyboard navigation. */
    __privateAdd(
      this,
      _rovingTabindexController,
      new RovingTabindexController(this, {
        direction: () => (this.horizontal ? 'horizontal' : 'vertical'),
        focusInIndex: elements => {
          return elements.findIndex(el => {
            return __privateMethod(this, _RadioGroup_instances, isRadioElement_fn).call(this, el)
              ? this.value
                ? !el.disabled && el.value === this.value
                : !el.disabled
              : __privateMethod(this, _RadioGroup_instances, isRadioElement_fn).call(
                  this,
                  el.parentElement
                ) &&
                  (this.value
                    ? !el.parentElement.disabled && el.parentElement.value === this.value
                    : !el.parentElement.disabled);
          });
        },
        elementEnterAction: el => {
          if (__privateMethod(this, _RadioGroup_instances, isRadioElement_fn).call(this, el)) {
            this.value = el.value;
          } else if (
            __privateMethod(this, _RadioGroup_instances, isRadioElement_fn).call(
              this,
              el.parentElement
            )
          ) {
            this.value = el.parentElement.value;
          }
        },
        elements: () =>
          __privateMethod(this, _RadioGroup_instances, focusableOptions_fn).call(this),
        isFocusableElement: el =>
          __privateMethod(this, _RadioGroup_instances, isRadioElement_fn).call(this, el)
            ? !el.disabled
            : __privateMethod(this, _RadioGroup_instances, isRadioElement_fn).call(
                this,
                el.parentElement
              ) && !el.parentElement.disabled
      })
    );
    /** @internal Element internals. */
    this.internals = this.attachInternals();
  }
  connectedCallback() {
    super.connectedCallback();
    this.internals.role = 'radiogroup';
    this.setFormControlElement(this);
    __privateGet(this, _events).listen(
      window,
      LOCALE_STATUS_EVENT,
      __privateMethod(this, _RadioGroup_instances, updateValueAndValidity_fn)
    );
  }
  disconnectedCallback() {
    __privateGet(this, _observer).disconnect();
    super.disconnectedCallback();
  }
  formAssociatedCallback() {
    __privateSet(this, _initialState, this.value);
  }
  formResetCallback() {
    this.value = __privateGet(this, _initialState);
    __privateGet(this, _observer).disconnect();
    __privateMethod(this, _RadioGroup_instances, setSelectedOption_fn).call(
      this,
      this.radios?.find(radio => radio.value === this.value)
    );
    __privateGet(this, _observer).observe(this, OBSERVER_OPTIONS);
  }
  firstUpdated(changes) {
    super.firstUpdated(changes);
    __privateGet(this, _observer).observe(this, OBSERVER_OPTIONS);
    __privateMethod(this, _RadioGroup_instances, updateValueAndValidity_fn).call(this);
  }
  willUpdate(changes) {
    super.willUpdate(changes);
    if (changes.has('disabled') && typeof this.disabled === 'boolean') {
      this.radios?.forEach(radio => (radio.disabled = !!this.disabled));
    }
    if (changes.has('required')) {
      this.internals.ariaRequired = this.required ? 'true' : 'false';
      __privateMethod(this, _RadioGroup_instances, updateValueAndValidity_fn).call(this);
    }
    if (changes.has('showValidity')) {
      const radio = this.radios?.find(radio2 => radio2.value === this.value);
      if (radio) {
        radio.showValidity = this.showValidity;
      }
    }
    if (changes.has('size')) {
      this.radios?.forEach(radio => (radio.size = this.size));
    }
    if (changes.has('value')) {
      __privateGet(this, _observer).disconnect();
      this.radios?.forEach(radio => (radio.checked = radio.value === this.value));
      __privateGet(this, _observer).observe(this, OBSERVER_OPTIONS);
    }
  }
  render() {
    return html`<slot
      @slotchange=${__privateMethod(this, _RadioGroup_instances, onSlotchange_fn)}></slot>`;
  }
  focus() {
    __privateGet(this, _rovingTabindexController).focus();
  }
};
_events = new WeakMap();
_initialState = new WeakMap();
_observer = new WeakMap();
_rovingTabindexController = new WeakMap();
_RadioGroup_instances = new WeakSet();
onClick_fn = function (event2) {
  if (event2.target === this) {
    __privateGet(this, _rovingTabindexController).focus();
  }
};
onFocusin_fn = function () {
  this.focusEvent.emit();
};
onFocusout_fn = function () {
  this.blurEvent.emit();
  this.updateState({ touched: true });
};
onSlotchange_fn = async function () {
  __privateGet(this, _rovingTabindexController).clearElementCache();
  __privateGet(this, _observer).disconnect();
  for (const radio of this.radios ?? []) {
    radio.checked = radio.value === this.value;
    if (typeof this.disabled === 'boolean') {
      radio.disabled = this.disabled;
    }
    if (this.size) {
      radio.size = this.size;
    }
    await radio.updateComplete;
  }
  __privateGet(this, _observer).observe(this, OBSERVER_OPTIONS);
  __privateMethod(this, _RadioGroup_instances, updateValueAndValidity_fn).call(this);
};
setSelectedOption_fn = function (option, emitEvent = true) {
  this.radios?.forEach(radio => (radio.checked = radio.value === option?.value));
  this.value = option?.value;
  if (emitEvent) {
    this.changeEvent.emit(this.value);
    this.updateState({ dirty: true });
  }
  __privateMethod(this, _RadioGroup_instances, updateValueAndValidity_fn).call(this);
};
updateValueAndValidity_fn = function () {
  this.internals.setFormValue(this.nativeFormValue);
  this.internals.setValidity(
    { valueMissing: this.required && !this.radios?.some(radio => radio.checked) },
    msg('Please select an option.', { id: 'sl.radioGroup.validation.valueMissing' })
  );
  this.updateValidity();
};
focusableOptions_fn = function () {
  const options = [];
  this.radios?.forEach(radio => {
    options.push(radio);
    if (radio.infotip) {
      options.push(radio.infotip);
    }
  });
  return options;
};
isRadioElement_fn = function (element) {
  return element instanceof HTMLElement && element.tagName === 'SL-RADIO';
};
/** @internal */
RadioGroup.formAssociated = true;
/** @internal */
RadioGroup.shadowRootOptions = {
  ...LitElement.shadowRootOptions,
  delegatesFocus: true
};
/** @internal */
RadioGroup.styles = styles;
__decorateClass([queryAssignedElements()], RadioGroup.prototype, 'radios', 2);
__decorateClass([event({ name: 'sl-blur' })], RadioGroup.prototype, 'blurEvent', 2);
__decorateClass([event({ name: 'sl-change' })], RadioGroup.prototype, 'changeEvent', 2);
__decorateClass([event({ name: 'sl-focus' })], RadioGroup.prototype, 'focusEvent', 2);
__decorateClass([property({ type: Boolean, reflect: true })], RadioGroup.prototype, 'disabled', 2);
__decorateClass(
  [property({ type: Boolean, reflect: true })],
  RadioGroup.prototype,
  'horizontal',
  2
);
__decorateClass([property({ type: Boolean, reflect: true })], RadioGroup.prototype, 'required', 2);
__decorateClass(
  [property({ type: Boolean, attribute: 'show-valid' })],
  RadioGroup.prototype,
  'showValid',
  2
);
__decorateClass([property()], RadioGroup.prototype, 'size', 2);
__decorateClass([property()], RadioGroup.prototype, 'value', 2);
RadioGroup = __decorateClass([localized()], RadioGroup);
//# sourceMappingURL=radio-group.js.map
