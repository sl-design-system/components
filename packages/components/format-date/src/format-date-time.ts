export const formatDateTime = (date: Date, locale: string, options?: Intl.DateTimeFormatOptions ): string => {
  return Intl.DateTimeFormat(locale, options).format(date);
}
