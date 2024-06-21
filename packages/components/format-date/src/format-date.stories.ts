import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html, nothing } from 'lit';
import '../register.js';
import { FormatDate } from './format-date';
import { formatDateTime } from './format-date-time';

interface Props extends FormatDate {
  fallback: string | TemplateResult;
}
type Story = StoryObj<Props>;

export default {
  title: 'Utilities/Format date',
  tags: ['draft'],
  args: {
    fallback: 'invalid date',
    locale: 'en-US',
  },
  argTypes: {
    fallback: {
      table: {
        disable: true
      }
    },
    date: { control: 'date' },
    year: {
      control: 'inline-radio',
      options: ['numeric', '2-digit']
    },
    month: {
      control: 'inline-radio',
      options: ['numeric', '2-digit', 'narrow', 'short', 'long']
    },
    day: {
      control: 'inline-radio',
      options: ['numeric', '2-digit']
    },
    weekday: {
      control: 'inline-radio',
      options: ['narrow', 'short', 'long']
    },
    dayPeriod: {
      control: 'inline-radio',
      options: ['narrow', 'short', 'long']
    },
    hour: {
      control: 'inline-radio',
      options: ['numeric', '2-digit']
    },
    minute: {
      control: 'inline-radio',
      options: ['numeric', '2-digit']
    },
    second: {
      control: 'inline-radio',
      options: ['numeric', '2-digit']
    },
    timeZoneName: {
      control: 'inline-radio',
      options: ['short', 'long']
    },
    timeZone: { control: 'text' },
    hour12: {
      control: 'boolean'
    },
    era: {
      control: 'inline-radio',
      options: ['narrow', 'short', 'long']
    },
  },
  render: ({ fallback,
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
             hour12 }) => html`
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
      .hour12=${hour12}>
      ${fallback}
    </sl-format-date>
  `
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    date: new Date,
    fallback: 'This is not a valid date',
  }
};

export const InvalidDate: Story = {
  args: {
    fallback: 'This date is not valid and I cannot render it.',
  }
};

export const Function: StoryObj = {
  render: ({ date,
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
             hour12 }) => {
              try {
                const options = {
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
                  hour12 };
                const formattedDate = formatDateTime(date ? date : new Date, locale, options);
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
                <article>This is a value rendered with function <code>formatDateTime</code>
                  <span>
                    ${formattedDate ? formattedDate : nothing}
                  </span>
                </article>
            `
              } catch {
                return html`Something went wrong. Please check function parameters.`
              }
            }
};
