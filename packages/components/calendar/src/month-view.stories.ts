import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type MonthView } from './month-view.js';

type Props = Pick<MonthView, 'firstDayOfWeek' | 'locale' | 'month' | 'readonly' | 'showToday' | 'showWeekNumbers'>;
type Story = StoryObj<Props>;

export default {
  title: 'Calendar/Month view',
  tags: ['draft'],
  args: {
    month: new Date(),
    readonly: false,
    showToday: false,
    showWeekNumbers: false
  },
  argTypes: {
    firstDayOfWeek: {
      control: 'number'
    },
    locale: {
      control: 'inline-radio',
      options: ['de', 'en-GB', 'es', 'fi', 'fr', 'it', 'nl', 'nl-BE', 'no', 'pl', 'sv']
    },
    month: {
      control: 'date'
    }
  },
  render: ({ firstDayOfWeek, month, locale, readonly, showToday, showWeekNumbers }) => html`
    <sl-month-view
      ?readonly=${readonly}
      ?show-today=${showToday}
      ?show-week-numbers=${showWeekNumbers}
      first-day-of-week=${ifDefined(firstDayOfWeek)}
      locale=${ifDefined(locale)}
      month=${ifDefined(month ? month.toISOString() : undefined)}
    ></sl-month-view>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const FirstDayOfWeek: Story = {
  args: {
    firstDayOfWeek: 0
  }
};

export const Readonly: Story = {
  args: {
    readonly: true
  }
};

export const Today: Story = {
  args: {
    showToday: true
  }
};

export const WeekNumbers: Story = {
  args: {
    showWeekNumbers: true
  }
};
