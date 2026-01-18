import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { SelectDay } from './select-day.js';

type Props = Pick<
  SelectDay,
  | 'disabledDates'
  | 'firstDayOfWeek'
  | 'indicatorDates'
  | 'max'
  | 'min'
  | 'month'
  | 'readonly'
  | 'selected'
  | 'showToday'
  | 'showWeekNumbers'
>;
type Story = StoryObj<Props>;

try {
  customElements.define('sl-select-day', SelectDay);
} catch {
  /* empty */
}

export default {
  title: 'Date & Time/Calendar/Select Day',
  tags: ['draft'],
  args: {
    month: new Date(),
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
      selected=${ifDefined(selected?.toISOString())}
    ></sl-select-day>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const DisabledDates: Story = {
  args: {
    disabledDates: [
      new Date(new Date().getFullYear(), new Date().getMonth(), 5),
      new Date(new Date().getFullYear(), new Date().getMonth(), 12),
      new Date(new Date().getFullYear(), new Date().getMonth(), 19)
    ]
  }
};

export const Indicators: Story = {
  args: {
    indicatorDates: [
      { date: new Date(new Date().getFullYear(), new Date().getMonth(), 3), color: 'blue', label: 'Meeting' },
      { date: new Date(new Date().getFullYear(), new Date().getMonth(), 8), color: 'green', label: 'Event' },
      { date: new Date(new Date().getFullYear(), new Date().getMonth(), 15), color: 'red', label: 'Deadline' }
    ]
  }
};

export const Max: Story = {
  args: {
    max: new Date(new Date().getFullYear(), new Date().getMonth(), 20),
    month: new Date()
  }
};

export const Min: Story = {
  args: {
    min: new Date(new Date().getFullYear(), new Date().getMonth(), 10),
    month: new Date()
  }
};

export const MinMax: Story = {
  args: {
    min: new Date(new Date().getFullYear(), new Date().getMonth(), 10),
    max: new Date(new Date().getFullYear(), new Date().getMonth(), 20),
    month: new Date()
  }
};

export const Readonly: Story = {
  args: {
    readonly: true,
    selected: new Date()
  }
};

export const Selected: Story = {
  args: {
    selected: new Date()
  }
};

export const SundayFirst: Story = {
  args: {
    firstDayOfWeek: 0
  }
};

export const WeekNumbers: Story = {
  args: {
    showWeekNumbers: true
  }
};

export const All: Story = {
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
        <sl-select-day .selected=${new Date()} show-today></sl-select-day>
      </div>
      <div>
        <h3>Readonly</h3>
        <sl-select-day .selected=${new Date()} readonly show-today></sl-select-day>
      </div>
      <div>
        <h3>With Indicators</h3>
        <sl-select-day
          .indicatorDates=${[
            { date: new Date(new Date().getFullYear(), new Date().getMonth(), 3), color: 'blue', label: 'Meeting' },
            { date: new Date(new Date().getFullYear(), new Date().getMonth(), 8), color: 'green', label: 'Event' }
          ]}
          show-today
        ></sl-select-day>
      </div>
    </div>
  `
};
