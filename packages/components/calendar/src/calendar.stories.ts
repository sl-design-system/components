import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type Calendar } from './calendar.js';

type Props = Pick<
  Calendar,
  'firstDayOfWeek' | 'locale' | 'month' | 'readonly' | 'selected' | 'showToday' | 'showWeekNumbers'
>;
type Story = StoryObj<Props>;

export default {
  title: 'Calendar/Calendar',
  tags: ['draft'],
  args: {
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
    },
    selected: {
      control: 'date'
    }
  },
  render: ({ firstDayOfWeek, locale, month, readonly, selected, showToday, showWeekNumbers }) => {
    return html`
      <sl-calendar
        ?readonly=${readonly}
        ?show-today=${showToday}
        ?show-week-numbers=${showWeekNumbers}
        first-day-of-week=${ifDefined(firstDayOfWeek)}
        locale=${ifDefined(locale)}
        month=${ifDefined(month?.toISOString())}
        selected=${ifDefined(selected?.toISOString())}
      ></sl-calendar>
    `;
  }
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

export const Selected: Story = {
  args: {
    month: new Date(2024, 10, 1),
    selected: new Date(2024, 10, 15)
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
