import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { useArgs } from 'storybook/internal/preview-api';
import '../register.js';
import { SelectYear } from './select-year.js';

type Props = Pick<SelectYear, 'year' | 'max' | 'min' | 'showToday'> & { styles?: string };
type Story = StoryObj<Props>;

customElements.define('sl-select-year', SelectYear);

export default {
  title: 'Date & Time/Select Year',
  tags: ['draft'],
  args: {
    year: new Date(),
    max: new Date(new Date().getFullYear(), 11, 31),
    min: new Date(new Date().getFullYear(), 0, 1),
    showToday: true
  },
  argTypes: {
    year: {
      control: 'date'
    },
    max: {
      control: 'date'
    },
    min: {
      control: 'date'
    },
    showToday: {
      control: 'boolean'
    },
    styles: {
      table: { disable: true }
    }
  },
  render: ({ year, max, min, styles, showToday }) => {
    const [_, updateArgs] = useArgs();
    const parseDate = (value: string | Date | undefined): Date | undefined => {
      if (!value) {
        return undefined;
      }

      return value instanceof Date ? value : new Date(value);
    };

    const onSelectYear = (event: CustomEvent<Date>) => {
      console.log('Year selected:', event.detail.getFullYear());
      updateArgs({ year: new Date(event.detail.getFullYear()).getTime() }); //needs to be set to the 'time' otherwise Storybook chokes on the date format 🤷
    };

    return html`
      ${styles
        ? html`
            <style>
              ${styles}
            </style>
          `
        : nothing}
      <sl-select-year
        @sl-select=${onSelectYear}
        year=${ifDefined(parseDate(year)?.toISOString())}
        max=${ifDefined(parseDate(max)?.toISOString())}
        min=${ifDefined(parseDate(min)?.toISOString())}
        show-today=${ifDefined(showToday)}
      ></sl-select-year>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    max: new Date(2025, 10, 1),
    min: new Date(2025, 2, 1),
    year: new Date(2025, 7, 1)
  }
};
