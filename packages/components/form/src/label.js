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
var _formControlId,
  _label,
  _observer,
  _previousFormControl,
  _Label_instances,
  onSlotchange_fn,
  update_fn;
import { localized, msg } from '@lit/localize';
import { LitElement, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './label.scss.js';
let nextUniqueId = 0;
export let Label = class extends LitElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _Label_instances);
    /** The actual form control id this label links to. */
    __privateAdd(this, _formControlId);
    /** The label instance in the light DOM. */
    __privateAdd(this, _label);
    /** Observe the form control for changes to the required attribute. */
    __privateAdd(
      this,
      _observer,
      new MutationObserver(() => __privateMethod(this, _Label_instances, update_fn).call(this))
    );
    /** Track the previous form control to clean up data-label-id when it changes. */
    __privateAdd(this, _previousFormControl, null);
    this.disabled = false;
    this.formControl = null;
    this.size = 'md';
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.parentElement?.tagName === 'SL-FORM-FIELD') {
      this.slot = 'label';
    }
  }
  disconnectedCallback() {
    __privateGet(this, _observer).disconnect();
    if (this.formControl) {
      this.formControl.removeAttribute('data-label-id');
    }
    super.disconnectedCallback();
  }
  willUpdate(changes) {
    super.willUpdate(changes);
    if (changes.has('for')) {
      if (this.for) {
        this.formControl = this.getRootNode()?.querySelector(`#${this.for}`);
        if (this.formControl instanceof LitElement) {
          void this.formControl.updateComplete.then(() => {
            __privateSet(this, _formControlId, this.formControl?.formControlElement?.id);
            if (__privateGet(this, _formControlId)) {
              __privateGet(this, _label)?.setAttribute('for', __privateGet(this, _formControlId));
            } else {
              __privateGet(this, _label)?.removeAttribute('for');
            }
          });
        } else if (!this.formControl) {
          __privateSet(this, _formControlId, this.for);
          __privateGet(this, _label)?.setAttribute('for', this.for);
        } else {
          console.warn(`The form control with id "${this.for}" could not be found.`);
          __privateGet(this, _label)?.removeAttribute('for');
          this.formControl = null;
        }
      } else {
        __privateGet(this, _label)?.removeAttribute('for');
        this.formControl = null;
      }
    }
    if (changes.has('formControl')) {
      if (
        __privateGet(this, _previousFormControl) &&
        __privateGet(this, _previousFormControl) !== this.formControl
      ) {
        __privateGet(this, _previousFormControl).removeAttribute('data-label-id');
      }
      if (this.formControl) {
        let target = this.formControl;
        if (target instanceof LitElement && this.formControl.formControlElement) {
          target = this.formControl.formControlElement;
        }
        if (typeof this.formControl.size === 'string') {
          this.size = ['sm', 'md', 'lg'].find(s => s === this.formControl.size) || 'md';
        }
        __privateGet(this, _observer).observe(target, {
          attributes: true,
          attributeFilter: ['disabled', 'required']
        });
        __privateMethod(this, _Label_instances, update_fn).call(this);
        if (__privateGet(this, _label)?.id) {
          this.formControl.setAttribute('data-label-id', __privateGet(this, _label).id);
        }
        __privateSet(this, _previousFormControl, this.formControl);
      } else {
        __privateGet(this, _observer).disconnect();
        this.required = void 0;
        __privateSet(this, _previousFormControl, null);
      }
    }
  }
  render() {
    return html`
      <slot
        @slotchange=${__privateMethod(this, _Label_instances, onSlotchange_fn)}
        style="display: none"></slot>
      <slot name="label"></slot>
      <slot name="infotip"></slot>
      ${
        this.mark === 'optional' && !this.required
          ? html`
              <span class="optional">
                (${msg('optional', { id: 'sl.form.optionalLabelIndicator' })})
              </span>
            `
          : nothing
      }
      ${
        this.mark === 'required' && this.required
          ? html`
              <span class="required">
                (${msg('required', { id: 'sl.form.requiredLabelIndicator' })})
              </span>
            `
          : nothing
      }
    `;
  }
};
_formControlId = new WeakMap();
_label = new WeakMap();
_observer = new WeakMap();
_previousFormControl = new WeakMap();
_Label_instances = new WeakSet();
onSlotchange_fn = function ({ target }) {
  const nodes = target.assignedNodes({ flatten: true });
  const contentNodes = nodes.filter(
    n => n.nodeType === Node.TEXT_NODE || n.nodeType === Node.ELEMENT_NODE
  );
  if (__privateGet(this, _label) && contentNodes.length) {
    __privateGet(this, _label).replaceChildren(...contentNodes);
  } else {
    __privateSet(
      this,
      _label,
      __privateGet(this, _label) ??
        (this.querySelector('label[slot="label"]') || document.createElement('label'))
    );
    __privateGet(this, _label).htmlFor = __privateGet(this, _formControlId) ?? '';
    __privateGet(this, _label).slot = 'label';
    __privateGet(this, _label).append(...contentNodes);
    this.prepend(__privateGet(this, _label));
  }
  __privateGet(this, _label).id ||= `sl-label-${nextUniqueId++}`;
  this.formControl?.setAttribute('data-label-id', __privateGet(this, _label).id);
};
update_fn = function () {
  this.disabled = this.formControl?.disabled ?? false;
  this.required = this.formControl?.required ?? false;
};
/** @internal */
Label.styles = styles;
__decorateClass([property({ type: Boolean, reflect: true })], Label.prototype, 'disabled', 2);
__decorateClass([property()], Label.prototype, 'for', 2);
__decorateClass([state()], Label.prototype, 'formControl', 2);
__decorateClass([property()], Label.prototype, 'mark', 2);
__decorateClass([state()], Label.prototype, 'required', 2);
__decorateClass([property({ reflect: true })], Label.prototype, 'size', 2);
Label = __decorateClass([localized()], Label);
//# sourceMappingURL=label.js.map
