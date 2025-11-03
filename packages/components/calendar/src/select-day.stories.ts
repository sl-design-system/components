import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { useArgs } from 'storybook/internal/preview-api';
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
  | 'negative'
  | 'readonly'
  | 'selected'
  | 'showToday'
  | 'showWeekNumbers'
> & { styles?: string };
type Story = StoryObj<Props>;

customElements.define('sl-select-day', SelectDay);

export default {
  title: 'Date & Time/Calendar/Select Day',
  tags: ['draft'],
  args: {
    firstDayOfWeek: 1,
    month: new Date(),
    readonly: false,
    showToday: true,
    showWeekNumbers: false
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
    negative: {
      control: 'object'
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
    },
    styles: {
      table: { disable: true }
    }
  },
  render: ({
    disabledDates,
    firstDayOfWeek,
    indicatorDates,
    max,
    min,
    month,
    negative,
    readonly,
    selected,
    showToday,
    showWeekNumbers,
    styles
  }) => {
    const [_, updateArgs] = useArgs();
    const parseDate = (value: string | Date | undefined): Date | undefined => {
      if (!value) {
        return undefined;
      }

      return value instanceof Date ? value : new Date(value);
    };

    const onSelectDay = (event: CustomEvent<Date>) => {
      updateArgs({ selected: event.detail.getTime() }); // needs to be set to the 'time' otherwise Storybook chokes on the date format 🤷
    };

    return html`
      ${styles
        ? html`
            <style>
              ${styles}
            </style>
          `
        : nothing}
      <sl-select-day
        @sl-select=${onSelectDay}
        .disabledDates=${disabledDates}
        .firstDayOfWeek=${firstDayOfWeek}
        .indicatorDates=${indicatorDates}
        .negative=${negative}
        ?readonly=${readonly}
        ?show-today=${showToday}
        ?show-week-numbers=${showWeekNumbers}
        max=${ifDefined(parseDate(max)?.toISOString())}
        min=${ifDefined(parseDate(min)?.toISOString())}
        month=${ifDefined(parseDate(month)?.toISOString())}
        selected=${ifDefined(parseDate(selected)?.toISOString())}
      ></sl-select-day>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const WithSelection: Story = {
  args: {
    selected: new Date()
  }
};

export const WithWeekNumbers: Story = {
  args: {
    showWeekNumbers: true
  }
};

export const SundayFirst: Story = {
  args: {
    firstDayOfWeek: 0
  }
};

export const Readonly: Story = {
  args: {
    readonly: true,
    selected: new Date()
  }
};

export const WithMinMax: Story = {
  args: {
    min: new Date(new Date().getFullYear(), new Date().getMonth(), 10),
    max: new Date(new Date().getFullYear(), new Date().getMonth(), 20),
    month: new Date()
  }
};

export const WithDisabledDates: Story = {
  args: {
    disabledDates: [
      new Date(new Date().getFullYear(), new Date().getMonth(), 5),
      new Date(new Date().getFullYear(), new Date().getMonth(), 12),
      new Date(new Date().getFullYear(), new Date().getMonth(), 19)
    ]
  }
};

export const WithIndicators: Story = {
  args: {
    indicatorDates: [
      { date: new Date(new Date().getFullYear(), new Date().getMonth(), 3), color: 'blue', label: 'Meeting' },
      { date: new Date(new Date().getFullYear(), new Date().getMonth(), 8), color: 'green', label: 'Event' },
      { date: new Date(new Date().getFullYear(), new Date().getMonth(), 15), color: 'red', label: 'Deadline' }
    ]
  }
};

export const WithNegativeDates: Story = {
  args: {
    negative: [
      new Date(new Date().getFullYear(), new Date().getMonth(), 7),
      new Date(new Date().getFullYear(), new Date().getMonth(), 14),
      new Date(new Date().getFullYear(), new Date().getMonth(), 21)
    ]
  }
};

export const All: Story = {
  render: () => html`
    <style>
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
