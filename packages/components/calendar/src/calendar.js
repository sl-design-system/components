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
var _events,
  _previousMode,
  _Calendar_instances,
  onFocusIn_fn,
  helperTextFormatOptions_get,
  onChange_fn,
  onSelect_fn,
  onSelectMonth_fn,
  onSelectYear_fn,
  onToggleMonthYear_fn,
  setHelperTextOnFirstButton_fn,
  focusActiveMode_fn;
import { localized, msg, str } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { format } from '@sl-design-system/format-date';
import { Icon } from '@sl-design-system/icon';
import { EventsController, LocaleMixin, event } from '@sl-design-system/shared';
import { dateConverter, dateListConverter } from '@sl-design-system/shared/converters.js';
import { isSameDate } from '@sl-design-system/shared/date.js';
import { LitElement, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './calendar.scss.js';
import { SelectDay } from './select-day.js';
import { SelectMonth } from './select-month.js';
import { SelectYear } from './select-year.js';
import { indicatorConverter } from './utils.js';
export let Calendar = class extends LocaleMixin(ScopedElementsMixin(LitElement)) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _Calendar_instances);
    /** Events controller. */
    // eslint-disable-next-line no-unused-private-class-members
    __privateAdd(
      this,
      _events,
      new EventsController(this, {
        focusin: __privateMethod(this, _Calendar_instances, onFocusIn_fn)
      })
    );
    /**
     * Tracks the previously active calendar mode (`'day' | 'month' | 'year'`) so the component can
     * restore the correct view when closing or switching between month and year views.
     */
    __privateAdd(this, _previousMode, 'day');
    this.mode = 'day';
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-icon': Icon,
      'sl-select-day': SelectDay,
      'sl-select-month': SelectMonth,
      'sl-select-year': SelectYear
    };
  }
  willUpdate(changes) {
    super.willUpdate(changes);
    if (changes.has('selected') && this.selected) {
      this.month = this.selected;
    } else {
      this.month ??= /* @__PURE__ */ new Date();
    }
  }
  render() {
    return html`
      <sl-select-day
        @sl-change=${__privateMethod(this, _Calendar_instances, onChange_fn)}
        @sl-select=${__privateMethod(this, _Calendar_instances, onSelect_fn)}
        @sl-toggle=${__privateMethod(this, _Calendar_instances, onToggleMonthYear_fn)}
        ?autofocus=${this.mode === 'day'}
        ?inert=${this.mode !== 'day'}
        ?readonly=${this.readonly}
        ?show-today=${this.showToday}
        ?show-week-numbers=${this.showWeekNumbers}
        .disabledDates=${this.disabledDates}
        .indicatorDates=${this.indicatorDates}
        .month=${this.month}
        .selected=${this.selected}
        aria-hidden=${ifDefined(this.mode !== 'day' ? 'true' : void 0)}
        first-day-of-week=${ifDefined(this.firstDayOfWeek)}
        locale=${ifDefined(this.locale)}
        max=${ifDefined(this.max?.toISOString())}
        min=${ifDefined(this.min?.toISOString())}
        style=${ifDefined(this.mode === 'day' ? void 0 : 'visibility: hidden')}></sl-select-day>
      ${choose(this.mode, [
        [
          'month',
          () => html`
            <sl-select-month
              @sl-select=${__privateMethod(this, _Calendar_instances, onSelectMonth_fn)}
              @sl-toggle=${__privateMethod(this, _Calendar_instances, onToggleMonthYear_fn)}
              ?show-current=${this.showToday}
              .selected=${this.selected}
              .month=${this.month}
              locale=${ifDefined(this.locale)}
              max=${ifDefined(this.max?.toISOString())}
              min=${ifDefined(this.min?.toISOString())}></sl-select-month>
          `
        ],
        [
          'year',
          () => html`
            <sl-select-year
              @sl-select=${__privateMethod(this, _Calendar_instances, onSelectYear_fn)}
              ?show-current=${this.showToday}
              .selected=${this.selected}
              .year=${this.month}
              max=${ifDefined(this.max?.toISOString())}
              min=${ifDefined(this.min?.toISOString())}></sl-select-year>
          `
        ]
      ])}
      ${
        this.min && this.max
          ? html`
              <div class="helper-text">
                <sl-icon name="info"></sl-icon>
                ${msg(
                  str`Between ${format(this.min, this.locale, __privateGet(this, _Calendar_instances, helperTextFormatOptions_get))} and ${format(this.max, this.locale, __privateGet(this, _Calendar_instances, helperTextFormatOptions_get))}`,
                  { id: 'sl.calendar.rangeBetween' }
                )}
              </div>
            `
          : this.min
            ? html`
                <div class="helper-text">
                  <sl-icon name="info"></sl-icon>
                  ${msg(
                    str`No earlier than ${format(this.min, this.locale, __privateGet(this, _Calendar_instances, helperTextFormatOptions_get))}`,
                    {
                      id: 'sl.calendar.rangeNoEarlierThan'
                    }
                  )}
                </div>
              `
            : this.max
              ? html`
                  <div class="helper-text">
                    <sl-icon name="info"></sl-icon>
                    ${msg(
                      str`No later than ${format(this.max, this.locale, __privateGet(this, _Calendar_instances, helperTextFormatOptions_get))}`,
                      {
                        id: 'sl.calendar.rangeNoLaterThan'
                      }
                    )}
                  </div>
                `
              : nothing
      }
    `;
  }
};
_events = new WeakMap();
_previousMode = new WeakMap();
_Calendar_instances = new WeakSet();
/**
 * Adds the helper-text to `ariaDescribedByElements` on the first button that receives focus inside
 * the calendar grid.
 *
 * This is an accessibility hack necessary because of https://github.com/nvaccess/nvda/issues/13392.
 * NVDA automatically switches to browse mode when detecting interactive elements inside grid cells.
 * Because of that focus is not moved to another day and the ARIA descriptions aren't read. As a
 * workaround, we're adding the helper text to the first button that receives focus, so NVDA will at
 * least read the helper text once. Once this NVDA issue is resolved, we can remove this workaround
 * and add the helper text to the min/max day as expected.
 */
