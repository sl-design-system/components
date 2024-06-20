import { LocaleMixin } from '@sl-design-system/shared';
import { LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import {formatDateTime} from "./format-date-time";

declare global {
  interface HTMLElementTagNameMap {
    'sl-format-date': FormatDate;
  }
}

// export interface FormatDateOptions extends Intl.DateTimeFormatOptions {
//   locale: string;
// }
//
// export function formatDate(date: Date, options: FormatDateOptions): string {
//   const { locale, ...rest } = options;
//
//   return new Intl.DateTimeFormat(locale, rest).format(date);
// }

/**
 * A format date component for formatting date and time.
 *
 * @slot default - A place for the fallback when there is no valid date/time applied.
 */
export class FormatDate extends LocaleMixin(LitElement) {
  // TODO: extends LocaleMixin?

  #date?: Date = new Date();

  @property() era?: 'narrow' | 'short' | 'long';

  @property() year?: '2-digit' | 'numeric' = 'numeric';

  /** The format for displaying the month. */
  @property() month?: 'numeric' | '2-digit' | 'narrow' | 'short' | 'long' = '2-digit';

  /** The format for displaying the day. */
  @property() day?: 'numeric' | '2-digit' = '2-digit';

  /** The format for displaying the day periods. It only has an effect if a 12-hour clock - hour12 is set to true */
  @property() dayPeriod?: 'narrow' | 'short' | 'long'; // TODO: maybe remove this one? should be connected with hourCycle

  /** The format for displaying the weekday. */
  @property() weekday?: 'narrow' | 'short' | 'long';

  /** The format for displaying the hour. */
  @property() hour?: '2-digit' | 'numeric';

  /** The format for displaying the minute. */
  @property() minute?: 'numeric' | '2-digit';

  /** The format for displaying the second. */
  @property() second?: 'numeric' | '2-digit';

  /** The format for displaying the time. */
  @property({ attribute: 'time-zone-name' }) timeZoneName?: 'short' | 'long';

  /** The time zone to express the time in. */
  @property({ attribute: 'time-zone' }) timeZone?: string;

  // /** When set, 24 hour time will always be used. */
  // @property({ attribute: 'hour-format' }) hourFormat: 'auto' | '12' | '24' = 'auto';

  /** When set, 24 hour time will always be used. */
  @property({ type: Boolean }) hour12?: boolean | undefined;

  // TODO: month, day, dayPeriod, hour, minute, second, fractionalseconddigits??, timeZoneName, formatMatcher??, datestyle, timestyle
  // TODO; calendar, numberingSystem, hour12, hourCycle, timeZone


  set date(value: number | string | Date | undefined | null) {
    const oldVal = this.#date;
    console.log('oldVal', oldVal, 'value????',  value);

    if (value instanceof Date) {
      this.#date = value;
    } else if (typeof value === 'number' && this.#isDateValid(value)) {
      this.#date = new Date(value);
    } else if (typeof value === 'string' && this.#isDateValid(value)) {
      this.#date = new Date(value); //value;
      // this.#date = dateConverter.fromAttribute(value);
    } else {
      this.#date = undefined;
    }

    console.log('date in set date?', this.#date);

    this.requestUpdate('date', oldVal);
  }

  /** The date/time to format. If not set, the current date and time will be used. */
  @property()
  get date(): Date | undefined {
    return this.#date;
  }

  override render(): TemplateResult {
    const myOptions = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'long', locale: 'pl' } as const;
    console.log('---format date time----', formatDateTime(new Date(), this.locale ? this.locale : 'pl', myOptions));
    // Intl.DateTimeFormatOptions()
    // new Intl.DateTimeFormat(Locale)
    console.log('thiiiis.date', this.date);
    console.log('date', this.#date, 'with locales', new Intl.DateTimeFormat(), new Intl.DateTimeFormat('pl').format(this.#date));
    return html`
      ${(!this.date) ? html`<slot></slot>` : this.#formatDateTime(this.date)}
    `;
  } // ${formatDate(this.#date, {locale: 'pl'})}
  // TODO: test timezone eg. UTC
  // TODO: render check if this is a date or sth else, if not retun fallback

  // TODO hour12 undefined when not set?

  // this.dejt? ${this.date}
  // formaaat ----> ${this.date ? this.#formatDateTime(this.date) : 'no date'}

/*  hour12???  ${this.hour12}
  this.dejt? ${this.date} ${this.#formatDateTime(new Date)}
  <slot></slot>*/


/*<div class="wrapper" style="background: lightskyblue;">
    ${this.#date}
    <slot></slot>
  ${formatDate(new Date(), { locale: 'pl', weekday: 'long', timeZoneName: 'short' })}
dateStyle: ${formatDate(new Date(), { locale: 'en', dateStyle: 'long' })}
dateValid??? ${this.#isDateValid(this.#date as string)}
  22dateValid??? ${this.#isDateValid('unknown')}
    </div>
    <div style="background: lightyellow;">
      ${(!this.date || !this.#isDateValid(this.date as string))
        ? html`slooooot <slot></slot>`
        : this.date}
      ${this.#date}
      </div>
      <div style="background: lightgreen;">
        ${(!this.date)
          ? html`test<slot></slot>`
          : this.date}
        ${this.#date}
      </div>*/


  #formatDateTime(date: Date): string { // TODO: in separated file?
    const localeString = this.locale ? this.locale : 'en';
    console.log('thiiiis', this.day, this.month, this.year, this.locale);
    const { weekday, era, year, month, day, hour, minute, second, timeZoneName, timeZone } = this;
    console.log('locale', localeString);
    const hour12 = this.hour12 ? this.hour12 : undefined;
    console.log('hour12', hour12);
    return formatDateTime(date, localeString, { weekday, era, year, month, day, hour, minute, second, timeZoneName, timeZone });
  //  return date.toString();
  }

  // #isDateValid(date: string): boolean {
  //   return !isNaN(new Date(date));
  // }

  #isDateValid(date: string | number): boolean {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }
}
