import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type Calendar } from './calendar.js';

type Props = Pick<Calendar, 'locale' | 'month'>;
type Story = StoryObj<Props>;

export default {
  title: 'Calendar/Calendar',
  tags: ['draft'],
  render: ({ locale, month }) => {
    return html`<sl-calendar locale=${ifDefined(locale)} month=${ifDefined(month?.toISOString())}></sl-calendar>`;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};
