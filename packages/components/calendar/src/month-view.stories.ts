import { faFlag } from '@fortawesome/pro-regular-svg-icons';
import { Icon } from '@sl-design-system/icon';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type MonthView } from './month-view.js';
import { type Day } from './utils.js';

type Props = Pick<
  MonthView,
  | 'firstDayOfWeek'
  | 'hideDaysOtherMonths'
  | 'indicator'
  | 'locale'
  | 'max'
  | 'min'
  | 'month'
  | 'readonly'
  | 'renderer'
  | 'selected'
  | 'showToday'
  | 'showWeekNumbers'
> & { styles?: string };
type Story = StoryObj<Props>;

Icon.register(faFlag);

export default {
  title: 'Date & Time/Month view',
  tags: ['draft'],
  args: {
    hideDaysOtherMonths: false,
    month: new Date(),
    readonly: false,
    showToday: false,
    showWeekNumbers: false
  },
  argTypes: {
    firstDayOfWeek: {
      control: 'number'
    },
    indicator: {
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
    firstDayOfWeek,
    hideDaysOtherMonths,
    indicator,
    max,
    min,
    month,
    locale,
    readonly,
    renderer,
    selected,
    showToday,
    showWeekNumbers,
    styles
  }) => html`
    ${styles
      ? html`
          <style>
            ${styles}
          </style>
        `
      : nothing}
    <sl-month-view
      ?hide-days-other-months=${hideDaysOtherMonths}
      ?readonly=${readonly}
      ?show-today=${showToday}
      ?show-week-numbers=${showWeekNumbers}
      first-day-of-week=${ifDefined(firstDayOfWeek)}
      indicator=${ifDefined(
        Array.isArray(indicator)
          ? JSON.stringify(
              indicator
                .filter(item => item?.date)
                .map(item => ({
                  date: item.date.toISOString(),
                  ...(item.color ? { color: item.color } : {})
                }))
            )
          : undefined
      )}
      locale=${ifDefined(locale)}
      max=${ifDefined(max?.toISOString())}
      min=${ifDefined(min?.toISOString())}
      month=${ifDefined(month?.toISOString())}
      selected=${ifDefined(selected?.toISOString())}
      .renderer=${renderer}
    ></sl-month-view>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

// TODO: selecting when clicking on it should work in the mont-view as well?

export const FirstDayOfWeek: Story = {
  args: {
    firstDayOfWeek: 0
  }
};

export const HideDaysOtherMonths: Story = {
  args: {
    hideDaysOtherMonths: true
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

export const Renderer: Story = {
  args: {
    renderer: (day: Day, monthView: MonthView) => {
      const parts = monthView.getDayParts(day);

      if (day.currentMonth && [2, 4, 7, 10, 16, 22].includes(day.date.getDate())) {
        parts.push('highlight');
      }

      if (day.currentMonth && day.date.getDate() === 24) {
        parts.push('finish');

        return html`<button .part=${parts.join(' ')}><sl-icon name="far-flag"></sl-icon></button>`;
      } else if (day.currentMonth) {
        return html`<button .part=${parts.join(' ')}>${day.date.getDate()}</button>`;
      } else {
        return html`<span .part=${parts.join(' ')}>${day.date.getDate()}</span>`;
      }
    },
    styles: `
      sl-month-view::part(finish) {
        background: var(--sl-color-success-plain);
        border-radius: 50%;
        color: var(--sl-color-text-inverted);
      }

      sl-month-view::part(finish):hover {
        background: var(--sl-color-success-bold);
      }

      sl-month-view::part(finish):active {
        background: var(--sl-color-success-heavy);
      }
    `
  }
};

export const Selected: Story = {
  args: {
    month: new Date(2024, 11, 10),
    selected: new Date(2024, 11, 4)
  }
};

export const Today: Story = {
  args: {
    showToday: true
  }
};

export const Indicator: Story = {
  args: {
    //  indicator: [new Date(), new Date('2025-08-05')],
    indicator: [
      { date: new Date('2025-08-05') },
      { date: new Date('2025-08-06'), color: 'blue' },
      { date: new Date('2025-08-07'), color: 'red' },
      { date: new Date('2025-08-09'), color: 'yellow' },
      { date: new Date('2025-08-10'), color: 'green' },
      { date: new Date('2025-08-20'), color: 'grey' },
      { date: new Date('2025-08-22'), color: 'green' },
      { date: new Date('2025-08-27'), color: 'yellow' }
    ],
    showToday: true,
    month: new Date(1755640800000)
  }
};

export const WeekNumbers: Story = {
  args: {
    showWeekNumbers: true
  }
};
