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

const dateFormatCache: Record<string, Intl.DateTimeFormatPart[]> = {},
  dateUnitCache: Record<string, Record<string, string>> = {};

/** Returns the date format parts for a given locale. */
export function getDateFormat(locale: string): Intl.DateTimeFormatPart[] {
  if (dateFormatCache[locale]) {
    return dateFormatCache[locale];
  }

  // Use January 1, 2026 as a sample date so we know how many digits each part should have
  const parts = new Intl.DateTimeFormat(locale).formatToParts(new Date(2026, 0, 1));

  dateFormatCache[locale] = parts;

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
    const parts = df.formatToParts({ [unit]: 1 }),
      unitPart = parts.find((part: DurationFormatPart) => part.type === unit);

    // Get the first letter of the unit name (uppercased)
    units[unit.slice(0, -1)] = unitPart?.value.trim().charAt(0).toUpperCase() ?? unit.charAt(0).toUpperCase();
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
          return units.day.repeat(2);
        case 'month':
          return units.month.repeat(2);
        case 'year':
          return units.year.repeat(part.value.length);
        default:
          return part.value;
      }
    })
    .join('');
}
