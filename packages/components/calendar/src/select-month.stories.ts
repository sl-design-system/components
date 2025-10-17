import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { useArgs } from 'storybook/internal/preview-api';
import '../register.js';
import { SelectMonth } from './select-month.js';

type Props = Pick<SelectMonth, 'month' | 'max' | 'min' | 'showToday'> & { styles?: string };
type Story = StoryObj<Props>;

customElements.define('sl-select-month', SelectMonth);

export default {
  title: 'Date & Time/Select Month',
  tags: ['draft'],
  args: {
    month: new Date(),
    max: new Date(new Date().getFullYear(), 11, 31),
    min: new Date(new Date().getFullYear(), 0, 1),
    showToday: true
  },
  argTypes: {
    max: {
      control: 'date'
    },
    min: {
      control: 'date'
    },
    month: {
      control: 'date'
    },
    showToday: {
      control: 'boolean'
    },
    styles: {
      table: { disable: true }
    }
  },
  render: ({ max, min, month, styles, showToday }) => {
    const [_, updateArgs] = useArgs();
    const parseDate = (value: string | Date | undefined): Date | undefined => {
      if (!value) {
        return undefined;
      }

      return value instanceof Date ? value : new Date(value);
    };

    const onSelectMonth = (event: CustomEvent<Date>) => {
      updateArgs({ month: new Date(event.detail.getFullYear(), event.detail.getMonth(), 1).getTime() }); //needs to be set to the 'time' otherwise Storybook chokes on the date format 🤷
    };

    return html`
      ${styles
        ? html`
            <style>
              ${styles}
            </style>
          `
        : nothing}
      <sl-select-month
        @sl-select=${onSelectMonth}
        max=${ifDefined(parseDate(max)?.toISOString())}
        min=${ifDefined(parseDate(min)?.toISOString())}
        month=${ifDefined(parseDate(month)?.toISOString())}
        show-today=${ifDefined(showToday)}
      ></sl-select-month>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    max: new Date(2025, 10, 1),
    min: new Date(2025, 2, 1),
    month: new Date(2025, 7, 1)
  }
};
