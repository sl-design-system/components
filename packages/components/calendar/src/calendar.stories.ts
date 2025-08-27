import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type Calendar } from './calendar.js';

type Props = Pick<
  Calendar,
  | 'firstDayOfWeek'
  | 'locale'
  | 'indicator'
  | 'max'
  | 'min'
  | 'month'
  | 'readonly'
  | 'selected'
  | 'showToday'
  | 'showWeekNumbers'
  | 'negative'
>;
type Story = StoryObj<Props>;

export default {
  title: 'Date & Time/Calendar',
  tags: ['draft'],
  args: {
    readonly: false,
    showToday: false,
    showWeekNumbers: false,
    month: new Date(2024, 8, 15)
  },
  argTypes: {
    firstDayOfWeek: {
      control: 'number'
    },
    locale: {
      control: 'inline-radio',
      options: ['de', 'en-GB', 'es', 'fi', 'fr', 'it', 'nl', 'nl-BE', 'no', 'pl', 'sv']
    },
    max: {
      control: 'date'
    },
    min: {
      control: 'date'
    },
    month: {
      control: 'date'
    },
    selected: {
      control: 'date'
    },
    negative: {
      control: 'date'
    },
    indicator: {
      control: 'date'
    }
  },
  render: ({
    firstDayOfWeek,
    indicator,
    locale,
    max,
    min,
    month,
    negative,
    readonly,
    selected,
    showToday,
    showWeekNumbers
  }) => {
    const parseDate = (value: string | Date | undefined): Date | undefined => {
      if (!value) {
        return undefined;
      }

      return value instanceof Date ? value : new Date(value);
    };

    return html`
      <sl-calendar
        ?readonly=${readonly}
        ?show-today=${showToday}
        ?show-week-numbers=${showWeekNumbers}
        first-day-of-week=${ifDefined(firstDayOfWeek)}
        locale=${ifDefined(locale)}
        max=${ifDefined(parseDate(max)?.toISOString())}
        min=${ifDefined(parseDate(min)?.toISOString())}
        month=${ifDefined(parseDate(month)?.toISOString())}
        selected=${ifDefined(parseDate(selected)?.toISOString())}
        negative=${ifDefined(negative?.map(date => date.toISOString()).join(','))}
        indicator=${ifDefined(indicator?.map(date => date.toISOString()).join(','))}
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

export const MinMax: Story = {
  args: {
    month: new Date(2025, 0, 1),
    max: new Date(2025, 0, 20),
    min: new Date(2025, 0, 10)
  }
};

export const Readonly: Story = {
  args: {
    readonly: true
  }
};

export const Selected: Story = {
  args: {
    selected: new Date(1755640800000),
    showToday: true,
    month: new Date(1755640800000)
  }
};

export const Negative: Story = {
  args: {
    negative: [new Date(), new Date('2025-08-07')],
    showToday: true,
    month: new Date(1755640800000)
  }
};

export const Indicator: Story = {
  args: {
    indicator: [new Date(), new Date('2025-08-05')],
    showToday: true,
    month: new Date(1755640800000)
  }
};

export const Today: Story = {
  args: {
    showToday: true,
    month: undefined
  }
};

export const WeekNumbers: Story = {
  args: {
    showWeekNumbers: true
  }
};

export const All: Story = {
  args: {
    indicator: [
      getOffsetDate(0),
      getOffsetDate(1),
      getOffsetDate(6),
      getOffsetDate(-6),
      getOffsetDate(3),
      getOffsetDate(8),
      getOffsetDate(-8)
    ],
    negative: [
      getOffsetDate(2),
      getOffsetDate(7),
      getOffsetDate(-7),
      getOffsetDate(3),
      getOffsetDate(8),
      getOffsetDate(-8)
    ],
    showToday: true,
    month: new Date(),
    max: getOffsetDate(5),
    min: getOffsetDate(-5)
  }
};

function getOffsetDate(offset: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date;
}
