const DurationFormat = Intl.DurationFormat;
const dateFormatCache = {},
  dateUnitCache = {};
export function getDateFormat(locale, date) {
  if (!date && dateFormatCache[locale]) {
    return dateFormatCache[locale];
  }
  const intlParts = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).formatToParts(date ?? /* @__PURE__ */ new Date());
  let index = 0;
  const parts = intlParts.map(part => {
    const start = index,
      end = index + part.value.length;
    index = end;
    return { ...part, start, end };
  });
  if (!date) {
    dateFormatCache[locale] = parts;
  }
  return parts;
}
export function getDateUnitName(locale, unit) {
  let name = unit;
  try {
    if (typeof DurationFormat === 'function') {
      const pluralUnit = `${unit}s`,
        df = new DurationFormat(locale, { style: 'long' }),
        part = df.formatToParts({ [pluralUnit]: 1 }).find(p => p.type === 'unit');
      name = part?.value ?? unit;
    }
  } catch {
    name = unit;
  }
  return name.charAt(0).toUpperCase() + name.slice(1);
}
function getDateUnitLetters(locale) {
  if (dateUnitCache[locale]) {
    return dateUnitCache[locale];
  }
  const units = {
    days: getDateUnitName(locale, 'day').charAt(0),
    months: getDateUnitName(locale, 'month').charAt(0),
    years: getDateUnitName(locale, 'year').charAt(0)
  };
  dateUnitCache[locale] = units;
  return units;
}
export function getDateUnitLetter(locale, unit) {
  const units = getDateUnitLetters(locale);
  return units[`${unit}s`] ?? unit.charAt(0).toUpperCase();
}
export function getDateTemplate(locale) {
  const parts = getDateFormat(locale),
    units = getDateUnitLetters(locale);
  return parts
    .map(part => {
      switch (part.type) {
        case 'day':
          return units.days.repeat(part.value.length);
        case 'month':
          return units.months.repeat(part.value.length);
        case 'year':
          return units.years.repeat(part.value.length);
        default:
          return part.value;
      }
    })
    .join('');
}
export function getMonthName(locale, month) {
  const date = new Date(2e3, month - 1, 1);
  return new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
}
export function parseDateString(text, locale) {
  const isoMatch = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(text);
  if (isoMatch) {
    const [, yearStr, monthStr, dayStr] = isoMatch,
      year = parseInt(yearStr, 10),
      month = parseInt(monthStr, 10),
      day = parseInt(dayStr, 10),
      date = new Date(year, month - 1, day);
    if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
      return date;
    }
  }
  const parts = getDateFormat(locale),
    dateParts = parts.filter(p => p.type !== 'literal'),
    separators = parts.filter(p => p.type === 'literal').map(p => p.value),
    separatorPattern = separators.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
    segments = text.split(new RegExp(separatorPattern));
  if (segments.length === dateParts.length) {
    const parsed = {};
    for (let i = 0; i < dateParts.length; i++) {
      const val = parseInt(segments[i], 10);
      if (isNaN(val)) {
        return void 0;
      }
      parsed[dateParts[i].type] = val;
    }
    if (parsed['day'] !== void 0 && parsed['month'] !== void 0 && parsed['year'] !== void 0) {
      const date = new Date(parsed['year'], parsed['month'] - 1, parsed['day']);
      if (
        date.getFullYear() === parsed['year'] &&
        date.getMonth() === parsed['month'] - 1 &&
        date.getDate() === parsed['day']
      ) {
        return date;
      }
    }
  }
  return void 0;
}
//# sourceMappingURL=utils.js.map
