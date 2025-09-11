import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import '../register.js';
import { type TimeField } from './time-field.js';

type Props = Pick<TimeField, 'value'>;
type Story = StoryObj<Props>;

export default {
  title: 'Form/Time Field',
  tags: ['draft'],
  render: () => '<sl-time-field></sl-time-field>'
} satisfies Meta<Props>;

export const Basic: Story = {};
