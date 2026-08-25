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
var _onUpdate, _FormValidationErrors_instances, onClick_fn;
import { localized, msg } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { InlineMessage } from '@sl-design-system/inline-message';
import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './form-validation-errors.scss.js';
export let FormValidationErrors = class extends ScopedElementsMixin(LitElement) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _FormValidationErrors_instances);
    __privateAdd(this, _onUpdate, () => {
      this.validity = this.controller?.showValidity
        ? this.controller?.invalid
          ? 'invalid'
          : 'valid'
        : void 0;
      if (this.validity === 'invalid') {
        this.invalidControls =
          this.controller?.element?.controls
            .filter(control => !control.valid)
            .reduce((acc, control) => {
              const label =
                control.labels?.[0]?.textContent?.trim() ||
                control.formControlElement.ariaLabel ||
                control.ariaLabel ||
                control.name;
              return { ...acc, [label]: control };
            }, {}) ?? {};
      } else {
        this.invalidControls = {};
      }
    });
    this.invalidControls = {};
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-inline-message': InlineMessage
    };
  }
  connectedCallback() {
    super.connectedCallback();
    __privateGet(this, _onUpdate).call(this);
  }
  willUpdate(changes) {
    super.willUpdate(changes);
    if (changes.has('controller')) {
      if (this.controller) {
        this.controller?.addEventListener('sl-update', __privateGet(this, _onUpdate));
      } else {
        changes.get('controller')?.removeEventListener('sl-update', __privateGet(this, _onUpdate));
      }
    }
    if (changes.has('validity')) {
      if (this.validity === 'valid' && changes.get('validity') === 'invalid') {
        this.variant = 'success';
      } else if (this.validity === 'invalid') {
        this.variant = 'danger';
      } else {
        this.variant = void 0;
      }
      this.style.display = this.variant ? 'block' : '';
    }
  }
  render() {
    return html`
      <sl-inline-message .variant=${this.variant}>
        ${
          this.variant === 'danger'
            ? html`
                ${msg('The following fields have errors:', { id: 'sl.form.errorsList' })}
                <ul>
                  ${Object.entries(this.invalidControls).map(
                    ([label, control]) =>
                      html`<li>
                        <a
                          @click=${__privateMethod(this, _FormValidationErrors_instances, onClick_fn)}
                          href="#${control.id}"
                          >${label}</a
                        >
                      </li>`
                  )}
                </ul>
                .
              `
            : msg('All fields are valid.', { id: 'sl.form.allFieldsValid' })
        }
      </sl-inline-message>
    `;
  }
};
_onUpdate = new WeakMap();
_FormValidationErrors_instances = new WeakSet();
onClick_fn = function (event) {
  event.preventDefault();
  this.getRootNode().querySelector(event.target.hash)?.focus();
};
/** @internal */
FormValidationErrors.styles = styles;
__decorateClass([property({ attribute: false })], FormValidationErrors.prototype, 'controller', 2);
__decorateClass([state()], FormValidationErrors.prototype, 'invalidControls', 2);
__decorateClass([state()], FormValidationErrors.prototype, 'validity', 2);
__decorateClass([state()], FormValidationErrors.prototype, 'variant', 2);
FormValidationErrors = __decorateClass([localized()], FormValidationErrors);
//# sourceMappingURL=form-validation-errors.js.map
