var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __typeError = msg => {
  throw TypeError(msg);
};
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if ((decorator = decorators[i]))
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError('Cannot ' + msg);
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
var _Callout_instances, onTitleSlotChange_fn;
import { localized } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './callout.scss.js';
export let Callout = class extends ScopedElementsMixin(LitElement) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _Callout_instances);
    this.noTitle = true;
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
      case 'danger':
        return 'octagon-xmark-solid';
      default:
        return 'info';
    }
  }
  render() {
    return html`
      <div part="icon">
        <slot name="icon">
          <sl-icon .name=${this.iconName} size="md"></sl-icon>
        </slot>
      </div>
      <div part="title">
        <slot
          @slotchange=${__privateMethod(this, _Callout_instances, onTitleSlotChange_fn)}
          name="title"></slot>
      </div>
      <div part="content">
        <slot></slot>
      </div>
    `;
  }
};
_Callout_instances = new WeakSet();
onTitleSlotChange_fn = function (event) {
  this.noTitle = !Array.from(event.target.assignedNodes({ flatten: true })).some(
    node => node.nodeType === Node.ELEMENT_NODE || node.textContent?.trim()
  );
};
/** @internal */
Callout.styles = styles;
__decorateClass(
  [property({ type: Boolean, attribute: 'no-title', reflect: true })],
  Callout.prototype,
  'noTitle',
  2
);
__decorateClass([property({ reflect: true })], Callout.prototype, 'density', 2);
__decorateClass([property({ reflect: true })], Callout.prototype, 'variant', 2);
Callout = __decorateClass([localized()], Callout);
//# sourceMappingURL=callout.js.map
