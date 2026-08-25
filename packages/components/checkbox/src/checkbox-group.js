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
var __privateMethod = (obj, member, method) => (
  __accessCheck(obj, member, 'access private method'),
  method
);
var _events,
  _observer,
  _rovingTabindexController,
  _CheckboxGroup_instances,
  onClick_fn,
  onFocusin_fn,
  onFocusout_fn,
  onFormControl_fn,
  focusableBoxes_fn,
  onSlotChange_fn,
  stopEvent_fn,
  updateValidity_fn;
import { LOCALE_STATUS_EVENT, localized, msg } from '@lit/localize';
import { FormControlMixin } from '@sl-design-system/form';
import { EventsController, RovingTabindexController, event } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import styles from './checkbox-group.scss.js';
import { Checkbox } from './checkbox.js';
const OBSERVER_OPTIONS = {
  attributeFilter: ['checked'],
  attributeOldValue: true,
  subtree: true
};
export let CheckboxGroup = class extends FormControlMixin(LitElement) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _CheckboxGroup_instances);
    /** Events controller. */
    __privateAdd(
      this,
      _events,
      new EventsController(this, {
        click: __privateMethod(this, _CheckboxGroup_instances, onClick_fn),
        focusin: __privateMethod(this, _CheckboxGroup_instances, onFocusin_fn),
        focusout: __privateMethod(this, _CheckboxGroup_instances, onFocusout_fn)
      })
    );
    /** Observe changes to the checkboxes. */
    __privateAdd(
      this,
      _observer,
      new MutationObserver(() => {
        this.value = this.boxes?.map(box => box.formValue) ?? [];
        this.changeEvent.emit(this.value);
        this.updateState({ dirty: true });
        __privateMethod(this, _CheckboxGroup_instances, updateValidity_fn).call(this);
      })
    );
    /** Manage the keyboard navigation. */
    __privateAdd(
      this,
      _rovingTabindexController,
      new RovingTabindexController(this, {
        direction: 'vertical',
        focusInIndex: elements => elements.findIndex(el => el instanceof Checkbox && !el.disabled),
        elements: () =>
          __privateMethod(this, _CheckboxGroup_instances, focusableBoxes_fn).call(this),
        isFocusableElement: el =>
          el instanceof Checkbox
            ? !el.disabled
            : el.parentElement instanceof Checkbox && !el.parentElement.disabled
      })
    );
    /** @internal */
    this.internals = this.attachInternals();
  }
  get formValue() {
    return this.value?.filter(v => v !== null) ?? [];
  }
  /**
   * We need to override the setter as well, otherwise it won't work. See
   * https://github.com/sl-design-system/components/issues/1441
   */
  set formValue(value) {
    super.formValue = value;
  }
  connectedCallback() {
    super.connectedCallback();
    __privateGet(this, _observer).observe(this, OBSERVER_OPTIONS);
    this.internals.role = 'group';
    this.setFormControlElement(this);
    __privateGet(this, _events).listen(
      window,
      LOCALE_STATUS_EVENT,
      __privateMethod(this, _CheckboxGroup_instances, updateValidity_fn)
    );
  }
  disconnectedCallback() {
    __privateGet(this, _observer).disconnect();
    super.disconnectedCallback();
  }
  willUpdate(changes) {
    super.willUpdate(changes);
    if (changes.has('disabled') && typeof this.disabled === 'boolean') {
      this.boxes?.forEach(box => (box.disabled = !!this.disabled));
    }
    if (changes.has('name')) {
      if (this.name) {
        this.boxes?.forEach(box => box.setAttribute('name', this.name));
      } else {
        this.boxes?.forEach(box => box.removeAttribute('name'));
      }
    }
    if (changes.has('required')) {
      this.internals.ariaRequired = this.required ? 'true' : 'false';
      __privateMethod(this, _CheckboxGroup_instances, updateValidity_fn).call(this);
    }
    if (changes.has('size')) {
      this.boxes?.forEach(box => (box.size = this.size || 'md'));
    }
    if (changes.has('value')) {
      __privateGet(this, _observer).disconnect();
      this.boxes?.forEach((box, index) => {
        if (box.value != null) {
          box.checked = this.value?.includes(box.value) ?? false;
        } else {
          const newValue = this.value?.at(index) ?? null;
          if (box.formValue !== newValue) {
            box.formValue = newValue;
          }
        }
      });
      __privateGet(this, _observer).observe(this, OBSERVER_OPTIONS);
    }
  }
  render() {
    return html`
      <slot
        @slotchange=${__privateMethod(this, _CheckboxGroup_instances, onSlotChange_fn)}
        @sl-blur=${__privateMethod(this, _CheckboxGroup_instances, stopEvent_fn)}
        @sl-change=${__privateMethod(this, _CheckboxGroup_instances, stopEvent_fn)}
        @sl-focus=${__privateMethod(this, _CheckboxGroup_instances, stopEvent_fn)}
        @sl-form-control=${__privateMethod(this, _CheckboxGroup_instances, onFormControl_fn)}
        @sl-validate=${__privateMethod(this, _CheckboxGroup_instances, stopEvent_fn)}></slot>
    `;
  }
  focus() {
    __privateGet(this, _rovingTabindexController).focus();
  }
  reportValidity() {
    this.boxes?.forEach(box => box.reportValidity());
    return super.reportValidity();
  }
};
_events = new WeakMap();
_observer = new WeakMap();
_rovingTabindexController = new WeakMap();
_CheckboxGroup_instances = new WeakSet();
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
onFormControl_fn = function (event2) {
  event2.preventDefault();
  event2.stopPropagation();
};
focusableBoxes_fn = function () {
  const focusableBoxes = [];
  this.boxes?.forEach(box => {
    focusableBoxes.push(box);
    if (box.infotip) {
      focusableBoxes.push(box.infotip);
    }
  });
  return focusableBoxes;
};
onSlotChange_fn = async function () {
  __privateGet(this, _rovingTabindexController).clearElementCache();
  __privateGet(this, _observer).disconnect();
  for (const box of this.boxes ?? []) {
    box.name = this.name;
    if (this.value !== void 0 && box.value !== void 0) {
      box.checked = this.value?.some(v => v == box.value) ?? false;
    }
    if (typeof this.disabled === 'boolean') {
      box.disabled = this.disabled;
    }
    if (this.size) {
      box.size = this.size;
    }
    await box.updateComplete;
  }
  this.value = this.boxes?.map(box => box.formValue) ?? [];
  __privateGet(this, _observer).observe(this, OBSERVER_OPTIONS);
  __privateMethod(this, _CheckboxGroup_instances, updateValidity_fn).call(this);
};
stopEvent_fn = function (event2) {
  event2.preventDefault();
  event2.stopPropagation();
};
updateValidity_fn = function () {
  this.internals.setValidity(
    { valueMissing: this.required && !this.boxes?.some(box => box.checked) },
    msg('Please check at least one option.', {
      id: 'sl.checkbox.validation.valueMissingMultiple'
    })
  );
  this.updateValidity();
};
/** @internal */
CheckboxGroup.formAssociated = true;
/** @internal */
CheckboxGroup.styles = styles;
__decorateClass(
  [queryAssignedElements({ selector: 'sl-checkbox' })],
  CheckboxGroup.prototype,
  'boxes',
  2
);
__decorateClass([event({ name: 'sl-blur' })], CheckboxGroup.prototype, 'blurEvent', 2);
__decorateClass([event({ name: 'sl-change' })], CheckboxGroup.prototype, 'changeEvent', 2);
__decorateClass([event({ name: 'sl-focus' })], CheckboxGroup.prototype, 'focusEvent', 2);
__decorateClass(
  [property({ type: Boolean, reflect: true })],
  CheckboxGroup.prototype,
  'disabled',
  2
);
__decorateClass(
  [property({ type: Boolean, reflect: true })],
  CheckboxGroup.prototype,
  'required',
  2
);
__decorateClass([property()], CheckboxGroup.prototype, 'size', 2);
__decorateClass([property({ type: Array })], CheckboxGroup.prototype, 'value', 2);
CheckboxGroup = __decorateClass([localized()], CheckboxGroup);
//# sourceMappingURL=checkbox-group.js.map
