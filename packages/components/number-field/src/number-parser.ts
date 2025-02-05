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
    // const numberFormat = new Intl.NumberFormat(this.locale, this.options);
    // const parts = numberFormat.formatToParts(12345.6);
    // const groupSeparator = parts.find(part => part.type === 'group')?.value || ',';
    // const decimalSeparator = parts.find(part => part.type === 'decimal')?.value || '.';
    // //
    // console.log('parts in parse', parts);
    // //
    // // const cleanedValue = value
    // //   .replace(new RegExp(`[^0-9${decimalSeparator}]`, 'g'), '')
    // //   .replace(new RegExp(`\\${groupSeparator}`, 'g'), '')
    // //   .replace(new RegExp(`\\${decimalSeparator}`), '.');
    // //
    // // const parsedNumber = Number(cleanedValue);
    // // return isNaN(parsedNumber) ? undefined : parsedNumber;
    //
    // // const cleanedValue = value
    // //   .replace(new RegExp(`[^0-9${decimalSeparator}-]`, 'g'), '')
    // //   .replace(new RegExp(`\\${groupSeparator}`, 'g'), '')
    // //   .replace(new RegExp(`\\${decimalSeparator}`), '.');
    // //
    // // console.log('parts in parse', parts);
    // //
    // // const parsedNumber = Number(cleanedValue);
    // // return isNaN(parsedNumber) || /[^0-9.-]/.test(cleanedValue) ? undefined : parsedNumber;
    //
    // // const cleanedValue = value
    // //   .replace(new RegExp(`[^0-9${decimalSeparator}-]`, 'g'), '')
    // //   .replace(new RegExp(`\\${groupSeparator}`, 'g'), '')
    // //   .replace(new RegExp(`\\${decimalSeparator}`), '.');
    // //
    // // if (/[^0-9.-]/.test(cleanedValue)) {
    // //   return undefined;
    // // }
    // //
    // // const parsedNumber = Number(cleanedValue);
    // // return isNaN(parsedNumber) ? undefined : parsedNumber;
    //
    // // const cleanedValue = value
    // //   .replace(new RegExp(`\\${groupSeparator}`, 'g'), '')
    // //   .replace(new RegExp(`\\${decimalSeparator}`, 'g'), '.');
    // //
    // // // if (/[^0-9.-]/.test(cleanedValue) || value !== cleanedValue) {
    // // // if (/[^0-9.-]/.test(cleanedValue) || value.replace(new RegExp(`\\${groupSeparator}`, 'g'), '').replace(new RegExp(`\\${decimalSeparator}`, 'g'), '.') !== cleanedValue) {
    // // // if (/[^0-9.-]/.test(cleanedValue) || value.replace(new RegExp(`[^0-9${groupSeparator}${decimalSeparator}-]`, 'g'), '') !== cleanedValue) {
    // // if (/[^0-9.-]/.test(cleanedValue) || value.replace(new RegExp(`[^0-9${groupSeparator}${decimalSeparator}-]`, 'g'), '') !== cleanedValue) {
    // //   return undefined;
    // // }
    // //
    // // const parsedNumber = Number(cleanedValue);
    // // return isNaN(parsedNumber) ? undefined : parsedNumber;
    //
    // // const cleanedValue = value
    // //   .replace(new RegExp(`\\${groupSeparator}`, 'g'), '')
    // //   .replace(new RegExp(`\\${decimalSeparator}`, 'g'), '.');
    // //
    // // if (/[^0-9.-]/.test(cleanedValue) || value.replace(new RegExp(`[^0-9${groupSeparator}${decimalSeparator}-]`, 'g'), '') !== cleanedValue) {
    // //   return undefined;
    // // }
    // //
    // // const parsedNumber = Number(cleanedValue);
    // // return isNaN(parsedNumber) || /[^\d.-]/.test(value.replace(new RegExp(`\\${groupSeparator}`, 'g'), '').replace(new RegExp(`\\${decimalSeparator}`, 'g'), '.')) ? undefined : parsedNumber;
    //
    // const cleanedValue = value
    //   .replace(new RegExp(`\\${groupSeparator}`, 'g'), '')
    //   .replace(new RegExp(`\\${decimalSeparator}`, 'g'), '.');
    //
    // if (/[^0-9.-]/.test(cleanedValue) || value.replace(new RegExp(`[^0-9${groupSeparator}${decimalSeparator}-]`, 'g'), '') !== value.replace(new RegExp(`\\${groupSeparator}`, 'g'), '').replace(new RegExp(`\\${decimalSeparator}`, 'g'), '.')) {
    //   return undefined;
    // }
    //
    // const parsedNumber = Number(cleanedValue);
    // return isNaN(parsedNumber) ? undefined : parsedNumber;

    if (this.options.style === 'percent' /*&& number > 1*/) {
      const parsedValue = this.parseLocalePercentage(value);
      console.log('parsedvalue percentage in number parser', parsedValue);
      return parsedValue;
    }

    // Remove non-numeric characters and symbols, except for the decimal point
    const cleanedValue = value.replace(/[^0-9.,]/g, '');

    // Check if the cleaned value is a valid number
    const match = cleanedValue.match(/^\d+(\.\d+)?$/);

    // Determine the decimal separator for the current locale
    const numberFormat = new Intl.NumberFormat(this.locale, this.options);
    // console.log('numberFormat in number parser', numberFormat);
    //  const parts = numberFormat.formatToParts(12345.6);
    const parts = numberFormat.formatToParts(parseFloat(value.replace(/[^0-9.,-]/g, '').replace(',', '.')));
    // const decimalSeparator = parts.find(part => part.type === 'decimal')?.value || '.';
    const decimalSeparator = parts.find(part => part.type === 'decimal')?.value || '.';
    const minusSign = parts.find(part => part.type === 'minusSign')?.value;

    console.log(
      'number in number parser with percentage?>',
      parseFloat(cleanedValue.replace(decimalSeparator, '.').replace('%', '')),
      cleanedValue
    );

    console.log(
      'match in number parser',
      match,
      value.replace(/[^0-9.,]/g, ''),
      Number(cleanedValue),
      parseFloat(cleanedValue),
      'cleanedValue?',
      cleanedValue,
      'parts',
      parts,
      this.options
    );

    // const regex = new RegExp(`^-?\\d+(\\${decimalSeparator}\\d+)?$`);
    const regex = new RegExp(`^-?\\d+(\\${decimalSeparator}\\d+)?$`);
    if (this.options.style === 'currency' || this.options.style === 'unit') {
      // const cleanedValue = value.replace(new RegExp(`[^0-9${decimalSeparator}]`, 'g'), '').replace(decimalSeparator, '.');
      // const number = parseFloat(cleanedValue);
      // return isNaN(number) ? undefined : number;
      const parsedValue = this.parseLocaleValue(value);
      return parsedValue;
    } /*else if (!regex.test(value)) {
      console.log('regex test failed??', value, regex);
      return undefined;
    }*/ else if (!regex.test(value)) {
      console.log('regex test failed??', value, regex);
      return undefined;
    }

    // if (!match) {
    //   return undefined;
    // }

    const numberToParse = minusSign ? minusSign + cleanedValue : cleanedValue;

    // const number = Number(cleanedValue); //parseFloat(cleanedValue); // TODO: or use Number(cleanedValue) ??
    const number = parseFloat(numberToParse.replace(decimalSeparator, '.'));
    // const number = parseFloat(cleanedValue.replace(decimalSeparator, '.').replace('%', ''));

    console.log(
      'number in number parser',
      number,
      value,
      new Intl.NumberFormat(this.locale, this.options).format(number),
      value != new Intl.NumberFormat(this.locale, this.options).format(number),
      'style percent?',
      //  this.options.style === 'percent',
      this.locale,
      this.options,
      'decimalSeparator',
      // decimalSeparator,
      cleanedValue,
      // parseFloat(cleanedValue.replace(decimalSeparator, '.').replace('%', '')),
      'old cleanedValue',
      value.replace(/[^0-9.,]/g, ''),
      cleanedValue.match(/^\d+(\.\d+)?$/)
    );

    // if (this.options.style === 'percent' /*&& number > 1*/) {
    //   // TODO: not only bigger than 1, because 1.5 should result in 150%
    //   // if (number < 0 || number > 100) {
    //   //   return undefined;
    //   // }
    //   return number * 0.01;
    // } // when digit , comma it should also work

    // Make sure the original value matches the cleaned value
    // const formattedOriginalValue = new Intl.NumberFormat(this.locale, this.options).format(number);
    // if (value !== formattedOriginalValue) {
    //   return undefined;
    // }

    return number;
  }

  parseLocalePercentage(value: string): number | undefined {
    // // Remove the percentage sign and trim whitespace
    // value = value.replace('%', '').trim();
    //
    // // Create a NumberFormat object for the specified locale
    // const formatter = new Intl.NumberFormat(this.locale);
    //
    // // Use the formatter to parse the value
    // const parts = formatter.formatToParts(1234.56);
    // const decimalSeparator = parts.find(part => part.type === 'decimal')?.value || '.';
    // const groupSeparator = parts.find(part => part.type === 'group')?.value || ',';
    //
    // // Replace locale-specific separators with standard ones
    // const normalizedValue = value
    //   .replace(new RegExp(`\\${groupSeparator}`, 'g'), '')
    //   .replace(new RegExp(`\\${decimalSeparator}`), '.');

    // Remove the percentage sign and trim whitespace
    value = value.replace('%', '').trim();

    // Create a NumberFormat object for the specified locale
    const formatter = new Intl.NumberFormat(this.locale, { style: 'decimal' });

    // Use the formatter to parse the value
    // const parts = formatter.formatToParts(1234.56);
    // const decimalSeparator = parts.find(part => part.type === 'decimal')?.value || '.';
    // const groupSeparator = parts.find(part => part.type === 'group')?.value || ',';

    // Replace locale-specific separators with standard ones
    // const normalizedValue = value
    //   .replace(new RegExp(`\\${groupSeparator}`, 'g'), '')
    //   .replace(new RegExp(`\\${decimalSeparator}`), '.');

    // const normalizedValue = value
    //   .replace(new RegExp(`\\${groupSeparator}`, 'g'), '')
    //   .replace(new RegExp(`\\${decimalSeparator}`), '.');

    // Use the formatter to parse the value
    // const parts = formatter.formatToParts(1234.56);
    // const decimalSeparator = '.'; //parts.find(part => part.type === 'decimal')?.value || '.';
    const parts = formatter.formatToParts(parseFloat(value.replace(/[^0-9.,-]/g, '').replace(',', '.')));
    const decimalSeparator = parts.find(part => part.type === 'decimal')?.value || '.';
    const groupSeparator = parts.find(part => part.type === 'group')?.value || ',';

    console.log('value before replace', value, groupSeparator, decimalSeparator);
    // Replace locale-specific group separators with an empty string only if present
    if (/*value.includes(groupSeparator)*/ groupSeparator !== decimalSeparator) {
      value = value.replace(new RegExp(`\\${groupSeparator}`, 'g'), '');
    }
    console.log('value after replace', value);

    // Check if the value is a valid number
    const regex = new RegExp(`^-?\\d+(\\${decimalSeparator}\\d+)?$`);
    if (!regex.test(value)) {
      console.log('regex test failed??', value, regex);
      return undefined;
    }

    // // Check if the value is a valid number
    // // const regex = new RegExp(`^-?\\d+(\\${decimalSeparator}\\d+)?$`);
    // // const regex = new RegExp(`^-?\\d+(\\${decimalSeparator}\\d+)?$`);
    // // if (!regex.test(value)) {
    // const regex = new RegExp(`^-?\\d+(\\${decimalSeparator}\\d+)?$`);
    // if (!regex.test(value.replace(new RegExp(`\\${groupSeparator}`, 'g'), ''))) {
    //   console.log('regex test failed??', value, regex);
    //   return undefined;
    // }
    //
    //
    // console.log('value before replace', value);
    // // Replace locale-specific group separators with an empty string
    // value = value.replace(new RegExp(`\\${groupSeparator}`, 'g'), '');
    // console.log('value after replace', value);

    // // Check if the value is a valid number
    // // const regex = new RegExp(`^-?\\d+(\\${decimalSeparator}\\d+)?$`);
    // const regex = new RegExp(`^-?\\d+(\\${decimalSeparator}\\d+)?$`);
    // if (!regex.test(value)) {
    //   console.log('regex test failed??', value, regex);
    //   return undefined;
    // }

    // const integer = parts.find(part => part.type === 'integer')?.value || '';
    // const fraction = parts.find(part => part.type === 'fraction')?.value || '';
    const [integer, fraction] = value.split(decimalSeparator);
    decimalSeparator.replace(new RegExp(`\\${decimalSeparator}`), '.');

    console.log(
      'parts in parseLocalePercentage integer and so on',
      parts,
      integer,
      fraction,
      decimalSeparator,
      groupSeparator
    );

    // Replace locale-specific separators with standard ones
    // const normalizedValue = value
    //   .replace(new RegExp(`\\${groupSeparator}`, 'g'), '')
    //   .replace(new RegExp(`\\${decimalSeparator}`), '.');

    // decimalSeparator = '.';

    const normalizedValue = integer + '.' + (fraction || '');

    console.log(
      'in parseLocalePercentage',
      value,
      normalizedValue,
      parseFloat(normalizedValue),
      formatter,
      parts,
      'decimal?',
      decimalSeparator,
      'group?',
      groupSeparator,
      value.replace(new RegExp(`\\${groupSeparator}`, 'g'), '')
    );

    // Make sure the original value matches the cleaned value
    const formattedOriginalValue = new Intl.NumberFormat(this.locale, this.options).format(
      parseFloat(normalizedValue) * 0.01
    );
    console.log(
      'in parseLocalePercentage formatted...',
      formattedOriginalValue,
      value,
      value !== formattedOriginalValue
    );
    if (value !== formattedOriginalValue) {
      // return undefined;
    }

    // TODO: check whether there are other unnecessary characters in the value like abc and so on

    // Parse the normalized value as a float
    return parseFloat(normalizedValue);
  }

  parseLocaleValue(value: string): number | undefined {
    // Remove the percentage sign, currency symbol, or unit and trim whitespace
    value = value.replace(/[%\s]/g, '').trim();

    // Create a NumberFormat object for the specified locale and options
    const formatter = new Intl.NumberFormat(this.locale, this.options);

    // Use the formatter to parse the value
    const parts = formatter.formatToParts(1234.56);
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
    // const regex = new RegExp(`^-?\\d+(\\${decimalSeparator}\\d+)?$`);
    // const regex = new RegExp(`^-?\\d+(\\${decimalSeparator}\\d+)?([a-zA-Z%\\s]*)?$`);
    const regex = new RegExp(`^-?\\d+(\\${decimalSeparator}\\d+)?$`);
    if (!regex.test(value)) {
      console.log('regex test failed?? in parseLocaleValue', value, regex);
      return undefined;
    }

    const [integer, fraction] = value.split(decimalSeparator);

    // Combine integer, decimal separator, and fraction parts
    const normalizedValue = integer + '.' + (fraction || '');

    console.log('normalizedValue in parseLocaleValue', normalizedValue, parseFloat(normalizedValue));

    // Parse the normalized value as a float
    return parseFloat(normalizedValue);
  }
}
