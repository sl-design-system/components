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
import { event } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { Error as Error2 } from './error.js';
import styles from './form-field.scss.js';
import { Hint } from './hint.js';
import { Label } from './label.js';
let nextUniqueId = 0;
export class FormField extends ScopedElementsMixin(LitElement) {
  constructor() {
    super(...arguments);
    /** A record of all error elements, with the form control id as key. */
    this.#errors = {};
    this.errors = {};
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-error': Error2,
      'sl-hint': Hint,
      'sl-label': Label
    };
  }
  static {
    /** @internal */
    this.styles = styles;
  }
  /** Whether a custom error has been slotted. */
  #customError;
  /** The error element. */
  #error;
  #errors;
  /** The hint element. */
  #hint;
  /** The infotip element. */
  #infotip;
  /** The label element. */
  #label;
  /** Callback returned by the parent form to call when this element is disconnected. */
  #unregister;
  connectedCallback() {
    super.connectedCallback();
    const event2 = new CustomEvent('sl-form-field', {
      bubbles: true,
      composed: true,
      detail: {}
    });
    this.formFieldEvent.emit(event2);
    this.#unregister = event2.detail.unregister;
    this.#customError = !!this.querySelector('sl-error');
  }
  disconnectedCallback() {
    this.#unregister?.();
    this.#unregister = void 0;
    super.disconnectedCallback();
  }
  willUpdate(changes) {
    super.willUpdate(changes);
    if (!this.#customError && changes.has('errors')) {
      const errors = Object.values(this.errors).filter(Boolean);
      this.error = errors.at(0);
    }
  }
  updated(changes) {
    super.updated(changes);
    if (!this.#customError && changes.has('errors')) {
      const errors = Object.entries(this.errors).filter(error => !!error[0] && !!error[1]);
      Object.entries(this.#errors)
        .filter(([id]) => !errors.find(([errorId]) => errorId === id))
        .forEach(([id, error]) => {
          const control = this.querySelector(`#${id}`);
          this.#updateAriaDescribedBy({ remove: error.id, control });
          error.remove();
          delete this.#errors[id];
        });
      errors.forEach(([id, message]) => {
        const error = (this.#errors[id] ??= this.shadowRoot.createElement('sl-error'));
        error.for = id;
        error.innerText = message;
        if (!error.parentElement) {
          this.prepend(error);
        }
      });
    }
    if (changes.has('hint')) {
      if (this.hint) {
        this.#hint ??= this.shadowRoot?.createElement('sl-hint');
        this.#hint.innerText = this.hint;
        if (!this.#hint.parentElement) {
          this.prepend(this.#hint);
        }
      } else {
        this.#updateAriaDescribedBy({ remove: this.#hint?.id });
        this.#hint?.remove();
        this.#hint = void 0;
      }
    }
    if (changes.has('label')) {
      if (this.label) {
        this.#label ??= this.shadowRoot?.createElement('sl-label');
        this.#label.innerText = this.label;
        if (!this.#label.parentElement) {
          this.prepend(this.#label);
        }
      } else {
        this.#label?.remove();
        this.#label = void 0;
      }
    }
    if (changes.has('mark') && this.#label) {
      this.#label.mark ??= this.mark;
    }
  }
  render() {
    return html`
      <slot name="label" @slotchange=${this.#onLabelSlotchange}></slot>
      <div class="wrapper" part="wrapper">
        <slot @slotchange=${this.#onHintSlotchange} name="hint"></slot>
        <slot
          @slotchange=${this.#onSlotchange}
          @sl-update-validity=${this.#onUpdateValidity}
          part="controls"></slot>
        <slot @slotchange=${this.#onErrorSlotchange} name="error"></slot>
      </div>
    `;
  }
  #onErrorSlotchange(event2) {
    const errors = event2.target
      .assignedElements({ flatten: true })
      .filter(el => el instanceof Error2);
    errors.forEach(error => {
      error.id ||= `sl-form-field-error-${nextUniqueId++}`;
      const control = error.for ? this.querySelector(`#${error.for}`) : this.control;
      if (control) {
        this.#updateAriaDescribedBy({ add: error.id, control });
      }
    });
    this.requestUpdate();
  }
  #onHintSlotchange(event2) {
    const assignedElements = event2.target.assignedElements({ flatten: true }),
      hint = assignedElements.find(el => el instanceof Hint);
    if (hint) {
      this.#hint = hint;
      this.#hint.id ||= `sl-form-field-hint-${nextUniqueId++}`;
      this.#updateAriaDescribedBy({ add: this.#hint.id });
    } else {
      this.#updateAriaDescribedBy({ remove: this.#hint?.id });
      this.#hint = void 0;
    }
  }
  #onLabelSlotchange(event2) {
    const assignedElements = event2.target.assignedElements({ flatten: true }),
      label = assignedElements.find(el => el instanceof Label),
      infotip = label?.querySelector('sl-infotip');
    if (infotip) {
      this.#infotip = infotip;
      this.#updateAriaDescribedBy({ add: infotip?.contentId });
    } else {
      this.#updateAriaDescribedBy({ remove: this.#infotip?.contentId });
      this.#infotip = void 0;
    }
    if (label) {
      this.#label = label;
      if (this.control) {
        this.#label.for = this.control.id;
      }
    } else {
      this.#label = void 0;
    }
  }
  #onSlotchange(event2) {
    const assignedElements = event2.target.assignedElements({ flatten: true }),
      formControls = assignedElements.filter(el => 'extendsFormControlMixin' in el.constructor);
    formControls.forEach(control => {
      control.id ||= `sl-form-field-control-${nextUniqueId++}`;
    });
    if (formControls.length) {
      this.control = formControls[0];
      if (this.control.name) {
        this.setAttribute('name', this.control.name);
      } else {
        this.removeAttribute('name');
      }
      if (this.control.showValidity) {
        this.error = this.control.getLocalizedValidationMessage();
      }
      this.#updateAriaDescribedBy({ add: this.#hint?.id });
      this.#updateAriaDescribedBy({ add: this.#infotip?.contentId });
      if (this.#label) {
        this.#label.for = this.control.id;
        this.#label.mark ??= this.mark;
      }
    } else {
      this.control = void 0;
      if (this.#label) {
        this.#label.for = this.#label.mark = void 0;
      }
    }
  }
  #updateAriaDescribedBy({ add, remove, control }) {
    const target = control ?? this.control;
    if (!target) {
      return;
    }
    const element = target.formControlElement,
      describedby = element.getAttribute('aria-describedby'),
      ids = describedby ? describedby.split(' ') : [];
    if (add && !ids.includes(add)) {
      ids.push(add);
    }
    if (remove) {
      const index = ids.indexOf(remove);
      if (index !== -1) {
        ids.splice(index, 1);
      }
    }
    if (ids.length) {
      element.setAttribute('aria-describedby', ids.join(' '));
    } else {
      element.removeAttribute('aria-describedby');
    }
  }
  #onUpdateValidity(event2) {
    if (!event2.target.id || (this.#error && !this.error)) {
      return;
    }
    this.errors = {
      ...this.errors,
      [event2.target.id]: event2.detail.showValidity ? event2.detail.validationMessage : void 0
    };
  }
}
__decorateClass([state()], FormField.prototype, 'error', 2);
__decorateClass([state()], FormField.prototype, 'errors', 2);
__decorateClass([event({ name: 'sl-form-field' })], FormField.prototype, 'formFieldEvent', 2);
__decorateClass([property()], FormField.prototype, 'hint', 2);
__decorateClass([property()], FormField.prototype, 'label', 2);
__decorateClass([property()], FormField.prototype, 'mark', 2);
//# sourceMappingURL=form-field.js.map
