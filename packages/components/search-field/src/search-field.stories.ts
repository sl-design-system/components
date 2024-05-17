import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { type SearchField } from './search-field.js';

type Props = Pick<SearchField, 'disabled' | 'placeholder' | 'value'>;
type Story = StoryObj<Props>;

export default {
  title: 'Form/Search field',
  tags: ['draft'],
  args: {
    placeholder: '',
    value: ''
  },
  render: ({ disabled, placeholder, value }) => {
    return html`
      <sl-search-field ?disabled=${disabled} .placeholder=${placeholder} .value=${value}></sl-search-field>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    placeholder: 'Search'
  }
};

export const Disabled: Story = {
  args: {
    ...Basic.args,
    disabled: true
  }
};

export const Value: Story = {
  args: {
    ...Basic.args,
    value: 'Lorem'
  }
};
