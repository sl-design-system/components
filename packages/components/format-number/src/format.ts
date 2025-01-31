export const format = (value: number, locale?: Intl.LocalesArgument, options?: Intl.NumberFormatOptions): string => {
  console.log(
    'value in format in FORMAT NUMBER',
    value,
    locale,
    options,
    Intl.NumberFormat(locale, options).format(value)
  );
  return new Intl.NumberFormat(locale, options).format(value);
};
