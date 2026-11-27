import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './register.js';
import { type RelativeTime } from './relative-time.js';

type Props = Pick<RelativeTime, 'format' | 'locale' | 'numeric' | 'sync'> & { date: number };
type Story = StoryObj<Props>;

const locales = ['de', 'en-GB', 'es', 'fi', 'fr', 'it', 'nl', 'nl-BE', 'no', 'pl', 'sv'];

const MINUTE = 60_000,
  HOUR = 60 * MINUTE,
  DAY = 24 * HOUR;

export default {
  title: 'Utilities/Relative time',
  args: {
    date: Date.now() - 5 * MINUTE,
    format: 'long',
    numeric: 'auto',
    sync: true
  },
  argTypes: {
    date: { control: 'date' },
    format: {
      control: 'inline-radio',
      options: ['long', 'short', 'narrow']
    },
    locale: {
      control: 'inline-radio',
      options: locales
    },
    numeric: {
      control: 'inline-radio',
      options: ['auto', 'always']
    }
  },
  render: ({ date, format, locale, numeric, sync }) => html`
    <sl-relative-time
      .date=${date}
      ?sync=${sync}
      format=${ifDefined(format)}
      locale=${ifDefined(locale)}
      numeric=${ifDefined(numeric)}></sl-relative-time>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const All: Story = {
  render: ({ format, locale, numeric }) => {
    const now = Date.now(),
      examples: Array<[string, number]> = [
        ['Now', now],
        ['Now − 5 minutes', now - 5 * MINUTE],
        ['Now − 3 hours', now - 3 * HOUR],
        ['Yesterday, 10:00', new Date(now - DAY).setHours(10, 0, 0, 0)],
        ['Now − 3 days', now - 3 * DAY],
        ['Now − 14 days', now - 14 * DAY],
        ['Now − 120 days', now - 120 * DAY],
        ['Now − 730 days', now - 730 * DAY],
        ['Now + 10 minutes', now + 10 * MINUTE],
        ['Tomorrow, 9:30', new Date(now + DAY).setHours(9, 30, 0, 0)],
        ['Now + 21 days', now + 21 * DAY]
      ];

    return html`
      <style>
        dl {
          display: grid;
          gap: 0.5rem 2rem;
          grid-template-columns: auto 1fr;
          margin: 0;
        }
        dt {
          color: var(--sl-color-foreground-subtle);
        }
        dd {
          margin: 0;
        }
      </style>
      <p>The date that is passed in, and how it is shown.</p>
      <dl>
        ${examples.map(
          ([label, date]) => html`
            <dt>${label}</dt>
            <dd>
              <sl-relative-time
                .date=${date}
                format=${ifDefined(format)}
                locale=${ifDefined(locale)}
                numeric=${ifDefined(numeric)}
                sync></sl-relative-time>
            </dd>
          `
        )}
      </dl>
    `;
  }
};
