// export interface LocalizedDateTimeFormatOptions extends Intl.DateTimeFormatOptions {
//   locale?: string;
// }

export const formatDateTime = (date: Date, locale: string, options?: Intl.DateTimeFormatOptions ): string => { // TODO: in separated file?
  // const localeString = locale ? locale : 'en';
  console.log('date in formatDateTime', date, locale);
  console.log('options', options, Intl.DateTimeFormat('pl', options).format(date));
  // Intl.DateTimeFormat(locale, rest).format(date)
  // const hour12 = this.hour12 ? this.hour12 : undefined;
  // console.log('hour12', hour12);
  // return date.toString();
  return Intl.DateTimeFormat(locale, options).format(date);
}
