import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { SelectMonth } from './select-month.js';

type Props = Pick<SelectMonth, 'max' | 'min' | 'month' | 'selected' | 'showCurrent'>;
type Story = StoryObj<Props>;

try {
  customElements.define('sl-select-month', SelectMonth);
} catch {
  /* empty */
}

export default {
  title: 'Date & Time/Calendar/Select Month',
  tags: ['draft'],
  args: {
    month: new Date()
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
    selected: {
      control: 'date'
    },
    showCurrent: {
      control: 'boolean'
    }
  },
  render: ({ max, min, month, selected, showCurrent }) => {
    return html`
      <sl-select-month
        ?show-current=${showCurrent}
        max=${ifDefined(max?.toISOString())}
        min=${ifDefined(min?.toISOString())}
        month=${ifDefined(month?.toISOString())}
        selected=${ifDefined(selected?.toISOString())}
      ></sl-select-month>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const MinMax: Story = {
  args: {
    max: new Date(2025, 10, 1),
    min: new Date(2025, 2, 1),
    month: new Date(2025, 7, 1)
  }
};

export const Selected: Story = {
  args: {
    selected: new Date(2025, 4, 1)
  }
};

export const ShowCurrent: Story = {
  args: {
    showCurrent: true
  }
};
