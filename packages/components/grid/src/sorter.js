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
var _GridSorter_instances, onClick_fn, toggleDirection_fn;
import { localized, msg } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { event } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './sorter.scss.js';
export let GridSorter = class extends ScopedElementsMixin(LitElement) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _GridSorter_instances);
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-button': Button,
      'sl-icon': Icon
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.sorterRegisterEvent.emit();
  }
  render() {
    return html`
      <slot></slot>
      <sl-button
        @click=${__privateMethod(this, _GridSorter_instances, onClick_fn)}
        aria-label=${this.direction === 'asc' ? msg('Sort descending', { id: 'sl.grid.sortDescending' }) : this.direction === 'desc' ? msg('Remove sort', { id: 'sl.grid.removeSort' }) : msg('Sort ascending', { id: 'sl.grid.sortAscending' })}
        .fill=${this.direction ? 'solid' : 'ghost'}
        size="sm"
        variant=${ifDefined(this.direction ? 'primary' : void 0)}>
        ${choose(
          this.direction,
          [
            ['asc', () => html`<sl-icon name="sort-up"></sl-icon>`],
            ['desc', () => html`<sl-icon name="sort-down"></sl-icon>`]
          ],
          () => html`<sl-icon name="sort"></sl-icon>`
        )}
      </sl-button>
    `;
  }
  /**
   * Resets the sorter to its initial state. This does not emit a change event. It is used
   * internally by the grid component to reset the sorter.
   */
  reset() {
    this.direction = void 0;
  }
};
_GridSorter_instances = new WeakSet();
onClick_fn = function () {
  __privateMethod(this, _GridSorter_instances, toggleDirection_fn).call(this);
  this.sorterChangeEvent.emit({ column: this.column, direction: this.direction });
};
toggleDirection_fn = function () {
  if (this.direction === 'asc') {
    this.direction = 'desc';
  } else if (this.direction === 'desc') {
    this.direction = void 0;
  } else {
    this.direction = 'asc';
  }
};
/** @internal */
GridSorter.styles = styles;
__decorateClass([property({ attribute: false })], GridSorter.prototype, 'column', 2);
__decorateClass([property({ reflect: true })], GridSorter.prototype, 'direction', 2);
__decorateClass([property()], GridSorter.prototype, 'path', 2);
__decorateClass([property({ attribute: false })], GridSorter.prototype, 'sorter', 2);
__decorateClass(
  [event({ name: 'sl-sorter-change' })],
  GridSorter.prototype,
  'sorterChangeEvent',
  2
);
__decorateClass(
  [event({ name: 'sl-sorter-register' })],
  GridSorter.prototype,
  'sorterRegisterEvent',
  2
);
GridSorter = __decorateClass([localized()], GridSorter);
//# sourceMappingURL=sorter.js.map
