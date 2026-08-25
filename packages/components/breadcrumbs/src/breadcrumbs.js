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
var _assignSlotsTimeoutId,
  _mutationObserver,
  _resizeObserver,
  _onClick,
  _onMutation,
  _Breadcrumbs_instances,
  onResize_fn,
  assignSlots_fn,
  processChildren_fn;
import { localized, msg } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { Popover } from '@sl-design-system/popover';
import { Tooltip } from '@sl-design-system/tooltip';
import { LitElement, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './breadcrumbs.scss.js';
let nextUniqueId = 0;
const COLLAPSE_THRESHOLD = 3;
const MOBILE_COLLAPSE_THRESHOLD = 2;
const isMobile = () => matchMedia('(width <= 600px)').matches;
export let Breadcrumbs = class extends ScopedElementsMixin(LitElement) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _Breadcrumbs_instances);
    /** Timeout ID for debouncing slot assignment during resize events. */
    __privateAdd(this, _assignSlotsTimeoutId);
    /** Because of the manual slot assignment we need to observe mutations */
    __privateAdd(
      this,
      _mutationObserver,
      new MutationObserver(() => __privateGet(this, _onMutation).call(this))
    );
    /**
     * Observe changes in size, so we can check whether we need to show tooltips for truncated
     * links.
     */
    __privateAdd(
      this,
      _resizeObserver,
      new ResizeObserver(() =>
        __privateMethod(this, _Breadcrumbs_instances, onResize_fn).call(this)
      )
    );
    this.breadcrumbs = [];
    this.collapseThreshold = COLLAPSE_THRESHOLD;
    this.hideHomeLabel = Breadcrumbs.hideHomeLabel;
    this.homeUrl = Breadcrumbs.homeUrl;
    this.noHome = Breadcrumbs.noHome;
    __privateAdd(this, _onClick, () => {
      this.renderRoot.querySelector('sl-popover')?.togglePopover();
    });
    __privateAdd(this, _onMutation, () => {
      __privateGet(this, _mutationObserver).disconnect();
      __privateMethod(this, _Breadcrumbs_instances, processChildren_fn).call(this);
      __privateGet(this, _mutationObserver).observe(this, { childList: true });
      requestAnimationFrame(() =>
        __privateMethod(this, _Breadcrumbs_instances, assignSlots_fn).call(this)
      );
    });
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-button': Button,
      'sl-icon': Icon,
      'sl-popover': Popover,
      'sl-tooltip': Tooltip
    };
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute('aria-label')) {
      this.setAttribute(
        'aria-label',
        msg('Breadcrumb trail', { id: 'sl.breadcrumbs.breadcrumbTrail' })
      );
    }
    this.setAttribute('role', 'navigation');
    __privateGet(this, _mutationObserver).observe(this, { childList: true });
    __privateGet(this, _resizeObserver).observe(this);
  }
  disconnectedCallback() {
    if (__privateGet(this, _assignSlotsTimeoutId)) {
      clearTimeout(__privateGet(this, _assignSlotsTimeoutId));
      __privateSet(this, _assignSlotsTimeoutId, void 0);
    }
    __privateGet(this, _resizeObserver).disconnect();
    __privateGet(this, _mutationObserver).disconnect();
    super.disconnectedCallback();
  }
  firstUpdated() {
    requestAnimationFrame(() => __privateGet(this, _onMutation).call(this));
  }
  render() {
    return html`
      <slot name="tooltips"></slot>
      <ul>
        ${
          this.noHome
            ? nothing
            : html`
                <li class="home">
                  ${
                    !this.customHomeLink
                      ? html`
                          <a
                            href=${this.homeUrl}
                            aria-label=${ifDefined(
                              isMobile() || this.hideHomeLabel
                                ? msg('Home', { id: 'sl.breadcrumbs.home' })
                                : void 0
                            )}>
                            <sl-icon name="home-blank"></sl-icon>
                            ${isMobile() || this.hideHomeLabel ? '' : msg('Home', { id: 'sl.breadcrumbs.home' })}
                          </a>
                        `
                      : html`<slot name="home"></slot>`
                  }
                </li>
                <sl-icon name="breadcrumb-separator"></sl-icon>
              `
        }
        ${
          this.breadcrumbs.length > this.collapseThreshold
            ? html`
                <li class="more-menu">
                  <sl-button
                    @click=${__privateGet(this, _onClick)}
                    aria-label=${msg('More breadcrumbs', { id: 'sl.breadcrumbs.moreBreadcrumbs' })}
                    fill="ghost"
                    id="button"
                    variant=${ifDefined(this.inverted ? 'inverted' : void 0)}>
                    <sl-icon name="ellipsis"></sl-icon>
                  </sl-button>
                  <sl-popover anchor="button">
                    ${this.breadcrumbs
                      .slice(0, -this.collapseThreshold)
                      .map((_, index) => html`<slot name="breadcrumb-menu-${index}"></slot>`)}
                  </sl-popover>
                </li>
                <sl-icon name="breadcrumb-separator"></sl-icon>
              `
            : nothing
        }
        ${this.breadcrumbs.slice(Math.max(0, this.breadcrumbs.length - this.collapseThreshold)).map(
          (_, index, array) => html`
            <li><slot name="breadcrumb-${index}"></slot></li>
            ${index < array.length - 1 ? html`<sl-icon name="breadcrumb-separator"></sl-icon>` : nothing}
          `
        )}
      </ul>
    `;
  }
};
_assignSlotsTimeoutId = new WeakMap();
_mutationObserver = new WeakMap();
_resizeObserver = new WeakMap();
_onClick = new WeakMap();
_onMutation = new WeakMap();
_Breadcrumbs_instances = new WeakSet();
onResize_fn = function () {
  if (__privateGet(this, _assignSlotsTimeoutId)) {
    clearTimeout(__privateGet(this, _assignSlotsTimeoutId));
  }
  __privateSet(
    this,
    _assignSlotsTimeoutId,
    setTimeout(() => {
      const newCollapseThreshold = isMobile() ? MOBILE_COLLAPSE_THRESHOLD : COLLAPSE_THRESHOLD;
      if (newCollapseThreshold !== this.collapseThreshold) {
        this.collapseThreshold = newCollapseThreshold;
        __privateGet(this, _onMutation).call(this);
      } else {
        __privateMethod(this, _Breadcrumbs_instances, assignSlots_fn).call(this);
      }
      __privateSet(this, _assignSlotsTimeoutId, void 0);
    }, 50)
  );
};
assignSlots_fn = function () {
  if (this.customHomeLink) {
    this.renderRoot.querySelector('slot[name="home"]')?.assign(this.customHomeLink);
  }
  this.breadcrumbs.slice(0, -this.collapseThreshold).forEach((crumb, index) => {
    crumb.element.removeAttribute('aria-current');
    crumb.tooltip.disabled = true;
    this.renderRoot
      .querySelector(`slot[name="breadcrumb-menu-${index}"]`)
      ?.assign(crumb.element, crumb.tooltip);
  });
  this.breadcrumbs
    .slice(Math.max(0, this.breadcrumbs.length - this.collapseThreshold))
    .forEach((crumb, index) => {
      crumb.element.removeAttribute('aria-current');
      crumb.tooltip.disabled = crumb.element.offsetWidth >= crumb.element.scrollWidth;
      this.renderRoot
        .querySelector(`slot[name="breadcrumb-${index}"]`)
        ?.assign(crumb.element, crumb.tooltip);
    });
  this.breadcrumbs.at(-1)?.element.setAttribute('aria-current', 'page');
};
processChildren_fn = function () {
  const children = Array.from(this.children);
  this.breadcrumbs = children
    .filter(el => el instanceof HTMLElement && !(el instanceof Tooltip) && !el.hasAttribute('slot'))
    .map(crumb => {
      crumb.id ||= `sl-breadcrumb-${nextUniqueId++}`;
      let tooltip = children.find(el => el instanceof Tooltip && el.for === crumb.id);
      if (!tooltip) {
        tooltip = this.shadowRoot.createElement('sl-tooltip');
        tooltip.for = crumb.id;
        crumb.after(tooltip);
      }
      tooltip.textContent = crumb.textContent?.trim() || '';
      return { element: crumb, tooltip };
    });
  this.customHomeLink = children.find(el => el.getAttribute('slot') === 'home');
};
/**
 * When true, doesn't show a home label in the first breadcrumb next to the home icon.
 *
 * By changing this static property you can change the default value for all future instances of the
 * component. Changing the static property won't affect already created instances.
 */
