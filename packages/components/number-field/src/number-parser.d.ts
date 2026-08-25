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
export declare class NumberParser {
  #private;
  formatter: Intl.NumberFormat;
  locale: Intl.LocalesArgument;
  options: Intl.ResolvedNumberFormatOptions;
  symbols: Symbols;
  constructor(locale?: Intl.LocalesArgument, options?: Intl.NumberFormatOptions);
  parse(value: string): number | undefined;
}
export {};
