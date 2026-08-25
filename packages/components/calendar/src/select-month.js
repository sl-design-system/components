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
  _SelectMonth_instances,
  onClick_fn,
  onKeydown_fn,
  onNext_fn,
  onPrevious_fn,
  onToggleYearSelect_fn,
  focusAfterRangeChange_fn,
  getPreferredBoundaryIndices_fn,
  isDisabled_fn,
  allYearDisabled_fn,
  canSelectYear_fn,
  announce_fn;
import { localized, msg, str } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { announce } from '@sl-design-system/announcer';
import { Button } from '@sl-design-system/button';
import { FormatDate, format } from '@sl-design-system/format-date';
import { Icon } from '@sl-design-system/icon';
import { LocaleMixin, NewFocusGroupController, event } from '@sl-design-system/shared';
import { dateConverter } from '@sl-design-system/shared/converters.js';
import { LitElement, html } from 'lit';
import { property, query, queryAll, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './select-month.scss.js';
export let SelectMonth = class extends LocaleMixin(ScopedElementsMixin(LitElement)) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _SelectMonth_instances);
    /** Timeout id, to be used with `clearTimeout`. */
    __privateAdd(this, _announceTimeoutId);
    /**
     * Number of columns in the months grid. Used by keyboard navigation and the focus group
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
    this.month = /* @__PURE__ */ new Date();
    this.months = [];
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-button': Button,
      'sl-format-date': FormatDate,
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
    if (changes.has('locale') || changes.has('month') || changes.has('min') || changes.has('max')) {
      const formatShort = new Intl.DateTimeFormat(this.locale, { month: 'short' }),
        formatLong = new Intl.DateTimeFormat(this.locale, { month: 'long' });
      this.months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(this.month.getFullYear(), i, 1);
        return {
          short: formatShort.format(date),
          long: formatLong.format(date),
          date,
          value: i,
          disabled: !(
            (!this.min || date >= new Date(this.min.getFullYear(), this.min.getMonth(), 1)) &&
            (!this.max || date <= new Date(this.max.getFullYear(), this.max.getMonth(), 1))
          )
        };
      });
    }
    if (changes.has('min') || changes.has('max') || changes.has('month')) {
      __privateGet(this, _focusGroupController).clearElementCache();
    }
  }
  render() {
    const currentYear = this.month.getFullYear();
    const rows = [];
    for (let i = 0; i < this.months.length; i += 3) {
      rows.push(this.months.slice(i, i + 3));
    }
    return html`
      <header>
        ${
          __privateMethod(this, _SelectMonth_instances, canSelectYear_fn).call(this, -1) ||
          __privateMethod(this, _SelectMonth_instances, canSelectYear_fn).call(this, 1)
            ? html`
                <sl-button
                  @click=${__privateMethod(this, _SelectMonth_instances, onToggleYearSelect_fn)}
                  aria-label=${msg(
                    str`${format(this.month, this.locale, { year: 'numeric' })}, change year`,
                    {
                      id: 'sl.calendar.changeYear'
                    }
                  )}
                  class="current-year"
                  fill="link"
                  variant="secondary">
                  <sl-format-date
                    .date=${this.month}
                    locale=${ifDefined(this.locale)}
                    year="numeric"></sl-format-date>
                  <sl-icon name="caret-down-solid"></sl-icon>
                </sl-button>
              `
            : html`<span class="current-year">${currentYear}</span>`
        }
        <div class="arrows">
          <sl-button
            @click=${__privateMethod(this, _SelectMonth_instances, onPrevious_fn)}
            ?disabled=${!__privateMethod(this, _SelectMonth_instances, canSelectYear_fn).call(this, -1)}
            aria-label=${msg(str`Previous year, ${currentYear - 1}`, {
              id: 'sl.calendar.previousYear'
            })}
            fill="ghost"
            variant="secondary">
            <sl-icon name="chevron-left"></sl-icon>
          </sl-button>
          <sl-button
            @click=${__privateMethod(this, _SelectMonth_instances, onNext_fn)}
            ?disabled=${!__privateMethod(this, _SelectMonth_instances, canSelectYear_fn).call(this, 1)}
            aria-label=${msg(str`Next year, ${currentYear + 1}`, { id: 'sl.calendar.nextYear' })}
            fill="ghost"
            variant="secondary">
            <sl-icon name="chevron-right"></sl-icon>
          </sl-button>
        </div>
      </header>

      <table
        aria-label=${msg(str`Months of ${currentYear}`, { id: 'sl.calendar.monthsLabel' })}
        role="grid">
        <tbody>
          ${rows.map(
            (row, rowIndex) => html`
              <tr aria-rowindex=${rowIndex + 1} role="row">
                ${row.map((month, colIndex) => this.renderMonth(month, rowIndex, colIndex))}
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }
  renderMonth(month, rowIndex, colIndex) {
    const current =
        month.value === /* @__PURE__ */ new Date().getMonth() &&
        this.month.getFullYear() === /* @__PURE__ */ new Date().getFullYear(),
      selected = !!(
        this.selected &&
        this.selected.getMonth() === month.value &&
        this.selected.getFullYear() === month.date.getFullYear()
      );
    return html`
      <td aria-rowindex=${rowIndex + 1} aria-colindex=${colIndex + 1} role="gridcell">
        <button
          @click=${() => __privateMethod(this, _SelectMonth_instances, onClick_fn).call(this, month.value)}
          @keydown=${__privateMethod(this, _SelectMonth_instances, onKeydown_fn)}
          ?disabled=${month.disabled}
          aria-current=${ifDefined(current ? 'date' : void 0)}
          aria-pressed=${selected.toString()}
          class=${classMap({ current, selected })}>
          <span>${month.long}</span>
        </button>
      </td>
    `;
  }
};
_announceTimeoutId = new WeakMap();
_cols = new WeakMap();
_focusGroupController = new WeakMap();
_SelectMonth_instances = new WeakSet();
onClick_fn = function (month) {
  this.selectEvent.emit(new Date(this.month.getFullYear(), month));
  this.selected = new Date(this.month.getFullYear(), month);
};
onKeydown_fn = async function (event2) {
  const buttons = Array.from(this.buttons),
    currentIndex = buttons.indexOf(event2.target);
  if (currentIndex === -1) {
    return;
  }
  const canGoEarlier = !__privateMethod(this, _SelectMonth_instances, allYearDisabled_fn).call(
      this,
      -1
    ),
    canGoLater = !__privateMethod(this, _SelectMonth_instances, allYearDisabled_fn).call(this, 1);
  let shouldLoadNewRange = false;
  if (event2.key === 'ArrowLeft' && currentIndex === 0 && canGoEarlier) {
    shouldLoadNewRange = true;
    event2.preventDefault();
    __privateMethod(this, _SelectMonth_instances, onPrevious_fn).call(this);
  } else if (event2.key === 'ArrowRight' && currentIndex === buttons.length - 1 && canGoLater) {
    shouldLoadNewRange = true;
    event2.preventDefault();
    __privateMethod(this, _SelectMonth_instances, onNext_fn).call(this);
  } else if (event2.key === 'ArrowUp' && currentIndex < __privateGet(this, _cols) && canGoEarlier) {
    shouldLoadNewRange = true;
    event2.preventDefault();
    __privateMethod(this, _SelectMonth_instances, onPrevious_fn).call(this);
  } else if (
    event2.key === 'ArrowDown' &&
    currentIndex >= buttons.length - __privateGet(this, _cols) &&
    canGoLater
  ) {
    shouldLoadNewRange = true;
    event2.preventDefault();
    __privateMethod(this, _SelectMonth_instances, onNext_fn).call(this);
  }
  if (shouldLoadNewRange) {
    await this.updateComplete;
    __privateMethod(this, _SelectMonth_instances, focusAfterRangeChange_fn).call(
      this,
      event2.key,
      currentIndex
    );
  }
};
onNext_fn = function () {
  this.month = new Date(this.month.getFullYear() + 1, this.month.getMonth(), this.month.getDate());
  __privateMethod(this, _SelectMonth_instances, announce_fn).call(this, this.month);
};
onPrevious_fn = function () {
  this.month = new Date(this.month.getFullYear() - 1, this.month.getMonth(), this.month.getDate());
  __privateMethod(this, _SelectMonth_instances, announce_fn).call(this, this.month);
};
onToggleYearSelect_fn = function () {
  this.toggleEvent.emit('year');
};
/** Moves focus to the right month button after loading a new year range. */
focusAfterRangeChange_fn = function (key, currentIndex) {
  const buttons = Array.from(this.buttons),
    preferredIndices = __privateMethod(
      this,
      _SelectMonth_instances,
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
/** Builds a list of preferred focus positions for boundary key navigation. */
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
isDisabled_fn = function (year, month) {
  const date = new Date(year, month, 1);
  if (this.min && date < new Date(this.min.getFullYear(), this.min.getMonth(), 1)) {
    return true;
  }
  return !!(this.max && date > new Date(this.max.getFullYear(), this.max.getMonth(), 1));
};
allYearDisabled_fn = function (offset) {
  const year = this.month.getFullYear() + offset;
  return this.months.every(m =>
    __privateMethod(this, _SelectMonth_instances, isDisabled_fn).call(this, year, m.value)
  );
};
canSelectYear_fn = function (offset) {
  const targetYear = this.month.getFullYear() + offset;
  if (offset > 0) {
    return !this.max || targetYear <= this.max.getFullYear();
  } else {
    return !this.min || targetYear >= this.min.getFullYear();
  }
};
// Announce if needed, we don't want to have the same message announced twice
announce_fn = function (month) {
  if (__privateGet(this, _announceTimeoutId)) {
    clearTimeout(__privateGet(this, _announceTimeoutId));
  }
  __privateSet(
    this,
    _announceTimeoutId,
    setTimeout(() => {
      announce(
        msg(
          str`Months of the year ${Intl.DateTimeFormat(this.locale, { year: 'numeric' }).format(month)}`,
          {
            id: 'sl.calendar.announceMonthsOfYear'
          }
        ),
        'polite'
      );
      __privateSet(this, _announceTimeoutId, void 0);
    }, 50)
  );
};
/** @internal */
SelectMonth.shadowRootOptions = {
  ...LitElement.shadowRootOptions,
  delegatesFocus: true
};
/** @internal */
SelectMonth.styles = styles;
__decorateClass([queryAll('button')], SelectMonth.prototype, 'buttons', 2);
__decorateClass([query('table')], SelectMonth.prototype, 'table', 2);
__decorateClass([property({ converter: dateConverter })], SelectMonth.prototype, 'max', 2);
__decorateClass([property({ converter: dateConverter })], SelectMonth.prototype, 'min', 2);
__decorateClass([property({ converter: dateConverter })], SelectMonth.prototype, 'month', 2);
__decorateClass([state()], SelectMonth.prototype, 'months', 2);
__decorateClass([property({ converter: dateConverter })], SelectMonth.prototype, 'selected', 2);
__decorateClass([event({ name: 'sl-select' })], SelectMonth.prototype, 'selectEvent', 2);
__decorateClass(
  [property({ type: Boolean, attribute: 'show-current' })],
  SelectMonth.prototype,
  'showCurrent',
  2
);
__decorateClass([event({ name: 'sl-toggle' })], SelectMonth.prototype, 'toggleEvent', 2);
SelectMonth = __decorateClass([localized()], SelectMonth);
//# sourceMappingURL=select-month.js.map
