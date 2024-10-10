import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { type Calendar } from './calendar.js';

type Props = Pick<Calendar, 'locale'>;
type Story = StoryObj<Props>;

export default {
  title: 'Calendar/Calendar',
  tags: ['draft'],
  render: () => {
    return html`<sl-calendar></sl-calendar>`;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};
