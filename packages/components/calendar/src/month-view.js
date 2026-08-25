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
var _month,
  _focusGroupController,
  _MonthView_instances,
  onClick_fn,
  onKeydown_fn,
  getEnabledSameWeekday_fn,
  hasAutofocus_fn;
import { localized, msg, str } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { format } from '@sl-design-system/format-date';
import { Icon } from '@sl-design-system/icon';
import { NewFocusGroupController, event } from '@sl-design-system/shared';
import { dateConverter, dateListConverter } from '@sl-design-system/shared/converters.js';
import { isDateInList, isSameDate } from '@sl-design-system/shared/date.js';
import { LocaleMixin } from '@sl-design-system/shared/mixins.js';
import { Tooltip } from '@sl-design-system/tooltip';
import { LitElement, html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './month-view.scss.js';
import { createCalendar, getWeekdayNames, indicatorConverter } from './utils.js';
const DAYS_IN_WEEK = 7;
export let MonthView = class extends LocaleMixin(ScopedElementsMixin(LitElement)) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _MonthView_instances);
    /** The current month. */
    __privateAdd(this, _month, /* @__PURE__ */ new Date());
    /** Manage focus group for day buttons. */
    __privateAdd(
      this,
      _focusGroupController,
      new NewFocusGroupController(this, {
        direction: 'grid',
        directionLength: DAYS_IN_WEEK,
        focusInIndex: elements => {
          if (!elements || elements.length === 0) {
            return -1;
          }
          const selectedIndex = elements.findIndex(
            el => !el.disabled && el.getAttribute('aria-pressed') === 'true'
          );
          if (selectedIndex > -1) {
            return selectedIndex;
          }
          const todayIndex = elements.findIndex(el => !el.disabled && el.part.contains('today'));
          if (todayIndex > -1) {
            return todayIndex;
          }
          return elements.findIndex(
            el =>
              !el.disabled && !el.part.contains('previous-month') && !el.part.contains('next-month')
          );
        },
        elements: () => {
          return this.inert ? [] : Array.from(this.renderRoot.querySelectorAll('button'));
        },
        isFocusableElement: el =>
          !!el &&
          !el.disabled &&
          !el.part.contains('previous-month') &&
          !el.part.contains('next-month')
      })
    );
    this.firstDayOfWeek = 1;
    this.weekDays = [];
    /** Returns the default aria-label for a given day. */
    this.getDayLabel = day => {
      return `${day.date.getDate()}, ${format(day.date, this.locale, { weekday: 'long' })} ${format(day.date, this.locale, { month: 'long', year: 'numeric' })}`;
    };
    /** Returns an array of part names for a given day. */
    this.getDayParts = day => {
      return [
        'day',
        day.disabled ? 'disabled' : '',
        day.indicator ? 'indicator' : '',
        day.indicator?.color ? `indicator-${day.indicator.color}` : '',
        day.nextMonth ? 'next-month' : '',
        day.outOfRange ? 'out-of-range' : '',
        day.previousMonth ? 'previous-month' : '',
        day.today ? 'today' : '',
        this.selected && isSameDate(day.date, this.selected) ? 'selected' : ''
      ].filter(part => part !== '');
    };
  }
  /** @internal */
  static get observedAttributes() {
    return [...(super.observedAttributes ?? []), 'inert'];
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-icon': Icon,
      'sl-tooltip': Tooltip
    };
  }
  get month() {
    return __privateGet(this, _month);
  }
  set month(value) {
    __privateSet(this, _month, value);
  }
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'inert') {
      __privateGet(this, _focusGroupController).clearElementCache();
    }
  }
  willUpdate(changes) {
    super.willUpdate(changes);
    if (changes.has('firstDayOfWeek') || changes.has('locale')) {
      const { locale, firstDayOfWeek } = this,
        longDays = getWeekdayNames({ firstDayOfWeek, locale, style: 'long' }),
        shortDays = getWeekdayNames({ firstDayOfWeek, locale, style: 'short' });
      this.weekDays = longDays.map((day, i) => ({ long: day, short: shortDays[i] }));
    }
    if (changes.has('locale') || changes.has('showWeekNumbers')) {
      this.localizedWeekOfYear = new Intl.DisplayNames(this.locale, {
        style: 'short',
        type: 'dateTimeField'
      }).of('weekOfYear');
    }
    if (
      changes.has('disabledDates') ||
      changes.has('indicatorDates') ||
      changes.has('max') ||
      changes.has('min') ||
      changes.has('month') ||
      changes.has('showToday')
    ) {
      const { disabledDates, firstDayOfWeek, indicatorDates, max, min, showToday } = this;
      this.calendar = createCalendar(this.month, {
        disabledDates,
        firstDayOfWeek,
        indicatorDates,
        max,
        min,
        showToday
      });
      __privateGet(this, _focusGroupController).clearElementCache();
    }
  }
  render() {
    return html`
      <table
        aria-label=${msg(
          str`Days of ${format(this.month ?? /* @__PURE__ */ new Date(), this.locale, { month: 'long', year: 'numeric' })}`,
          { id: 'sl.calendar.daysLabel' }
        )}
        role="grid">
        ${this.renderHeader()}
        <tbody>
          ${this.calendar?.weeks.map(
            week => html`
              <tr class="days" role="row">
                ${
                  this.showWeekNumbers
                    ? html`
                        <td
                          aria-label=${msg(str`Week ${week.number}`, { id: 'sl.monthView.week' })}
                          part="week-number"
                          role="rowheader">
                          ${week.number}
                        </td>
                      `
                    : nothing
                }
                ${week.days.map(day => this.renderDay(day))}
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }
  /** Renders the header row with week day names. Override this to customize the header. */
  renderHeader() {
    return html`
      <thead part="header">
        <tr role="row">
          ${
            this.showWeekNumbers
              ? html`
                  <th aria-label=${msg('Week', { id: 'sl.calendar.week' })} part="week-number">
                    ${this.localizedWeekOfYear}
                  </th>
                `
              : nothing
          }
          ${this.weekDays.map(
            day => html`<th aria-label=${day.long} part="week-day"><span>${day.short}</span></th>`
          )}
        </tr>
      </thead>
    `;
  }
  /** Renders a single day cell. You can also use the `renderer` property to customize how days look. */
  renderDay(day) {
    let template;
    if (this.renderer) {
      template = this.renderer(day, this);
    } else if (this.hideDaysOtherMonths && (day.nextMonth || day.previousMonth)) {
      return html`<td role="gridcell"></td>`;
    }
    const parts = this.getDayParts(day),
      selected = parts.includes('selected');
    if (!template) {
      const autofocus = __privateMethod(this, _MonthView_instances, hasAutofocus_fn).call(
        this,
        day,
        selected
      );
      template =
        this.readonly || day.disabled || day.outOfRange
          ? html`
              <button aria-label=${this.getDayLabel(day)} disabled part=${parts.join(' ')}>
                <span>${day.date.getDate()}</span>
              </button>
            `
          : html`
              <button
                @click=${event2 => __privateMethod(this, _MonthView_instances, onClick_fn).call(this, event2, day)}
                @keydown=${event2 => __privateMethod(this, _MonthView_instances, onKeydown_fn).call(this, event2, day)}
                ?autofocus=${autofocus}
                aria-current=${ifDefined(parts.includes('today') ? 'date' : void 0)}
                aria-label=${this.getDayLabel(day)}
                aria-pressed=${selected.toString()}
                id=${day.date.toISOString()}
                part=${parts.join(' ')}>
                <span>${day.date.getDate()}</span>
              </button>
              ${
                day.indicator?.label
                  ? html`
                      <sl-tooltip for=${day.date.toISOString()} type="description">
                        ${day.indicator.label}
                      </sl-tooltip>
                    `
                  : nothing
              }
            `;
    }
    return html`<td data-date=${day.date.toISOString()} role="gridcell">${template}</td>`;
  }
  /** @internal */
  focus(dateOrOptions) {
    if (dateOrOptions instanceof Date) {
      const button = this.renderRoot.querySelector(
        `td[data-date="${dateOrOptions.toISOString()}"] button`
      );
      __privateGet(this, _focusGroupController).clearElementCache();
      __privateGet(this, _focusGroupController).focusToElement(button);
    } else {
      super.focus(dateOrOptions);
    }
  }
};
_month = new WeakMap();
_focusGroupController = new WeakMap();
_MonthView_instances = new WeakSet();
onClick_fn = function (event2, day) {
  const button = event2.target.closest('button');
  if (!button?.disabled) {
    const isAlreadySelected = this.selected && isSameDate(day.date, this.selected);
    if (!isAlreadySelected) {
      this.selectEvent.emit(day.date);
      this.selected = day.date;
    }
  }
  if (button?.part.contains('previous-month') || button?.part.contains('next-month')) {
    this.changeEvent.emit(day.date);
  }
};
onKeydown_fn = function (event2, day) {
  if (event2.key === 'ArrowLeft' && day.firstActiveDayOfMonth) {
    event2.preventDefault();
    event2.stopPropagation();
    this.changeEvent.emit(new Date(day.date.getFullYear(), day.date.getMonth(), 0));
  } else if (event2.key === 'ArrowRight' && day.lastActiveDayOfMonth) {
    event2.preventDefault();
    event2.stopPropagation();
    this.changeEvent.emit(new Date(day.date.getFullYear(), day.date.getMonth() + 1, 1));
  } else if (event2.key === 'ArrowUp' && day.currentMonth) {
    const possibleDay = __privateMethod(this, _MonthView_instances, getEnabledSameWeekday_fn).call(
      this,
      day.date,
      -1
    );
    if (!possibleDay) {
      event2.preventDefault();
      event2.stopPropagation();
      return;
    }
    const crossesMonth =
      possibleDay.getMonth() !== day.date.getMonth() ||
      possibleDay.getFullYear() !== day.date.getFullYear();
    if (crossesMonth) {
      event2.preventDefault();
      event2.stopPropagation();
      this.changeEvent.emit(possibleDay);
    }
  } else if (event2.key === 'ArrowDown' && day.currentMonth) {
    const possibleDay = __privateMethod(this, _MonthView_instances, getEnabledSameWeekday_fn).call(
      this,
      day.date,
      1
    );
    if (!possibleDay) {
      event2.preventDefault();
      event2.stopPropagation();
      return;
    }
    const crossesMonth =
      possibleDay.getMonth() !== day.date.getMonth() ||
      possibleDay.getFullYear() !== day.date.getFullYear();
    if (crossesMonth) {
      event2.preventDefault();
      event2.stopPropagation();
      this.changeEvent.emit(possibleDay);
    }
  } else if (event2.key === 'Enter' || event2.key === ' ') {
    event2.preventDefault();
    event2.stopPropagation();
    this.selectEvent.emit(day.date);
    this.selected = day.date;
  }
};
/** Nearest enabled same-weekday date (weekly steps: -1 or 1) */
getEnabledSameWeekday_fn = function (start, direction) {
  const findEnabledSameWeekday = current => {
    const possibleDay = new Date(
      current.getFullYear(),
      current.getMonth(),
      current.getDate() + DAYS_IN_WEEK * direction
    );
    if ((this.min && possibleDay < this.min) || (this.max && possibleDay > this.max)) {
      return void 0;
    }
    if (!(this.disabledDates && isDateInList(possibleDay, this.disabledDates))) {
      return possibleDay;
    }
    return findEnabledSameWeekday(possibleDay);
  };
  return findEnabledSameWeekday(start);
};
/**
 * Determines if a button should autofocus. A button should autofocus when: - it is the selected
 * date - or it is today - or it is the first enabled day of the month
 */
