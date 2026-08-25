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
var _ProgressBar_instances, getLocalizedVariant_fn;
import { localized, msg } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { announce } from '@sl-design-system/announcer';
import { Icon } from '@sl-design-system/icon';
import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import styles from './progress-bar.scss.js';
export let ProgressBar = class extends ScopedElementsMixin(LitElement) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _ProgressBar_instances);
    this.indeterminate = false;
    this.value = 0;
    this.shouldAnnounce = true;
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-icon': Icon
    };
  }
  /** @internal The name of the icon, depending on the variant. */
  get iconName() {
    switch (this.variant) {
      case 'success':
        return 'circle-check-solid';
      case 'warning':
        return 'triangle-exclamation-solid';
      case 'error':
        return 'octagon-xmark-solid';
      default:
        return 'circle-check-solid';
    }
  }
  updated(changes) {
    super.updated(changes);
    if (changes.has('value')) {
      if (this.value === 100) {
        announce(
          `100%, ${__privateMethod(this, _ProgressBar_instances, getLocalizedVariant_fn).call(this).strings[0]}`
        );
      }
      if (this.shouldAnnounce) {
        announce(`${this.value}%`, 'assertive');
        this.shouldAnnounce = false;
        setTimeout(() => {
          this.shouldAnnounce = true;
        }, 1500);
      }
    }
  }
  render() {
    return html`
      <div>
        ${
          this.label
            ? html`
                <div id="label" class="label">
                  ${this.label}
                  ${this.variant ? html`<sl-icon .name=${this.iconName} size="md"></sl-icon>` : nothing}
                </div>
              `
            : nothing
        }
        <div id="helper" class="helper">
          <slot></slot>
          <span id="live" aria-busy=${ifDefined(this.indeterminate)}>
            ${msg('state', { id: 'sl.progressBar.state' })}:
            ${this.variant ? html`${__privateMethod(this, _ProgressBar_instances, getLocalizedVariant_fn).call(this)}` : html`${msg('active', { id: 'sl.progressBar.active' })}`}
          </span>
          ${this.variant && !this.label ? html`<sl-icon .name=${this.iconName} size="md"></sl-icon>` : nothing}
        </div>
      </div>
      <div
        aria-labelledby=${ifDefined(this.label ? 'label' : void 0)}
        aria-describedby="helper"
        class="container"
        role="progressbar"
        aria-valuemin="0"
        aria-valuenow=${ifDefined(!this.indeterminate ? `${this.value}` : void 0)}
        aria-valuemax="100">
        <div
          class="progress"
          style=${styleMap({
            width: !this.indeterminate || this.variant ? `${this.value}%` : ''
          })}></div>
      </div>
      <slot name="error"></slot>
    `;
  }
};
_ProgressBar_instances = new WeakSet();
getLocalizedVariant_fn = function () {
  switch (this.variant) {
    case 'success':
      return html`${msg('success', { id: 'sl.progressBar.success' })}`;
    case 'warning':
      return html`${msg('warning', { id: 'sl.progressBar.warning' })}`;
    case 'error':
      return html`${msg('error', { id: 'sl.progressBar.error' })}`;
    default:
      return html`${msg('success', { id: 'sl.progressBar.success' })}`;
  }
};
/** @internal */
ProgressBar.styles = styles;
__decorateClass(
  [property({ type: Boolean, reflect: true })],
  ProgressBar.prototype,
  'indeterminate',
  2
);
__decorateClass([property()], ProgressBar.prototype, 'label', 2);
__decorateClass([property({ reflect: true })], ProgressBar.prototype, 'variant', 2);
__decorateClass([property({ reflect: true })], ProgressBar.prototype, 'color', 2);
__decorateClass([property({ type: Number })], ProgressBar.prototype, 'value', 2);
ProgressBar = __decorateClass([localized()], ProgressBar);
//# sourceMappingURL=progress-bar.js.map
