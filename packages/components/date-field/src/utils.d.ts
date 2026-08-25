export interface DateFormatPart extends Intl.DateTimeFormatPart {
  start: number;
  end: number;
}
/** Returns the date format parts for a given locale. */
export declare function getDateFormat(locale: string, date?: Date): DateFormatPart[];
/** Returns the full localized unit name (e.g. "Day", "Month", "Year") for a given date unit. */
export declare function getDateUnitName(locale: string, unit: 'day' | 'month' | 'year'): string;
/** Returns the localized unit letters for public use. */
export declare function getDateUnitLetter(locale: string, unit: 'day' | 'month' | 'year'): string;
/** Returns a localized date template string for a given locale. For example: 'MM-DD-YYYY' for en-US. */
export declare function getDateTemplate(locale: string): string;
/** Returns the localized name of a month (e.g. "January") for a given 1-based month number. */
export declare function getMonthName(locale: string, month: number): string;
/** Attempts to parse a date string. Supports ISO format (YYYY-MM-DD) and locale-specific format. */
export declare function parseDateString(text: string, locale: string): Date | undefined;
