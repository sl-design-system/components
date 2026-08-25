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
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});
var _events, _forceCounter, _Announcer_instances, onLiveEvent_fn;
import { localized } from '@lit/localize';
import { EventsController } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import styles from './announcer.scss.js';
export let Announcer = class extends LitElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _Announcer_instances);
    __privateAdd(this, _events, new EventsController(this, {}));
    /** Counter used to make forced announcements unique for screen reader deduplication. */
    __privateAdd(this, _forceCounter, 0);
  }
  connectedCallback() {
    super.connectedCallback();
    __privateGet(this, _events).listen(
      document.body,
      'sl-announce',
      __privateMethod(this, _Announcer_instances, onLiveEvent_fn)
    );
  }
  render() {
    return html`
      <ul aria-live="polite" aria-atomic="false"></ul>
      <ul aria-live="assertive" aria-atomic="false"></ul>
    `;
  }
};
_events = new WeakMap();
_forceCounter = new WeakMap();
_Announcer_instances = new WeakSet();
onLiveEvent_fn = function (event) {
  const container = this.renderRoot.querySelector(
    `[aria-live="${event.detail.urgency || 'polite'}"]`
  );
  const messageNode = document.createElement('li');
  if (event.detail.force) {
    __privateWrapper(this, _forceCounter)._++;
    messageNode.innerText =
      event.detail.message + '\u200B'.repeat((__privateGet(this, _forceCounter) % 4) + 1);
  } else if (container?.textContent?.indexOf(event.detail.message) === -1) {
    messageNode.innerText = event.detail.message;
  } else {
    return;
  }
  container?.appendChild(messageNode);
  setTimeout(() => {
    messageNode.remove();
  }, 500);
};
/** @internal */
Announcer.styles = styles;
Announcer = __decorateClass([localized()], Announcer);
//# sourceMappingURL=announcer.js.map
