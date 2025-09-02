import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { SelectMonth } from './select-month.js';

type Props = Pick<SelectMonth, 'month'> & { styles?: string };
type Story = StoryObj<Props>;

customElements.define('sl-select-month', SelectMonth);

export default {
  title: 'Date & Time/Select Month',
  tags: ['draft'],
  args: {
    month: new Date()
  },
  argTypes: {
    month: {
      control: 'date'
    },
    styles: {
      table: { disable: true }
    }
  },
  render: ({ month, styles }) => html`
    ${styles
      ? html`
          <style>
            ${styles}
          </style>
        `
      : nothing}
    <sl-select-month month=${ifDefined(month?.toISOString())}></sl-select-month>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};
