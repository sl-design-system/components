import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { SelectDay } from './select-day.js';
try {
  customElements.define('sl-select-day', SelectDay);
} catch {}
export default {
  title: 'Date & Time/Calendar/Select Day',
  args: {
    month: /* @__PURE__ */ new Date(),
    showToday: true
  },
  argTypes: {
    disabledDates: {
      control: 'object'
    },
    firstDayOfWeek: {
      control: 'inline-radio',
      options: [0, 1]
    },
    indicatorDates: {
      control: 'object'
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
    readonly: {
      control: 'boolean'
    },
    selected: {
      control: 'date'
    },
    showToday: {
      control: 'boolean'
    },
    showWeekNumbers: {
      control: 'boolean'
    }
  },
  render: ({
    disabledDates,
    firstDayOfWeek,
    indicatorDates,
    max,
    min,
    month,
    readonly,
    selected,
    showToday,
    showWeekNumbers
  }) => html`
    <sl-select-day
      .disabledDates=${disabledDates}
      .indicatorDates=${indicatorDates}
      ?readonly=${readonly}
      ?show-today=${showToday}
      ?show-week-numbers=${showWeekNumbers}
      first-day-of-week=${ifDefined(firstDayOfWeek)}
      max=${ifDefined(max?.toISOString())}
      min=${ifDefined(min?.toISOString())}
      month=${ifDefined(month?.toISOString())}
      selected=${ifDefined(selected?.toISOString())}></sl-select-day>
  `
};
export const Basic = {};
export const DisabledDates = {
  args: {
    disabledDates: [
      new Date(/* @__PURE__ */ new Date().getFullYear(), /* @__PURE__ */ new Date().getMonth(), 5),
      new Date(/* @__PURE__ */ new Date().getFullYear(), /* @__PURE__ */ new Date().getMonth(), 12),
      new Date(/* @__PURE__ */ new Date().getFullYear(), /* @__PURE__ */ new Date().getMonth(), 19)
    ]
  }
};
export const Indicators = {
  args: {
    indicatorDates: [
      {
        date: new Date(
          /* @__PURE__ */ new Date().getFullYear(),
          /* @__PURE__ */ new Date().getMonth(),
          3
        ),
        color: 'blue',
        label: 'Meeting'
      },
      {
        date: new Date(
          /* @__PURE__ */ new Date().getFullYear(),
          /* @__PURE__ */ new Date().getMonth(),
          8
        ),
        color: 'green',
        label: 'Event'
      },
      {
        date: new Date(
          /* @__PURE__ */ new Date().getFullYear(),
          /* @__PURE__ */ new Date().getMonth(),
          15
        ),
        color: 'red',
        label: 'Deadline'
      }
    ]
  }
};
export const Max = {
  args: {
    max: new Date(
      /* @__PURE__ */ new Date().getFullYear(),
      /* @__PURE__ */ new Date().getMonth(),
      20
    ),
    month: /* @__PURE__ */ new Date()
  }
};
export const Min = {
  args: {
    min: new Date(
      /* @__PURE__ */ new Date().getFullYear(),
      /* @__PURE__ */ new Date().getMonth(),
      10
    ),
    month: /* @__PURE__ */ new Date()
  }
};
export const MinMax = {
  args: {
    min: new Date(
      /* @__PURE__ */ new Date().getFullYear(),
      /* @__PURE__ */ new Date().getMonth(),
      10
    ),
    max: new Date(
      /* @__PURE__ */ new Date().getFullYear(),
      /* @__PURE__ */ new Date().getMonth(),
      20
    ),
    month: /* @__PURE__ */ new Date()
  }
};
export const Readonly = {
  args: {
    readonly: true,
    selected: /* @__PURE__ */ new Date()
  }
};
export const Selected = {
  args: {
    selected: /* @__PURE__ */ new Date()
  }
};
export const SundayFirst = {
  args: {
    firstDayOfWeek: 0
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
        grid-template-columns: repeat(auto-fit, minmax(308px, 1fr));
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
        <sl-select-day show-today></sl-select-day>
      </div>
      <div>
        <h3>With Week Numbers</h3>
        <sl-select-day show-today show-week-numbers></sl-select-day>
      </div>
      <div>
        <h3>Sunday First</h3>
        <sl-select-day .firstDayOfWeek=${0} show-today></sl-select-day>
      </div>
      <div>
        <h3>With Selection</h3>
        <sl-select-day .selected=${/* @__PURE__ */ new Date()} show-today></sl-select-day>
      </div>
      <div>
        <h3>Readonly</h3>
        <sl-select-day .selected=${/* @__PURE__ */ new Date()} readonly show-today></sl-select-day>
      </div>
      <div>
        <h3>With Indicators</h3>
        <sl-select-day
          .indicatorDates=${[
            {
              date: new Date(
                /* @__PURE__ */ new Date().getFullYear(),
                /* @__PURE__ */ new Date().getMonth(),
                3
              ),
              color: 'blue',
              label: 'Meeting'
            },
            {
              date: new Date(
                /* @__PURE__ */ new Date().getFullYear(),
                /* @__PURE__ */ new Date().getMonth(),
                8
              ),
              color: 'green',
              label: 'Event'
            }
          ]}
          show-today></sl-select-day>
      </div>
    </div>
  `
};
//# sourceMappingURL=select-day.stories.js.map
