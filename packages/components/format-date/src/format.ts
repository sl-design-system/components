export const format = (date: Date, locale = 'default', options?: Intl.DateTimeFormatOptions): string => {
  return Intl.DateTimeFormat(locale, options).format(date);
};
