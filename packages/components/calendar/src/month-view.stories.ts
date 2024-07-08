import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { type MonthView } from './month-view.js';

type Props = Pick<MonthView, 'showWeekNumbers'>;
type Story = StoryObj<Props>;

export default {
  title: 'Components/Month view',
  tags: ['draft'],
  render: ({ showWeekNumbers }) => html`<sl-month-view ?show-week-numbers=${showWeekNumbers}></sl-month-view>`
} satisfies Meta<Props>;

export const Basic: Story = {};
