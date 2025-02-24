import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type DateField } from './date-field.js';

type Props = Pick<DateField, 'disabled' | 'placeholder' | 'selectOnly' | 'showWeekNumbers' | 'value'>;
type Story = StoryObj<Props>;

export default {
  title: 'Form/Date field',
  tags: ['draft'],
  args: {
    disabled: false,
    selectOnly: false,
    showWeekNumbers: false
  },
  argTypes: {
    value: {
      control: 'date'
    }
  },
  render: ({ disabled, placeholder, selectOnly, showWeekNumbers, value }) => html`
    <sl-date-field
      ?disabled=${disabled}
      ?select-only=${selectOnly}
      ?show-week-numbers=${showWeekNumbers}
      .value=${value}
      placeholder=${ifDefined(placeholder)}
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

export const Placeholder: Story = {
  args: {
    placeholder: 'Select a date'
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

export const Value: Story = {
  args: {
    value: new Date(2024, 8, 12)
  }
};
