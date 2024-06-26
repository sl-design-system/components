import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
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
  title: 'Utilities/Format date',
  tags: ['draft'],
  args: {
    fallback: 'invalid date',
    dateStyle: 'long',
    timeStyle: 'medium'
  },
  argTypes: {
    locale: {
      control: 'inline-radio',
      options: ['de-DE', 'en-GB', 'es-ES', 'fi-FI', 'it-IT', 'nl-NL', 'no-NO', 'pl-PL', 'sv-FI']
    },
    date: { control: 'date' },
    dateStyle: {
      control: 'inline-radio',
      options: ['full', 'long', 'medium', 'short', undefined]
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
      .locale=${locale}
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
    >
      ${fallback}
    </sl-format-date>
  `
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    fallback: 'This is not a valid date'
  }
};

export const Fallback: Story = {
  args: {
    fallback: 'This date is not valid and it cannot be rendered.'
  }
};
