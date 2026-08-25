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
var _GridGroupHeader_instances, onChange_fn, onClick_fn;
import { localized, msg, str } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Checkbox } from '@sl-design-system/checkbox';
import { Icon } from '@sl-design-system/icon';
import { event } from '@sl-design-system/shared';
import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './group-header.scss.js';
export let GridGroupHeader = class extends ScopedElementsMixin(LitElement) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _GridGroupHeader_instances);
    this.selected = 'none';
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-button': Button,
      'sl-checkbox': Checkbox,
      'sl-icon': Icon
    };
  }
  render() {
    const selectGroupLabel = this.groupLabel
      ? msg(str`${this.groupLabel} group`, { id: 'sl.grid.selectGroupWithName' })
      : msg('Group', { id: 'sl.grid.selectGroup' });
    return html`
      ${
        this.dragHandle
          ? html`
              <div draggable="true" part="drag-handle">
                <sl-icon name="grip-lines"></sl-icon>
              </div>
            `
          : nothing
      }
      ${
        this.selectable
          ? html`
              <div part="checkbox">
                <sl-checkbox
                  @sl-change=${__privateMethod(this, _GridGroupHeader_instances, onChange_fn)}
                  aria-label=${selectGroupLabel}
                  .checked=${this.selected === 'all'}
                  .indeterminate=${this.selected === 'some'}
                  size="sm"></sl-checkbox>
              </div>
            `
          : nothing
      }
      <sl-button
        @click=${__privateMethod(this, _GridGroupHeader_instances, onClick_fn)}
        aria-expanded=${this.collapsed ? 'false' : 'true'}
        aria-label=${msg('Toggle group', { id: 'sl.grid.toggleGroup' })}
        fill="ghost"
        size="sm">
        <sl-icon name="chevron-down"></sl-icon>
      </sl-button>
      <div part="wrapper">
        <div part="group-heading">
          <slot name="group-heading"></slot>
        </div>
        <slot></slot>
      </div>
    `;
  }
};
_GridGroupHeader_instances = new WeakSet();
onChange_fn = function (event2) {
  this.selectEvent.emit(event2.detail);
};
onClick_fn = function () {
  this.collapsed = !this.collapsed;
  this.toggleEvent.emit(this.collapsed);
};
/** @internal */
GridGroupHeader.styles = styles;
__decorateClass(
  [property({ type: Boolean, reflect: true })],
  GridGroupHeader.prototype,
  'collapsed',
  2
);
__decorateClass(
  [property({ type: Boolean, attribute: 'drag-handle' })],
  GridGroupHeader.prototype,
  'dragHandle',
  2
);
__decorateClass(
  [property({ attribute: 'group-label' })],
  GridGroupHeader.prototype,
  'groupLabel',
  2
);
__decorateClass(
  [property({ type: Boolean, reflect: true })],
  GridGroupHeader.prototype,
  'selectable',
  2
);
__decorateClass([property()], GridGroupHeader.prototype, 'selected', 2);
__decorateClass([event({ name: 'sl-select' })], GridGroupHeader.prototype, 'selectEvent', 2);
__decorateClass([event({ name: 'sl-toggle' })], GridGroupHeader.prototype, 'toggleEvent', 2);
GridGroupHeader = __decorateClass([localized()], GridGroupHeader);
//# sourceMappingURL=group-header.js.map
