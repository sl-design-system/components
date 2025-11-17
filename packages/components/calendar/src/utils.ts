import { dateConverter } from '@sl-design-system/shared/converters.js';

export type IndicatorColor = 'blue' | 'red' | 'yellow' | 'green' | 'grey';

export type Indicator = { date: Date; color?: IndicatorColor; label?: string };

export interface Day {
  /** Whether this day is in the current month. */
  currentMonth?: boolean;

  /** The date of the day. */
  date: Date;

  /** Whether this day is disabled. */
  disabled?: boolean;

  /**
   * Whether this day is the first enabled day of the month. You cannot navigate
   * past this day using keyboard navigation.
   */
  firstActiveDayOfMonth?: boolean;

  /** Whether this day is in the future. */
  future?: boolean;

  /** Whether this day has an indicator. */
  indicator?: { color?: IndicatorColor; label?: string };

  /**
   * Whether this day is the last enabled day of the month. You cannot navigate
   * past this date using keyboard navigation.
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

const weekdayNamesCache: Record<string, WeekDayNames> = {};

/**
 * Returns cached weekday names for locale for all styles ('long', 'short', 'narrow')
 */
function getCachedWeekdayNames(locale: string): WeekDayNames {
  const cachedWeekdayNames = weekdayNamesCache[locale];

  if (cachedWeekdayNames) {
    return cachedWeekdayNames;
  }

  weekdayNamesCache[locale] = {
    long: [],
    short: [],
    narrow: []
  };

  let weekdays: string[] = [];
  (['long', 'short', 'narrow'] as WeekDayNamesStyle[]).forEach(style => {
    weekdays = weekdayNamesCache[locale][style];

    const formatter = new Intl.DateTimeFormat(locale, { weekday: style }),
      date = new Date('2019/04/07'); // start from Sunday

    for (let i = 0; i < 7; i += 1) {
      weekdays.push(formatter.format(date));
      date.setDate(date.getDate() + 1);
    }
  });

  return weekdayNamesCache[locale];
}

/**
 * Returns weekday names for locale
 */
export function getWeekdayNames({
  locale,
  style = 'long',
  firstDayOfWeek = 0
}: {
  locale: Intl.LocalesArgument;
  style?: WeekDayNamesStyle;
  firstDayOfWeek: number;
}): string[] {
  const weekdays = getCachedWeekdayNames(locale?.toString() ?? 'default')[style],
    orderedWeekdays = [];

  for (let i = firstDayOfWeek; i < firstDayOfWeek + 7; i += 1) {
    orderedWeekdays.push(weekdays[i % 7]);
  }

  return orderedWeekdays;
}

// Code based on https://weeknumber.com/how-to/javascript
export function getWeekNumber(d: Date, firstDayOfWeek: number): number {
  const date = new Date(d.getTime());
  date.setHours(0, 0, 0, 0);

  // Use monday when calculating the week number
  if (firstDayOfWeek === 0) {
    date.setDate(date.getDate() + 1);
  }

  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));

  // January 4 is always in week 1.
  const week1 = new Date(date.getFullYear(), 0, 4);

  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
}

export function isSameDate(day1?: Date, day2?: Date): boolean {
  return (
    day1 instanceof Date &&
    day2 instanceof Date &&
    day1.getDate() === day2.getDate() &&
    day1.getMonth() === day2.getMonth() &&
    day1.getFullYear() === day2.getFullYear()
  );
}

export function isDateInList(date: Date, list?: Date[] | string): boolean {
  if (!list) {
    return false;
  }

  if (typeof list === 'string') {
    list = list.split(',').map(item => new Date(item));
  }

  return list.some(item => isSameDate(item, date));
}

export function normalizeDateTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export interface CreateCalendarOptions {
  disabledDates?: Date[];
  end?: Date;
  firstDayOfWeek?: number;
  indicatorDates?: Indicator[];
  max?: Date;
  min?: Date;
  showToday?: boolean;
}

export function createCalendar(
  date: Date,
  { disabledDates, end, firstDayOfWeek = 0, indicatorDates, max, min, showToday = false }: CreateCalendarOptions
): Calendar {
  const weekOptions = { disabledDates, firstDayOfWeek, indicatorDates, max, min, showToday };

  return end ? createPeriod(date, end, weekOptions) : createMonth(date, weekOptions);
}

export interface CreatePeriodOptions {
  disabledDates?: Date[];
  firstDayOfWeek: number;
  indicatorDates?: Indicator[];
  max?: Date;
  min?: Date;
  showToday: boolean;
}

