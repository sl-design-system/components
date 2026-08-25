import { LitElement, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-format-number': FormatNumber;
  }
}
declare const FormatNumber_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<import('@sl-design-system/shared/mixins.js').Locale>;
/**
 * A utility custom element around the `Intl.NumberFormat` API.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
 */
export declare class FormatNumber extends FormatNumber_base {
  /** The currency to use in currency formatting. */
  currency?: string;
  /** How to display the currency. */
  currencyDisplay?: 'code' | 'symbol' | 'narrowSymbol' | 'name';
  /**
   * Use this if you need access to advanced formatting options not provided via properties.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
   */
  formatOptions?: Intl.NumberFormatOptions;
  /**
   * The minimum number of integer digits to use. A value with a smaller number of integer digits
   * than this number will be left-padded with zeros (to the specified length) when formatted.
   * Possible values are from 1 to 21; the default is 1.
   */
  minimumIntegerDigits?: number;
  /**
   * The minimum number of fraction digits to use. Possible values are from 0 to 100; the default
   * for plain number and percent formatting is 0; the default for currency formatting is the number
   * of minor unit digits provided by the ISO 4217 currency code list (2 if the list doesn't provide
   * that information).
   */
  minimumFractionDigits?: number;
  /**
   * The maximum number of fraction digits to use. Possible values are from 0 to 100; the default
   * for plain number formatting is the larger of minimumFractionDigits and 3; the default for
   * currency formatting is the larger of minimumFractionDigits and the number of minor unit digits
   * provided by the ISO 4217 currency code list (2 if the list doesn't provide that information);
   * the default for percent formatting is the larger of minimumFractionDigits and 0.
   */
  maximumFractionDigits?: number;
  /**
   * The minimum number of significant digits to use. Possible values are from 1 to 21; the default
   * is 1.
   */
  minimumSignificantDigits?: number;
  /**
   * The maximum number of significant digits to use. Possible values are from 1 to 21; the default
   * is 21.
   */
  maximumSignificantDigits?: number;
  /** The formatting that should be displayed for the number. */
  notation?: Intl.NumberFormatOptions['notation'];
  /** The number to format. */
  number?: number;
  /** The style used for formatting. If unspecified, defaults to 'decimal'. */
  numberStyle?: 'decimal' | 'currency' | 'percent' | 'unit';
  /** When to display the sign for the number. */
  signDisplay?: Intl.NumberFormatOptions['signDisplay'];
  /** The unit to use in unit formatting. */
  unit?: string;
  /** How to display the unit. */
  unitDisplay?: Intl.NumberFormatOptions['unitDisplay'];
  /**
   * Whether to use grouping separators, such as thousands separators. If you need more control than
   * just true/false, use `formatOptions`.
   */
  useGrouping?: boolean;
  render(): TemplateResult | string;
}
export {};
