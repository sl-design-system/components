import '@sl-design-system/format-date/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
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
    showWeekNumbers: false
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
    // Mock date in Chromatic is 2025-06-01
    const mockDate = new Date('2025-06-01'),
      selectedDate = new Date('2025-06-15');

    return html`
      <style>
        section {
          display: inline-grid;
          gap: 2rem;
          grid-template-columns: repeat(2, auto);
        }
        .calendar-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .calendar-wrapper > span {
          font-weight: var(--sl-text-new-typeset-fontWeight-semiBold);
        }
      </style>
      <section>
        <div class="calendar-wrapper">
          <span>Basic</span>
          <sl-calendar month=${mockDate.toISOString()}></sl-calendar>
        </div>

        <div class="calendar-wrapper">
          <span>Selected</span>
          <sl-calendar month=${mockDate.toISOString()} selected=${selectedDate.toISOString()}></sl-calendar>
        </div>

        <div class="calendar-wrapper">
          <span>Show Today</span>
          <sl-calendar month=${mockDate.toISOString()} show-today></sl-calendar>
        </div>

        <div class="calendar-wrapper">
          <span>Week Numbers</span>
          <sl-calendar month=${mockDate.toISOString()} show-week-numbers></sl-calendar>
        </div>

        <div class="calendar-wrapper">
          <span>First Day Sunday</span>
          <sl-calendar first-day-of-week="0" month=${mockDate.toISOString()}></sl-calendar>
        </div>

        <div class="calendar-wrapper">
          <span>Min/Max</span>
          <sl-calendar
            max=${new Date('2025-06-20').toISOString()}
            min=${new Date('2025-06-05').toISOString()}
            month=${mockDate.toISOString()}
          ></sl-calendar>
        </div>

        <div class="calendar-wrapper">
          <span>Disabled Dates</span>
          <sl-calendar
            disabled-dates=${[
              new Date('2025-06-10'),
              new Date('2025-06-11'),
              new Date('2025-06-12'),
              new Date('2025-06-18')
            ]
              .map(date => date.toISOString())
              .join(',')}
            month=${mockDate.toISOString()}
          ></sl-calendar>
        </div>

        <div class="calendar-wrapper">
          <span>Indicator Dates</span>
          <sl-calendar
            indicator-dates=${JSON.stringify([
              { date: new Date('2025-06-05').toISOString(), color: 'red', label: 'Important' },
              { date: new Date('2025-06-10').toISOString(), color: 'blue', label: 'Event' },
              { date: new Date('2025-06-15').toISOString(), color: 'green', label: 'Available' },
              { date: new Date('2025-06-20').toISOString(), color: 'yellow', label: 'Reminder' },
              { date: new Date('2025-06-25').toISOString(), color: 'grey', label: 'Note' }
            ])}
            month=${mockDate.toISOString()}
            show-today
          ></sl-calendar>
        </div>

        <div class="calendar-wrapper">
          <span>Readonly</span>
          <sl-calendar month=${mockDate.toISOString()} readonly selected=${selectedDate.toISOString()}></sl-calendar>
        </div>
      </section>
    `;
  }
};
