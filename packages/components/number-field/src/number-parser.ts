interface Symbols {
  minusSign?: string;
  plusSign?: string;
  decimal?: string;
  group?: string;
  unit?: string;
  literals: RegExp;
  numeral: RegExp;
  index(v: string): string;
}

const nonLiteralParts = new Set(['decimal', 'fraction', 'integer', 'minusSign', 'plusSign', 'group']);

// This list is derived from https://www.unicode.org/cldr/charts/43/supplemental/language_plural_rules.html#comparison and includes
// all unique numbers which we need to check in order to determine all the plural forms for a given locale.
// See: https://github.com/adobe/react-spectrum/pull/5134/files#r1337037855 for used script
const pluralNumbers = [0, 4, 2, 1, 11, 20, 3, 7, 100, 21, 0.1, 1.1];

function escapeRegex(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSymbols(
  locale: Intl.LocalesArgument,
  intlOptions: Intl.ResolvedNumberFormatOptions,
  originalOptions: Intl.NumberFormatOptions
): Symbols {
  // formatter needs access to all decimal places in order to generate the correct literal strings for the plural set
  const symbolFormatter = new Intl.NumberFormat(locale, {
    ...intlOptions,
    // Resets so we get the full range of symbols
    minimumSignificantDigits: 1,
    maximumSignificantDigits: 21,
    roundingIncrement: 1,
    roundingPriority: 'auto',
    roundingMode: 'halfExpand'
  });
  // Note: some locale's don't add a group symbol until there is a ten thousands place
  const allParts = symbolFormatter.formatToParts(-10000.111);
  const posAllParts = symbolFormatter.formatToParts(10000.111);
  const pluralParts = pluralNumbers.map(n => symbolFormatter.formatToParts(n));

  const minusSign = allParts.find(p => p.type === 'minusSign')?.value ?? '-';
  let plusSign = posAllParts.find(p => p.type === 'plusSign')?.value;

  // Safari does not support the signDisplay option, but our number parser polyfills it.
  // If no plus sign was returned, but the original options contained signDisplay, default to the '+' character.
  if (!plusSign && (originalOptions?.signDisplay === 'exceptZero' || originalOptions?.signDisplay === 'always')) {
    plusSign = '+';
  }

  // If maximumSignificantDigits is 1 (the minimum) then we won't get decimal characters out of the above formatters
  // Percent also defaults to 0 fractionDigits, so we need to make a new one that isn't percent to get an accurate decimal
  const decimalParts = new Intl.NumberFormat(locale, {
    ...intlOptions,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).formatToParts(0.001);

  const decimal = decimalParts.find(p => p.type === 'decimal')?.value;
  const group = allParts.find(p => p.type === 'group')?.value;
  const unit = allParts.find(p => p.type === 'unit')?.value;

  // this set is also for a regex, it's all literals that might be in the string we want to eventually parse that
  // don't contribute to the numerical value
  const allPartsLiterals = allParts.filter(p => !nonLiteralParts.has(p.type)).map(p => escapeRegex(p.value));
  const pluralPartsLiterals = pluralParts.flatMap(p =>
    p.filter(p => !nonLiteralParts.has(p.type)).map(p => escapeRegex(p.value))
  );
  const sortedLiterals = [...new Set([...allPartsLiterals, ...pluralPartsLiterals])].sort(
    (a, b) => b.length - a.length
  );

  const literals =
    sortedLiterals.length === 0
      ? new RegExp('[\\p{White_Space}]', 'gu')
      : new RegExp(`${sortedLiterals.join('|')}|[\\p{White_Space}]`, 'gu');

  // These are for replacing non-latn characters with the latn equivalent
  const numerals = [...new Intl.NumberFormat(intlOptions.locale, { useGrouping: false }).format(9876543210)].reverse();
  const indexes = new Map(numerals.map((d, i) => [d, i]));
  const numeral = new RegExp(`[${numerals.join('')}]`, 'g');
  const index = (d: string) => String(indexes.get(d));

  return { minusSign, plusSign, decimal, group, unit, literals, numeral, index };
}

function replaceAll(str: string, find: string | RegExp, replace: string) {
  if (str.replaceAll) {
    return str.replaceAll(find, replace);
  }

  return str.split(find).join(replace);
}

export class NumberParser {
  formatter: Intl.NumberFormat;
  locale: Intl.LocalesArgument;
  options: Intl.ResolvedNumberFormatOptions;
  symbols: Symbols;

  constructor(locale: Intl.LocalesArgument = 'default', options: Intl.NumberFormatOptions = {}) {
    this.locale = locale;

    this.formatter = new Intl.NumberFormat(locale, options);
    this.options = this.formatter.resolvedOptions();
    this.symbols = getSymbols(locale, this.options, options);
  }

  parse(value: string): number | undefined {
    let sanitizedValue = this.#sanitize(value);

    if (sanitizedValue.length === 0) {
      return undefined;
    }

    if (this.symbols.group) {
      sanitizedValue = replaceAll(sanitizedValue, this.symbols.group, '');
    }

    if (this.symbols.decimal) {
      sanitizedValue = sanitizedValue.replace(this.symbols.decimal, '.');
    }

    if (this.symbols.minusSign) {
      sanitizedValue = sanitizedValue.replace(this.symbols.minusSign, '-');
    }

    sanitizedValue = sanitizedValue.replace(this.symbols.numeral, this.symbols.index);

    if (this.options.style === 'percent') {
      const isNegative = sanitizedValue.indexOf('-');
      sanitizedValue = sanitizedValue.replace('-', '');
      sanitizedValue = sanitizedValue.replace('+', '');

      let index = sanitizedValue.indexOf('.');
      if (index === -1) {
        index = sanitizedValue.length;
      }

      if (isNegative > -1) {
        sanitizedValue = `-${sanitizedValue}`;
      }
    }

    return sanitizedValue ? +sanitizedValue : NaN;
  }

  #sanitize(value: string): string {
    // Remove literals and whitespace, which are allowed anywhere in the string
    value = value.replace(this.symbols.literals, '');

    // Replace the ASCII minus sign with the minus sign used in the current locale
    // so that both are allowed in case the user's keyboard doesn't have the locale's minus sign.
    if (this.symbols.minusSign) {
      value = value.replace('-', this.symbols.minusSign);
    }

    // In arab numeral system, their decimal character is 1643, but most keyboards don't type that
    // instead they use the , (44) character or apparently the (1548) character.
    if (this.options.numberingSystem === 'arab') {
      if (this.symbols.decimal) {
        value = value.replace(',', this.symbols.decimal);
        value = value.replace(String.fromCharCode(1548), this.symbols.decimal);
      }

      if (this.symbols.group) {
        value = replaceAll(value, '.', this.symbols.group);
      }
    }

    // In some locale styles, such as swiss currency, the group character can be a special single quote
    // that keyboards don't typically have. This expands the character to include the easier to type single quote.
    if (this.symbols.group === '’' && value.includes("'")) {
      value = replaceAll(value, "'", this.symbols.group);
    }

    // Remove the unit string, if it exists
    if (this.symbols.unit) {
      value = replaceAll(value, this.symbols.unit, '');
    }

    // fr-FR group character is narrow non-breaking space, char code 8239 (U+202F), but that's not a key on the french keyboard,
    // so allow space and non-breaking space as a group char as well
    if (this.options.locale === 'fr-FR' && this.symbols.group) {
      value = replaceAll(value, ' ', this.symbols.group);
      value = replaceAll(value, /\u00A0/g, this.symbols.group);
    }

    value = value.trim();

    return value;
  }
}
