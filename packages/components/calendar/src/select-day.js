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
  _intersectionObserver,
  _observedMonths,
  _resizeObserver,
  _SelectDay_instances,
  onChange_fn,
  onPrevious_fn,
  onNext_fn,
  onScrollEnd_fn,
  onSelect_fn,
  onToggleMonthSelect_fn,
  onToggleYearSelect_fn,
  announce_fn,
  canSelectNextMonth_fn,
  canSelectPreviousMonth_fn,
  scrollToMonth_fn,
  updateWeekNumberColumnSize_fn,
  updateMonthViews_fn;
import { localized, msg, str } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { announce } from '@sl-design-system/announcer';
import { Button } from '@sl-design-system/button';
import { FormatDate, format } from '@sl-design-system/format-date';
import { Icon } from '@sl-design-system/icon';
import { LocaleMixin, event } from '@sl-design-system/shared';
import { dateConverter } from '@sl-design-system/shared/converters.js';
import { isSameDate, normalizeDateTime } from '@sl-design-system/shared/date.js';
import { LitElement, html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { MonthView } from './month-view.js';
import styles from './select-day.scss.js';
import { getWeekdayNames, indicatorConverter } from './utils.js';
const getRequiredColumnSize = (renderedWidth, scrollWidth) => {
  const minimumColumnSize = Math.ceil(renderedWidth),
    requiredColumnSize = Math.max(minimumColumnSize, Math.ceil(scrollWidth));
  return requiredColumnSize > minimumColumnSize ? requiredColumnSize : void 0;
};
export let SelectDay = class extends LocaleMixin(ScopedElementsMixin(LitElement)) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _SelectDay_instances);
    /** Timeout id, to be used with `clearTimeout`. */
    __privateAdd(this, _announceTimeoutId);
    /**
     * Use an intersection observer as a workaround until `scrollsnapchange` events are widely
     * supported.
     */
    __privateAdd(this, _intersectionObserver);
    /** The currently observed month views. */
    __privateAdd(this, _observedMonths);
    /**
     * Use a resize observer as a cross browser solution to know when to initialize the intersection
     * observer and also to know when to center the current month in the scroller during
     * initialization.
     */
    __privateAdd(
      this,
      _resizeObserver,
      new ResizeObserver(async () => {
        if (!__privateGet(this, _intersectionObserver)) {
          __privateSet(
            this,
            _intersectionObserver,
            new IntersectionObserver(
              entries => {
                const visibleEntry = entries
                  .filter(entry => entry.isIntersecting)
                  .find(entry => entry.intersectionRatio >= 0.5);
                if (visibleEntry) {
                  const monthView = visibleEntry.target,
                    displayMonth = normalizeDateTime(monthView.month);
                  if (!isSameDate(this.displayMonth, displayMonth)) {
                    this.displayMonth = displayMonth;
                  }
                }
              },
              { root: this.scroller, threshold: [0, 0.5, 1] }
            )
          );
          await __privateMethod(this, _SelectDay_instances, updateMonthViews_fn).call(this);
        }
      })
    );
    this.firstDayOfWeek = 1;
    this.month = /* @__PURE__ */ new Date();
    this.weekDays = [];
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-button': Button,
      'sl-format-date': FormatDate,
      'sl-icon': Icon,
      'sl-month-view': MonthView
    };
  }
  connectedCallback() {
    super.connectedCallback();
    __privateGet(this, _resizeObserver).observe(this);
  }
  disconnectedCallback() {
    __privateGet(this, _resizeObserver).disconnect();
    __privateGet(this, _intersectionObserver)?.disconnect();
    __privateSet(this, _intersectionObserver, void 0);
    if (__privateGet(this, _announceTimeoutId)) {
      clearTimeout(__privateGet(this, _announceTimeoutId));
      __privateSet(this, _announceTimeoutId, void 0);
    }
    super.disconnectedCallback();
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
    if (changes.has('month') && this.month) {
      this.displayMonth = new Date(this.month.getFullYear(), this.month.getMonth());
      this.nextMonth = new Date(this.month.getFullYear(), this.month.getMonth() + 1);
      this.previousMonth = new Date(this.month.getFullYear(), this.month.getMonth() - 1);
    }
    if (changes.has('max') || changes.has('min') || changes.has('month')) {
      __privateGet(this, _observedMonths)?.forEach(mv =>
        __privateGet(this, _intersectionObserver)?.unobserve(mv)
      );
      __privateSet(this, _observedMonths, void 0);
    }
  }
  updated(changes) {
    super.updated(changes);
    if (changes.has('localizedWeekOfYear') || changes.has('showWeekNumbers')) {
      __privateMethod(this, _SelectDay_instances, updateWeekNumberColumnSize_fn).call(this);
    }
    const weekNumberHeader = this.renderRoot.querySelector('.days-of-week .week-number'),
      shouldRecenterForShowWeekNumbers =
        changes.has('showWeekNumbers') &&
        (weekNumberHeader != null || changes.get('showWeekNumbers') === true),
      shouldRecenterForLocalizedWeekOfYear =
        changes.has('localizedWeekOfYear') && weekNumberHeader != null;
    if (shouldRecenterForShowWeekNumbers || shouldRecenterForLocalizedWeekOfYear) {
      requestAnimationFrame(() =>
        __privateMethod(this, _SelectDay_instances, scrollToMonth_fn).call(this, 0)
      );
    }
    if (changes.has('max') || changes.has('min') || changes.has('month')) {
      void __privateMethod(this, _SelectDay_instances, updateMonthViews_fn).call(this);
    }
  }
  render() {
    const canSelectNextMonth = __privateMethod(
        this,
        _SelectDay_instances,
        canSelectNextMonth_fn
      ).call(this),
      canSelectPreviousMonth = __privateMethod(
        this,
        _SelectDay_instances,
        canSelectPreviousMonth_fn
      ).call(this),
      canSelectNextYear = this.displayMonth
        ? !this.max || (this.max && this.displayMonth.getFullYear() + 1 <= this.max.getFullYear())
        : false,
      canSelectPreviousYear = this.displayMonth
        ? !this.min || (this.min && this.displayMonth.getFullYear() - 1 >= this.min.getFullYear())
        : false;
    return html`
      <header>
        ${
          canSelectPreviousMonth || canSelectNextMonth
            ? html`
                <sl-button
                  @click=${__privateMethod(this, _SelectDay_instances, onToggleMonthSelect_fn)}
                  aria-label=${msg(
                    str`${format(this.displayMonth, this.locale, { month: 'long' })}, change month`,
                    {
                      id: 'sl.calendar.changeMonth'
                    }
                  )}
                  class="current-month"
                  fill="link"
                  variant="secondary">
                  <sl-format-date
                    .date=${this.displayMonth}
                    locale=${ifDefined(this.locale)}
                    month="long"></sl-format-date>
                  <sl-icon name="caret-down-solid"></sl-icon>
                </sl-button>
              `
            : html`
                <span class="current-month">
                  <sl-format-date
                    .date=${this.displayMonth}
                    locale=${ifDefined(this.locale)}
                    month="long"></sl-format-date>
                </span>
              `
        }
        ${
          canSelectPreviousYear || canSelectNextYear
            ? html`
                <sl-button
                  @click=${__privateMethod(this, _SelectDay_instances, onToggleYearSelect_fn)}
                  aria-label=${msg(
                    str`${format(this.displayMonth, this.locale, { year: 'numeric' })}, change year`,
                    {
                      id: 'sl.calendar.changeYear'
                    }
                  )}
                  class="current-year"
                  fill="link"
                  variant="secondary">
                  <sl-format-date
                    .date=${this.displayMonth}
                    locale=${ifDefined(this.locale)}
                    year="numeric"></sl-format-date>
                  <sl-icon name="caret-down-solid"></sl-icon>
                </sl-button>
              `
            : html`
                <span class="current-year">
                  <sl-format-date
                    .date=${this.displayMonth}
                    locale=${ifDefined(this.locale)}
                    year="numeric"></sl-format-date>
                </span>
              `
        }

        <sl-button
          @click=${__privateMethod(this, _SelectDay_instances, onPrevious_fn)}
          ?disabled=${!canSelectPreviousMonth}
          aria-label=${msg(
            str`Previous month, ${format(this.previousMonth, this.locale, { month: 'long', year: 'numeric' })}`,
            { id: 'sl.calendar.previousMonth' }
          )}
          class="previous-month"
          fill="ghost"
          variant="secondary">
          <sl-icon name="chevron-left"></sl-icon>
        </sl-button>
        <sl-button
          @click=${__privateMethod(this, _SelectDay_instances, onNext_fn)}
          ?disabled=${!canSelectNextMonth}
          aria-label=${msg(
            str`Next month, ${format(this.nextMonth, this.locale, { month: 'long', year: 'numeric' })}`,
            { id: 'sl.calendar.nextMonth' }
          )}
          class="next-month"
          fill="ghost"
          variant="secondary">
          <sl-icon name="chevron-right"></sl-icon>
        </sl-button>
      </header>

      <div class="days-of-week" role="list">
        ${
          this.showWeekNumbers
            ? html`
                <span
                  aria-label=${msg('Week', { id: 'sl.calendar.week' })}
                  class="week-number"
                  role="listitem">
                  ${this.localizedWeekOfYear}
                </span>
              `
            : nothing
        }
        ${this.weekDays.map(
          day => html`
            <span aria-label=${day.long} class="day-of-week" role="listitem">${day.short}</span>
          `
        )}
      </div>

      <div
        @scrollend=${__privateMethod(this, _SelectDay_instances, onScrollEnd_fn)}
        class="scroller"
        tabindex="-1">
        ${
          canSelectPreviousMonth
            ? html`
                <sl-month-view
                  ?readonly=${this.readonly}
                  ?show-today=${this.showToday}
                  ?show-week-numbers=${this.showWeekNumbers}
                  .disabledDates=${this.disabledDates}
                  .indicatorDates=${this.indicatorDates}
                  aria-hidden="true"
                  first-day-of-week=${ifDefined(this.firstDayOfWeek)}
                  inert
                  locale=${ifDefined(this.locale)}
                  max=${ifDefined(this.max?.toISOString())}
                  min=${ifDefined(this.min?.toISOString())}
                  month=${ifDefined(this.previousMonth?.toISOString())}
                  selected=${ifDefined(this.selected?.toISOString())}></sl-month-view>
              `
            : nothing
        }
        <sl-month-view
          @sl-change=${__privateMethod(this, _SelectDay_instances, onChange_fn)}
          @sl-select=${__privateMethod(this, _SelectDay_instances, onSelect_fn)}
          ?readonly=${this.readonly}
          ?show-today=${this.showToday}
          ?show-week-numbers=${this.showWeekNumbers}
          .disabledDates=${this.disabledDates}
          .indicatorDates=${this.indicatorDates}
          autofocus
          first-day-of-week=${ifDefined(this.firstDayOfWeek)}
          locale=${ifDefined(this.locale)}
          max=${ifDefined(this.max?.toISOString())}
          min=${ifDefined(this.min?.toISOString())}
          month=${ifDefined(this.month?.toISOString())}
          selected=${ifDefined(this.selected?.toISOString())}></sl-month-view>
        ${
          canSelectNextMonth
            ? html`
                <sl-month-view
                  ?readonly=${this.readonly}
                  ?show-today=${this.showToday}
                  ?show-week-numbers=${this.showWeekNumbers}
                  .disabledDates=${this.disabledDates}
                  .indicatorDates=${this.indicatorDates}
                  aria-hidden="true"
                  first-day-of-week=${ifDefined(this.firstDayOfWeek)}
                  inert
                  locale=${ifDefined(this.locale)}
                  max=${ifDefined(this.max?.toISOString())}
                  min=${ifDefined(this.min?.toISOString())}
                  month=${ifDefined(this.nextMonth?.toISOString())}
                  selected=${ifDefined(this.selected?.toISOString())}></sl-month-view>
              `
            : nothing
        }
      </div>
    `;
  }
};
_announceTimeoutId = new WeakMap();
_intersectionObserver = new WeakMap();
_observedMonths = new WeakMap();
_resizeObserver = new WeakMap();
_SelectDay_instances = new WeakSet();
onChange_fn = function (event2) {
  event2.preventDefault();
  event2.stopPropagation();
  const newMonth = new Date(event2.detail.getFullYear(), event2.detail.getMonth());
  if (this.min) {
    const minMonth = new Date(this.min.getFullYear(), this.min.getMonth());
    if (newMonth < minMonth) {
      return;
    }
  }
  if (this.max) {
    const maxMonth = new Date(this.max.getFullYear(), this.max.getMonth());
    if (newMonth > maxMonth) {
      return;
    }
  }
  this.month = newMonth;
  requestAnimationFrame(() => {
    this.renderRoot.querySelector('sl-month-view:not([inert])')?.focus(event2.detail);
  });
};
onPrevious_fn = function () {
  __privateMethod(this, _SelectDay_instances, scrollToMonth_fn).call(this, -1, true);
  __privateMethod(this, _SelectDay_instances, announce_fn).call(this, this.previousMonth);
};
onNext_fn = function () {
  __privateMethod(this, _SelectDay_instances, scrollToMonth_fn).call(this, 1, true);
  __privateMethod(this, _SelectDay_instances, announce_fn).call(this, this.nextMonth);
};
onScrollEnd_fn = async function () {
  if (!this.displayMonth || isSameDate(this.month, this.displayMonth)) {
    return;
  }
  __privateGet(this, _observedMonths)?.forEach(mv =>
    __privateGet(this, _intersectionObserver)?.unobserve(mv)
  );
  __privateSet(this, _observedMonths, void 0);
  this.month = normalizeDateTime(this.displayMonth);
  if ('onscrollend' in this.scroller) {
    await this.updateComplete;
  } else {
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
  }
  __privateMethod(this, _SelectDay_instances, scrollToMonth_fn).call(this, 0);
  __privateSet(this, _observedMonths, this.renderRoot.querySelectorAll('sl-month-view'));
  __privateGet(this, _observedMonths).forEach(mv =>
    __privateGet(this, _intersectionObserver)?.observe(mv)
  );
};
onSelect_fn = function (event2) {
  event2.preventDefault();
  event2.stopPropagation();
  this.selectEvent.emit(event2.detail);
};
onToggleMonthSelect_fn = function () {
  this.toggleEvent.emit('month');
};
onToggleYearSelect_fn = function () {
  this.toggleEvent.emit('year');
};
announce_fn = function (month) {
  if (!month) {
    return;
  }
  if (__privateGet(this, _announceTimeoutId)) {
    clearTimeout(__privateGet(this, _announceTimeoutId));
  }
  __privateSet(
    this,
    _announceTimeoutId,
    setTimeout(() => {
      const monthFormatted = format(month, this.locale, { month: 'long', year: 'numeric' });
      announce(`${monthFormatted}`, 'polite');
      __privateSet(this, _announceTimeoutId, void 0);
    }, 50)
  );
};
canSelectNextMonth_fn = function () {
  if (!this.nextMonth) {
    return false;
  }
  if (!this.max) {
    return true;
  }
  const nextMonthNormalized = new Date(this.nextMonth.getFullYear(), this.nextMonth.getMonth()),
    maxMonthNormalized = new Date(this.max.getFullYear(), this.max.getMonth());
  return nextMonthNormalized <= maxMonthNormalized;
};
canSelectPreviousMonth_fn = function () {
  if (!this.previousMonth) {
    return false;
  }
  if (!this.min) {
    return true;
  }
  const previousMonthNormalized = new Date(
      this.previousMonth.getFullYear(),
      this.previousMonth.getMonth()
    ),
    minMonthNormalized = new Date(this.min.getFullYear(), this.min.getMonth());
  return previousMonthNormalized >= minMonthNormalized;
};
scrollToMonth_fn = function (month, smooth = false) {
  if (!this.scroller) {
    return;
  }
  const { width } = this.scroller.getBoundingClientRect(),
    canSelectPrevious = __privateMethod(this, _SelectDay_instances, canSelectPreviousMonth_fn).call(
      this
    ),
    canSelectNext = __privateMethod(this, _SelectDay_instances, canSelectNextMonth_fn).call(this);
  const currentMonthPosition = canSelectPrevious ? 1 : 0;
  let left;
  if (month === -1) {
    left = 0;
  } else if (month === 1) {
    if (canSelectPrevious && canSelectNext) {
      left = width * 2;
    } else if (canSelectNext) {
      left = width;
    } else {
      left = width * currentMonthPosition;
    }
  } else {
    left = width * currentMonthPosition;
  }
  if (smooth) {
    this.scroller.scrollTo({ left, behavior: 'smooth' });
  } else if (this.scroller.scrollLeft !== left) {
    this.scroller.scrollLeft = left;
  }
};
/** Measures the week number header and increases the column width when text does not fit. */
updateWeekNumberColumnSize_fn = function () {
  this.style.removeProperty('--_week-number-column-size');
  if (!this.showWeekNumbers) {
    return;
  }
  const weekNumber = this.renderRoot.querySelector('.days-of-week .week-number');
  if (!weekNumber) {
    return;
  }
  const requiredColumnSize = getRequiredColumnSize(
    weekNumber.getBoundingClientRect().width,
    weekNumber.scrollWidth
  );
  if (requiredColumnSize) {
    this.style.setProperty('--_week-number-column-size', `${requiredColumnSize}px`);
  }
};
updateMonthViews_fn = async function () {
  await new Promise(requestAnimationFrame);
  await new Promise(requestAnimationFrame);
  __privateMethod(this, _SelectDay_instances, scrollToMonth_fn).call(this, 0);
  __privateSet(this, _observedMonths, this.renderRoot.querySelectorAll('sl-month-view'));
  __privateGet(this, _observedMonths).forEach(mv =>
    __privateGet(this, _intersectionObserver)?.observe(mv)
  );
};
/** @internal */
SelectDay.shadowRootOptions = {
  ...LitElement.shadowRootOptions,
  delegatesFocus: true
};
/** @internal */
SelectDay.styles = styles;
__decorateClass(
  [property({ attribute: 'disabled-dates', converter: dateConverter })],
  SelectDay.prototype,
  'disabledDates',
  2
);
__decorateClass([state()], SelectDay.prototype, 'displayMonth', 2);
__decorateClass(
  [property({ type: Number, attribute: 'first-day-of-week' })],
  SelectDay.prototype,
  'firstDayOfWeek',
  2
);
__decorateClass(
  [
    property({
      attribute: 'indicator-dates',
      converter: indicatorConverter
    })
  ],
  SelectDay.prototype,
  'indicatorDates',
  2
);
__decorateClass([state()], SelectDay.prototype, 'localizedWeekOfYear', 2);
__decorateClass([property({ converter: dateConverter })], SelectDay.prototype, 'max', 2);
__decorateClass([property({ converter: dateConverter })], SelectDay.prototype, 'min', 2);
__decorateClass([property({ converter: dateConverter })], SelectDay.prototype, 'month', 2);
__decorateClass([state()], SelectDay.prototype, 'nextMonth', 2);
__decorateClass([state()], SelectDay.prototype, 'previousMonth', 2);
__decorateClass([property({ type: Boolean })], SelectDay.prototype, 'readonly', 2);
__decorateClass([query('.scroller')], SelectDay.prototype, 'scroller', 2);
__decorateClass([property({ converter: dateConverter })], SelectDay.prototype, 'selected', 2);
__decorateClass([event({ name: 'sl-select' })], SelectDay.prototype, 'selectEvent', 2);
__decorateClass(
  [property({ type: Boolean, attribute: 'show-today' })],
  SelectDay.prototype,
  'showToday',
  2
);
__decorateClass(
  [property({ type: Boolean, reflect: true, attribute: 'show-week-numbers' })],
  SelectDay.prototype,
  'showWeekNumbers',
  2
);
__decorateClass([event({ name: 'sl-toggle' })], SelectDay.prototype, 'toggleEvent', 2);
__decorateClass([state()], SelectDay.prototype, 'weekDays', 2);
SelectDay = __decorateClass([localized()], SelectDay);
//# sourceMappingURL=select-day.js.map
