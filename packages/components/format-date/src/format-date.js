var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if ((decorator = decorators[i]))
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
import { LocaleMixin } from '@sl-design-system/shared/mixins.js';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { format } from './format.js';
export class FormatDate extends LocaleMixin(LitElement) {
  static {
    /**
     * The date style format. The `dateStyle` and `timeStyle` can be used with each other, but not
     * with other date-time component options (e.g. weekday, hour, month, etc.).
     *
     * By changing this static property you can change the default value for all future instances of
     * the component with dateStyle usage. Changing the static property won't affect already created
     * instances.
     */
    this.dateStyle = 'long';
  }
  static {
    /**
     * The time style format. The `dateStyle` and `timeStyle` can be used with each other, but not
     * with other date-time component options (e.g. weekday, hour, month, etc.).
     *
     * By changing this static property you can change the default value for all future instances of
     * the component with timeStyle usage. Changing the static property won't affect already created
     * instances.
     */
    this.timeStyle = 'medium';
  }
  /** The date object. */
  #date;
  set date(value) {
    if (value instanceof Date) {
      this.#date = value;
    } else if (typeof value === 'number' && this.#isDateValid(value)) {
      this.#date = new Date(value);
    } else if (typeof value === 'string' && this.#isDateValid(value)) {
      this.#date = new Date(value);
    } else {
      this.#date = void 0;
    }
  }
  get date() {
    return this.#date;
  }
  render() {
    return html`${!this.date ? html`<slot></slot>` : this.#formatDateTime(this.date)}`;
  }
  #formatDateTime(date) {
    const localeString = this.locale ? this.locale : 'en',
      {
        dateStyle,
        day,
        dayPeriod,
        era,
        hour,
        hour12,
        month,
        minute,
        second,
        timeStyle,
        timeZoneName,
        timeZone,
        weekday,
        year
      } = this,
      predefinedStyles = { dateStyle: dateStyle || void 0, timeStyle: timeStyle || void 0 },
      options = {
        weekday,
        era,
        year,
        month,
        day,
        dayPeriod,
        hour,
        minute,
        second,
        timeZoneName,
        timeZone,
        hour12
      },
      formatOptions = Object.values(options).every(value => value === void 0)
        ? predefinedStyles
        : options;
    return format(date, localeString, { ...formatOptions, ...this.dateTimeOptions });
  }
  #isDateValid(date) {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }
}
__decorateClass([property({ attribute: 'date-style' })], FormatDate.prototype, 'dateStyle', 2);
__decorateClass([property({ attribute: 'time-style' })], FormatDate.prototype, 'timeStyle', 2);
__decorateClass([property()], FormatDate.prototype, 'weekday', 2);
__decorateClass([property()], FormatDate.prototype, 'era', 2);
__decorateClass([property()], FormatDate.prototype, 'year', 2);
__decorateClass([property()], FormatDate.prototype, 'month', 2);
__decorateClass([property()], FormatDate.prototype, 'day', 2);
__decorateClass([property({ attribute: 'day-period' })], FormatDate.prototype, 'dayPeriod', 2);
__decorateClass([property()], FormatDate.prototype, 'hour', 2);
__decorateClass([property()], FormatDate.prototype, 'minute', 2);
__decorateClass([property()], FormatDate.prototype, 'second', 2);
__decorateClass(
  [property({ attribute: 'time-zone-name' })],
  FormatDate.prototype,
  'timeZoneName',
  2
);
__decorateClass([property({ attribute: 'time-zone' })], FormatDate.prototype, 'timeZone', 2);
__decorateClass([property({ type: Boolean })], FormatDate.prototype, 'hour12', 2);
__decorateClass(
  [property({ type: Object, attribute: 'date-time-options' })],
  FormatDate.prototype,
  'dateTimeOptions',
  2
);
__decorateClass([property()], FormatDate.prototype, 'date', 1);
//# sourceMappingURL=format-date.js.map
