import { LocaleMixin } from '@sl-design-system/shared/mixins.js';
import { LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { format } from './format.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-format-number': FormatNumber;
  }
}

/**
 * A utility custom element around the `Intl.NumberFormat` API.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
 */
export class FormatNumber extends LocaleMixin(LitElement) {
  /** The currency to use in currency formatting. */
  @property() currency?: string;

  /** How to display the currency. */
  @property({ attribute: 'currency-display' }) currencyDisplay?: 'code' | 'symbol' | 'narrowSymbol' | 'name';

  /**
   * Use this if you need access to advanced formatting options not provided via properties.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
   */
  @property({ type: Object, attribute: 'format-options' }) formatOptions?: Intl.NumberFormatOptions;

  /**
   * The minimum number of integer digits to use. A value with a smaller number of integer digits
   * than this number will be left-padded with zeros (to the specified length) when formatted.
   * Possible values are from 1 to 21; the default is 1.
   */
  @property({ type: Number, attribute: 'minimum-integer-digits' }) minimumIntegerDigits?: number;

  /**
   * The minimum number of fraction digits to use. Possible values are from 0 to 100; the default for
   * plain number and percent formatting is 0; the default for currency formatting is the number of
   * minor unit digits provided by the ISO 4217 currency code list (2 if the list doesn't provide
   * that information).
   */
  @property({ type: Number, attribute: 'minimum-fraction-digits' }) minimumFractionDigits?: number;

  /**
   * The maximum number of fraction digits to use. Possible values are from 0 to 100; the default for
   * plain number formatting is the larger of minimumFractionDigits and 3; the default for currency
   * formatting is the larger of minimumFractionDigits and the number of minor unit digits provided
   * by the ISO 4217 currency code list (2 if the list doesn't provide that information); the default
   * for percent formatting is the larger of minimumFractionDigits and 0.
   */
  @property({ type: Number, attribute: 'maximum-fraction-digits' }) maximumFractionDigits?: number;

  /** The minimum number of significant digits to use. Possible values are from 1 to 21; the default is 1.*/
  @property({ type: Number, attribute: 'minimum-significant-digits' }) minimumSignificantDigits?: number;

  /** The maximum number of significant digits to use. Possible values are from 1 to 21; the default is 21. */
  @property({ type: Number, attribute: 'maximum-significant-digits' }) maximumSignificantDigits?: number;

  /** The formatting that should be displayed for the number. */
  @property() notation?: Intl.NumberFormatOptions['notation'];

  /** The number to format. */
  @property({ type: Number }) number?: number;

  /** The style used for formatting. If unspecified, defaults to 'decimal'. */
  @property({ attribute: 'number-style' }) numberStyle?: 'decimal' | 'currency' | 'percent' | 'unit';

  /** When to display the sign for the number. */
  @property({ attribute: 'sign-display' }) signDisplay?: Intl.NumberFormatOptions['signDisplay'];

  /** The unit to use in unit formatting. */
  @property() unit?: string;

  /** How to display the unit. */
  @property({ attribute: 'unit-display' }) unitDisplay?: Intl.NumberFormatOptions['unitDisplay'];

  /**
   * Whether to use grouping separators, such as thousands separators.
   * If you need more control than just true/false, use `formatOptions`.
   */
  @property({
    attribute: 'use-grouping',
    converter: value => (value === null ? undefined : value === 'false' ? false : true)
  })
  useGrouping?: boolean;

  override render(): TemplateResult | string {
    if (typeof this.number === 'number' && !Number.isNaN(this.number)) {
      const {
        currency,
        currencyDisplay,
        minimumIntegerDigits,
        minimumFractionDigits,
        maximumFractionDigits,
        minimumSignificantDigits,
        maximumSignificantDigits,
        notation,
        numberStyle: style,
        signDisplay,
        unit,
        unitDisplay,
        useGrouping
      } = this;

      return format(this.number, this.locale, {
        currency,
        currencyDisplay,
        minimumIntegerDigits,
        minimumFractionDigits,
        maximumFractionDigits,
        minimumSignificantDigits,
        maximumSignificantDigits,
        notation,
        signDisplay,
        style,
        unit,
        unitDisplay,
        useGrouping,
        ...this.formatOptions
      });
    }

    return html`<slot></slot>`;
  }
}
