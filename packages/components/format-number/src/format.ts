export const format = (value: number, locale?: Intl.LocalesArgument, options?: Intl.NumberFormatOptions): string => {
  return new Intl.NumberFormat(locale, options).format(value);
};
