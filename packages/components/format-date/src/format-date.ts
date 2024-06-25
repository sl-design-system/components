import { LocaleMixin } from '@sl-design-system/shared/mixins.js';
import { LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { format } from './format';

declare global {
  interface HTMLElementTagNameMap {
    'sl-format-date': FormatDate;
  }
}

/**
 * A format date component for formatting date and time.
 *
 *
 * @slot default - A place for the fallback when there is no valid date/time applied.
 */
export class FormatDate extends LocaleMixin(LitElement) {
  /**
   * The date style format. The `dateStyle` and `timeStyle` can be used with each other, but not with other date-time component options (e.g. weekday, hour, month, etc.).
   *
   * By changing this static property you can change the default value for all future instances of the component with dateStyle usage.
   * Changing the static property won't affect already created instances.
   */
  static dateStyle: Intl.DateTimeFormatOptions['dateStyle'] = 'long';

  /**
   * The time style format. The `dateStyle` and `timeStyle` can be used with each other, but not with other date-time component options (e.g. weekday, hour, month, etc.).
   *
   * By changing this static property you can change the default value for all future instances of the component with timeStyle usage.
   * Changing the static property won't affect already created instances.
   */
  static timeStyle: Intl.DateTimeFormatOptions['timeStyle'] = 'medium';

  #date?: Date;

  /**
   * The date style format.
   *
   * If you want to change the default value for all future instances of the component, you can change the static property.
   * If you want to change the property of an already created instance, you need to change this property.
   *
   * The `dateStyle` and `timeStyle` can be used with each other, but not with other date-time component options (e.g. weekday, hour, month, etc.).
   * If you set other options than dateStyle/timeStyle like `weekday`, `hour` etc. dateStyle/timeStyle will not be used to format your date/time.
   * The dateStyle/timeStyle will be overwritten in that case by your other properties.
   */
  @property({ attribute: 'date-style' }) dateStyle?: Intl.DateTimeFormatOptions['dateStyle'];

  /**
   * The time style format.
   *
   * If you want to change the default value for all future instances of the component, you can change the static property.
   * If you want to change the property of an already created instance, you need to change this property.
   *
   * The `dateStyle` and `timeStyle` can be used with each other, but not with other date-time component options (e.g. weekday, hour, month, etc.).
   * If you set other options than dateStyle/timeStyle like `weekday`, `hour` etc. dateStyle/timeStyle will not be used to format your date/time.
   * The dateStyle/timeStyle will be overwritten in that case by your other properties.
   */
  @property({ attribute: 'time-style' }) timeStyle?: Intl.DateTimeFormatOptions['timeStyle'];

  /** The format for displaying the weekday. */
  @property() weekday?: Intl.DateTimeFormatOptions['weekday'];

  /** The format for displaying the era (eg. 'long' -> `Anno Domini`). */
  @property() era?: Intl.DateTimeFormatOptions['era'];

  /** The format for displaying the year. Default to `numeric` when all properties are `undefined`, including dateStyle and timeStyle. */
  @property() year?: Intl.DateTimeFormatOptions['year'];

  /** The format for displaying the month. Default to `numeric` when all properties are `undefined`, including dateStyle and timeStyle. */
  @property() month?: Intl.DateTimeFormatOptions['month'];

  /** The format for displaying the day. Default to `numeric` when all properties are `undefined`, including dateStyle and timeStyle. */
  @property() day?: Intl.DateTimeFormatOptions['day'];

  /** The format for displaying the day periods. It only has an effect if a 12-hour clock - hour12 is set to true */
  @property({ attribute: 'day-period' }) dayPeriod?: Intl.DateTimeFormatOptions['dayPeriod'];

  /** The format for displaying the hour. */
  @property() hour?: Intl.DateTimeFormatOptions['hour'];

  /** The format for displaying the minute. */
  @property() minute?: Intl.DateTimeFormatOptions['minute'];

  /** The format for displaying the second. */
  @property() second?: Intl.DateTimeFormatOptions['second'];

  /** The format for displaying the time. */
  @property({ attribute: 'time-zone-name' }) timeZoneName?: Intl.DateTimeFormatOptions['timeZoneName'];

  /** The time zone to express the time in. The default is the runtime's default time zone. */
  @property({ attribute: 'time-zone' }) timeZone?: Intl.DateTimeFormatOptions['timeZone'];

  /** Whether to use 12-hour time or not (when `false` is set 24-hour time is used). The default is locale dependent. */
  @property({ type: Boolean }) hour12?: Intl.DateTimeFormatOptions['hour12'];

  /**
   * Use this property if you need access to advanced formatting options not provided via properties of this component.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
   */
  @property({ type: Object, attribute: 'date-time-options' }) dateTimeOptions?: Intl.DateTimeFormatOptions;

  /** The date/time to format. If not set, the slotted content will be shown. */
  @property()
  set date(value: number | string | Date | undefined | null) {
    if (value instanceof Date) {
      this.#date = value;
    } else if (typeof value === 'number' && this.#isDateValid(value)) {
      this.#date = new Date(value);
    } else if (typeof value === 'string' && this.#isDateValid(value)) {
      this.#date = new Date(value);
    } else {
      this.#date = undefined;
    }
  }

  get date(): Date | undefined {
    return this.#date;
  }

  override render(): TemplateResult {
    return html` ${!this.date ? html`<slot></slot>` : this.#formatDateTime(this.date)} `;
  }

  #formatDateTime(date: Date): string {
    const localeString = this.locale ? this.locale : 'en',
      {
        dateStyle,
        timeStyle,
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
      } = this,
      predefinedStyles = { dateStyle, timeStyle },
      options = { weekday, era, year, month, day, dayPeriod, hour, minute, second, timeZoneName, timeZone, hour12 },
      formatOptions = Object.values(options).every(value => value === undefined) ? predefinedStyles : options;

    return format(date, localeString, { ...formatOptions, ...this.dateTimeOptions });
  }

  #isDateValid(date: string | number): boolean {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }
}
