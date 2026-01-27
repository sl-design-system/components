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

  // Default to December 31, 2026 so we know the maximum number of characters of each
  // part (e.g., 31 for day, 12 for month, 2026 for year). This is required for the date
  // template generation.
  const intlParts = new Intl.DateTimeFormat(locale).formatToParts(date ?? new Date(2026, 0, 0));

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

/** Returns the first letter of the localized unit name for day, month, and year. */
function getDateUnitLetters(locale: string): Record<string, string> {
  if (dateUnitCache[locale]) {
    return dateUnitCache[locale];
  }

  const df = new DurationFormat(locale, { style: 'long' }),
    units: Record<string, string> = {};

  for (const unit of ['days', 'months', 'years'] as const) {
    const part = df.formatToParts({ [unit]: 1 }).find(part => part.type === 'unit');

    // Get the first letter of the unit name (uppercased)
    units[unit] = part?.value.charAt(0).toUpperCase() ?? unit.charAt(0).toUpperCase();
  }

  dateUnitCache[locale] = units;

  return units;
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
