export class NumberParser {
  locale: Intl.LocalesArgument;
  options: Intl.NumberFormatOptions;

  constructor(locale: Intl.LocalesArgument = 'default', options: Intl.NumberFormatOptions = {}) {
    this.locale = locale;
    this.options = options;
  }

  parse(value: string): number {
    return parseFloat(value);
  }
}
