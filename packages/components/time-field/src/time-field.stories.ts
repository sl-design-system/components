import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type TimeField } from './time-field.js';

type Props = Pick<TimeField, 'disabled' | 'placeholder' | 'value'>;
type Story = StoryObj<Props>;

export default {
  title: 'Form/Time field',
  tags: ['draft'],
  args: {
    disabled: false,
    placeholder: 'Select time'
  },
  render: ({ disabled, placeholder, value }) => html`
    <sl-time-field
      ?disabled=${disabled}
      placeholder=${ifDefined(placeholder)}
      value=${ifDefined(value)}
    ></sl-time-field>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};
