var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if ((decorator = decorators[i]))
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
import { LocaleMixin } from '@sl-design-system/shared/mixins.js';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { format } from './format.js';
export class FormatNumber extends LocaleMixin(LitElement) {
  render() {
    if (typeof this.number !== 'number' || Number.isNaN(this.number)) {
      return html`<slot></slot>`;
    }
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
}
__decorateClass([property()], FormatNumber.prototype, 'currency', 2);
__decorateClass(
  [property({ attribute: 'currency-display' })],
  FormatNumber.prototype,
  'currencyDisplay',
  2
);
__decorateClass(
  [property({ type: Object, attribute: 'format-options' })],
  FormatNumber.prototype,
  'formatOptions',
  2
);
__decorateClass(
  [property({ type: Number, attribute: 'minimum-integer-digits' })],
  FormatNumber.prototype,
  'minimumIntegerDigits',
  2
);
__decorateClass(
  [property({ type: Number, attribute: 'minimum-fraction-digits' })],
  FormatNumber.prototype,
  'minimumFractionDigits',
  2
);
__decorateClass(
  [property({ type: Number, attribute: 'maximum-fraction-digits' })],
  FormatNumber.prototype,
  'maximumFractionDigits',
  2
);
__decorateClass(
  [property({ type: Number, attribute: 'minimum-significant-digits' })],
  FormatNumber.prototype,
  'minimumSignificantDigits',
  2
);
__decorateClass(
  [property({ type: Number, attribute: 'maximum-significant-digits' })],
  FormatNumber.prototype,
  'maximumSignificantDigits',
  2
);
__decorateClass([property()], FormatNumber.prototype, 'notation', 2);
__decorateClass([property({ type: Number })], FormatNumber.prototype, 'number', 2);
__decorateClass(
  [property({ attribute: 'number-style' })],
  FormatNumber.prototype,
  'numberStyle',
  2
);
__decorateClass(
  [property({ attribute: 'sign-display' })],
  FormatNumber.prototype,
  'signDisplay',
  2
);
__decorateClass([property()], FormatNumber.prototype, 'unit', 2);
__decorateClass(
  [property({ attribute: 'unit-display' })],
  FormatNumber.prototype,
  'unitDisplay',
  2
);
__decorateClass(
  [
    property({
      attribute: 'use-grouping',
      converter: value => (value === null ? void 0 : value === 'false' ? false : true)
    })
  ],
  FormatNumber.prototype,
  'useGrouping',
  2
);
//# sourceMappingURL=format-number.js.map
