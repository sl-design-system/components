const nonLiteralParts = /* @__PURE__ */ new Set([
  'decimal',
  'fraction',
  'integer',
  'minusSign',
  'plusSign',
  'group'
]);
const pluralNumbers = [0, 4, 2, 1, 11, 20, 3, 7, 100, 21, 0.1, 1.1];
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function getSymbols(locale, intlOptions, originalOptions) {
  const symbolFormatter = new Intl.NumberFormat(locale, {
    ...intlOptions,
    // Resets so we get the full range of symbols
    minimumSignificantDigits: 1,
    maximumSignificantDigits: 21,
    roundingIncrement: 1,
    roundingPriority: 'auto',
    roundingMode: 'halfExpand'
  });
  const allParts = symbolFormatter.formatToParts(-10000.111);
  const posAllParts = symbolFormatter.formatToParts(10000.111);
  const pluralParts = pluralNumbers.map(n => symbolFormatter.formatToParts(n));
  const minusSign = allParts.find(p => p.type === 'minusSign')?.value ?? '-';
  let plusSign = posAllParts.find(p => p.type === 'plusSign')?.value;
  if (
    !plusSign &&
    (originalOptions?.signDisplay === 'exceptZero' || originalOptions?.signDisplay === 'always')
  ) {
    plusSign = '+';
  }
  const decimalParts = new Intl.NumberFormat(locale, {
    ...intlOptions,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).formatToParts(1e-3);
  const decimal = decimalParts.find(p => p.type === 'decimal')?.value;
  const group = allParts.find(p => p.type === 'group')?.value;
  const unit = allParts.find(p => p.type === 'unit')?.value;
  const allPartsLiterals = allParts
    .filter(p => !nonLiteralParts.has(p.type))
    .map(p => escapeRegex(p.value));
  const pluralPartsLiterals = pluralParts.flatMap(p =>
    p.filter(p2 => !nonLiteralParts.has(p2.type)).map(p2 => escapeRegex(p2.value))
  );
  const sortedLiterals = [
    .../* @__PURE__ */ new Set([...allPartsLiterals, ...pluralPartsLiterals])
  ].sort((a, b) => b.length - a.length);
  const literals =
    sortedLiterals.length === 0
      ? new RegExp('[\\p{White_Space}]', 'gu')
      : new RegExp(`${sortedLiterals.join('|')}|[\\p{White_Space}]`, 'gu');
  const numerals = [
    ...new Intl.NumberFormat(intlOptions.locale, { useGrouping: false }).format(9876543210)
  ].reverse();
  const indexes = new Map(numerals.map((d, i) => [d, i]));
  const numeral = new RegExp(`[${numerals.join('')}]`, 'g');
  const index = d => String(indexes.get(d));
  return { minusSign, plusSign, decimal, group, unit, literals, numeral, index };
}
function replaceAll(str, find, replace) {
  if (str.replaceAll) {
    return str.replaceAll(find, replace);
  }
  return str.split(find).join(replace);
}
export class NumberParser {
  constructor(locale = 'default', options = {}) {
    this.locale = locale;
    this.formatter = new Intl.NumberFormat(locale, options);
    this.options = this.formatter.resolvedOptions();
    this.symbols = getSymbols(locale, this.options, options);
  }
  parse(value) {
    let sanitizedValue = this.#sanitize(value);
    if (sanitizedValue.length === 0) {
      return void 0;
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
  #sanitize(value) {
    value = value.replace(this.symbols.literals, '');
    if (this.symbols.minusSign) {
      value = value.replace('-', this.symbols.minusSign);
    }
    if (this.options.numberingSystem === 'arab') {
      if (this.symbols.decimal) {
        value = value.replace(',', this.symbols.decimal);
        value = value.replace(String.fromCharCode(1548), this.symbols.decimal);
      }
      if (this.symbols.group) {
        value = replaceAll(value, '.', this.symbols.group);
      }
    }
    if (this.symbols.group === '\u2019' && value.includes("'")) {
      value = replaceAll(value, "'", this.symbols.group);
    }
    if (this.symbols.unit) {
      value = replaceAll(value, this.symbols.unit, '');
    }
    if (this.options.locale === 'fr-FR' && this.symbols.group) {
      value = replaceAll(value, ' ', this.symbols.group);
      value = replaceAll(value, /\u00A0/g, this.symbols.group);
    }
    value = value.trim();
    return value;
  }
}
//# sourceMappingURL=number-parser.js.map