export function createPeriod(
  start: Date,
  end: Date,
  { disabledDates, firstDayOfWeek, indicatorDates, max, min, showToday }: CreatePeriodOptions
): Calendar {
  const calendar: Calendar = { weeks: [] },
    weekOptions = { disabledDates, firstDayOfWeek, indicatorDates, max, min, relativeMonth: start, showToday };

  let nextWeek = createWeek(start, weekOptions);
  do {
    calendar.weeks.push(nextWeek);
    const firstDayOfNextWeek = new Date(nextWeek.days[6].date); // last day of current week
    firstDayOfNextWeek.setDate(firstDayOfNextWeek.getDate() + 1); // make it first day of next week
    nextWeek = createWeek(firstDayOfNextWeek, weekOptions);
  } while (nextWeek.days[0].date <= end);

  // Mark the first and last selectable days in the period
  const allDays = calendar.weeks.flatMap(week => week.days);
  const selectableDays = allDays.filter(day => !day.disabled && !day.outOfRange);

  if (selectableDays.length > 0) {
    selectableDays[0].firstActiveDayOfMonth = true;
    selectableDays[selectableDays.length - 1].lastActiveDayOfMonth = true;
  }

  return calendar;
}

export interface CreateMonthOptions {
  disabledDates?: Date[];
  firstDayOfWeek: number;
  indicatorDates?: Indicator[];
  max?: Date;
  min?: Date;
  showToday: boolean;
}

export function createMonth(
  date: Date,
  { disabledDates, firstDayOfWeek, indicatorDates, max, min, showToday }: CreateMonthOptions
): Calendar {
  const firstDayOfMonth = new Date(date);
  firstDayOfMonth.setDate(1);
  const monthNumber = firstDayOfMonth.getMonth();
  const weekOptions = {
    disabledDates,
    firstDayOfWeek,
    indicatorDates,
    max,
    min,
    relativeMonth: firstDayOfMonth,
    showToday
  };

  const month: Calendar = { weeks: [] };

  let nextWeek = createWeek(firstDayOfMonth, weekOptions);
  do {
    month.weeks.push(nextWeek);
    const firstDayOfNextWeek = new Date(nextWeek.days[6].date); // last day of current week
    firstDayOfNextWeek.setDate(firstDayOfNextWeek.getDate() + 1); // make it first day of next week
    nextWeek = createWeek(firstDayOfNextWeek, weekOptions);
  } while (nextWeek.days[0].date.getMonth() === monthNumber);

  // Find and mark the first and last active (selectable) days of the current month
  const currentMonthDays = month.weeks
    .flatMap(week => week.days)
    .filter(day => day.currentMonth && !day.disabled && !day.outOfRange);

  if (currentMonthDays.length > 0) {
    currentMonthDays[0].firstActiveDayOfMonth = true;
    currentMonthDays[currentMonthDays.length - 1].lastActiveDayOfMonth = true;
  }

  return month;
}

export interface CreateWeekOptions {
  disabledDates?: Date[];
  firstDayOfWeek: number;
  indicatorDates?: Indicator[];
  max?: Date;
  min?: Date;
  relativeMonth: Date;
  showToday: boolean;
}

export function createWeek(
  date: Date,
  { disabledDates, firstDayOfWeek, indicatorDates, max, min, relativeMonth, showToday }: CreateWeekOptions
): Week {
  let weekStartDate = new Date(date);

  const tmpDate = new Date(date);
  while (tmpDate.getDay() !== firstDayOfWeek) {
    tmpDate.setDate(tmpDate.getDate() - 1);
    weekStartDate = new Date(tmpDate);
  }

  const week: Week = { number: getWeekNumber(weekStartDate, firstDayOfWeek), days: [] };
  for (let i = 0; i < 7; i += 1) {
    if (i !== 0) {
      weekStartDate.setDate(weekStartDate.getDate() + 1);
    }

    week.days.push(
      createDay(new Date(weekStartDate), {
        disabledDates,
        indicatorDates,
        max,
        min,
        relativeMonth,
        showToday,
        startOfWeek: i === 0,
        weekOrder: i
      })
    );
  }
  return week;
}

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

export function createDay(
  date: Date,
  { disabledDates, indicatorDates, max, min, relativeMonth, showToday, startOfWeek, weekOrder }: CreateDayOptions
): Day {
  const today = normalizeDateTime(new Date()),
    indicator = indicatorDates?.find(i => isSameDate(i.date, date)),
    currentMonth = relativeMonth.getMonth(),
    isToday = showToday && isSameDate(date, today);

  return {
    currentMonth: date.getMonth() === currentMonth,
    date,
    disabled: isDateInList(date, disabledDates),
    future: date > today,
    indicator: indicator ? { color: indicator.color, label: indicator.label } : undefined,
    nextMonth: date.getMonth() > currentMonth,
    outOfRange: (min && date < min) || (max && date > max),
    past: date < today,
    previousMonth: date.getMonth() < currentMonth,
    startOfWeek,
    today: isToday,
    weekOrder
  };
}

export const indicatorConverter = {
  fromAttribute: (value: string | null) =>
    value
      ? (JSON.parse(value) as Array<{ date: string; color?: IndicatorColor; label?: string }>).map(i => ({
          ...i,
          date: dateConverter.fromAttribute?.(i.date)
        }))
      : undefined,
  toAttribute: (value?: Indicator[]) =>
    value
      ? JSON.stringify(
          value.map(i => ({
            ...i,
            date: dateConverter.toAttribute?.(i.date)
          }))
        )
      : undefined
};
