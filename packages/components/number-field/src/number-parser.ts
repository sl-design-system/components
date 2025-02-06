export class NumberParser {
  locale: Intl.LocalesArgument;
  options: Intl.NumberFormatOptions;

  constructor(locale: Intl.LocalesArgument = 'default', options: Intl.NumberFormatOptions = {}) {
    this.locale = locale;
    this.options = options;
  }

  // parse(value: string): number {
  //   return parseFloat(value);
  // }

  parse(value: string): number | undefined {
    if (this.options.style === 'percent') {
      return this.#parseLocalePercentage(value);
    } else if (this.options.style === 'currency' || this.options.style === 'unit') {
      return this.#parseLocaleCurrencyOrUnit(value);
    }

    // Remove non-numeric characters and symbols, except for the decimal point
    const cleanedValue = value.replace(/[^0-9.,]/g, '');

    // Create a NumberFormat object for the specified locale and options
    const formatter = new Intl.NumberFormat(this.locale, this.options);
    const parts = formatter.formatToParts(parseFloat(value.replace(/[^0-9.,-]/g, '').replace(',', '.')));
    const decimalSeparator = parts.find(part => part.type === 'decimal')?.value || '.';
    const minusSign = parts.find(part => part.type === 'minusSign')?.value;

    // regex checks if the string is a valid number, optionally including a decimal part and/or starting with a minus sign.
    const isNumber = new RegExp(`^-?\\d+(\\${decimalSeparator}\\d+)?$`);
    if (!isNumber.test(value)) {
      return undefined;
    }

    const normalizedValue = minusSign ? minusSign + cleanedValue : cleanedValue;

    return parseFloat(normalizedValue.replace(decimalSeparator, '.'));
  }

  #parseLocalePercentage(value: string): number | undefined {
    // Remove the percentage sign and trim whitespace
    value = value.replace('%', '').trim();

    // Create a NumberFormat object for the specified locale, changed to decimal to get proper parts
    const formatter = new Intl.NumberFormat(this.locale, { style: 'decimal' });

    // Use the formatter to parse the value
    const parts = formatter.formatToParts(parseFloat(value.replace(/[^0-9.,-]/g, '').replace(',', '.')));
    const decimalSeparator = parts.find(part => part.type === 'decimal')?.value || '.';
    const groupSeparator = parts.find(part => part.type === 'group')?.value || ',';

    // Replace locale-specific group separators with an empty string only if present
    if (groupSeparator !== decimalSeparator) {
      value = value.replace(new RegExp(`\\${groupSeparator}`, 'g'), '');
    }

    // Check if the value is a valid number
    const regex = new RegExp(`^-?\\d+(\\${decimalSeparator}\\d+)?$`);
    if (!regex.test(value)) {
      console.log('regex test failed??', value, regex);
      return undefined;
    }

    const [integer, fraction] = value.split(decimalSeparator);
    decimalSeparator.replace(new RegExp(`\\${decimalSeparator}`), '.');

    const normalizedValue = integer + '.' + (fraction || '');

    // // Make sure the original value matches the cleaned value
    // const formattedOriginalValue = new Intl.NumberFormat(this.locale, this.options).format(
    //   parseFloat(normalizedValue) * 0.01
    // );

    // TODO: check whether there are other unnecessary characters in the value like abc and so on

    // Parse the normalized value as a float
    return parseFloat(normalizedValue);
  }

  #parseLocaleCurrencyOrUnit(value: string): number | undefined {
    // Remove the percentage sign, currency symbol, or unit and trim whitespace
    value = value.replace(/[%\s]/g, '').trim();

    // Create a NumberFormat object for the specified locale and options
    const formatter = new Intl.NumberFormat(this.locale, this.options);

    // Use the formatter to parse the value
    //  const parts = formatter.formatToParts(1234.56);
    //  const formatter = new Intl.NumberFormat(this.locale, this.options);
    const parts = formatter.formatToParts(parseFloat(value.replace(/[^0-9.,-]/g, '').replace(',', '.')));
    const decimalSeparator = parts.find(part => part.type === 'decimal')?.value || '.';
    const groupSeparator = parts.find(part => part.type === 'group')?.value || ',';
    const currencySymbol = parts.find(part => part.type === 'currency')?.value || '';
    const unitSymbol = parts.find(part => part.type === 'unit')?.value || '';

    value = value.replace(new RegExp(`[${currencySymbol}${unitSymbol}%\\s]`, 'g'), '').trim();

    // Replace locale-specific group separators with an empty string only if different from decimal separator
    if (groupSeparator !== decimalSeparator) {
      value = value.replace(new RegExp(`\\${groupSeparator}`, 'g'), '');
    }

    // Check if the value is a valid number
    const regex = new RegExp(`^-?\\d+(\\${decimalSeparator}\\d+)?$`);
    if (!regex.test(value)) {
      return undefined;
    }

    const [integer, fraction] = value.split(decimalSeparator);
    const normalizedValue = integer + '.' + (fraction || '');

    // Parse the normalized value as a float
    return parseFloat(normalizedValue);
  }
}
