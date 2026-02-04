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

/** Returns the first letter of the localized unit name for day, month, and year. */
function getDateUnitLetters(locale: string): Record<'days' | 'months' | 'years', string> {
  if (dateUnitCache[locale]) {
    return dateUnitCache[locale];
  }

  const df = new DurationFormat(locale, { style: 'long' }),
    units: Record<'days' | 'months' | 'years', string> = {
      days: '',
      months: '',
      years: ''
    };

  for (const unit of ['days', 'months', 'years'] as const) {
    const part = df.formatToParts({ [unit]: 1 }).find(part => part.type === 'unit');

    // Get the first letter of the unit name (uppercased)
    units[unit] = part?.value.charAt(0).toUpperCase() ?? unit.charAt(0).toUpperCase();
  }

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
