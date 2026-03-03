// Intl.DurationFormat is not yet in TypeScript's lib, so we need to define it.
// Will be fixed in https://github.com/microsoft/TypeScript/pull/63046

interface DurationFormatPart {
  type: string;
  value: string;
}

interface DurationFormat {
  formatToParts(duration: Partial<Record<string, number>>): DurationFormatPart[];
}

interface DurationFormatConstructor {
  new (locale: string, options?: { style?: 'long' | 'short' | 'narrow' }): DurationFormat;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
const DurationFormat = (Intl as any).DurationFormat as DurationFormatConstructor;

export interface DateFormatPart extends Intl.DateTimeFormatPart {
  start: number;
  end: number;
}

const dateFormatCache: Record<string, DateFormatPart[]> = {},
  dateUnitCache: Record<string, Record<string, string>> = {};

/** Returns the date format parts for a given locale. */
export function getDateFormat(locale: string, date?: Date): DateFormatPart[] {
  // Only cache when no date is provided
  if (!date && dateFormatCache[locale]) {
    return dateFormatCache[locale];
  }

  // To prevent the format changing from 2 digits day/month to 1 digit
  // when the value is set in DateField, we force 2-digit formatting
  const intlParts = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).formatToParts(date ?? new Date());

  // Extend the parts to include the indices of each part in the formatted string
  let index = 0;
  const parts: DateFormatPart[] = intlParts.map(part => {
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

/** Returns the full localized unit name (e.g. "Day", "Month", "Year") for a given date unit. */
export function getDateUnitName(locale: string, unit: 'day' | 'month' | 'year'): string {
  let name: string = unit;

  try {
    if (typeof DurationFormat === 'function') {
      const pluralUnit = `${unit}s` as const,
        df = new DurationFormat(locale, { style: 'long' }),
        part = df.formatToParts({ [pluralUnit]: 1 }).find(p => p.type === 'unit');

      name = part?.value ?? unit;
    }
  } catch {
    // Fallback to the non-localized unit name when Intl.DurationFormat is not available
    name = unit;
  }

  // Capitalize the first letter
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/** Returns the first letter of the localized unit name for day, month, and year. */
function getDateUnitLetters(locale: string): Record<'days' | 'months' | 'years', string> {
  if (dateUnitCache[locale]) {
    return dateUnitCache[locale];
  }

  const units: Record<'days' | 'months' | 'years', string> = {
    days: getDateUnitName(locale, 'day').charAt(0),
    months: getDateUnitName(locale, 'month').charAt(0),
    years: getDateUnitName(locale, 'year').charAt(0)
  };

  dateUnitCache[locale] = units;

  return units;
}

/** Returns the localized unit letters for public use. */
export function getDateUnitLetter(locale: string, unit: 'day' | 'month' | 'year'): string {
  const units = getDateUnitLetters(locale);

  return units[`${unit}s`] ?? unit.charAt(0).toUpperCase();
}

/**
 * Returns a localized date template string for a given locale.
 * For example: 'MM-DD-YYYY' for en-US.
 */
export function getDateTemplate(locale: string): string {
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

/** Returns the localized name of a month (e.g. "January") for a given 1-based month number. */
export function getMonthName(locale: string, month: number): string {
  const date = new Date(2000, month - 1, 1);

  return new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
}

/**
 * Attempts to parse a date string.
 * Supports ISO format (YYYY-MM-DD) and locale-specific format.
 */
export function parseDateString(text: string, locale: string): Date | undefined {
  // Try ISO format first: YYYY-MM-DD
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

  // Try locale-specific format
  const parts = getDateFormat(locale),
    dateParts = parts.filter(p => p.type !== 'literal'),
    separators = parts.filter(p => p.type === 'literal').map(p => p.value),
    separatorPattern = separators.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
    segments = text.split(new RegExp(separatorPattern));

  if (segments.length === dateParts.length) {
    const parsed: Record<string, number> = {};

    for (let i = 0; i < dateParts.length; i++) {
      const val = parseInt(segments[i], 10);
      if (isNaN(val)) {
        return undefined;
      }
      parsed[dateParts[i].type] = val;
    }

    if (parsed['day'] !== undefined && parsed['month'] !== undefined && parsed['year'] !== undefined) {
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

  return undefined;
}
