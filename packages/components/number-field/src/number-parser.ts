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

  // parse(value: string): number {
  //   const numberFormat = new Intl.NumberFormat(this.locale, this.options);
  //   const parts = numberFormat.formatToParts(12345.6);
  //   const groupSeparator = parts.find(part => part.type === 'group')?.value || ',';
  //   const decimalSeparator = parts.find(part => part.type === 'decimal')?.value || '.';
  //
  //   const cleanedValue = value
  //     .replace(new RegExp(`\\${groupSeparator}`, 'g'), '')
  //     .replace(new RegExp(`\\${decimalSeparator}`), '.');
  //
  //   return parseFloat(cleanedValue);
  // }

  /*  parse(value: string): number {
    const numberFormat = new Intl.NumberFormat(this.locale, this.options);
    const parts = numberFormat.formatToParts(12345.6);
    const groupSeparator = parts.find(part => part.type === 'group')?.value || ',';
    const decimalSeparator = parts.find(part => part.type === 'decimal')?.value || '.';

    console.log('parts in parse', parts);

    const cleanedValue = value
      .replace(new RegExp(`[^0-9${decimalSeparator}]`, 'g'), '')
      .replace(new RegExp(`\\${groupSeparator}`, 'g'), '')
      .replace(new RegExp(`\\${decimalSeparator}`), '.');

    // return parseFloat(cleanedValue);
    return Number(cleanedValue);
  }*/

  /*  parse(value: string): number | string {
    const numberFormat = new Intl.NumberFormat(this.locale, this.options);
    const parts = numberFormat.formatToParts(12345.6);
    const groupSeparator = parts.find(part => part.type === 'group')?.value || ',';
    const decimalSeparator = parts.find(part => part.type === 'decimal')?.value || '.';

    console.log('parts in parse', parts);

    const cleanedValue = value
      .replace(new RegExp(`[^0-9${decimalSeparator}]`, 'g'), '')
      .replace(new RegExp(`\\${groupSeparator}`, 'g'), '')
      .replace(new RegExp(`\\${decimalSeparator}`), '.');

    const parsedNumber = Number(cleanedValue);
    return isNaN(parsedNumber) ? value : parsedNumber;
  }*/

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

    // Remove non-numeric characters and symbols, except for the decimal point
    const cleanedValue = value.replace(/[^0-9.,]/g, '');

    // Check if the cleaned value is a valid number
    const match = cleanedValue.match(/^\d+(\.\d+)?$/);

    if (!match) {
      return undefined;
    }

    const number = parseFloat(cleanedValue); // TODO: or use Number(cleanedValue) ??

    // Make sure the original value matches the cleaned value
    const formattedOriginalValue = new Intl.NumberFormat(this.locale, this.options).format(number);
    if (value !== formattedOriginalValue) {
      return undefined;
    }

    return number;
  }
}
