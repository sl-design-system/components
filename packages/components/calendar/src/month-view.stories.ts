import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type MonthView } from './month-view.js';

type Props = Pick<MonthView, 'firstDayOfWeek' | 'locale' | 'month' | 'showWeekNumbers'>;
type Story = StoryObj<Props>;

export default {
  title: 'Components/Month view',
  tags: ['draft'],
  args: {
    month: new Date(),
    showWeekNumbers: false
  },
  argTypes: {
    firstDayOfWeek: {
      control: 'number'
    },
    locale: {
      control: 'inline-radio',
      options: ['de', 'en-GB', 'es', 'fi', 'it', 'nl', 'no', 'pl', 'sv']
    },
    month: {
      control: 'date'
    }
  },
  render: ({ firstDayOfWeek, month, locale, showWeekNumbers }) => html`
    <sl-month-view
      ?show-week-numbers=${showWeekNumbers}
      first-day-of-week=${ifDefined(firstDayOfWeek)}
      locale=${ifDefined(locale)}
      month=${ifDefined(month ? month.toISOString() : undefined)}
    ></sl-month-view>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};