hasAutofocus_fn = function (day, selected) {
  const isFirstEnabledDay =
    day.currentMonth &&
    !day.disabled &&
    !day.outOfRange &&
    !this.selected &&
    !this.showToday &&
    !this.calendar?.weeks.some(week =>
      week.days.some(d => d.currentMonth && !d.disabled && !d.outOfRange && d.date < day.date)
    );
  return !!(selected || (day.today && !this.selected) || isFirstEnabledDay);
};
/** @internal */
MonthView.shadowRootOptions = {
  ...LitElement.shadowRootOptions,
  delegatesFocus: true
};
/** @internal */
MonthView.styles = styles;
__decorateClass([state()], MonthView.prototype, 'calendar', 2);
__decorateClass([event({ name: 'sl-change' })], MonthView.prototype, 'changeEvent', 2);
__decorateClass([query('.days')], MonthView.prototype, 'days', 2);
__decorateClass(
  [property({ attribute: 'disabled-dates', converter: dateListConverter })],
  MonthView.prototype,
  'disabledDates',
  2
);
__decorateClass(
  [property({ type: Number, attribute: 'first-day-of-week' })],
  MonthView.prototype,
  'firstDayOfWeek',
  2
);
__decorateClass(
  [property({ type: Boolean, attribute: 'hide-days-other-months' })],
  MonthView.prototype,
  'hideDaysOtherMonths',
  2
);
__decorateClass(
  [property({ attribute: 'indicator-dates', converter: indicatorConverter })],
  MonthView.prototype,
  'indicatorDates',
  2
);
__decorateClass([state()], MonthView.prototype, 'localizedWeekOfYear', 2);
__decorateClass([property({ converter: dateConverter })], MonthView.prototype, 'max', 2);
__decorateClass([property({ converter: dateConverter })], MonthView.prototype, 'min', 2);
__decorateClass([property({ converter: dateConverter })], MonthView.prototype, 'month', 1);
__decorateClass([property({ type: Boolean, reflect: true })], MonthView.prototype, 'readonly', 2);
__decorateClass([property({ attribute: false })], MonthView.prototype, 'renderer', 2);
__decorateClass([event({ name: 'sl-select' })], MonthView.prototype, 'selectEvent', 2);
__decorateClass([property({ converter: dateConverter })], MonthView.prototype, 'selected', 2);
__decorateClass(
  [property({ type: Boolean, attribute: 'show-today' })],
  MonthView.prototype,
  'showToday',
  2
);
__decorateClass(
  [property({ type: Boolean, attribute: 'show-week-numbers' })],
  MonthView.prototype,
  'showWeekNumbers',
  2
);
__decorateClass([state()], MonthView.prototype, 'weekDays', 2);
MonthView = __decorateClass([localized()], MonthView);
//# sourceMappingURL=month-view.js.map
