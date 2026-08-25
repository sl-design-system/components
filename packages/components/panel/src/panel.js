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
var _toggleRafId,
  _addedNoTransitionInternally,
  _Panel_instances,
  renderHeading_fn,
  onHeaderSlotChange_fn,
  onActionsSlotChange_fn;
import { localized, msg } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { event } from '@sl-design-system/shared';
import { ToolBar } from '@sl-design-system/tool-bar';
import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './panel.scss.js';
export let Panel = class extends ScopedElementsMixin(LitElement) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _Panel_instances);
    this.fill = 'ghost';
    /**
     * Tracks the active requestAnimationFrame ID for state updates to allow
     * debouncing/cancellations on rapid toggles.
     */
    __privateAdd(this, _toggleRafId);
    /**
     * Tracks whether the `no-transition` attribute was added by the component's internal lifecycle
     * rather than a user.
     */
    __privateAdd(this, _addedNoTransitionInternally, false);
    this.hasActions = false;
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-button': Button,
      'sl-icon': Icon,
      'sl-tool-bar': ToolBar
    };
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.hasUpdated && !this.hasAttribute('no-transition')) {
      this.setAttribute('no-transition', '');
      __privateSet(this, _addedNoTransitionInternally, true);
    }
  }
  disconnectedCallback() {
    if (__privateGet(this, _toggleRafId) !== void 0) {
      cancelAnimationFrame(__privateGet(this, _toggleRafId));
      __privateSet(this, _toggleRafId, void 0);
    }
    super.disconnectedCallback();
  }
  willUpdate(changes) {
    super.willUpdate(changes);
    if (changes.has('heading') || changes.has('collapsible')) {
      __privateMethod(this, _Panel_instances, onHeaderSlotChange_fn).call(this);
    }
  }
  firstUpdated(changes) {
    super.firstUpdated(changes);
    requestAnimationFrame(() => {
      if (!this.isConnected) {
        return;
      }
      __privateMethod(this, _Panel_instances, onHeaderSlotChange_fn).call(this);
      requestAnimationFrame(() => {
        if (this.isConnected && __privateGet(this, _addedNoTransitionInternally)) {
          this.removeAttribute('no-transition');
        }
      });
    });
  }
  render() {
    return html`
      <div
        part="header"
        @slotchange=${__privateMethod(this, _Panel_instances, onHeaderSlotChange_fn)}>
        ${
          this.collapsible
            ? html`
                <sl-button
                  @click=${() => this.toggle()}
                  aria-label=${this.collapsed ? msg('Expand panel', { id: 'sl.panel.expand' }) : msg('Collapse panel', { id: 'sl.panel.collapse' })}
                  aria-controls="body"
                  aria-expanded=${this.collapsed ? 'false' : 'true'}
                  class="toggle"
                  fill="ghost">
                  <sl-icon
                    class=${!this.collapsed ? 'upside-down' : ''}
                    name="chevron-down"></sl-icon>
                </sl-button>
                <div part="wrapper">
                  ${__privateMethod(this, _Panel_instances, renderHeading_fn).call(this)}
                </div>
              `
            : html`<div part="wrapper">
                ${__privateMethod(this, _Panel_instances, renderHeading_fn).call(this)}
              </div>`
        }
        <slot name="aside">
          ${
            this.hasActions
              ? html`
                  <sl-tool-bar align="end" fill=${ifDefined(this.fill)}>
                    <slot
                      @slotchange=${__privateMethod(this, _Panel_instances, onActionsSlotChange_fn)}
                      name="actions"></slot>
                  </sl-tool-bar>
                `
              : html`<slot
                  @slotchange=${__privateMethod(this, _Panel_instances, onActionsSlotChange_fn)}
                  hidden
                  name="actions"></slot>`
          }
        </slot>
      </div>
      <div
        id="body"
        part="body"
        ?inert=${this.collapsible && !!this.collapsed}
        aria-hidden=${ifDefined(this.collapsible && this.collapsed ? 'true' : void 0)}
        aria-labelledby=${ifDefined(this.collapsible ? 'heading' : void 0)}
        role=${ifDefined(this.collapsible ? 'region' : void 0)}>
        <div part="inner">
          <div part="content">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
  /**
   * Toggles the collapsed state of the panel. This only does something if the panel is collapsible.
   *
   * @param force Whether to force the panel to be collapsed or expanded.
   */
  toggle(force = !this.collapsed) {
    if (!this.collapsible) {
      return;
    }
    const nextState = force;
    if (__privateGet(this, _toggleRafId) !== void 0) {
      cancelAnimationFrame(__privateGet(this, _toggleRafId));
      __privateSet(this, _toggleRafId, void 0);
    }
    if (!!this.collapsed === nextState) {
      return;
    }
    __privateSet(
      this,
      _toggleRafId,
      requestAnimationFrame(() => {
        this.collapsed = nextState;
        this.toggleEvent.emit(this.collapsed);
        __privateSet(this, _toggleRafId, void 0);
      })
    );
  }
};
_toggleRafId = new WeakMap();
_addedNoTransitionInternally = new WeakMap();
_Panel_instances = new WeakSet();
renderHeading_fn = function () {
  return html`
    <slot name="prefix"></slot>
    <div part="titles">
      <slot id="heading" name="heading">${this.heading}</slot>
    </div>
    <slot name="suffix"></slot>
  `;
};
onHeaderSlotChange_fn = function () {
  const headerSlots = this.renderRoot.querySelectorAll('div[part="header"] slot');
  const hasSlottedContent = Array.from(headerSlots).some(slot => {
    const slotElement = slot;
    if (slotElement.name === 'actions') {
      return false;
    }
    const assignedNodes = slotElement.assignedNodes({ flatten: true });
    return assignedNodes.some(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent?.trim() !== '';
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node;
        return element.textContent?.trim() !== '';
      }
      return false;
    });
  });
  const actionsSlot = this.renderRoot.querySelector('slot[name="actions"]'),
    hasActions = actionsSlot?.assignedElements({ flatten: true }).length > 0;
  this.toggleAttribute(
    'no-header',
    !hasSlottedContent && !hasActions && !this.heading && !this.collapsible
  );
};
onActionsSlotChange_fn = function (event2) {
  const elements = event2.target.assignedElements({ flatten: true });
  elements.forEach(el => {
    if (el instanceof Button) {
      el.fill = this.fill;
    }
  });
  this.hasActions = elements.length > 0;
  this.toggleAttribute('has-actions', this.hasActions);
};
/** @internal */
Panel.styles = styles;
__decorateClass([property({ type: Boolean, reflect: true })], Panel.prototype, 'collapsed', 2);
__decorateClass([property({ type: Boolean, reflect: true })], Panel.prototype, 'collapsible', 2);
__decorateClass([property({ reflect: true })], Panel.prototype, 'density', 2);
__decorateClass([property({ type: Boolean, reflect: true })], Panel.prototype, 'divider', 2);
__decorateClass([property({ reflect: true })], Panel.prototype, 'elevation', 2);
__decorateClass([property()], Panel.prototype, 'fill', 2);
__decorateClass([property()], Panel.prototype, 'heading', 2);
__decorateClass(
  [property({ type: Boolean, reflect: true, attribute: 'no-border' })],
  Panel.prototype,
  'noBorder',
  2
);
__decorateClass(
  [property({ reflect: true, attribute: 'toggle-placement' })],
  Panel.prototype,
  'togglePlacement',
  2
);
__decorateClass([event({ name: 'sl-toggle' })], Panel.prototype, 'toggleEvent', 2);
__decorateClass([state()], Panel.prototype, 'hasActions', 2);
Panel = __decorateClass([localized()], Panel);
//# sourceMappingURL=panel.js.map
