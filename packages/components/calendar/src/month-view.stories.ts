import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type MonthView } from './month-view.js';

type Props = Pick<MonthView, 'firstDayOfWeek' | 'month' | 'showWeekNumbers'>;
type Story = StoryObj<Props>;

export default {
  title: 'Components/Month view',
  tags: ['draft'],
  args: {
    showWeekNumbers: false
  },
  argTypes: {
    firstDayOfWeek: {
      control: 'number'
    }
  },
  render: ({ firstDayOfWeek, showWeekNumbers }) => html`
    <sl-month-view ?show-week-numbers=${showWeekNumbers} first-day-of-week=${ifDefined(firstDayOfWeek)}></sl-month-view>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};
