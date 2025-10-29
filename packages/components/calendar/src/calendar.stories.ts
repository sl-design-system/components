import '@sl-design-system/format-date/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { useArgs } from 'storybook/internal/preview-api';
import '../register.js';
import { type Calendar } from './calendar.js';
import { IndicatorColor } from './utils.js';

type Props = Pick<
  Calendar,
  | 'disabledDates'
  | 'firstDayOfWeek'
  | 'indicatorDates'
  | 'locale'
  | 'max'
  | 'min'
  | 'month'
  | 'negative'
  | 'readonly'
  | 'selected'
  | 'showToday'
  | 'showWeekNumbers'
>;
type Story = StoryObj<Props>;

export default {
  title: 'Date & Time/Calendar',
  tags: ['draft'],
  args: {
    readonly: false,
    showToday: false,
    showWeekNumbers: false,
    month: new Date(2025, 8, 15)
  },
  argTypes: {
    disabledDates: {
      control: 'date'
    },
    firstDayOfWeek: {
      control: 'number'
    },
    indicatorDates: {
      control: { type: 'object' },
      description: 'Array of objects: {date: Date, color: string, label?: string}'
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
    negative: {
      control: 'date'
    },
    selected: {
      control: 'date'
    }
  },
  render: ({
    disabledDates,
    firstDayOfWeek,
    indicatorDates,
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
    const [_, updateArgs] = useArgs();
    const parseDate = (value: string | Date | undefined): Date | undefined => {
      if (!value) {
        return undefined;
      }

      return value instanceof Date ? value : new Date(value);
    };

    const onSelectDate = (event: CustomEvent<Date>) => {
      updateArgs({ selected: new Date(event.detail).getTime() }); //needs to be set to the 'time' otherwise Storybook chokes on the date format 🤷
    };

    return html`
      <sl-calendar
        @sl-change=${onSelectDate}
        ?readonly=${readonly}
        ?show-today=${showToday}
        ?show-week-numbers=${showWeekNumbers}
        disabled-dates=${ifDefined(disabledDates?.map(date => date.toISOString()).join(','))}
        first-day-of-week=${ifDefined(firstDayOfWeek)}
        indicator-dates=${ifDefined(
          Array.isArray(indicatorDates)
            ? JSON.stringify(
                indicatorDates
                  .filter(item => item?.date)
                  .map(item => ({
                    date: item.date.toISOString(),
                    ...(item.color ? { color: item.color } : {}),
                    ...(item.label ? { label: item.label } : {})
                  }))
              )
            : undefined
        )}
        locale=${ifDefined(locale)}
        max=${ifDefined(parseDate(max)?.toISOString())}
        min=${ifDefined(parseDate(min)?.toISOString())}
        month=${ifDefined(parseDate(month)?.toISOString())}
        negative=${ifDefined(negative?.map(date => date.toISOString()).join(','))}
        selected=${ifDefined(parseDate(selected)?.toISOString())}
      ></sl-calendar>
    `;
  }
} satisfies Meta<Props>;

const indicatorLabels: Record<string, { label: string }> = {
  red: {
    label: 'Exam — Important'
  },
  blue: {
    label: 'Homework Deadline'
  },
  green: {
    label: 'Available — Open slot for study'
  },
  yellow: {
    label: 'Reminder — A parent‑teacher meeting'
  },
  grey: {
    label: 'Event — Informational'
  },
  default: {
    // same as blue
    label: 'Homework Deadline'
  }
};

export const Basic: Story = {};

export const FirstDayOfWeek: Story = {
  args: {
    firstDayOfWeek: 0
  }
};

export const MinMax: Story = {
  args: {
    max: new Date(2025, 0, 20),
    min: new Date(2025, 0, 10),
    month: new Date(2025, 0, 1)
  }
};

export const Readonly: Story = {
  args: {
    readonly: true
  }
};

export const Selected: Story = {
  args: {
    month: new Date(1755640800000),
    selected: new Date(1755640800000),
    showToday: true
  }
};

export const Negative: Story = {
  args: {
    month: new Date(1755640800000),
    negative: [new Date(), new Date('2025-08-07')],
    showToday: true
  }
};

export const IndicatorDates: Story = {
  args: {
    indicatorDates: [
      { date: new Date(), color: 'red', label: indicatorLabels.red.label },
      { date: new Date('2025-09-05'), color: 'blue' as IndicatorColor, label: indicatorLabels.blue.label },
      { date: new Date('2025-09-24'), label: indicatorLabels.default.label },
      { date: new Date('2025-09-09'), color: 'green' as IndicatorColor, label: indicatorLabels.green.label },
      { date: new Date('2025-09-11'), color: 'grey' as IndicatorColor, label: indicatorLabels.grey.label },
      { date: new Date('2025-09-12'), color: 'yellow' as IndicatorColor, label: indicatorLabels.yellow.label },
      { date: new Date('2025-09-18'), color: 'red', label: indicatorLabels.red.label }
    ],
    month: new Date('2025-09-01'),
    showToday: true
  }
};

export const DisabledDates: Story = {
  args: {
    disabledDates: [new Date('2025-10-06'), new Date('2025-10-07'), new Date('2025-10-10')],
    max: new Date(2025, 10, 20),
    min: new Date(2025, 9, 4),
    month: new Date(2025, 9, 20)
  }
};

export const Today: Story = {
  args: {
    month: undefined,
    showToday: true
  }
};

export const WeekNumbers: Story = {
  args: {
    showWeekNumbers: true
  }
};

export const All: Story = {
  render: () => {
    const parseDate = (value: string | Date | undefined): Date | undefined => {
      if (!value) {
        return undefined;
      }

      return value instanceof Date ? value : new Date(value);
    };
    const getOffsetDate = (offset: number, setDate?: Date): Date => {
      const date = setDate ? new Date(setDate) : new Date();
      date.setDate(date.getDate() + offset);
      return date;
    };

    const renderMonth = (settings: Props): TemplateResult => {
      return html`
        <sl-calendar
          ?show-today=${ifDefined(settings.showToday)}
          indicator-dates=${ifDefined(
            Array.isArray(settings.indicatorDates)
              ? JSON.stringify(
                  settings.indicatorDates
                    .filter(item => item?.date)
                    .map(item => ({
                      date: item.date.toISOString(),
                      ...(item.color ? { color: item.color } : {}),
                      ...(item.label ? { label: item.label } : {})
                    }))
                )
              : undefined
          )}
          max=${ifDefined(parseDate(settings.max)?.toISOString())}
          min=${ifDefined(parseDate(settings.min)?.toISOString())}
          month=${ifDefined(parseDate(settings.month)?.toISOString())}
          negative=${ifDefined(settings.negative?.map(date => date.toISOString()).join(','))}
          selected=${ifDefined(parseDate(settings.selected)?.toISOString())}
          show-week-numbers="true"
        ></sl-calendar>
      `;
    };
    const monthEndDate = new Date();
    const monthEnd = {
      indicatorDates: [
        { date: getOffsetDate(3, monthEndDate), color: 'red' as IndicatorColor, label: indicatorLabels.red.label }
      ],
      max: getOffsetDate(5, monthEndDate),
      min: getOffsetDate(-5, monthEndDate),
      month: monthEndDate,
      negative: [getOffsetDate(2, monthEndDate)],
      selected: getOffsetDate(4, monthEndDate),
      showToday: false
    };

    const indicatorDates = {
      indicatorDates: [
        { date: getOffsetDate(0), color: 'red' as IndicatorColor, label: indicatorLabels.red.label },
        { date: getOffsetDate(1), color: 'blue' as IndicatorColor, label: indicatorLabels.blue.label },
        { date: getOffsetDate(2), color: 'yellow' as IndicatorColor, label: indicatorLabels.yellow.label },
        { date: getOffsetDate(3), color: 'grey' as IndicatorColor, label: indicatorLabels.grey.label },
        { date: getOffsetDate(5), color: 'green' as IndicatorColor, label: indicatorLabels.green.label },
        { date: getOffsetDate(8), color: 'green' as IndicatorColor, label: indicatorLabels.green.label }
      ], // make sure one is outside the min/max range
      max: getOffsetDate(5),
      min: getOffsetDate(-5),
      month: new Date(),
      selected: getOffsetDate(1),
      showToday: true
    };
    const indicatorToday = {
      ...indicatorDates,
      selected: getOffsetDate(0)
    };
    const negative = {
      max: getOffsetDate(5),
      min: getOffsetDate(-5),
      month: new Date(),
      negative: [getOffsetDate(0), getOffsetDate(1), getOffsetDate(6)], // make sure one it outside the min/max range
      selected: getOffsetDate(1),
      showToday: true
    };

    const negativeToday = {
      ...negative,
      selected: getOffsetDate(0)
    };
    return html`
      <style>
        .container {
          display: flex;
          gap: 1.2rem;
        }
      </style>
      <h1>Month End (${monthEndDate.toLocaleDateString()})</h1>
      <p>
        Selected, negative and date with indicator are all in the next month, but have the same styling as they would
        within the current month.
      </p>
      ${renderMonth(monthEnd)}
      <h1>Today</h1>
      <p>Shows current month with 'today' highlighted, in combination with selected, indicator and negative</p>
      <h2>Indicator</h2>
      <div class="container">${renderMonth(indicatorDates)} ${renderMonth(indicatorToday)}</div>
      <h2>Negative</h2>
      <div class="container">${renderMonth(negative)} ${renderMonth(negativeToday)}</div>
    `;
  }
};