Breadcrumbs.hideHomeLabel = false;
/**
 * The url for the home link, defaults to the root url.
 *
 * By changing this static property you can change the default value for all future instances of the
 * component. Changing the static property won't affect already created instances.
 */
Breadcrumbs.homeUrl = '/';
/**
 * When true doesn't show a home link as the first breadcrumb.
 *
 * By changing this static property you can change the default value for all future instances of the
 * component. Changing the static property won't affect already created instances.
 */
Breadcrumbs.noHome = false;
/** @internal */
Breadcrumbs.shadowRootOptions = {
  ...LitElement.shadowRootOptions,
  slotAssignment: 'manual'
};
/** @internal */
Breadcrumbs.styles = styles;
__decorateClass([state()], Breadcrumbs.prototype, 'breadcrumbs', 2);
__decorateClass([state()], Breadcrumbs.prototype, 'customHomeLink', 2);
__decorateClass([state()], Breadcrumbs.prototype, 'collapseThreshold', 2);
__decorateClass(
  [property({ type: Boolean, attribute: 'hide-home-label' })],
  Breadcrumbs.prototype,
  'hideHomeLabel',
  2
);
__decorateClass([property({ type: Boolean, reflect: true })], Breadcrumbs.prototype, 'inverted', 2);
__decorateClass([property({ attribute: 'home-url' })], Breadcrumbs.prototype, 'homeUrl', 2);
__decorateClass(
  [property({ type: Boolean, attribute: 'no-home' })],
  Breadcrumbs.prototype,
  'noHome',
  2
);
Breadcrumbs = __decorateClass([localized()], Breadcrumbs);
//# sourceMappingURL=breadcrumbs.js.map
