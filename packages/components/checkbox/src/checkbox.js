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
  _label,
  _Checkbox_instances,
  onClick_fn,
  onFocusin_fn,
  onFocusout_fn,
  onKeydown_fn,
  onInputSlotChange_fn,
  onLabelSlotChange_fn,
  labelText_fn,
  onInfotipSlotChange_fn,
  syncInput_fn;
import { localized, msg } from '@lit/localize';
import { FormControlMixin } from '@sl-design-system/form';
import { EventsController, event } from '@sl-design-system/shared';
import { ForwardAriaMixin } from '@sl-design-system/shared/mixins.js';
import { LitElement, html, svg } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './checkbox.scss.js';
let nextUniqueId = 0;
export let Checkbox = class extends ForwardAriaMixin(FormControlMixin(LitElement)) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _Checkbox_instances);
    // eslint-disable-next-line no-unused-private-class-members
    __privateAdd(
      this,
      _events,
      new EventsController(this, {
        click: __privateMethod(this, _Checkbox_instances, onClick_fn),
        focusin: __privateMethod(this, _Checkbox_instances, onFocusin_fn),
        focusout: __privateMethod(this, _Checkbox_instances, onFocusout_fn),
        keydown: __privateMethod(this, _Checkbox_instances, onKeydown_fn)
      })
    );
    /** The label instance in the light DOM. */
    __privateAdd(this, _label);
  }
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
      __privateMethod(this, _Checkbox_instances, syncInput_fn).call(this, this.input);
      if (!this.input.parentElement) {
        this.append(this.input);
      }
      const style = document.createElement('style');
      style.innerHTML = `
        sl-checkbox:has(input:focus-visible)::part(inner) {
          outline-color: var(--sl-color-border-focused);
          transition: 200ms ease-in-out;
          transition-property: background, border-color, color, outline-color;
        }
      `;
      this.append(style);
    }
    this.setFormControlElement(this.input);
    __privateMethod(this, _Checkbox_instances, onLabelSlotChange_fn).call(this);
  }
  updated(changes) {
    super.updated(changes);
    const props = ['checked', 'disabled', 'indeterminate', 'required'];
    if (props.some(prop => changes.has(prop))) {
      __privateMethod(this, _Checkbox_instances, syncInput_fn).call(this, this.input);
    }
    if (changes.has('disabled')) {
      this.updateValidity();
    }
    if (changes.has('value') && this.value !== this.input.value) {
      this.input.value = this.value?.toString() || '';
    }
  }
  render() {
    return html`
      <div part="wrapper">
        <slot
          @keydown=${__privateMethod(this, _Checkbox_instances, onKeydown_fn)}
          @slotchange=${__privateMethod(this, _Checkbox_instances, onInputSlotChange_fn)}
          name="input"></slot>
        <div part="outer">
          <div part="inner">
            <svg
              aria-hidden="true"
              class=${classMap({ checked: !!this.checked, indeterminate: !!this.indeterminate })}
              part="svg"
              version="1.1"
              viewBox="0 0 24 24">
              ${this.indeterminate ? svg`<path d="M4.1,12 9,12 20.3,12"></path>` : svg`<path d="M4.1,12.7 9,17.6 20.3,6.3"></path>`}
            </svg>
          </div>
        </div>
        <span part="label">
          <slot name="label"></slot>
          <slot
            @slotchange=${() => __privateMethod(this, _Checkbox_instances, onLabelSlotChange_fn).call(this)}
            style="display: none"></slot>
        </span>
      </div>
      <slot
        name="infotip"
        @slotchange=${() => __privateMethod(this, _Checkbox_instances, onInfotipSlotChange_fn).call(this)}></slot>
    `;
  }
  focus() {
    this.input.focus();
  }
  blur() {
    this.input.blur();
  }
  getLocalizedValidationMessage() {
    if (!this.validity.customError && this.validity.valueMissing) {
      return msg('Please check this box.', { id: 'sl.checkbox.validation.valueMissing' });
    }
    return super.getLocalizedValidationMessage();
  }
};
_events = new WeakMap();
_label = new WeakMap();
_Checkbox_instances = new WeakSet();
onClick_fn = function (event2) {
  if (this.disabled || (this.infotip && event2.composedPath().includes(this.infotip))) {
    return;
  }
  const label = event2.composedPath().find(el => el instanceof HTMLLabelElement);
  if (label?.parentElement === this) {
    this.input.click();
    event2.preventDefault();
    event2.stopPropagation();
    return;
  }
  event2.stopPropagation();
  this.checked = !this.checked;
  this.input.checked = this.checked;
  this.changeEvent.emit(this.formValue);
  this.updateState({ dirty: true });
  this.updateValidity();
};
onFocusin_fn = function () {
  this.focusEvent.emit();
};
onFocusout_fn = function () {
  this.blurEvent.emit();
  this.updateState({ touched: true });
};
onKeydown_fn = function (event2) {
  if (['Enter', ' '].includes(event2.key)) {
    event2.preventDefault();
    event2.stopPropagation();
    __privateMethod(this, _Checkbox_instances, onClick_fn).call(this, event2);
  }
};
onInputSlotChange_fn = function (event2) {
  const elements = event2.target.assignedElements({ flatten: true }),
    input = elements.find(el => el instanceof HTMLInputElement);
  if (input) {
    this.input = input;
    __privateMethod(this, _Checkbox_instances, syncInput_fn).call(this, this.input);
    this.setFormControlElement(this.input);
  }
};
onLabelSlotChange_fn = function () {
  const nodes = Array.from(this.childNodes).filter(
    node =>
      node.nodeType === Node.TEXT_NODE ||
      (node.nodeType === Node.ELEMENT_NODE &&
        !node.hasAttribute('slot') &&
        !(node instanceof HTMLStyleElement))
  );
  if (!nodes.length && __privateGet(this, _label)) {
    return;
  }
  const labelText = __privateMethod(this, _Checkbox_instances, labelText_fn).call(this);
  if (nodes.length > 0 && labelText.length > 0) {
    __privateGet(this, _label) || __privateSet(this, _label, document.createElement('label'));
    __privateGet(this, _label).htmlFor = this.input.id;
    __privateGet(this, _label).id ||= `sl-checkbox-label-${nextUniqueId++}`;
    __privateGet(this, _label).setAttribute('aria-hidden', 'true');
    __privateGet(this, _label).slot = 'label';
    __privateGet(this, _label).append(...nodes);
    this.append(__privateGet(this, _label));
  }
  requestAnimationFrame(() => {
    const labelledBy =
      !!this.input.getAttribute('aria-labelledby') || !!this.input.ariaLabelledByElements?.length;
    if (!labelledBy && this.input.labels?.length) {
      this.input.setAttribute(
        'aria-labelledby',
        Array.from(this.input.labels)
          .map(label => label.id)
          .join(' ')
      );
    }
  });
  if (this.infotip && !this.infotip.describes) {
    this.infotip.describes = labelText;
  }
  this.toggleAttribute('no-label', labelText.length === 0);
};
labelText_fn = function () {
  const labelSlot = this.shadowRoot?.querySelector('slot[name="label"]'),
    labelSlotNodes = labelSlot?.assignedNodes({ flatten: true }) || [],
    lightDomNodes = Array.from(this.childNodes).filter(
      node =>
        node.nodeType === Node.TEXT_NODE ||
        (node.nodeType === Node.ELEMENT_NODE &&
          !node.hasAttribute('slot') &&
          !(node instanceof HTMLStyleElement))
    ),
    nodes = labelSlotNodes.length ? labelSlotNodes : lightDomNodes;
  return nodes
    .map(node => node.textContent?.trim() || '')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
};
onInfotipSlotChange_fn = function () {
  const slot = this.shadowRoot?.querySelector('slot[name="infotip"]');
  const assignedElements = slot?.assignedElements({ flatten: true }) || [];
  this.infotip =
    assignedElements.find(el => el instanceof HTMLElement && el.tagName === 'SL-INFOTIP') || void 0;
  if (this.infotip) {
    this.infotip.setAttribute('size', 'sm');
  }
  if (this.infotip && !this.infotip.describes) {
    __privateMethod(this, _Checkbox_instances, onLabelSlotChange_fn).call(this);
    this.infotip.describes = __privateMethod(this, _Checkbox_instances, labelText_fn).call(this);
  }
};
syncInput_fn = function (input) {
  input.autofocus = this.autofocus;
  input.disabled = !!this.disabled;
  input.id ||= `sl-checkbox-${nextUniqueId++}`;
  input.required = !!this.required;
  input.checked = !!this.checked;
  input.indeterminate = !!this.indeterminate;
  this.setProxyTarget(input);
};
/** @internal */
Checkbox.shadowRootOptions = {
  ...LitElement.shadowRootOptions,
  delegatesFocus: true
};
/** @internal */
Checkbox.styles = styles;
__decorateClass([event({ name: 'sl-blur' })], Checkbox.prototype, 'blurEvent', 2);
__decorateClass([event({ name: 'sl-change' })], Checkbox.prototype, 'changeEvent', 2);
__decorateClass([event({ name: 'sl-focus' })], Checkbox.prototype, 'focusEvent', 2);
__decorateClass([property({ type: Boolean, reflect: true })], Checkbox.prototype, 'checked', 2);
__decorateClass([property({ type: Boolean, reflect: true })], Checkbox.prototype, 'disabled', 2);
__decorateClass(
  [property({ type: Boolean, reflect: true })],
  Checkbox.prototype,
  'indeterminate',
  2
);
__decorateClass([property({ type: Boolean, reflect: true })], Checkbox.prototype, 'required', 2);
__decorateClass(
  [property({ type: Boolean, attribute: 'show-valid' })],
  Checkbox.prototype,
  'showValid',
  2
);
__decorateClass([state()], Checkbox.prototype, 'infotip', 2);
__decorateClass([property({ reflect: true })], Checkbox.prototype, 'size', 2);
__decorateClass([property()], Checkbox.prototype, 'value', 2);
Checkbox = __decorateClass([localized()], Checkbox);
//# sourceMappingURL=checkbox.js.map
