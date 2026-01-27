import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { SelectYear } from './select-year.js';

type Props = Pick<SelectYear, 'max' | 'min' | 'selected' | 'showCurrent' | 'year'>;
type Story = StoryObj<Props>;

try {
  customElements.define('sl-select-year', SelectYear);
} catch {
  /* empty */
}

export default {
  title: 'Date & Time/Calendar/Select Year',
  tags: ['draft'],
  args: {
    year: new Date()
  },
  argTypes: {
    max: {
      control: 'date'
    },
    min: {
      control: 'date'
    },
    selected: {
      control: 'date'
    },
    showCurrent: {
      control: 'boolean'
    },
    year: {
      control: 'date'
    }
  },
  render: ({ max, min, selected, showCurrent, year }) => {
    return html`
      <sl-select-year
        ?show-current=${showCurrent}
        max=${ifDefined(max?.toISOString())}
        min=${ifDefined(min?.toISOString())}
        selected=${ifDefined(selected?.toISOString())}
        year=${ifDefined(year?.toISOString())}
      ></sl-select-year>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const MinMax: Story = {
  args: {
    max: new Date(2025, 10, 1),
    min: new Date(2022, 2, 1),
    year: new Date(2025, 7, 1)
  }
};

export const Selected: Story = {
  args: {
    selected: new Date(2025, 7, 1),
    year: new Date(2025, 7, 1)
  }
};

export const ShowCurrent: Story = {
  args: {
    showCurrent: true
  }
};

export const Year: Story = {
  args: {
    year: new Date(2000, 0, 1)
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
        <sl-select-year></sl-select-year>
      </div>
      <div>
        <h3>Min Max</h3>
        <sl-select-year max="2027" min="2022"></sl-select-year>
      </div>
      <div>
        <h3>With Selection</h3>
        <sl-select-year .selected=${new Date()}></sl-select-year>
      </div>
      <div>
        <h3>Show Current</h3>
        <sl-select-year show-current></sl-select-year>
      </div>
      <div>
        <h3>Year</h3>
        <sl-select-year year="2000"></sl-select-year>
      </div>
    </div>
  `
};
