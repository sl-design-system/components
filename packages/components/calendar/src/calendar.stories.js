import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { useArgs } from 'storybook/internal/preview-api';
import '../register.js';
const indicatorLabels = {
  red: {
    label: 'Exam \u2014 Important'
  },
  blue: {
    label: 'Homework Deadline'
  },
  green: {
    label: 'Available \u2014 Open slot for study'
  },
  yellow: {
    label: 'Reminder \u2014 A parent\u2011teacher meeting'
  },
  grey: {
    label: 'Event \u2014 Informational'
  },
  default: {
    // same as blue
    label: 'Homework Deadline'
  }
};
export default {
  title: 'Date & Time/Calendar',
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
    const parseDate = value => {
      if (!value) {
        return void 0;
      }
      return value instanceof Date ? value : new Date(value);
    };
    const onSelectDate = event => {
      updateArgs({ selected: event.detail.getTime() });
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
            : void 0
        )}
        locale=${ifDefined(locale)}
        max=${ifDefined(parseDate(max)?.toISOString())}
        min=${ifDefined(parseDate(min)?.toISOString())}
        month=${ifDefined(parseDate(month)?.toISOString())}
        selected=${ifDefined(parseDate(selected)?.toISOString())}></sl-calendar>
    `;
  }
};
export const Basic = {};
export const FirstDayOfWeek = {
  args: {
    firstDayOfWeek: 0
  }
};
export const Min = {
  args: {
    min: new Date(2025, 0, 10),
    month: new Date(2025, 0, 1)
  }
};
export const Max = {
  args: {
    max: new Date(2025, 0, 20),
    month: new Date(2025, 0, 1)
  }
};
export const MinMax = {
  args: {
    max: new Date(2025, 0, 20),
    min: new Date(2025, 0, 10),
    month: new Date(2025, 0, 1)
  }
};
export const Readonly = {
  args: {
    readonly: true
  }
};
export const Selected = {
  args: {
    month: /* @__PURE__ */ new Date(17556408e5),
    selected: /* @__PURE__ */ new Date(17556408e5),
    showToday: true
  }
};
export const IndicatorDates = {
  args: {
    indicatorDates: [
      { date: /* @__PURE__ */ new Date(), color: 'red', label: indicatorLabels.red.label },
      {
        date: /* @__PURE__ */ new Date('2025-09-05'),
        color: 'blue',
        label: indicatorLabels.blue.label
      },
      { date: /* @__PURE__ */ new Date('2025-09-24'), label: indicatorLabels.default.label },
      {
        date: /* @__PURE__ */ new Date('2025-09-09'),
        color: 'green',
        label: indicatorLabels.green.label
      },
      {
        date: /* @__PURE__ */ new Date('2025-09-11'),
        color: 'grey',
        label: indicatorLabels.grey.label
      },
      {
        date: /* @__PURE__ */ new Date('2025-09-12'),
        color: 'yellow',
        label: indicatorLabels.yellow.label
      },
      {
        date: /* @__PURE__ */ new Date('2025-09-18'),
        color: 'red',
        label: indicatorLabels.red.label
      }
    ],
    month: /* @__PURE__ */ new Date('2025-09-01'),
    showToday: true
  }
};
export const DisabledDates = {
  args: {
    disabledDates: [
      /* @__PURE__ */ new Date('2025-10-06'),
      /* @__PURE__ */ new Date('2025-10-07'),
      /* @__PURE__ */ new Date('2025-10-10')
    ],
    max: new Date(2025, 10, 20),
    min: new Date(2025, 9, 4),
    month: new Date(2025, 9, 20)
  }
};
export const Today = {
  args: {
    month: void 0,
    showToday: true
  }
};
export const WeekNumbers = {
  args: {
    showWeekNumbers: true
  }
};
export const All = {
  render: () => {
    const mockDate = /* @__PURE__ */ new Date('2025-06-01'),
      selectedDate = /* @__PURE__ */ new Date('2025-06-15');
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
          <sl-calendar
            month=${mockDate.toISOString()}
            selected=${selectedDate.toISOString()}></sl-calendar>
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
            max=${/* @__PURE__ */ new Date('2025-06-20').toISOString()}
            min=${/* @__PURE__ */ new Date('2025-06-05').toISOString()}
            month=${mockDate.toISOString()}></sl-calendar>
        </div>

        <div class="calendar-wrapper">
          <span>Disabled Dates</span>
          <sl-calendar
            disabled-dates=${[
              /* @__PURE__ */ new Date('2025-06-10'),
              /* @__PURE__ */ new Date('2025-06-11'),
              /* @__PURE__ */ new Date('2025-06-12'),
              /* @__PURE__ */ new Date('2025-06-18')
            ]
              .map(date => date.toISOString())
              .join(',')}
            month=${mockDate.toISOString()}></sl-calendar>
        </div>

        <div class="calendar-wrapper">
          <span>Indicator Dates</span>
          <sl-calendar
            indicator-dates=${JSON.stringify([
              {
                date: /* @__PURE__ */ new Date('2025-06-05').toISOString(),
                color: 'red',
                label: 'Important'
              },
              {
                date: /* @__PURE__ */ new Date('2025-06-10').toISOString(),
                color: 'blue',
                label: 'Event'
              },
              {
                date: /* @__PURE__ */ new Date('2025-06-15').toISOString(),
                color: 'green',
                label: 'Available'
              },
              {
                date: /* @__PURE__ */ new Date('2025-06-20').toISOString(),
                color: 'yellow',
                label: 'Reminder'
              },
              {
                date: /* @__PURE__ */ new Date('2025-06-25').toISOString(),
                color: 'grey',
                label: 'Note'
              }
            ])}
            month=${mockDate.toISOString()}
            show-today></sl-calendar>
        </div>

        <div class="calendar-wrapper">
          <span>Readonly</span>
          <sl-calendar
            month=${mockDate.toISOString()}
            readonly
            selected=${selectedDate.toISOString()}></sl-calendar>
        </div>
      </section>
    `;
  }
};
//# sourceMappingURL=calendar.stories.js.map
