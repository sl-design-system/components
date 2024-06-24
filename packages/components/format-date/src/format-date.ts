import { LocaleMixin } from '@sl-design-system/shared';
import { LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { formatDateTime } from './format-date-time';

declare global {
  interface HTMLElementTagNameMap {
    'sl-format-date': FormatDate;
  }
}

/**
 * A format date component for formatting date and time.
 *
 * @slot default - A place for the fallback when there is no valid date/time applied.
 */
export class FormatDate extends LocaleMixin(LitElement) {
  #date?: Date = new Date();

  /** The format for displaying the weekday. */
  @property() weekday?: Intl.DateTimeFormatOptions['weekday'];

  /** The format for displaying the era (eg. 'long' -> `Anno Domini`). */
  @property() era?: Intl.DateTimeFormatOptions['era'];

  /** The format for displaying the year. Default to `numeric` when all properties are `undefined`. */
  @property() year?: Intl.DateTimeFormatOptions['year'];

  /** The format for displaying the month. Default to `numeric` when all properties are `undefined`. */
  @property() month?: Intl.DateTimeFormatOptions['month'];

  /** The format for displaying the day. Default to `numeric` when all properties are `undefined`. */
  @property() day?: Intl.DateTimeFormatOptions['day'];

  /** The format for displaying the day periods. It only has an effect if a 12-hour clock - hour12 is set to true */
  @property() dayPeriod?: Intl.DateTimeFormatOptions['dayPeriod'];

  /** The format for displaying the hour. */
  @property() hour?: Intl.DateTimeFormatOptions['hour'];

  /** The format for displaying the minute. */
  @property() minute?: Intl.DateTimeFormatOptions['minute'];

  /** The format for displaying the second. */
  @property() second?: Intl.DateTimeFormatOptions['second'];

  /** The format for displaying the time. */
  @property() timeZoneName?: Intl.DateTimeFormatOptions['timeZoneName'];

  /** The time zone to express the time in. The default is the runtime's default time zone. */
  @property() timeZone?: Intl.DateTimeFormatOptions['timeZone'];

  /** Whether to use 12-hour time or not (when `false` is set 24-hour time is used). The default is locale dependent. */
  @property({ type: Boolean }) hour12?: Intl.DateTimeFormatOptions['hour12'];

  /**
   * Use this property if you need access to advanced formatting options not provided via properties of this component.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
   */
  @property({ type: Object, attribute: 'date-time-options' }) dateTimeOptions?: Intl.DateTimeFormatOptions;

  set date(value: number | string | Date | undefined | null) {
    const oldValue = this.#date;
    console.log('oldVal', oldValue, 'value????', value);

    if (value instanceof Date) {
      this.#date = value;
    } else if (typeof value === 'number' && this.#isDateValid(value)) {
      this.#date = new Date(value);
    } else if (typeof value === 'string' && this.#isDateValid(value)) {
      this.#date = new Date(value);
    } else {
      this.#date = undefined;
    }

    console.log('date in set date?', this.#date);

    this.requestUpdate('date', oldValue);
  }

  /** The date/time to format. If not set, the current date and time will be used. */
  @property()
  get date(): Date | undefined {
    return this.#date;
  }

  override render(): TemplateResult {
    const myOptions = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'long', locale: 'pl' } as const;
    console.log('---format date time----', formatDateTime(new Date(), this.locale ? this.locale : 'pl', myOptions));
    console.log('thiiiis.date', this.date);
    console.log(
      'date',
      this.#date,
      'with locales',
      new Intl.DateTimeFormat(),
      new Intl.DateTimeFormat('pl').format(this.#date)
    );
    return html` ${!this.date ? html`<slot></slot>` : this.#formatDateTime(this.date)} `;
  }

  #formatDateTime(date: Date): string {
    // TODO: in separated file?
    const localeString = this.locale ? this.locale : 'en';
    const { weekday, era, year, month, day, dayPeriod, hour, minute, second, timeZoneName, timeZone, hour12 } = this;
    console.log('locale', localeString);
    const options = {
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
    };
    console.log('hour12', hour12, formatDateTime(date, localeString, { ...options, ...this.dateTimeOptions }));
    return formatDateTime(date, localeString, { ...options, ...this.dateTimeOptions });
  }

  #isDateValid(date: string | number): boolean {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }
}
