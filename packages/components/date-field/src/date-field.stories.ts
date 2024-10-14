import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { type DateField } from './date-field.js';

type Props = Pick<DateField, 'disabled' | 'placeholder' | 'selectOnly' | 'showWeekNumbers'>;
type Story = StoryObj<Props>;

export default {
  title: 'Form/Date field',
  tags: ['draft'],
  args: {
    disabled: false,
    placeholder: 'Pick a date',
    selectOnly: false,
    showWeekNumbers: false
  },
  render: ({ disabled, placeholder, selectOnly, showWeekNumbers }) => html`
    <sl-date-field
      ?disabled=${disabled}
      ?select-only=${selectOnly}
      ?show-week-numbers=${showWeekNumbers}
      .placeholder=${placeholder}
      style="width: fit-content"
    ></sl-date-field>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const SelectOnly: Story = {
  args: {
    selectOnly: true
  }
};

export const ShowWeekNumbers: Story = {
  args: {
    showWeekNumbers: true
  }
};
