import { type Meta, type StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit';
import '../register.js';
import { format } from './format';
import { type FormatDate } from './format-date.js';

type Props = Pick<
  FormatDate,
  | 'locale'
  | 'date'
  | 'year'
  | 'month'
  | 'day'
  | 'weekday'
  | 'dayPeriod'
  | 'hour'
  | 'minute'
  | 'second'
  | 'timeZoneName'
  | 'timeZone'
  | 'hour12'
  | 'era'
> & { fallback?: string };
type Story = StoryObj<Props>;

export default {
  title: 'Utilities/Format date',
  tags: ['draft'],
  args: {
    fallback: 'invalid date'
  },
  argTypes: {
    locale: {
      control: 'inline-radio',
      options: ['de', 'en', 'es', 'fi', 'it', 'nl', 'no', 'pl', 'sv']
    },
    date: { control: 'date' },
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

export const InvalidDate: Story = {
  args: {
    fallback: 'This date is not valid and I cannot render it.'
  }
};

export const Function: StoryObj = {
  render: props => {
    const { date, locale, ...options } = props;

    try {
      const formattedDate = format(
        date ? (date as Date) : new Date(),
        locale as string,
        options as Intl.DateTimeFormatOptions | undefined
      );

      return html`
        <style>
          article {
            display: flex;
            flex-direction: column;
          }

          span {
            margin-block: 16px;
            font-size: 24px;
            font-weight: 600;
          }
        </style>
        <article>
          This is a value rendered with function <code>format</code>
          <span>${formattedDate ? formattedDate : nothing}</span>
        </article>
      `;
    } catch {
      return html`Something went wrong. Please check function parameters.`;
    }
  }
};
