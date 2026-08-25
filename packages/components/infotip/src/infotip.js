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
var _contentCopy,
  _observer,
  _Infotip_instances,
  onKeydown_fn,
  onClick_fn,
  buttonLabel_fn,
  syncContent_fn;
import { localized, msg, str } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { Popover } from '@sl-design-system/popover';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './infotip.scss.js';
let nextUniqueId = 0;
export let Infotip = class extends ScopedElementsMixin(LitElement) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _Infotip_instances);
    this.size = 'md';
    /** Light DOM div that holds a copy of the content; manually assigned to the default slot. */
    __privateAdd(this, _contentCopy);
    /** Observes light DOM changes to sync the copy. */
    __privateAdd(this, _observer);
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-button': Button,
      'sl-icon': Icon,
      'sl-popover': Popover
    };
  }
  connectedCallback() {
    super.connectedCallback();
    __privateSet(this, _contentCopy, document.createElement('div'));
    __privateGet(this, _contentCopy).id = this.contentId = `sl-infotip-content-${nextUniqueId++}`;
    this.append(__privateGet(this, _contentCopy));
    __privateSet(
      this,
      _observer,
      new MutationObserver(() =>
        __privateMethod(this, _Infotip_instances, syncContent_fn).call(this)
      )
    );
    __privateGet(this, _observer).observe(this, {
      childList: true,
      characterData: true,
      attributes: true,
      subtree: true
    });
  }
  firstUpdated() {
    __privateMethod(this, _Infotip_instances, syncContent_fn).call(this);
  }
  disconnectedCallback() {
    __privateGet(this, _observer)?.disconnect();
    __privateSet(this, _observer, void 0);
    __privateGet(this, _contentCopy)?.remove();
    __privateSet(this, _contentCopy, void 0);
    super.disconnectedCallback();
  }
  render() {
    return html`
      <sl-button
        @click=${__privateMethod(this, _Infotip_instances, onClick_fn)}
        @keydown=${__privateMethod(this, _Infotip_instances, onKeydown_fn)}
        aria-label=${__privateMethod(this, _Infotip_instances, buttonLabel_fn).call(this)}
        fill="ghost"
        id="trigger"
        size=${this.size}
        part="button">
        <slot name="icon">
          <sl-icon name="info"></sl-icon>
        </slot>
      </sl-button>
      <sl-popover anchor="trigger" part="popover" position="top">
        <slot></slot>
      </sl-popover>
    `;
  }
  focus(options) {
    const trigger = this.renderRoot.querySelector('sl-button');
    if (trigger) {
      trigger.focus(options);
      return;
    }
    super.focus(options);
  }
  toggleInfotip() {
    this.renderRoot.querySelector('sl-popover')?.togglePopover();
  }
};
_contentCopy = new WeakMap();
_observer = new WeakMap();
_Infotip_instances = new WeakSet();
onKeydown_fn = function (event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.stopPropagation();
  }
};
onClick_fn = function (event) {
  event.preventDefault();
  event.stopPropagation();
  this.toggleInfotip();
};
buttonLabel_fn = function () {
  const describes = this.describes?.trim();
  if (!describes) {
    return msg('More information', { id: 'sl.infotip.moreInformation' });
  }
  return msg(str`More information about ${describes}`, { id: 'sl.infotip.moreInformationAbout' });
};
syncContent_fn = function () {
  __privateGet(this, _observer)?.disconnect();
  const icon = this.querySelector('[slot="icon"]'),
    iconSlot = this.renderRoot?.querySelector('slot[name="icon"]');
  if (icon && iconSlot) {
    iconSlot.assign(icon);
  }
  const nodes = [...this.childNodes].filter(
    node =>
      node !== __privateGet(this, _contentCopy) &&
      node.nodeType !== Node.COMMENT_NODE &&
      node !== icon
  );
  if (__privateGet(this, _contentCopy)) {
    __privateGet(this, _contentCopy).replaceChildren(...nodes.map(n => n.cloneNode(true)));
    this.renderRoot.querySelector('slot:not([name])')?.assign(__privateGet(this, _contentCopy));
  }
  __privateGet(this, _observer)?.observe(this, {
    childList: true,
    characterData: true,
    subtree: true
  });
};
/** @internal */
Infotip.shadowRootOptions = {
  ...LitElement.shadowRootOptions,
  slotAssignment: 'manual'
};
/** @internal */
Infotip.styles = styles;
__decorateClass([property()], Infotip.prototype, 'describes', 2);
__decorateClass([property({ reflect: true })], Infotip.prototype, 'size', 2);
Infotip = __decorateClass([localized()], Infotip);
//# sourceMappingURL=infotip.js.map
