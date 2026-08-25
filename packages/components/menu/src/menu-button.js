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
var _events,
  _popoverJustClosed,
  _MenuButton_instances,
  onBeforeToggle_fn,
  onClick_fn,
  onHostClick_fn,
  onHostKeydown_fn,
  onKeydown_fn,
  onKeydownMenu_fn,
  onMenuClick_fn,
  onPointerDown_fn,
  onSelect_fn,
  onToggle_fn,
  isDisabled_fn;
import { localized } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { EventsController, event } from '@sl-design-system/shared';
import { isForwardedDisabled } from '@sl-design-system/shared/helpers/forward-aria.js';
import { ForwardAriaMixin } from '@sl-design-system/shared/mixins.js';
import { LitElement, html, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './menu-button.scss.js';
import { MenuItem } from './menu-item.js';
import { Menu } from './menu.js';
export let MenuButton = class extends ForwardAriaMixin(ScopedElementsMixin(LitElement)) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _MenuButton_instances);
    // eslint-disable-next-line no-unused-private-class-members
    __privateAdd(
      this,
      _events,
      new EventsController(this, {
        click: {
          handler: __privateMethod(this, _MenuButton_instances, onHostClick_fn),
          options: { capture: true }
        },
        keydown: {
          handler: __privateMethod(this, _MenuButton_instances, onHostKeydown_fn),
          options: { capture: true }
        }
      })
    );
    /**
     * Flag indicating whether the popover was just closed. We need to know this so we can properly
     * handle button clicks that close the popover. If the popover was just closed, we don't want to
     * show it again when the button click event fires.
     */
    __privateAdd(this, _popoverJustClosed, false);
    this.fill = 'outline';
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-button': Button,
      'sl-icon': Icon,
      'sl-menu': Menu
    };
  }
  firstUpdated(changes) {
    super.firstUpdated(changes);
    this.setProxyTarget(this.button);
    this.button.setAttribute('aria-controls', this.menu.id);
    this.menu.anchorElement = this.button;
  }
  render() {
    const assignedElements = Array.from(this.children).filter(el => el.slot === 'button'),
      iconOnly = assignedElements.length === 1 && assignedElements[0].nodeName === 'SL-ICON';
    return html`
      <sl-button
        @click=${__privateMethod(this, _MenuButton_instances, onClick_fn)}
        @keydown=${__privateMethod(this, _MenuButton_instances, onKeydown_fn)}
        @pointerdown=${__privateMethod(this, _MenuButton_instances, onPointerDown_fn)}
        ?disabled=${this.disabled}
        aria-expanded="false"
        aria-haspopup="menu"
        exportparts="button:internal-button, tooltip"
        fill=${ifDefined(this.fill)}
        part="button"
        shape=${ifDefined(this.shape)}
        size=${ifDefined(this.size)}
        tooltip=${ifDefined(this.tooltip)}
        variant=${ifDefined(this.variant)}>
        <slot name="button"></slot>
        ${iconOnly ? nothing : html`<sl-icon name="angle-down"></sl-icon>`}
      </sl-button>
      <sl-menu
        @beforetoggle=${__privateMethod(this, _MenuButton_instances, onBeforeToggle_fn)}
        @click=${__privateMethod(this, _MenuButton_instances, onMenuClick_fn)}
        @keydown=${__privateMethod(this, _MenuButton_instances, onKeydownMenu_fn)}
        @sl-select=${__privateMethod(this, _MenuButton_instances, onSelect_fn)}
        @toggle=${__privateMethod(this, _MenuButton_instances, onToggle_fn)}
        .position=${this.position ?? 'bottom-start'}
        part="menu">
        <slot></slot>
      </sl-menu>
    `;
  }
};
_events = new WeakMap();
_popoverJustClosed = new WeakMap();
_MenuButton_instances = new WeakSet();
onBeforeToggle_fn = function (event2) {
  if (event2.newState === 'closed') {
    __privateSet(this, _popoverJustClosed, true);
  }
};
onClick_fn = function () {
  if (
    __privateMethod(this, _MenuButton_instances, isDisabled_fn).call(this) ||
    __privateGet(this, _popoverJustClosed)
  ) {
    return;
  }
  this.menu.togglePopover();
  if (this.menu.matches(':popover-open')) {
    this.menu.focus();
  }
};
onHostClick_fn = function (event2) {
  if (__privateMethod(this, _MenuButton_instances, isDisabled_fn).call(this)) {
    event2.preventDefault();
    event2.stopImmediatePropagation();
  }
};
onHostKeydown_fn = function (event2) {
  if (
    __privateMethod(this, _MenuButton_instances, isDisabled_fn).call(this) &&
    ['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event2.key)
  ) {
    event2.preventDefault();
    event2.stopImmediatePropagation();
  }
};
onKeydown_fn = function (event2) {
  if (__privateMethod(this, _MenuButton_instances, isDisabled_fn).call(this)) {
    if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event2.key)) {
      event2.preventDefault();
      event2.stopImmediatePropagation();
    }
    return;
  }
  if (event2.key === 'Escape') {
    event2.stopPropagation();
  } else if (event2.key === 'ArrowDown' && !this.menu.matches(':popover-open')) {
    this.menu.showPopover();
    this.menu.focus();
  } else {
    const actualPlacement = this.menu.getAttribute('actual-placement');
    if (actualPlacement?.startsWith('top') && event2.key === 'ArrowUp') {
      this.menu.focusLastItem();
    } else if (actualPlacement?.startsWith('bottom') && event2.key === 'ArrowDown') {
      this.menu.focus();
    }
  }
};
onKeydownMenu_fn = function (event2) {
  if (event2.key === 'Escape') {
    event2.stopPropagation();
  }
};
onMenuClick_fn = function (event2) {
  const menuItem = event2.composedPath().find(el => el instanceof MenuItem);
  if (menuItem) {
    const focusVisible = menuItem.matches(':focus-visible');
    this.menu.togglePopover({ source: menuItem });
    this.button.focus({ focusVisible });
  }
};
onPointerDown_fn = function (event2) {
  if (this.menu.matches(':popover-open')) {
    event2.preventDefault();
    event2.stopImmediatePropagation();
  }
};
onSelect_fn = function () {
  this.menu.hidePopover();
};
onToggle_fn = function (event2) {
  this.toggleEvent.emit(event2.newState === 'open');
  if (event2.newState === 'closed') {
    __privateSet(this, _popoverJustClosed, false);
    if (!event2.source && this.menu.matches(':focus-within')) {
      this.button.focus();
    }
  }
};
isDisabled_fn = function () {
  return this.disabled || !!isForwardedDisabled(this.button);
};
/** @internal */
MenuButton.styles = styles;
__decorateClass([query('sl-button')], MenuButton.prototype, 'button', 2);
__decorateClass([event({ name: 'sl-toggle' })], MenuButton.prototype, 'toggleEvent', 2);
__decorateClass([property({ type: Boolean })], MenuButton.prototype, 'disabled', 2);
__decorateClass([property()], MenuButton.prototype, 'fill', 2);
__decorateClass([query('sl-menu')], MenuButton.prototype, 'menu', 2);
__decorateClass([property()], MenuButton.prototype, 'position', 2);
__decorateClass([property()], MenuButton.prototype, 'shape', 2);
__decorateClass([property()], MenuButton.prototype, 'size', 2);
__decorateClass([property()], MenuButton.prototype, 'tooltip', 2);
__decorateClass([property()], MenuButton.prototype, 'variant', 2);
MenuButton = __decorateClass([localized()], MenuButton);
//# sourceMappingURL=menu-button.js.map
