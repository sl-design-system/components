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
var _announceTimeoutId,
  _cols,
  _focusGroupController,
  _SelectYear_instances,
  onClick_fn,
  onKeydown_fn,
  onNext_fn,
  onPrevious_fn,
  setYears_fn,
  focusAfterRangeChange_fn,
  getPreferredBoundaryIndices_fn,
  announce_fn;
import { localized, msg, str } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { announce } from '@sl-design-system/announcer';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { NewFocusGroupController, event } from '@sl-design-system/shared';
import { dateConverter } from '@sl-design-system/shared/converters.js';
import { LitElement, html } from 'lit';
import { property, query, queryAll, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './select-year.scss.js';
export let SelectYear = class extends ScopedElementsMixin(LitElement) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _SelectYear_instances);
    /** Timeout id, to be used with `clearTimeout`. */
    __privateAdd(this, _announceTimeoutId);
    /**
     * Number of columns in the years grid. Used by keyboard navigation and the roving tabindex
     * controller to compute row/column movement and focus targets.
     */
    __privateAdd(this, _cols, 3);
    /** Focus management. */
    __privateAdd(
      this,
      _focusGroupController,
      new NewFocusGroupController(this, {
        autofocus: true,
        direction: 'grid',
        directionLength: __privateGet(this, _cols),
        elements: () => Array.from(this.buttons),
        isFocusableElement: el => !el.disabled,
        scope: () => this.table,
        wrap: false
      })
    );
    this.year = /* @__PURE__ */ new Date();
    this.years = [];
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-button': Button,
      'sl-icon': Icon
    };
  }
  disconnectedCallback() {
    if (__privateGet(this, _announceTimeoutId)) {
      clearTimeout(__privateGet(this, _announceTimeoutId));
      __privateSet(this, _announceTimeoutId, void 0);
    }
    super.disconnectedCallback();
  }
  willUpdate(changes) {
    super.willUpdate(changes);
    if (changes.has('year')) {
      const year = this.year.getFullYear();
      __privateMethod(this, _SelectYear_instances, setYears_fn).call(this, year - 5, year + 6);
    }
    if (changes.has('max') || changes.has('min') || changes.has('years')) {
      __privateGet(this, _focusGroupController)?.clearElementCache();
    }
  }
  render() {
    const rows = [];
    for (let i = 0; i < this.years.length; i += __privateGet(this, _cols)) {
      rows.push(this.years.slice(i, i + __privateGet(this, _cols)));
    }
    return html`
      <header>
        <span>${this.years.at(0)} - ${this.years.at(-1)}</span>

        <sl-button
          @click=${__privateMethod(this, _SelectYear_instances, onPrevious_fn)}
          ?disabled=${this.min && this.years.at(0) < this.min.getFullYear()}
          aria-label=${msg('Go back 12 years', { id: 'sl.calendar.previousYears' })}
          fill="ghost"
          variant="secondary">
          <sl-icon name="chevron-left"></sl-icon>
        </sl-button>
        <sl-button
          @click=${__privateMethod(this, _SelectYear_instances, onNext_fn)}
          ?disabled=${this.max && this.years.at(-1) > this.max.getFullYear()}
          aria-label=${msg('Go forward 12 years', { id: 'sl.calendar.nextYears' })}
          fill="ghost"
          variant="secondary">
          <sl-icon name="chevron-right"></sl-icon>
        </sl-button>
      </header>

      <table
        aria-label=${msg(str`Years from ${this.years.at(0)} to ${this.years.at(-1)}`, {
          id: 'sl.calendar.yearsLabel'
        })}
        role="grid">
        <tbody>
          ${rows.map(
            (row, rowIndex) => html`
              <tr aria-rowindex=${rowIndex + 1} role="row">
                ${row.map((year, colIndex) => this.renderYear(year, rowIndex, colIndex))}
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }
  renderYear(year, rowIndex, colIndex) {
    const current = year === /* @__PURE__ */ new Date().getFullYear(),
      disabled =
        (this.min && year < this.min.getFullYear()) || (this.max && year > this.max.getFullYear()),
      selected = !!(this.selected && this.selected.getFullYear() === year);
    return html`
      <td aria-rowindex=${rowIndex + 1} aria-colindex=${colIndex + 1} role="gridcell">
        <button
          @click=${() => __privateMethod(this, _SelectYear_instances, onClick_fn).call(this, year)}
          @keydown=${__privateMethod(this, _SelectYear_instances, onKeydown_fn)}
          ?disabled=${disabled}
          aria-current=${ifDefined(current ? 'date' : void 0)}
          aria-pressed=${selected.toString()}
          class=${classMap({ current, selected })}>
          <span>${year}</span>
        </button>
      </td>
    `;
  }
};
_announceTimeoutId = new WeakMap();
_cols = new WeakMap();
_focusGroupController = new WeakMap();
_SelectYear_instances = new WeakSet();
onClick_fn = function (year) {
  const date = new Date(year, 0, 1);
  this.selectEvent.emit(date);
  this.selected = date;
};
onKeydown_fn = async function (event2) {
  const buttons = Array.from(this.buttons);
  const currentIndex = buttons.indexOf(event2.target);
  if (currentIndex === -1) {
    return;
  }
  const firstYear = this.years.at(0),
    lastYear = this.years.at(-1),
    canGoEarlier = !this.min || firstYear > this.min.getFullYear(),
    canGoLater = !this.max || lastYear < this.max.getFullYear();
  let shouldLoadNewRange = false;
  if (event2.key === 'ArrowLeft' && currentIndex === 0 && canGoEarlier) {
    shouldLoadNewRange = true;
    event2.preventDefault();
    __privateMethod(this, _SelectYear_instances, onPrevious_fn).call(this);
  } else if (event2.key === 'ArrowRight' && currentIndex === buttons.length - 1 && canGoLater) {
    shouldLoadNewRange = true;
    event2.preventDefault();
    __privateMethod(this, _SelectYear_instances, onNext_fn).call(this);
  } else if (event2.key === 'ArrowUp' && currentIndex < __privateGet(this, _cols) && canGoEarlier) {
    shouldLoadNewRange = true;
    event2.preventDefault();
    __privateMethod(this, _SelectYear_instances, onPrevious_fn).call(this);
  } else if (
    event2.key === 'ArrowDown' &&
    currentIndex >= buttons.length - __privateGet(this, _cols) &&
    canGoLater
  ) {
    shouldLoadNewRange = true;
    event2.preventDefault();
    __privateMethod(this, _SelectYear_instances, onNext_fn).call(this);
  }
  if (shouldLoadNewRange) {
    await this.updateComplete;
    __privateMethod(this, _SelectYear_instances, focusAfterRangeChange_fn).call(
      this,
      event2.key,
      currentIndex
    );
  }
};
onNext_fn = function () {
  __privateMethod(this, _SelectYear_instances, setYears_fn).call(
    this,
    this.years.at(-1) + 1,
    this.years.at(-1) + 12
  );
  __privateMethod(this, _SelectYear_instances, announce_fn).call(this, this.years);
};
onPrevious_fn = function () {
  __privateMethod(this, _SelectYear_instances, setYears_fn).call(
    this,
    this.years.at(0) - 12,
    this.years.at(0) - 1
  );
  __privateMethod(this, _SelectYear_instances, announce_fn).call(this, this.years);
};
setYears_fn = function (start, end) {
  this.years = Array.from({ length: end - start + 1 }, (_, i) => start + i);
};
/** Moves focus to the right year button after loading a new year range. */
focusAfterRangeChange_fn = function (key, currentIndex) {
  const buttons = Array.from(this.buttons),
    preferredIndices = __privateMethod(
      this,
      _SelectYear_instances,
      getPreferredBoundaryIndices_fn
    ).call(this, key, currentIndex, buttons.length),
    targetIndex = preferredIndices.find(index => {
      const button = buttons[index];
      return !!button && !button.disabled;
    });
  if (targetIndex !== void 0) {
    __privateGet(this, _focusGroupController).focusToElement(targetIndex);
  }
};
/** Returns preferred button indexes to focus after crossing a grid edge. */
getPreferredBoundaryIndices_fn = function (key, currentIndex, length) {
  const column = currentIndex % __privateGet(this, _cols),
    preferredIndices =
      key === 'ArrowUp'
        ? [length - __privateGet(this, _cols) + column]
        : key === 'ArrowDown'
          ? [column]
          : [];
  if (key === 'ArrowLeft' || key === 'ArrowUp') {
    for (let i = length - 1; i >= 0; i -= 1) {
      preferredIndices.push(i);
    }
  } else {
    for (let i = 0; i < length; i += 1) {
      preferredIndices.push(i);
    }
  }
  return preferredIndices;
};
// Announce if needed, we don't want to have the same message announced twice
announce_fn = function (yearsRange) {
  if (__privateGet(this, _announceTimeoutId)) {
    clearTimeout(__privateGet(this, _announceTimeoutId));
  }
  __privateSet(
    this,
    _announceTimeoutId,
    setTimeout(() => {
      announce(
        msg(str`Years between ${yearsRange.at(0) ?? ''} and ${yearsRange.at(-1) ?? ''}`, {
          id: 'sl.calendar.announceYears'
        }),
        'polite'
      );
      __privateSet(this, _announceTimeoutId, void 0);
    }, 50)
  );
};
/** @internal */
SelectYear.shadowRootOptions = {
  ...LitElement.shadowRootOptions,
  delegatesFocus: true
};
/** @internal */
SelectYear.styles = styles;
__decorateClass([queryAll('button')], SelectYear.prototype, 'buttons', 2);
__decorateClass([query('table')], SelectYear.prototype, 'table', 2);
__decorateClass([property({ converter: dateConverter })], SelectYear.prototype, 'max', 2);
__decorateClass([property({ converter: dateConverter })], SelectYear.prototype, 'min', 2);
__decorateClass([property({ converter: dateConverter })], SelectYear.prototype, 'selected', 2);
__decorateClass([event({ name: 'sl-select' })], SelectYear.prototype, 'selectEvent', 2);
__decorateClass(
  [property({ type: Boolean, attribute: 'show-current' })],
  SelectYear.prototype,
  'showCurrent',
  2
);
__decorateClass([property({ converter: dateConverter })], SelectYear.prototype, 'year', 2);
__decorateClass([state()], SelectYear.prototype, 'years', 2);
SelectYear = __decorateClass([localized()], SelectYear);
//# sourceMappingURL=select-year.js.map
