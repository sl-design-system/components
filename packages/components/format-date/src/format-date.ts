import { LocaleMixin } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
// import styles from './inline-message.scss.js';
// import {Locale} from "@sl-design-system/shared/src/mixins";
// import { locale } from "@sl-design-system/shared/src/mixins/locale-mixin.js";

declare global {
  interface HTMLElementTagNameMap {
    'sl-format-date': FormatDate;
  }
}

export interface FormatDateOptions extends Intl.DateTimeFormatOptions {
  locale: string;
}

export function formatDate(date: Date, options: FormatDateOptions): string {
  const { locale, ...rest } = options;

  return new Intl.DateTimeFormat(locale, rest).format(date);
}

/**
 * A format date component for formatting date and time.
 *
 * @slot default - ...
 */
//@localized()
export class FormatDate extends LocaleMixin(LitElement) {
  // TODO: extends LocaleMixin?
  /** @internal */
  // static get scopedElements(): ScopedElementsMap {
  //   return {
  //     'sl-button': Button,
  //     'sl-icon': Icon
  //   };
  // }

  /** @internal */
 // static override styles: CSSResultGroup = styles;

  #date?: Date = new Date();

  /** The format for displaying the weekday. */
  @property() weekday?: 'narrow' | 'short' | 'long';

  @property() era?: 'narrow' | 'short' | 'long';

  @property() year?: '2-digit' | 'numeric';

  /** The format for displaying the month. */
  @property() month?: 'numeric' | '2-digit' | 'narrow' | 'short' | 'long';

  /** The format for displaying the day. */
  @property() day?: 'numeric' | '2-digit';

  /** The format for displaying the hour. */
  @property() hour?: 'numeric' | '2-digit';

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
  @property({ type: Boolean, attribute: 'hour-12' }) hour12?: boolean;

  // TODO: month, day, dayPeriod, hour, minute, second, fractionalseconddigits??, timeZoneName, formatMatcher??, datestyle, timestyle
  // TODO; calendar, numberingSystem, hour12, hourCycle, timeZone

  /** Observe the size and determine where to place the action button if present. */
  // #observer = new ResizeObserver(() => this.#onResize());

  /** Will hide the close button if set. */
  @property({ type: Boolean, reflect: true }) indismissible?: boolean;

  // /** @internal If the action is missing, we need to hide the action part. */
  // @property({ type: Boolean, attribute: 'no-action', reflect: true }) noAction = true;

  /** @internal If the title is missing, the content needs to be placed where the title should be. */
  @property({ type: Boolean, attribute: 'no-title', reflect: true }) noTitle = true;

  /** @internal Calculates the height of the title and wraps the button if longer than 1 line. */
  @property({ type: Boolean, attribute: 'wrap-action', reflect: true }) wrapAction?: boolean;

  set date(value: number | string | Date | undefined | null) {
    const oldVal = this.#date;
    console.log('oldVal', oldVal, 'value????',  value);

    if (value instanceof Date) {
      this.#date = value;
    } else if (typeof value === 'number') {
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

  // /** @internal The name of the icon, depending on the variant. */
  // get iconName(): string {
  //   switch (this.variant) {
  //     case 'success':
  //       return 'circle-check-solid';
  //     case 'warning':
  //       return 'octagon-exclamation-solid';
  //     case 'danger':
  //       return 'triangle-exclamation-solid';
  //     default:
  //       return 'info';
  //   }
  // }

  override render(): TemplateResult {
    // Intl.DateTimeFormatOptions()
    // new Intl.DateTimeFormat(Locale)
    console.log('thiiiis.date', this.date);
    console.log('date', this.#date, 'with locales', new Intl.DateTimeFormat(), new Intl.DateTimeFormat('pl').format(this.#date));
    return html`
      ${(!this.date || !this.#isDateValid(this.date)) ? html`<slot></slot>` : this.date}
      <div class="wrapper" style="background: lightskyblue;">
        ${this.#date}
        <slot></slot>
        ${formatDate(new Date(), { locale: 'pl', weekday: 'long', timeZoneName: 'short' })}
        dateStyle: ${formatDate(new Date(), { locale: 'en', dateStyle: 'long' })}
        dateValid??? ${this.#isDateValid(this.#date)}
        22dateValid??? ${this.#isDateValid('unknown')}
      </div>
      <div style="background: lightyellow;">
      ${(!this.date || !this.#isDateValid(this.date))
        ? html`slooooot <slot></slot>`
        : this.date}
        ${this.#date}
      </div>
      <div style="background: lightgreen;">
        ${(!this.date)
          ? html`test<slot></slot>`
          : this.date}
        ${this.#date}
      </div>
      this.dejt? ${this.date} ${this.#formatDateTime(new Date)}
      <slot></slot>
    `;
  } // ${formatDate(this.#date, {locale: 'pl'})}
  // TODO: test timezone eg. UTC
  // TODO: render check if this is a date or sth else, if not retun fallback

  // TODO hour12 undefined when not set?

  #formatDateTime(date: Date): string { // TODO: in separated file?
    const hour12 = this.hour12 ? this.hour12 : undefined;
    console.log('hour12', hour12);
    return date.toString();
  }

  // #isDateValid(date: string): boolean {
  //   return !isNaN(new Date(date));
  // }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
  #isDateValid(date: any): boolean { // TODO: change any to sth else
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }

  // #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
  //   this.noAction = !event.target.assignedElements({ flatten: true }).length;
  // }
}
