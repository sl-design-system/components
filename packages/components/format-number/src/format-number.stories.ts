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
    number: {
      type: 'number'
    },
    numberStyle: {
      control: 'inline-radio',
      options: ['decimal', 'currency', 'percent', 'unit']
    },
    unitDisplay: {
      control: 'inline-radio',
      options: ['short', 'long', 'narrow']
    },
    useGrouping: {
      type: 'boolean'
    }
  },
  render: ({ locale, number }) =>
    html`<sl-format-number .number=${number} locale=${ifDefined(locale)}></sl-format-number>`
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    number: 1234
  }
};