onFocusIn_fn = function (event2) {
  if (!this.min && !this.max) {
    return;
  }
  const helperText = this.renderRoot.querySelector('.helper-text');
  if (!helperText) {
    return;
  }
  const button = event2
    .composedPath()
    .find(el => el instanceof HTMLButtonElement && !!el.closest('table[role="grid"]'));
  if (button) {
    const existing = (button.ariaDescribedByElements ?? []).filter(
      el => !el.classList?.contains('helper-text')
    );
    button.ariaDescribedByElements = [...existing, helperText];
  }
};
helperTextFormatOptions_get = function () {
  return this.min && this.max && this.min.getFullYear() === this.max.getFullYear()
    ? { day: 'numeric', month: 'long' }
    : { day: '2-digit', month: '2-digit', year: 'numeric' };
};
onChange_fn = function (event2) {
  event2.preventDefault();
  event2.stopPropagation();
};
onSelect_fn = function (event2) {
  event2.preventDefault();
  event2.stopPropagation();
  if (!this.selected || !isSameDate(this.selected, event2.detail)) {
    this.selected = new Date(event2.detail);
    this.changeEvent.emit(this.selected);
  }
};
onSelectMonth_fn = function (event2) {
  event2.preventDefault();
  event2.stopPropagation();
  this.month = new Date(
    event2.detail.getFullYear(),
    event2.detail.getMonth(),
    this.month.getDate()
  );
  this.mode = 'day';
  requestAnimationFrame(() => {
    this.renderRoot.querySelector('sl-select-day')?.focus();
  });
};
onSelectYear_fn = function (event2) {
  event2.preventDefault();
  event2.stopPropagation();
  this.month = new Date(event2.detail.getFullYear(), this.month.getMonth(), this.month.getDate());
  this.mode = __privateGet(this, _previousMode) ?? 'day';
  requestAnimationFrame(() => {
    __privateMethod(this, _Calendar_instances, focusActiveMode_fn).call(this);
  });
};
onToggleMonthYear_fn = function (event2) {
  event2.preventDefault();
  event2.stopPropagation();
  __privateSet(this, _previousMode, this.mode);
  this.mode = event2.detail;
  requestAnimationFrame(() => {
    const subComponent = this.renderRoot.querySelector(
      event2.detail === 'month' ? 'sl-select-month' : 'sl-select-year'
    );
    if (subComponent) {
      subComponent.focus();
      __privateMethod(this, _Calendar_instances, setHelperTextOnFirstButton_fn).call(
        this,
        subComponent
      );
    }
  });
};
/**
 * Sets `ariaDescribedByElements` on the first focusable button (day, month or year depending on
 * view)
 */
setHelperTextOnFirstButton_fn = function (subComponent) {
  const helperText = this.renderRoot.querySelector('.helper-text');
  if (!helperText) {
    return;
  }
  const button = subComponent.shadowRoot?.querySelector('table button:not(:disabled)');
  if (button) {
    const existingDescription = (button.ariaDescribedByElements ?? []).filter(
      el => !el.classList?.contains('helper-text')
    );
    button.ariaDescribedByElements = [...existingDescription, helperText];
  }
};
focusActiveMode_fn = function () {
  const selector =
      this.mode === 'month'
        ? 'sl-select-month'
        : this.mode === 'year'
          ? 'sl-select-year'
          : 'sl-select-day',
    subComponent = this.renderRoot.querySelector(selector);
  if (subComponent) {
    subComponent.focus();
    __privateMethod(this, _Calendar_instances, setHelperTextOnFirstButton_fn).call(
      this,
      subComponent
    );
  }
};
/** @internal */
Calendar.shadowRootOptions = {
  ...LitElement.shadowRootOptions,
  delegatesFocus: true
};
/** @internal */
Calendar.styles = styles;
__decorateClass([event({ name: 'sl-change' })], Calendar.prototype, 'changeEvent', 2);
__decorateClass(
  [property({ attribute: 'disabled-dates', converter: dateListConverter })],
  Calendar.prototype,
  'disabledDates',
  2
);
__decorateClass(
  [property({ type: Number, attribute: 'first-day-of-week' })],
  Calendar.prototype,
  'firstDayOfWeek',
  2
);
__decorateClass(
  [property({ attribute: 'indicator-dates', converter: indicatorConverter })],
  Calendar.prototype,
  'indicatorDates',
  2
);
__decorateClass([property({ converter: dateConverter })], Calendar.prototype, 'max', 2);
__decorateClass([property({ converter: dateConverter })], Calendar.prototype, 'min', 2);
__decorateClass([state()], Calendar.prototype, 'mode', 2);
__decorateClass([property({ converter: dateConverter })], Calendar.prototype, 'month', 2);
__decorateClass([property({ type: Boolean })], Calendar.prototype, 'readonly', 2);
__decorateClass([property({ converter: dateConverter })], Calendar.prototype, 'selected', 2);
__decorateClass(
  [property({ type: Boolean, attribute: 'show-today' })],
  Calendar.prototype,
  'showToday',
  2
);
__decorateClass(
  [property({ type: Boolean, attribute: 'show-week-numbers' })],
  Calendar.prototype,
  'showWeekNumbers',
  2
);
Calendar = __decorateClass([localized()], Calendar);
//# sourceMappingURL=calendar.js.map
