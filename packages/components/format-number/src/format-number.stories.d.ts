import { type StoryObj } from '@storybook/web-components-vite';
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
> & {
  slot?: string;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  argTypes: {
    currency: {
      type: 'string';
    };
    currencyDisplay: {
      control: 'inline-radio';
      options: string[];
    };
    locale: {
      control: 'inline-radio';
      options: string[];
    };
    minimumIntegerDigits: {
      type: 'number';
    };
    minimumFractionDigits: {
      type: 'number';
    };
    maximumFractionDigits: {
      type: 'number';
    };
    minimumSignificantDigits: {
      type: 'number';
    };
    maximumSignificantDigits: {
      type: 'number';
    };
    notation: {
      control: 'inline-radio';
      options: string[];
    };
    number: {
      type: 'number';
    };
    numberStyle: {
      control: 'inline-radio';
      options: string[];
    };
    unit: {
      type: 'string';
    };
    unitDisplay: {
      control: 'inline-radio';
      options: string[];
    };
    useGrouping: {
      type: 'boolean';
    };
  };
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
  }: Props) => import('lit-html').TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Currency: Story;
export declare const Percent: Story;
export declare const Unit: Story;
export declare const Fallback: Story;
