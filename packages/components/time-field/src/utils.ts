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
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
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

/** Returns the full localized unit name (e.g. "Hour", "Minute", "Second") for a given time unit. */
export function getTimeUnitName(locale: string, unit: 'hour' | 'minute' | 'second'): string {
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

/** Returns the first letter of the localized unit name for hour, minute, and second. */
function getTimeUnitLetters(locale: string): Record<'hours' | 'minutes' | 'seconds', string> {
  if (dateUnitCache[locale]) {
    return dateUnitCache[locale];
  }

  const units: Record<'hours' | 'minutes' | 'seconds', string> = {
    hours: getTimeUnitName(locale, 'hour').charAt(0),
    minutes: getTimeUnitName(locale, 'minute').charAt(0),
    seconds: getTimeUnitName(locale, 'second').charAt(0)
  };

  dateUnitCache[locale] = units;

  return units;
}

/** Returns the localized unit letters for public use. */
export function getTimeUnitLetter(locale: string, unit: 'hour' | 'minute' | 'second'): string {
  const units = getTimeUnitLetters(locale);

  return units[`${unit}s`] ?? unit.charAt(0).toUpperCase();
}

/**
 * Returns a localized date template string for a given locale.
 * For example: 'HH:MM:SS' for en-US.
 */
export function getTimeTemplate(locale: string): string {
  const parts = getDateFormat(locale),
    units = getTimeUnitLetters(locale);

  return parts
    .map(part => {
      switch (part.type) {
        case 'hour':
          return units.hours.repeat(part.value.length);
        case 'minute':
          return units.minutes.repeat(part.value.length);
        case 'second':
          return units.seconds.repeat(part.value.length);
        default:
          return part.value;
      }
    })
    .join('');
}
