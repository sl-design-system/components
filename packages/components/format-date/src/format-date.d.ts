import { LitElement, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-format-date': FormatDate;
  }
}
declare const FormatDate_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<import('@sl-design-system/shared/mixins.js').Locale>;
/**
 * A format date component for formatting date and time.
 *
 * @slot default - A place for the fallback when there is no valid date/time applied.
 */
export declare class FormatDate extends FormatDate_base {
  #private;
  /**
   * The date style format. The `dateStyle` and `timeStyle` can be used with each other, but not
   * with other date-time component options (e.g. weekday, hour, month, etc.).
   *
   * By changing this static property you can change the default value for all future instances of
   * the component with dateStyle usage. Changing the static property won't affect already created
   * instances.
   */
  static dateStyle: Intl.DateTimeFormatOptions['dateStyle'];
  /**
   * The time style format. The `dateStyle` and `timeStyle` can be used with each other, but not
   * with other date-time component options (e.g. weekday, hour, month, etc.).
   *
   * By changing this static property you can change the default value for all future instances of
   * the component with timeStyle usage. Changing the static property won't affect already created
   * instances.
   */
  static timeStyle: Intl.DateTimeFormatOptions['timeStyle'];
  /**
   * The date style format.
   *
   * If you want to change the default value for all future instances of the component, you can
   * change the static property. If you want to change the property of an already created instance,
   * you need to change this property.
   *
   * The `dateStyle` and `timeStyle` can be used with each other, but not with other date-time
   * component options (e.g. weekday, hour, month, etc.). If you set other options than
   * dateStyle/timeStyle like `weekday`, `hour` etc. dateStyle/timeStyle will not be used to format
   * your date/time. The dateStyle/timeStyle will be overwritten in that case by your other
   * properties.
   */
  dateStyle?: Intl.DateTimeFormatOptions['dateStyle'];
  /**
   * The time style format.
   *
   * If you want to change the default value for all future instances of the component, you can
   * change the static property. If you want to change the property of an already created instance,
   * you need to change this property.
   *
   * The `dateStyle` and `timeStyle` can be used with each other, but not with other date-time
   * component options (e.g. weekday, hour, month, etc.). If you set other options than
   * dateStyle/timeStyle like `weekday`, `hour` etc. dateStyle/timeStyle will not be used to format
   * your date/time. The dateStyle/timeStyle will be overwritten in that case by your other
   * properties.
   */
  timeStyle?: Intl.DateTimeFormatOptions['timeStyle'];
  /** The format for displaying the weekday. */
  weekday?: Intl.DateTimeFormatOptions['weekday'];
  /** The format for displaying the era (eg. 'long' -> `Anno Domini`). */
  era?: Intl.DateTimeFormatOptions['era'];
  /**
   * The format for displaying the year. Default to `numeric` when all properties are `undefined`,
   * including dateStyle and timeStyle.
   */
  year?: Intl.DateTimeFormatOptions['year'];
  /**
   * The format for displaying the month. Default to `numeric` when all properties are `undefined`,
   * including dateStyle and timeStyle.
   */
  month?: Intl.DateTimeFormatOptions['month'];
  /**
   * The format for displaying the day. Default to `numeric` when all properties are `undefined`,
   * including dateStyle and timeStyle.
   */
  day?: Intl.DateTimeFormatOptions['day'];
  /**
   * The format for displaying the day periods. It only has an effect if a 12-hour clock - hour12 is
   * set to true
   */
  dayPeriod?: Intl.DateTimeFormatOptions['dayPeriod'];
  /** The format for displaying the hour. */
  hour?: Intl.DateTimeFormatOptions['hour'];
  /** The format for displaying the minute. */
  minute?: Intl.DateTimeFormatOptions['minute'];
  /** The format for displaying the second. */
  second?: Intl.DateTimeFormatOptions['second'];
  /** The format for displaying the time. */
  timeZoneName?: Intl.DateTimeFormatOptions['timeZoneName'];
  /** The time zone to express the time in. The default is the runtime's default time zone. */
  timeZone?: Intl.DateTimeFormatOptions['timeZone'];
  /**
   * Whether to use 12-hour time or not (when `false` is set 24-hour time is used). The default is
   * locale dependent.
   */
  hour12?: Intl.DateTimeFormatOptions['hour12'];
  /**
   * Use this property if you need access to advanced formatting options not provided via properties
   * of this component.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
   */
  dateTimeOptions?: Intl.DateTimeFormatOptions;
  /** The date/time to format. If not set, the slotted content will be shown. */
  set date(value: number | string | Date | undefined | null);
  get date(): Date | undefined;
  render(): TemplateResult;
}
export {};
