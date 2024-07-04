export const format = (date: Date, locale: string, options?: Intl.DateTimeFormatOptions): string => {
  return Intl.DateTimeFormat(locale, options).format(date);
};
