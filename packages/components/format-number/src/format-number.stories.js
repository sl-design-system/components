import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
export default {
  title: 'Utilities/Format number',
  argTypes: {
    currency: {
      type: 'string'
    },
    currencyDisplay: {
      control: 'inline-radio',
      options: ['code', 'name', 'symbol', 'narrowSymbol']
    },
    locale: {
      control: 'inline-radio',
      options: ['de', 'en', 'es', 'fi', 'it', 'nl', 'no', 'pl', 'sv']
    },
    minimumIntegerDigits: {
      type: 'number'
    },
    minimumFractionDigits: {
      type: 'number'
    },
    maximumFractionDigits: {
      type: 'number'
    },
    minimumSignificantDigits: {
      type: 'number'
    },
    maximumSignificantDigits: {
      type: 'number'
    },
    notation: {
      control: 'inline-radio',
      options: ['standard', 'scientific', 'engineering', 'compact']
    },
    number: {
      type: 'number'
    },
    numberStyle: {
      control: 'inline-radio',
      options: ['decimal', 'currency', 'percent', 'unit']
    },
    unit: {
      type: 'string'
    },
    unitDisplay: {
      control: 'inline-radio',
      options: ['short', 'long', 'narrow']
    },
    useGrouping: {
      type: 'boolean'
    }
  },
  render: ({
    currency,
    currencyDisplay,
    formatOptions,
    locale,
    minimumIntegerDigits,
    minimumFractionDigits,
    maximumFractionDigits,
    minimumSignificantDigits,
    maximumSignificantDigits,
    notation,
    number,
    numberStyle,
    signDisplay,
    slot,
    unit,
    unitDisplay,
    useGrouping
  }) => html`
    <sl-format-number
      ?use-grouping=${useGrouping}
      .formatOptions=${formatOptions}
      .number=${number}
      currency=${ifDefined(currency)}
      currency-display=${ifDefined(currencyDisplay)}
      locale=${ifDefined(locale)}
      minimum-integer-digits=${ifDefined(minimumIntegerDigits)}
      minimum-fraction-digits=${ifDefined(minimumFractionDigits)}
      maximum-fraction-digits=${ifDefined(maximumFractionDigits)}
      minimum-significant-digits=${ifDefined(minimumSignificantDigits)}
      maximum-significant-digits=${ifDefined(maximumSignificantDigits)}
      notation=${ifDefined(notation)}
      number-style=${ifDefined(numberStyle)}
      sign-display=${ifDefined(signDisplay)}
      unit=${ifDefined(unit)}
      unit-display=${ifDefined(unitDisplay)}
      >${slot}</sl-format-number
    >
  `
};
export const Basic = {
  args: {
    number: 1234
  }
};
export const Currency = {
  args: {
    currency: 'EUR',
    number: 9.9,
    numberStyle: 'currency'
  }
};
export const Percent = {
  args: {
    number: 0.1,
    numberStyle: 'percent'
  }
};
export const Unit = {
  args: {
    number: 1e3,
    numberStyle: 'unit',
    unit: 'meter',
    unitDisplay: 'long'
  }
};
export const Fallback = {
  args: {
    number: 'not a number',
    slot: 'This content is displayed when the number is not a valid number.'
  }
};
//# sourceMappingURL=format-number.stories.js.map
