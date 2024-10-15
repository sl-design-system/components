import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
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
> & { fallback?: string };
type Story = StoryObj<Props>;

export default {
  title: 'Date & Time/Format date',
  tags: ['draft'],
  args: {
    fallback: 'invalid date',
    dateStyle: 'long',
    timeStyle: 'medium'
  },
  argTypes: {
    date: { control: 'date' },
    dateStyle: {
      control: 'inline-radio',
      options: ['full', 'long', 'medium', 'short', undefined]
    },
    locale: {
      control: 'inline-radio',
      options: ['de', 'en-GB', 'es', 'fi', 'fr', 'it', 'nl', 'nl-BE', 'no', 'pl', 'sv']
    },
    timeStyle: {
      control: 'inline-radio',
      options: ['full', 'long', 'medium', 'short', undefined]
    },
    year: {
      control: 'inline-radio',
      options: ['numeric', '2-digit', undefined]
    },
    month: {
      control: 'inline-radio',
      options: ['numeric', '2-digit', 'narrow', 'short', 'long', undefined]
    },
    day: {
      control: 'inline-radio',
      options: ['numeric', '2-digit', undefined]
    },
    weekday: {
      control: 'inline-radio',
      options: ['narrow', 'short', 'long', undefined]
    },
    dayPeriod: {
      control: 'inline-radio',
      options: ['narrow', 'short', 'long', undefined]
    },
    hour: {
      control: 'inline-radio',
      options: ['numeric', '2-digit', undefined]
    },
    minute: {
      control: 'inline-radio',
      options: ['numeric', '2-digit', undefined]
    },
    second: {
      control: 'inline-radio',
      options: ['numeric', '2-digit', undefined]
    },
    timeZoneName: {
      control: 'inline-radio',
      options: ['short', 'long', undefined]
    },
    timeZone: { control: 'text' },
    hour12: {
      control: 'boolean'
    },
    era: {
      control: 'inline-radio',
      options: ['narrow', 'short', 'long', undefined]
    }
  },
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
  }) => html`
    <sl-format-date
      .date=${date}
      .dateStyle=${dateStyle}
      .timeStyle=${timeStyle}
      .weekday=${weekday}
      .era=${era}
      .year=${year}
      .month=${month}
      .day=${day}
      .dayPeriod=${dayPeriod}
      .hour=${hour}
      .minute=${minute}
      .second=${second}
      .timeZoneName=${timeZoneName}
      .timeZone=${timeZone}
      .hour12=${hour12}
      locale=${ifDefined(locale)}
    >
      ${fallback}
    </sl-format-date>
  `
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    date: new Date()
  }
};

export const Fallback: Story = {
  args: {
    fallback:
      'You can use the fallback slot to provide a message when the date is not valid (this includes when a date is not set). This can be useful if you want to show a placeholder or an error message.'
  }
};
