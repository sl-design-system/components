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
var _internals,
  _observer,
  _mutationObserver,
  _Tag_instances,
  onBlur_fn,
  onFocus_fn,
  onKeydown_fn,
  onRemove_fn,
  syncButtonTabIndex_fn,
  onResize_fn,
  onSlotChange_fn,
  updateLabel_fn;
import { localized, msg, str } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { event } from '@sl-design-system/shared';
import { Tooltip } from '@sl-design-system/tooltip';
import { LitElement, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './tag.scss.js';
export let Tag = class extends ScopedElementsMixin(LitElement) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _Tag_instances);
    /** @internal */
    __privateAdd(this, _internals, this.attachInternals());
    /**
     * Observe changes in size, so we can check whether we need to show tooltips for truncated
     * links.
     */
    __privateAdd(
      this,
      _observer,
      new ResizeObserver(() => __privateMethod(this, _Tag_instances, onResize_fn).call(this))
    );
    /** Observe label text changes that do not trigger a resize or slotchange. */
    __privateAdd(
      this,
      _mutationObserver,
      new MutationObserver(() => __privateMethod(this, _Tag_instances, updateLabel_fn).call(this))
    );
    this.label = '';
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-icon': Icon,
      'sl-tooltip': Tooltip
    };
  }
  /** @internal */
  get tabIndex() {
    return super.tabIndex;
  }
  /** @internal */
  set tabIndex(tabIndex) {
    super.tabIndex = tabIndex;
    __privateMethod(this, _Tag_instances, syncButtonTabIndex_fn).call(this);
  }
  connectedCallback() {
    super.connectedCallback();
    __privateGet(this, _observer).observe(this);
    __privateGet(this, _mutationObserver).observe(this, {
      characterData: true,
      childList: true,
      subtree: true
    });
  }
  disconnectedCallback() {
    __privateGet(this, _observer).disconnect();
    __privateGet(this, _mutationObserver).disconnect();
    super.disconnectedCallback();
  }
  focus(options) {
    const focusTarget = this.removable
      ? this.renderRoot.querySelector('button')
      : this.renderRoot.querySelector('[part="label"][tabindex]');
    if (focusTarget) {
      focusTarget.focus(options);
    } else {
      super.focus(options);
    }
  }
  updated(changes) {
    super.updated(changes);
    __privateMethod(this, _Tag_instances, syncButtonTabIndex_fn).call(this);
  }
  render() {
    const labelTabIndex =
        !this.disabled && !this.removable
          ? this.hasAttribute('tabindex')
            ? this.tabIndex.toString()
            : this.tooltip
              ? '0'
              : void 0
          : void 0,
      buttonDescription = [
        this.tooltip ? 'tooltip' : void 0,
        this.navigationDescription ? 'navigation-description' : void 0
      ]
        .filter(Boolean)
        .join(' '),
      labelDescribedBy = [
        this.tooltip ? 'tooltip' : void 0,
        this.labelDescription ? 'label-description' : void 0
      ]
        .filter(Boolean)
        .join(' ');
    return html`
      ${
        this.tooltip
          ? html`
              <sl-tooltip for="label" part="tooltip">
                ${typeof this.tooltip === 'string' ? this.tooltip : this.label}
              </sl-tooltip>
            `
          : nothing
      }
      <div
        @blur=${__privateMethod(this, _Tag_instances, onBlur_fn)}
        @focus=${__privateMethod(this, _Tag_instances, onFocus_fn)}
        aria-describedby=${ifDefined(labelDescribedBy || void 0)}
        id="label"
        part="label"
        tabindex=${ifDefined(labelTabIndex)}>
        <slot @slotchange=${__privateMethod(this, _Tag_instances, onSlotChange_fn)}></slot>
      </div>
      ${this.labelDescription ? html`<span id="label-description" class="visually-hidden">${this.labelDescription}</span>` : nothing}
      ${
        this.removable
          ? html`
              <button
                @blur=${__privateMethod(this, _Tag_instances, onBlur_fn)}
                @click=${__privateMethod(this, _Tag_instances, onRemove_fn)}
                @focus=${__privateMethod(this, _Tag_instances, onFocus_fn)}
                @keydown=${__privateMethod(this, _Tag_instances, onKeydown_fn)}
                aria-describedby=${ifDefined(buttonDescription || void 0)}
                aria-disabled=${ifDefined(this.disabled ? 'true' : void 0)}
                aria-label=${msg(str`Remove tag '${this.label}'`, { id: 'sl.tag.remove' })}
                part="button"
                type="button">
                <sl-icon name="xmark"></sl-icon>
              </button>
              ${
                this.navigationDescription
                  ? html`
                      <span id="navigation-description" class="visually-hidden" aria-hidden="true"
                        >${this.navigationDescription}</span
                      >
                    `
                  : nothing
              }
            `
          : nothing
      }
    `;
  }
};
_internals = new WeakMap();
_observer = new WeakMap();
_mutationObserver = new WeakMap();
_Tag_instances = new WeakSet();
onBlur_fn = function () {
  __privateGet(this, _internals).states.delete('focus-visible');
};
onFocus_fn = function (event2) {
  if (event2.target.matches(':focus-visible')) {
    __privateGet(this, _internals).states.add('focus-visible');
  }
};
onKeydown_fn = function (event2) {
  if (event2.key === 'Backspace' || event2.key === 'Delete') {
    event2.preventDefault();
    event2.stopPropagation();
    __privateMethod(this, _Tag_instances, onRemove_fn).call(this, event2);
  }
};
onRemove_fn = function (event2) {
  if (this.disabled) {
    event2.preventDefault();
    event2.stopPropagation();
    return;
  }
  this.removeEvent.emit();
  this.remove();
};
syncButtonTabIndex_fn = function () {
  const button = this.renderRoot.querySelector('button');
  if (!button) {
    return;
  }
  if (this.navigationDescription || this.hasAttribute('tabindex')) {
    button.tabIndex = this.tabIndex;
  } else {
    button.removeAttribute('tabindex');
  }
};
onResize_fn = function () {
  if (typeof this.tooltip === 'string' && this.tooltip !== '') {
    return;
  }
  const label = this.renderRoot.querySelector('[part="label"]');
  this.tooltip = !!(label && label.clientWidth < label.scrollWidth);
};
onSlotChange_fn = function (event2) {
  __privateMethod(this, _Tag_instances, updateLabel_fn).call(this, event2.target);
};
updateLabel_fn = function (slot = this.renderRoot.querySelector('slot')) {
  if (!slot) {
    return;
  }
  this.label = slot
    .assignedNodes({ flatten: true })
    .map(node => node.textContent ?? '')
    .join('')
    .trim()
    .replaceAll(/\s+/g, ' ');
  void this.updateComplete.then(() =>
    __privateMethod(this, _Tag_instances, onResize_fn).call(this)
  );
};
/** @internal */
Tag.styles = styles;
/** @internal */
Tag.shadowRootOptions = {
  ...LitElement.shadowRootOptions,
  delegatesFocus: true
};
__decorateClass([property({ type: Boolean, reflect: true })], Tag.prototype, 'disabled', 2);
__decorateClass([property()], Tag.prototype, 'tooltip', 2);
__decorateClass([state()], Tag.prototype, 'label', 2);
__decorateClass([state()], Tag.prototype, 'navigationDescription', 2);
__decorateClass([property({ attribute: false })], Tag.prototype, 'labelDescription', 2);
__decorateClass([property({ type: Boolean, reflect: true })], Tag.prototype, 'removable', 2);
__decorateClass([event({ name: 'sl-remove' })], Tag.prototype, 'removeEvent', 2);
__decorateClass([property({ reflect: true })], Tag.prototype, 'size', 2);
__decorateClass([property({ reflect: true })], Tag.prototype, 'variant', 2);
Tag = __decorateClass([localized()], Tag);
//# sourceMappingURL=tag.js.map
