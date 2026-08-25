import { faFlag } from '@fortawesome/pro-regular-svg-icons';
import { Icon } from '@sl-design-system/icon';
import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
Icon.register(faFlag);
export default {
  title: 'Date & Time/Month view',
  args: {
    hideDaysOtherMonths: false,
    month: /* @__PURE__ */ new Date(),
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
      control: 'date'
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
    renderer: {
      table: { disable: true }
    },
    selected: {
      control: 'date'
    },
    styles: {
      table: { disable: true }
    }
  },
  render: ({
    disabledDates,
    firstDayOfWeek,
    hideDaysOtherMonths,
    indicatorDates,
    locale,
    max,
    min,
    month,
    readonly,
    renderer,
    selected,
    showToday,
    showWeekNumbers,
    styles
  }) => html`
    ${
      styles
        ? html`
            <style>
              ${styles}
            </style>
          `
        : nothing
    }
    <sl-month-view
      ?hide-days-other-months=${hideDaysOtherMonths}
      ?readonly=${readonly}
      ?show-today=${showToday}
      ?show-week-numbers=${showWeekNumbers}
      .renderer=${renderer}
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
      max=${ifDefined(max?.toISOString())}
      min=${ifDefined(min?.toISOString())}
      month=${ifDefined(month ? new Date(month).toISOString() : void 0)}
      selected=${ifDefined(selected ? new Date(selected).toISOString() : void 0)}></sl-month-view>
  `
};
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
export const Basic = {};
export const FirstDayOfWeek = {
  args: {
    firstDayOfWeek: 0
  }
};
export const HideDaysOtherMonths = {
  args: {
    hideDaysOtherMonths: true
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
export const Renderer = {
  args: {
    renderer: (day, monthView) => {
      if (day.currentMonth && day.date.getDate() === 24) {
        const label = `${monthView.getDayLabel(day)}, Goal achieved!`,
          parts = [...monthView.getDayParts(day), 'finish'];
        return html`
          <button aria-label=${label} .part=${parts.join(' ')}>
            <span><sl-icon name="far-flag"></sl-icon></span>
          </button>
        `;
      } else {
        return void 0;
      }
    },
    styles: `
      sl-month-view::part(finish) {
        --_bg-color: var(--sl-color-background-positive-subtle);
        --_bg-mix-color: var(--sl-color-background-positive-interactive-bold);
      }
    `
  }
};
export const Selected = {
  args: {
    month: new Date(2024, 11, 10),
    selected: new Date(2024, 11, 4)
  }
};
export const Today = {
  args: {
    showToday: true
  }
};
export const IndicatorDates = {
  args: {
    indicatorDates: [
      { date: /* @__PURE__ */ new Date('2025-08-05'), label: indicatorLabels.default.label },
      {
        date: /* @__PURE__ */ new Date('2025-08-06'),
        color: 'blue',
        label: indicatorLabels.blue.label
      },
      {
        date: /* @__PURE__ */ new Date('2025-08-07'),
        color: 'red',
        label: indicatorLabels.red.label
      },
      {
        date: /* @__PURE__ */ new Date('2025-08-09'),
        color: 'yellow',
        label: indicatorLabels.yellow.label
      },
      {
        date: /* @__PURE__ */ new Date('2025-08-10'),
        color: 'green',
        label: indicatorLabels.green.label
      },
      {
        date: /* @__PURE__ */ new Date('2025-08-20'),
        color: 'grey',
        label: indicatorLabels.grey.label
      },
      {
        date: /* @__PURE__ */ new Date('2025-08-22'),
        color: 'green',
        label: indicatorLabels.green.label
      },
      {
        date: /* @__PURE__ */ new Date('2025-08-27'),
        color: 'yellow',
        label: indicatorLabels.yellow.label
      }
    ],
    month: /* @__PURE__ */ new Date(17556408e5),
    showToday: true
  }
};
export const DisabledDates = {
  args: {
    disabledDates: [
      /* @__PURE__ */ new Date('2025-10-06'),
      /* @__PURE__ */ new Date('2025-10-07'),
      /* @__PURE__ */ new Date('2025-10-17')
    ],
    max: new Date(2025, 9, 25),
    min: new Date(2025, 9, 4),
    month: new Date(2025, 9, 1)
  }
};
export const WeekNumbers = {
  args: {
    showWeekNumbers: true
  }
};
export const All = {
  render: () => html`
    <style>
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 2rem;
      }
      .grid > div {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .grid h3 {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
      }
    </style>
    <div class="grid">
      <div>
        <h3>Basic</h3>
        <sl-month-view .month=${/* @__PURE__ */ new Date()}></sl-month-view>
      </div>
      <div>
        <h3>First day of week (Sunday)</h3>
        <sl-month-view .firstDayOfWeek=${0} .month=${/* @__PURE__ */ new Date()}></sl-month-view>
      </div>
      <div>
        <h3>Hide days from other months</h3>
        <sl-month-view hide-days-other-months .month=${/* @__PURE__ */ new Date()}></sl-month-view>
      </div>
      <div>
        <h3>Min/Max range</h3>
        <sl-month-view
          .max=${new Date(2025, 0, 20)}
          .min=${new Date(2025, 0, 10)}
          .month=${new Date(2025, 0, 1)}></sl-month-view>
      </div>
      <div>
        <h3>Readonly</h3>
        <sl-month-view readonly .month=${/* @__PURE__ */ new Date()}></sl-month-view>
      </div>
      <div>
        <h3>Selected date</h3>
        <sl-month-view
          .month=${new Date(2024, 11, 10)}
          .selected=${new Date(2024, 11, 4)}></sl-month-view>
      </div>
      <div>
        <h3>Show today</h3>
        <sl-month-view show-today .month=${/* @__PURE__ */ new Date()}></sl-month-view>
      </div>
      <div>
        <h3>Indicator dates</h3>
        <sl-month-view
          .indicatorDates=${[
            { date: /* @__PURE__ */ new Date('2025-08-05'), label: indicatorLabels.default.label },
            {
              date: /* @__PURE__ */ new Date('2025-08-06'),
              color: 'blue',
              label: indicatorLabels.blue.label
            },
            {
              date: /* @__PURE__ */ new Date('2025-08-07'),
              color: 'red',
              label: indicatorLabels.red.label
            },
            {
              date: /* @__PURE__ */ new Date('2025-08-09'),
              color: 'yellow',
              label: indicatorLabels.yellow.label
            },
            {
              date: /* @__PURE__ */ new Date('2025-08-10'),
              color: 'green',
              label: indicatorLabels.green.label
            }
          ]}
          .month=${/* @__PURE__ */ new Date(17556408e5)}
          show-today></sl-month-view>
      </div>
      <div>
        <h3>Disabled dates</h3>
        <sl-month-view
          .disabledDates=${[/* @__PURE__ */ new Date('2025-10-06'), /* @__PURE__ */ new Date('2025-10-07'), /* @__PURE__ */ new Date('2025-10-17')]}
          .max=${new Date(2025, 9, 25)}
          .min=${new Date(2025, 9, 4)}
          .month=${new Date(2025, 9, 1)}></sl-month-view>
      </div>
      <div>
        <h3>Week numbers</h3>
        <sl-month-view show-week-numbers .month=${/* @__PURE__ */ new Date()}></sl-month-view>
      </div>
    </div>
  `
};
//# sourceMappingURL=month-view.stories.js.map
