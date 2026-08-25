import { type StoryObj } from '@storybook/web-components-vite';
import '../register.js';
import { type FormatDate } from './format-date.js';
type Props = Pick<
  FormatDate,
  | 'date'
  | 'dateStyle'
  | 'day'
  | 'dayPeriod'
  | 'era'
  | 'hour'
  | 'hour12'
  | 'locale'
  | 'minute'
  | 'month'
  | 'second'
  | 'timeZoneName'
  | 'timeZone'
  | 'timeStyle'
  | 'weekday'
  | 'year'
> & {
  fallback?: string;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    fallback: string;
    dateStyle: 'long';
    timeStyle: 'medium';
  };
  argTypes: {
    date: {
      control: 'date';
    };
    dateStyle: {
      control: 'inline-radio';
      options: (string | undefined)[];
    };
    locale: {
      control: 'inline-radio';
      options: string[];
    };
    timeStyle: {
      control: 'inline-radio';
      options: (string | undefined)[];
    };
    year: {
      control: 'inline-radio';
      options: (string | undefined)[];
    };
    month: {
      control: 'inline-radio';
      options: (string | undefined)[];
    };
    day: {
      control: 'inline-radio';
      options: (string | undefined)[];
    };
    weekday: {
      control: 'inline-radio';
      options: (string | undefined)[];
    };
    dayPeriod: {
      control: 'inline-radio';
      options: (string | undefined)[];
    };
    hour: {
      control: 'inline-radio';
      options: (string | undefined)[];
    };
    minute: {
      control: 'inline-radio';
      options: (string | undefined)[];
    };
    second: {
      control: 'inline-radio';
      options: (string | undefined)[];
    };
    timeZoneName: {
      control: 'inline-radio';
      options: (string | undefined)[];
    };
    timeZone: {
      control: 'text';
    };
    hour12: {
      control: 'boolean';
    };
    era: {
      control: 'inline-radio';
      options: (string | undefined)[];
    };
  };
  render: ({
    fallback,
    date,
    locale,
    dateStyle,
    timeStyle,
    weekday,
    era,
    year,
    month,
    day,
    dayPeriod,
    hour,
    minute,
    second,
    timeZoneName,
    timeZone,
    hour12
  }: Props) => import('lit-html').TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Fallback: Story;
export declare const Locales: Story;
