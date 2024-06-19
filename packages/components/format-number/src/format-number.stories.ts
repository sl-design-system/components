import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type FormatNumber } from './format-number.js';

type Props = Pick<
  FormatNumber,
  | 'currency'
  | 'currencyDisplay'
  | 'formatOptions'
  | 'locale'
  | 'minimumIntegerDigits'
  | 'minimumFractionDigits'
  | 'maximumFractionDigits'
  | 'minimumSignificantDigits'
  | 'maximumSignificantDigits'
  | 'notation'
  | 'number'
  | 'numberStyle'
  | 'signDisplay'
  | 'unit'
  | 'unitDisplay'
  | 'useGrouping'
>;
type Story = StoryObj<Props>;

export default {
  title: 'Utilities/Format number',
  tags: ['draft'],
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
    unit,
    unitDisplay,
    useGrouping
  }) =>
    html`<sl-format-number
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
    ></sl-format-number>`
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    number: 1234
  }
};

export const Currency: Story = {
  args: {
    currency: 'EUR',
    number: 9.9,
    numberStyle: 'currency'
  }
};

export const Percent: Story = {
  args: {
    number: 0.1,
    numberStyle: 'percent'
  }
};

export const Unit: Story = {
  args: {
    number: 1000,
    numberStyle: 'unit',
    unit: 'meter',
    unitDisplay: 'long'
  }
};
