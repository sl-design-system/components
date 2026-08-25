export interface DateFormatPart extends Intl.DateTimeFormatPart {
  start: number;
  end: number;
}
/** A partial time where only hour or only minute may be set (e.g. during keyboard editing). */
export interface PartialTimePart {
  hour?: number;
  minute?: number;
}
/** A complete time with both hour and minute always present as numbers. */
export interface TimePart {
  hour: number;
  minute: number;
}
/** Returns the time format parts for a given locale. */
export declare function getTimeFormat(locale: string, date?: Date): DateFormatPart[];
/** Returns the full localized unit name (e.g. "Hour", "Minute", "Second") for a given time unit. */
export declare function getTimeUnitName(locale: string, unit: 'hour' | 'minute' | 'second'): string;
/** Returns the localized unit letters for public use. */
export declare function getTimeUnitLetter(
  locale: string,
  unit: 'hour' | 'minute' | 'second'
): string;
/** Returns a localized time template string for a given locale. For example: 'HH:MM' for en-US. */
export declare function getTimeTemplate(locale: string): string;
