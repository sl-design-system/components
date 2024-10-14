export interface Day {
  ariaCurrent?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false';
  ariaPressed?: 'true' | 'false' | 'mixed';
  autosuggest?: boolean;
  central?: boolean;
  currentMonth?: boolean;
  date: Date;
  disabled?: boolean;
  focused?: boolean;
  future?: boolean;
  highlight?: boolean;
  nextMonth?: boolean;
  past?: boolean;
  previousMonth?: boolean;
  range?: boolean;
  selected?: boolean;
  startOfWeek?: boolean;
  tabindex?: string;
  today?: boolean;
  weekOrder?: number;
}

export interface Week {
  number: number;
  days: Day[];
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

export function normalizeDateTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export interface CreateCalendarOptions {
  end?: Date;
  firstDayOfWeek?: number;
  showToday?: boolean;
}

export function createCalendar(
  date: Date,
  { end, firstDayOfWeek = 0, showToday = false }: CreateCalendarOptions
): Calendar {
  const weekOptions = { firstDayOfWeek, showToday };

  return end ? createPeriod(date, end, weekOptions) : createMonth(date, weekOptions);
}

export interface CreatePeriodOptions {
  firstDayOfWeek: number;
  showToday: boolean;
}

export function createPeriod(start: Date, end: Date, { firstDayOfWeek, showToday }: CreatePeriodOptions): Calendar {
  const calendar: Calendar = { weeks: [] },
    weekOptions = { firstDayOfWeek, relativeMonth: start, showToday };

  let nextWeek = createWeek(start, weekOptions);
  do {
    calendar.weeks.push(nextWeek);
    const firstDayOfNextWeek = new Date(nextWeek.days[6].date); // last day of current week
    firstDayOfNextWeek.setDate(firstDayOfNextWeek.getDate() + 1); // make it first day of next week
    nextWeek = createWeek(firstDayOfNextWeek, weekOptions);
  } while (nextWeek.days[0].date <= end);

  return calendar;
}

export interface CreateMonthOptions {
  firstDayOfWeek: number;
  showToday: boolean;
}

export function createMonth(date: Date, { firstDayOfWeek, showToday }: CreateMonthOptions): Calendar {
  const firstDayOfMonth = new Date(date);
  firstDayOfMonth.setDate(1);
  const monthNumber = firstDayOfMonth.getMonth();
  const weekOptions = { firstDayOfWeek, relativeMonth: firstDayOfMonth, showToday };

  const month: Calendar = { weeks: [] };

  let nextWeek = createWeek(firstDayOfMonth, weekOptions);
  do {
    month.weeks.push(nextWeek);
    const firstDayOfNextWeek = new Date(nextWeek.days[6].date); // last day of current week
    firstDayOfNextWeek.setDate(firstDayOfNextWeek.getDate() + 1); // make it first day of next week
    nextWeek = createWeek(firstDayOfNextWeek, weekOptions);
  } while (nextWeek.days[0].date.getMonth() === monthNumber);

  return month;
}

export interface CreateWeekOptions {
  firstDayOfWeek: number;
  relativeMonth: Date;
  showToday: boolean;
}

export function createWeek(date: Date, { firstDayOfWeek, relativeMonth, showToday }: CreateWeekOptions): Week {
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
        relativeMonth,
        weekOrder: i,
        showToday,
        startOfWeek: i === 0
      })
    );
  }
  return week;
}

export interface CreateDayOptions {
  relativeMonth: Date;
  showToday: boolean;
  startOfWeek: boolean;
  weekOrder: number;
}

export function createDay(date: Date, { relativeMonth, showToday, startOfWeek, weekOrder }: CreateDayOptions): Day {
  const today = normalizeDateTime(new Date()),
    currentMonth = relativeMonth.getMonth(),
    isToday = showToday && isSameDate(date, today);

  return {
    ariaCurrent: isToday ? 'date' : undefined,
    currentMonth: date.getMonth() === currentMonth,
    date,
    future: date > today,
    nextMonth: date.getMonth() > currentMonth,
    past: date < today,
    previousMonth: date.getMonth() < currentMonth,
    startOfWeek,
    tabindex: '-1',
    today: isToday,
    weekOrder
  };
}
