import { dateConverter } from '@sl-design-system/shared/converters.js';
import { isDateInList, isSameDate, normalizeDateTime } from '@sl-design-system/shared/date.js';
const weekdayNamesCache = {};
function getCachedWeekdayNames(locale) {
  const cachedWeekdayNames = weekdayNamesCache[locale];
  if (cachedWeekdayNames) {
    return cachedWeekdayNames;
  }
  weekdayNamesCache[locale] = {
    long: [],
    short: [],
    narrow: []
  };
  let weekdays = [];
  ['long', 'short', 'narrow'].forEach(style => {
    weekdays = weekdayNamesCache[locale][style];
    const formatter = new Intl.DateTimeFormat(locale, { weekday: style }),
      date = /* @__PURE__ */ new Date('2019/04/07');
    for (let i = 0; i < 7; i += 1) {
      weekdays.push(formatter.format(date));
      date.setDate(date.getDate() + 1);
    }
  });
  return weekdayNamesCache[locale];
}
export function getWeekdayNames({ locale, style = 'long', firstDayOfWeek = 0 }) {
  const weekdays = getCachedWeekdayNames(locale?.toString() ?? 'default')[style],
    orderedWeekdays = [];
  for (let i = firstDayOfWeek; i < firstDayOfWeek + 7; i += 1) {
    orderedWeekdays.push(weekdays[i % 7]);
  }
  return orderedWeekdays;
}
export function getWeekNumber(d, firstDayOfWeek) {
  const date = new Date(d.getTime());
  date.setHours(0, 0, 0, 0);
  if (firstDayOfWeek === 0) {
    date.setDate(date.getDate() + 1);
  }
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  const week1 = new Date(date.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(((date.getTime() - week1.getTime()) / 864e5 - 3 + ((week1.getDay() + 6) % 7)) / 7)
  );
}
export function createCalendar(
  date,
  { disabledDates, end, firstDayOfWeek, indicatorDates, max, min, showToday = false }
) {
  const weekOptions = { disabledDates, firstDayOfWeek, indicatorDates, max, min, showToday };
  return end ? createPeriod(date, end, weekOptions) : createMonth(date, weekOptions);
}
export function createPeriod(
  start,
  end,
  { disabledDates, firstDayOfWeek, indicatorDates, max, min, showToday }
) {
  const calendar = { weeks: [] },
    weekOptions = {
      disabledDates,
      firstDayOfWeek,
      indicatorDates,
      max,
      min,
      relativeMonth: start,
      showToday
    };
  let nextWeek = createWeek(start, weekOptions);
  do {
    calendar.weeks.push(nextWeek);
    const firstDayOfNextWeek = new Date(nextWeek.days[6].date);
    firstDayOfNextWeek.setDate(firstDayOfNextWeek.getDate() + 1);
    nextWeek = createWeek(firstDayOfNextWeek, weekOptions);
  } while (nextWeek.days[0].date <= end);
  const allDays = calendar.weeks.flatMap(week => week.days),
    selectableDays = allDays.filter(day => !day.disabled && !day.outOfRange);
  if (selectableDays.length > 0) {
    selectableDays[0].firstActiveDayOfMonth = true;
    selectableDays[selectableDays.length - 1].lastActiveDayOfMonth = true;
  }
  return calendar;
}
export function createMonth(
  date,
  { disabledDates, firstDayOfWeek, indicatorDates, max, min, showToday }
) {
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
  const month = { weeks: [] };
  let nextWeek = createWeek(firstDayOfMonth, weekOptions);
  do {
    month.weeks.push(nextWeek);
    const firstDayOfNextWeek = new Date(nextWeek.days[6].date);
    firstDayOfNextWeek.setDate(firstDayOfNextWeek.getDate() + 1);
    nextWeek = createWeek(firstDayOfNextWeek, weekOptions);
  } while (nextWeek.days[0].date.getMonth() === monthNumber);
  while (month.weeks.length < 6) {
    const firstDayOfNextWeek = new Date(month.weeks[month.weeks.length - 1].days[6].date);
    firstDayOfNextWeek.setDate(firstDayOfNextWeek.getDate() + 1);
    month.weeks.push(createWeek(firstDayOfNextWeek, weekOptions));
  }
  const currentMonthDays = month.weeks
    .flatMap(week => week.days)
    .filter(day => day.currentMonth && !day.disabled && !day.outOfRange);
  if (currentMonthDays.length > 0) {
    currentMonthDays[0].firstActiveDayOfMonth = true;
    currentMonthDays[currentMonthDays.length - 1].lastActiveDayOfMonth = true;
  }
  return month;
}
export function createWeek(
  date,
  { disabledDates, firstDayOfWeek, indicatorDates, max, min, relativeMonth, showToday }
) {
  let weekStartDate = new Date(date);
  const tmpDate = new Date(date);
  while (tmpDate.getDay() !== firstDayOfWeek) {
    tmpDate.setDate(tmpDate.getDate() - 1);
    weekStartDate = new Date(tmpDate);
  }
  const week = { number: getWeekNumber(weekStartDate, firstDayOfWeek), days: [] };
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
export function createDay(
  date,
  { disabledDates, indicatorDates, max, min, relativeMonth, showToday, startOfWeek, weekOrder }
) {
  const today = normalizeDateTime(/* @__PURE__ */ new Date()),
    indicator = indicatorDates?.find(i => isSameDate(i.date, date)),
    currentMonth = relativeMonth.getMonth(),
    isToday = showToday && isSameDate(date, today);
  return {
    currentMonth: date.getMonth() === currentMonth,
    date,
    disabled: isDateInList(date, disabledDates),
    future: date > today,
    indicator: indicator ? { color: indicator.color, label: indicator.label } : void 0,
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
  fromAttribute: value =>
    value
      ? JSON.parse(value).map(i => ({
          ...i,
          date: dateConverter.fromAttribute?.(i.date)
        }))
      : void 0,
  toAttribute: value =>
    value
      ? JSON.stringify(
          value.map(i => ({
            ...i,
            date: dateConverter.toAttribute?.(i.date)
          }))
        )
      : void 0
};
//# sourceMappingURL=utils.js.map
