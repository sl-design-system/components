export type IndicatorColor = 'blue' | 'red' | 'yellow' | 'green' | 'grey';
export type Indicator = {
  date: Date;
  color?: IndicatorColor;
  label?: string;
};
export interface Day {
  /** Whether this day is in the current month. */
  currentMonth?: boolean;
  /** The date of the day. */
  date: Date;
  /** Whether this day is disabled. */
  disabled?: boolean;
  /**
   * Whether this day is the first enabled day of the month. You cannot navigate past this day using
   * keyboard navigation.
   */
  firstActiveDayOfMonth?: boolean;
  /** Whether this day is in the future. */
  future?: boolean;
  /**
   * Whether this day has an indicator.
   *
   * @default { color: 'blue', label: undefined }
   */
  indicator?: {
    color?: IndicatorColor;
    label?: string;
  };
  /**
   * Whether this day is the last enabled day of the month. You cannot navigate past this date using
   * keyboard navigation.
   */
  lastActiveDayOfMonth?: boolean;
  /** Whether this day is in the next month. */
  nextMonth?: boolean;
  /** Whether this day is out of range (before min, after max). */
  outOfRange?: boolean;
  /** Whether this day is in the past. */
  past?: boolean;
  /** Whether this day is in the previous month. */
  previousMonth?: boolean;
  /** Whether this day is the first day of the week. */
  startOfWeek?: boolean;
  /** Whether this day is today. */
  today?: boolean;
  /** The index of the day within the week (0..6). */
  weekOrder?: number;
}
export interface Week {
  number: number;
  days: Day[];
}
export interface Month {
  short: string;
  long: string;
  value: number;
  date: Date;
  disabled?: boolean;
}
export type WeekDayNamesStyle = 'long' | 'short' | 'narrow';
export type WeekDayNames = {
  [key in WeekDayNamesStyle]: string[];
};
export interface Calendar {
  weeks: Week[];
}
/** Returns weekday names for locale */
export declare function getWeekdayNames({
  locale,
  style,
  firstDayOfWeek
}: {
  locale: Intl.LocalesArgument;
  style?: WeekDayNamesStyle;
  firstDayOfWeek: number;
}): string[];
export declare function getWeekNumber(d: Date, firstDayOfWeek: number): number;
export interface CreateCalendarOptions {
  disabledDates?: Date[];
  end?: Date;
  firstDayOfWeek: number;
  indicatorDates?: Indicator[];
  max?: Date;
  min?: Date;
  showToday?: boolean;
}
export declare function createCalendar(
  date: Date,
  { disabledDates, end, firstDayOfWeek, indicatorDates, max, min, showToday }: CreateCalendarOptions
): Calendar;
export interface CreatePeriodOptions {
  disabledDates?: Date[];
  firstDayOfWeek: number;
  indicatorDates?: Indicator[];
  max?: Date;
  min?: Date;
  showToday: boolean;
}
export declare function createPeriod(
  start: Date,
  end: Date,
  { disabledDates, firstDayOfWeek, indicatorDates, max, min, showToday }: CreatePeriodOptions
): Calendar;
export interface CreateMonthOptions {
  disabledDates?: Date[];
  firstDayOfWeek: number;
  indicatorDates?: Indicator[];
  max?: Date;
  min?: Date;
  showToday: boolean;
}
export declare function createMonth(
  date: Date,
  { disabledDates, firstDayOfWeek, indicatorDates, max, min, showToday }: CreateMonthOptions
): Calendar;
export interface CreateWeekOptions {
  disabledDates?: Date[];
  firstDayOfWeek: number;
  indicatorDates?: Indicator[];
  max?: Date;
  min?: Date;
  relativeMonth: Date;
  showToday: boolean;
}
export declare function createWeek(
  date: Date,
  {
    disabledDates,
    firstDayOfWeek,
    indicatorDates,
    max,
    min,
    relativeMonth,
    showToday
  }: CreateWeekOptions
): Week;
export interface CreateDayOptions {
  disabledDates?: Date[];
  indicatorDates?: Indicator[];
  max?: Date;
  min?: Date;
  relativeMonth: Date;
  showToday: boolean;
  startOfWeek: boolean;
  weekOrder: number;
}
export declare function createDay(
  date: Date,
  {
    disabledDates,
    indicatorDates,
    max,
    min,
    relativeMonth,
    showToday,
    startOfWeek,
    weekOrder
  }: CreateDayOptions
): Day;
export declare const indicatorConverter: {
  fromAttribute: (value: string | null) =>
    | {
        date: Date | undefined;
        color?: IndicatorColor;
        label?: string;
      }[]
    | undefined;
  toAttribute: (value?: Indicator[]) => string | undefined;
};
